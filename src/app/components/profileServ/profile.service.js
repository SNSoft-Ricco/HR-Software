(function(){

	angular
		.module('snsoftHr')
		.service('ProfileService',ProfileService);

	function ProfileService($q,localdb){
    var DB_OBJ_STORE_NAME = 'user';

		this.getUser=function(uid)
		{
			var deferred = $q.defer();

      localdb.openDb().then(function() {
        var request = localdb.getObjectStore(DB_OBJ_STORE_NAME, 'readonly').get(uid);

        request.onerror = function (event) {
          deferred.reject();
          $log.info("get user info error: " + event.target.errorCode);
        };

        request.onsuccess = function (event) {
          var data = event.target.result;
          deferred.resolve(data);
        };
      });

			return deferred.promise;
		}

		this.updateUser=function(obj)
		{
      var deferred = $q.defer();

      localdb.openDb().then(function() {
        var request = localdb.getObjectStore(DB_OBJ_STORE_NAME, 'readwrite').put(obj);

        request.onerror = function (event) {
          deferred.reject();
          $log.info("get user info error: " + event.target.errorCode);
        };

        request.onsuccess = function (event) {
          var data = event.target.result;
          deferred.resolve(data);
        };
      });

			return deferred.promise;
		}
	}

})();
