(function(){

	angular
		.module('snsoftHr')
		.service('PermissionService',PermissionService);

	function PermissionService($q,localdb){
    var DB_OBJ_PERMISSION = 'permission';
    var DB_OBJ_USER = 'user';
    var permissionArray=[];
    var userList=[];

		this.addPermission=function (obj)
		{
			var deferred = $q.defer();

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
        var pid = parseInt(id);
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
		}

		this.getAllPermission=function()
		{
			permissionArray=[];
			var deferred = $q.defer();

      localdb.openDb().then(function() {
          var objectStore = localdb.getObjectStore(DB_OBJ_PERMISSION, 'readonly');

          objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {

              var objPms = {};
              objPms = {
                id: cursor.key,
                code: cursor.value.code,
                desc: cursor.value.desc,
                array: cursor.value.PermissionList
              };

              permissionArray.push(objPms);
              cursor.continue();
            }
            else {
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
            objPms = {name: cursor.value.fullname, dept: cursor.value.department, position: cursor.value.position};
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
		}
	}

})();
