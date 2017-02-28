(function(){

	angular
		.module('snsoftHr')
		.service('PermissionService',PermissionService);

	function PermissionService($q,localdb){

		//const DB_NAME = 'snsofthrdb';
	  	//const DB_VERSION = 4; 
	  	var DB_OBJ_STORE_NAME = 'permission';

	  	//var db;
	  	var permissionArray=[];

		/*this.openDb=function () {
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
		      console.log("openDb.onupgradeneeded...");
		      var store = evt.currentTarget.result.createObjectStore(
		        DB_OBJ_STORE_NAME, { keyPath: 'id', autoIncrement: true });

		      store.createIndex('code', 'code', { unique: false });
		      store.createIndex('desc', 'desc', { unique: false });
		      store.createIndex('PermissionList', 'PermissionList', { unique: false });

		      deferred.resolve();
		    };
		    return deferred.promise;
		}*/

		this.openDb=function () {
			var deferred = $q.defer();

			var promise = localdb.openDb();
            promise.then (function(result){
				if(result)
					deferred.resolve();
				else
					deferred.reject();
            });

			return deferred.promise;
		}

		this.addPermission=function (obj)
		{
			var deferred = $q.defer();

			/*
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
			*/

			var request = localdb.getObjectStore(DB_OBJ_STORE_NAME, 'readwrite').add(obj);

			request.onsuccess = function(event) {
			    deferred.resolve();
			    console.log("insert successfully");
			};

			request.onerror = function(event) {
				deferred.reject();
				console.log("insert error: " + event.target.errorCode);
			};

			return deferred.promise;
		}

		this.removePermission=function (id)
		{
			/*var request = db.transaction([DB_OBJ_STORE_NAME], "readwrite")
                .objectStore(DB_OBJ_STORE_NAME)
                .delete(id);*/

            var deferred = $q.defer();
            var request = localdb.getObjectStore(DB_OBJ_STORE_NAME, 'readwrite').delete(id); 

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

		this.updatePermission=function(obj)
		{
			var deferred = $q.defer();
			
			/*var request = db.transaction([DB_OBJ_STORE_NAME], "readwrite")
                .objectStore(DB_OBJ_STORE_NAME)
                .put(obj);*/

            var request = localdb.getObjectStore(DB_OBJ_STORE_NAME, 'readwrite').put(obj);

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

			/*var objectStore = db.transaction([DB_OBJ_STORE_NAME], "readwrite").objectStore(DB_OBJ_STORE_NAME);
			var request = objectStore.get(id);*/

			var request = localdb.getObjectStore(DB_OBJ_STORE_NAME, 'readonly').get(id);

			request.onerror = function(event) {
				deferred.reject();
				console.log("get error: " + event.target.errorCode);
			};

			request.onsuccess = function(event) {
				var data = event.target.result;
			  	deferred.resolve(data);
			  	console.log("get data");
			};

			return deferred.promise;
		}

		this.getAllPermission=function()
		{
			permissionArray=[];

			var deferred = $q.defer();

			//var objectStore = db.transaction(DB_OBJ_STORE_NAME).objectStore(DB_OBJ_STORE_NAME);

			var objectStore = localdb.getObjectStore(DB_OBJ_STORE_NAME, 'readonly');

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

		this.getDbConnection=function()
		{
			var db = localdb.getDbConn();
			return db;
		}

		//this.openDb();
	}

})();
