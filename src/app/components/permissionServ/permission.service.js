(function(){

  angular
    .module('snsoftHr')
    .service('PermissionService',PermissionService);

  function PermissionService($log, localdb, mongoServ, syncData, $q){
    this.addPermission = addPermission;
    this.removePermission = removePermission;
    this.updatePermission = updatePermission;
    this.getPermission = getPermission;
    this.getAllPermission = getAllPermission;
    this.getPermissionUser = getPermissionUser;
    this.getUserGroupNameByID = getUserGroupNameByID;

    var DB_OBJ_PERMISSION = 'permission';
    var DB_OBJ_USER = 'user';
    var permissionArray=[];
    var userList=[];

    function addPermission(obj)
    {
      var deferred = $q.defer();
      obj.indexID = syncData.generateIndexID();
      obj.lastModified = parseInt((new Date().getTime())/1000);

      localdb.openDb().then(
        function() {
          var request = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readwrite').add(obj);

          request.onsuccess = function () {
            deferred.resolve();
          };

          request.onerror = function (event) {
            deferred.reject("Error to add permission", event.target.errorCode);
          };
        },
        function (error) {
          deferred.reject("Error to check DB connection.", error);
        }
      );
      return deferred.promise;
    }

    function removePermission (id)
    {
      var deferred = $q.defer();

      localdb.openDb().then(
        function () {
          var request = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readwrite').delete(id);

          request.onsuccess = function () {
            deferred.resolve();
          };

          request.onerror = function (event) {
            deferred.reject("Error to remove permission", event.target.errorCode);
          };
        },
        function (error) {
          deferred.reject("Error to check DB connection.", error);
        }
      );
      return deferred.promise;
    }

    function updatePermission (obj)
    {
      var deferred = $q.defer();

      localdb.openDb().then(
        function () {
          var request = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readwrite').put(obj);

          request.onsuccess = function () {
            deferred.resolve();
          };

          request.onerror = function (event) {
            deferred.reject("Error to update permission", event.target.errorCode);
          };
        },
        function (error) {
          deferred.reject("Error to check DB connection.", error);
        }
      );
      return deferred.promise;
    }

    function getPermission (id)
    {
      var deferred = $q.defer();

      localdb.openDb().then(
        function () {
          var request = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readonly').get(id);

          request.onsuccess = function (event) {
            var data = event.target.result;
            deferred.resolve(data);
          };

          request.onerror = function (event) {
            deferred.reject("Error to get a permission", event.target.errorCode);
          };
        },
        function (error) {
          deferred.reject("Error to check DB connection.", error);
        }
      );
      return deferred.promise;
    }

    function getAllPermission (sync)
    {
      var deferred = $q.defer();
      localdb.openDb().then(
        function () {
          permissionArray = [];
          var objectStore = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readonly');

          objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {

              var objPms = {};
              objPms = {
                id: cursor.value.indexID,
                indexID:cursor.value.indexID, 
                code: cursor.value.code,
                description: cursor.value.description,
                array: cursor.value.permissionList,
                objectID: cursor.value.objectID,
                lastModified: cursor.value.lastModified
              };

              permissionArray.push(objPms);
              cursor.continue();

            }
            else {
              //no more result from cursor, then reach here
              if (sync) {
                // compare the file between indexDB & mongoDB , then sync it
                syncData.compare(permissionArray, mongoServ.addPermission, mongoServ.getAllPermission)
                  .then(function (data) {

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

                    for (var idb in indexDBNotExist) {
                      // insert no exist record(from mongo) to indexDB
                      addPermission(indexDBNotExist[idb]);
                    }

                    for (var tnm in mongoDBtimeNotMatch) {
                      //update indexDB data, because the lastmodified date is different(compared to mongodb)
                      updatePermission(mongoDBtimeNotMatch[tnm]);
                    }
                  })
              }
              deferred.resolve(permissionArray);
            }
          };
        },
        function (error) {
          deferred.reject("Error to check DB connection.", error);
        }
      );
      return deferred.promise;
    }

    function getPermissionUser(id)
    {
      var deferred = $q.defer();

      localdb.openDb().then(
        function () {
          var rslt = localdb.getObjectStore(DB_OBJ_USER, 'readonly');
          var index = rslt.index('userGroup');
          var sID = id.toString();
          userList = [];

          var request = index.openCursor(IDBKeyRange.only(sID));

          request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
              var objPms = {};
              objPms = {name: cursor.value.name, dept: cursor.value.department, position: cursor.value.position};
              userList.push(objPms);

              cursor.continue();
            }
            else {
              deferred.resolve(userList);
            }

            if (userList)
              deferred.resolve(userList);
          };

          request.onerror = function (event) {
            deferred.reject("Error to get user list", event.target.errorCode);
          };
        },
        function (error) {
          deferred.reject("Error to check DB connection.", error);
        }
      );
      return deferred.promise;
    }

    function getUserGroupNameByID (id) {
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
