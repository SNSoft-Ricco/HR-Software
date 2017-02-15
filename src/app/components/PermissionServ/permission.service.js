(function(){

	angular
		.module('snsoftHr')
		.service('PermissionService',PermissionService);

	function PermissionService($q){

		const DB_NAME = 'snsofthrdb';
	  	const DB_VERSION = 4; 
	  	const DB_OBJ_STORE_NAME = 'permission_OBJ';

	  	var db;
	  	var permissionArray=[];

		this.openDb=function () {
			var deferred = $q.defer();

		    console.log("openDb ...");
		    var req = indexedDB.open(DB_NAME, DB_VERSION);

		    req.onsuccess = function (evt) {
		      // Better use "this" than "req" to get the result to avoid problems with
		      // garbage collection.
		      // db = req.result;
		      db = this.result;
		      deferred.resolve();
		      console.log("openDb DONE");
		    };
		    req.onerror = function (evt) {
		      //console.error("openDb:", evt.target.errorCode);
		      deferred.reject();
		      console.error("openDb error");
		    };

		    req.onupgradeneeded = function (evt) {
		      console.log("openDb.onupgradeneeded");
		      var store = evt.currentTarget.result.createObjectStore(
		        DB_OBJ_STORE_NAME, { keyPath: 'id', autoIncrement: true });

		      store.createIndex('code', 'code', { unique: false });
		      store.createIndex('desc', 'desc', { unique: false });
		      store.createIndex('PermissionList', 'PermissionList', { unique: false });

		      deferred.resolve();
		    };
		    return deferred.promise;
		}

		this.addPermission=function (code,desc,id,selectedChkBox)
		{
			var deferred = $q.defer();
			var obj = {};
			obj = { code: code, desc: desc, PermissionList:selectedChkBox };
			var transaction = db.transaction([DB_OBJ_STORE_NAME], "readwrite");

			console.log(obj);

			transaction.oncomplete = function(event) {
			  deferred.resolve();
			  console.log("insert done");
			};

			transaction.onerror = function(event) {
			  deferred.reject();
			  console.log("insert error");
			};

			var objectStore = transaction.objectStore(DB_OBJ_STORE_NAME);
			var request = objectStore.add(obj);

			request.onsuccess = function(event) {
			    deferred.resolve();
			    console.log("insert successfully");
			};
			return deferred.promise;
		}

		this.removePermission=function (id)
		{
			var deferred = $q.defer();
			var request = db.transaction([DB_OBJ_STORE_NAME], "readwrite")
                .objectStore(DB_OBJ_STORE_NAME)
                .delete(id);

			request.onsuccess = function(event) {
				deferred.resolve();
				console.log("delete done");
			};

			request.onerror = function(event) {
				deferred.reject();
				console.log("delete error: " + event.target.errorCode);
			};

			return deferred.promise;
		}

		this.updatePermission=function(code,desc,id,selectedChkBox)
		{
			var deferred = $q.defer();
			var obj = {};
			obj = { id: id, code: code, desc: desc, PermissionList:selectedChkBox };

			var request = db.transaction([DB_OBJ_STORE_NAME], "readwrite")
                .objectStore(DB_OBJ_STORE_NAME)
                .put(obj);

			request.onsuccess = function(event) {
				deferred.resolve();
				console.log("update done");
			};

			request.onerror = function(event) {
				deferred.reject();
				console.log("update error: " + event.target.errorCode);
			};

			return deferred.promise;
		}

		this.getPermission=function(id)
		{
			var deferred = $q.defer();
			var objectStore = db.transaction([DB_OBJ_STORE_NAME], "readwrite").objectStore(DB_OBJ_STORE_NAME);
			var request = objectStore.get(id);

			request.onerror = function(event) {
				deferred.reject();
				console.log("get error: " + event.target.errorCode);
			};

			request.onsuccess = function(event) {
				var data = event.target.result;
			  	deferred.resolve(data);
			  	console.log("get update data");
			};

			return deferred.promise;
		}

		this.getAllPermission=function()
		{
			permissionArray=[];

			var deferred = $q.defer();
			var objectStore = db.transaction(DB_OBJ_STORE_NAME).objectStore(DB_OBJ_STORE_NAME);


			objectStore.openCursor().onsuccess = function(event) {
			  var cursor = event.target.result;
			  if (cursor) {

			    var objPms = {};
			    objPms = { id: cursor.key, code: cursor.value.code, desc: cursor.value.desc, array:cursor.value.PermissionList };

			    console.log("id: " + objPms.id + " ,code: " + objPms.code + " ,desc: " + objPms.desc+ " ,list: " + objPms.array);

			    permissionArray.push(objPms);
			    cursor.continue();
			  }
			  else {
			    deferred.resolve(permissionArray);
			    
			  }
			};
			return deferred.promise;
		}

		this.getList=function()
		{
			return permissionArray;
		}


		//this.openDb();

	}

})();