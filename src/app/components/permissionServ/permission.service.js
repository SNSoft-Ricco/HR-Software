(function(){

  angular
    .module('snsoftHr')
    .service('PermissionService',PermissionService);

  function PermissionService($q,localdb, mongoServ, syncData){
    var DB_OBJ_PERMISSION = 'permission';
    var DB_OBJ_USER = 'user';
    var permissionArray=[];
    var userList=[];

    this.addPermission=function (obj)
    {
      var deferred = $q.defer();
      obj.indexID = syncData.generateIndexID();
      obj.lastModified = parseInt((new Date().getTime())/1000);

      localdb.openDb().then(function() {
        var request = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readwrite').add(obj);

        request.onsuccess = function (event) {
          deferred.resolve();
        };

        request.onerror = function (event) {
          deferred.reject();
          console.log("insert error: " + event.target.errorCode);
        };
      });

      return deferred.promise;
    }

    this.removePermission=function (id)
    {
      var deferred = $q.defer();

      localdb.openDb().then(function() {
        var request = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readwrite').delete(id);

        request.onsuccess = function (event) {
          deferred.resolve();
        };

        request.onerror = function (event) {
          deferred.reject();
          console.log("delete error: " + event.target.errorCode);
        };
      });

      return deferred.promise;
    }

    this.updatePermission=function(obj)
    {
      var deferred = $q.defer();

      localdb.openDb().then(function() {
        var request = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readwrite').put(obj);

        request.onsuccess = function (event) {
          deferred.resolve();
        };

        request.onerror = function (event) {
          deferred.reject();
          console.log("update error: " + event.target.errorCode);
        };
      });

      return deferred.promise;
    }

    this.getPermission=function(id)
    {
      var deferred = $q.defer();

      localdb.openDb().then(function() {
        var pid = id;
        var request = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readonly').get(pid);

        request.onerror = function (event) {
          deferred.reject();
          console.log("get error: " + event.target.errorCode);
        };

        request.onsuccess = function (event) {
          var data = event.target.result;
          deferred.resolve(data);
        };
      });
      return deferred.promise;
    };

    this.getAllPermission=function(sync)
    {
      permissionArray=[];
      var deferred = $q.defer();

      localdb.openDb().then(function() {
        var objectStore = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readonly');

        objectStore.openCursor().onsuccess = function (event) {
          var cursor = event.target.result;
          if (cursor) {

			//var objectStore = db.transaction(DB_OBJ_PERMISSION).objectStore(DB_OBJ_PERMISSION);
          localdb.openDb().then(function() {
			var objectStore = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readonly');

			objectStore.openCursor().onsuccess = function(event) {
			  var cursor = event.target.result;
			  if (cursor) {

			    var objPms = {};
			    objPms = { id: cursor.value.indexID, indexID:cursor.value.indexID, code: cursor.value.code, description: cursor.value.description,permissionList:cursor.value.permissionList, array:cursor.value.permissionList, _id:cursor.value._id, lastModified:cursor.value.lastModified };

			    permissionArray.push(objPms);
			    cursor.continue();
			  }
			  else {
		          if(sync){
		              // compare the file between indexDB & mongoDB , then sync it
		              syncData.compare(permissionArray, mongoServ.addPermission, mongoServ.getAllPermission)
		              .then(function(data){
8

		                  mongoServ.addPermission(data['mongoDBNotExist'])
		                  .then(function(udata){
		                      // assign objectID to departments
		                      if(udata.length==0||!udata.data){ return }
		                          udata.data.forEach(function(pmRecord){
		                            var _id = pmRecord._id;
		                            vm.getPermission(pmRecord.indexID)
		                              .then(function(indexData){
		                                indexData._id = _id;
		                                vm.updatePermission(indexData);
		                              });
		                          });
		                  });

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
          });
			return deferred.promise;
		}

		this.getPermissionUser=function(id)
		{
			var deferred = $q.defer();

            localdb.openDb().then(function() {
              var rslt = localdb.getObjectStore(DB_OBJ_USER, 'readonly');
              var index = rslt.index('usergroup');
              var sID = id.toString();
              userList = [];

              var request = index.openCursor(IDBKeyRange.only(sID));

              request.onerror = function () {
                console.log("Open ObjectStore Error!");
                deferred.reject();
              };

              request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                  var objPms = {};
                  objPms = { name: cursor.value.name, dept: cursor.value.department,  position: cursor.value.position };
                  userList.push(objPms);

                  cursor.continue();
                }
                else {
                  deferred.resolve(userList);
                }

                if (userList)
                  deferred.resolve(userList);
              };
            });
			return deferred.promise;
		};

		this.getUserGroupNameByID = function(id) {
		  return new Promise(function(resolve,reject) {
        
        localdb.openDb().then(function() {
          var request =
            localdb
              .getObjectStore(DB_OBJ_PERMISSION, 'readonly')
              .get(id);

          request.onerror = function (event) {
            reject("get error: " + event.target.errorCode);
          };

          request.onsuccess = function (event) {
            var data = event.target.result;
            resolve(data.code);
          };
        });
      })
    }
  }

})();
