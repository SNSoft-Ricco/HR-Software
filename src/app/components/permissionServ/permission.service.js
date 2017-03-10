(function(){

	angular
		.module('snsoftHr')
		.service('PermissionService',PermissionService);

	function PermissionService($q,localdb, mongoServ, syncData){

		//const DB_NAME = 'snsofthrdb';
	  	//const DB_VERSION = 4; 
	  	var DB_OBJ_PERMISSION = 'permission';
	  	var DB_OBJ_USER = 'user';

	  	//var db;
	  	var permissionArray=[];
	  	var userList=[];
	  	var vm = this;
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
		        DB_OBJ_PERMISSION, { keyPath: 'id', autoIncrement: true });

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
			obj.indexID = syncData.generateIndexID();
			obj.lastModified = parseInt((new Date().getTime())/1000);
			/*
			var transaction = db.transaction([DB_OBJ_PERMISSION], "readwrite");

			console.log(obj);

			transaction.oncomplete = function(event) {
			  deferred.resolve();
			  console.log("insert done");
			};

			transaction.onerror = function(event) {
			  deferred.reject();
			  console.log("insert error");
			};

			var objectStore = transaction.objectStore(DB_OBJ_PERMISSION);
			var request = objectStore.add(obj);
			*/

			var request = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readwrite').add(obj);

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
			/*var request = db.transaction([DB_OBJ_PERMISSION], "readwrite")
                .objectStore(DB_OBJ_PERMISSION)
                .delete(id);*/

            var deferred = $q.defer();
            var request = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readwrite').delete(id); 

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
			
			/*var request = db.transaction([DB_OBJ_PERMISSION], "readwrite")
                .objectStore(DB_OBJ_PERMISSION)
                .put(obj);*/

            var request = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readwrite').put(obj);

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

			/*var objectStore = db.transaction([DB_OBJ_PERMISSION], "readwrite").objectStore(DB_OBJ_PERMISSION);
			var request = objectStore.get(id);*/
			// var pid = parseInt(id);
			var pid = id;
			var request = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readonly').get(pid);

			request.onerror = function(event) {
				deferred.reject();
				console.log("get error: " + event.target.errorCode);
			};

			request.onsuccess = function(event) {
				var data = event.target.result;
			  	deferred.resolve(data);
			};
			return deferred.promise;
		}

		this.getAllPermission=function(sync)
		{
			permissionArray=[];
			var deferred = $q.defer();

			//var objectStore = db.transaction(DB_OBJ_PERMISSION).objectStore(DB_OBJ_PERMISSION);

			var objectStore = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readonly');

			objectStore.openCursor().onsuccess = function(event) {
			  var cursor = event.target.result;
			  if (cursor) {

			    var objPms = {};
			    objPms = { id: cursor.value.indexID, code: cursor.value.code, desc: cursor.value.desc, array:cursor.value.PermissionList, objectID:cursor.value.objectID, lastModified:cursor.value.lastModified };

			    permissionArray.push(objPms);
			    cursor.continue();
			  }
			  else {
		          if(sync){
		              // compare the file between indexDB & mongoDB , then sync it
		              syncData.compare(permissionArray, mongoServ.addPermission, mongoServ.getAllPermission)
		              .then(function(data){

		                  mongoServ.addPermission(data['mongoDBNotExist']);
		                  mongoServ.updatePermission(data['indexDBtimeNotMatch']);

		                  var indexDBNotExist = data.indexDBNotExist;
		                  var mongoDBtimeNotMatch = data.mongoDBtimeNotMatch;

		                  for(var idb in indexDBNotExist){
		                    // insert no exist record(from mongo) to indexDB
		                    vm.addPermission(indexDBNotExist[idb]);
		                  }

		                  for(var tnm in mongoDBtimeNotMatch){
		                    //update indexDB data, because the lastmodified date is different(compared to mongodb)
		                    vm.updatePermission(mongoDBtimeNotMatch[tnm]);
		                  }
		              })
		          }
			    deferred.resolve(permissionArray);
			  }
			};
			return deferred.promise;
		}

		this.getPermissionUser=function(id)
		{
			var deferred = $q.defer();
			var rslt = localdb.getObjectStore(DB_OBJ_USER, 'readonly');
			var index = rslt.index('usergroup');
			var sID = id.toString();
			userList = [];

			var request = index.openCursor(IDBKeyRange.only(sID));

			request.onerror = function() {
		        console.log("Open ObjectStore Error!");
		        deferred.reject(); 
		      };    

		    request.onsuccess = function(event) {
		        var cursor = event.target.result;
		        if (cursor) {
		        	var objPms = {};
				    objPms = { name: cursor.value.fullname, dept: cursor.value.department,  position: cursor.value.position };
				    userList.push(objPms);

		        	cursor.continue();
		        }
				else {
				   deferred.resolve(userList);
				}

				if(userList)
					deferred.resolve(userList);
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
