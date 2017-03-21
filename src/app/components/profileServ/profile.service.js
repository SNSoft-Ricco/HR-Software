(function(){

  angular
    .module('snsoftHr')
    .service('ProfileService',ProfileService);

  function ProfileService(localdb, $q){
    this.getUser = getUser;
    this.updateUser = updateUser;

    var DB_OBJ_STORE_NAME = 'user';

    function getUser (uid)
    {
      var deferred = $q.defer();

      localdb.openDb().then(
        function () {
          var request = localdb.getObjectStore(DB_OBJ_STORE_NAME, 'readonly').get(uid);
          request.onsuccess = function (event) {
            var data = event.target.result;
            deferred.resolve(data);
          };

          request.onerror = function (event) {
            deferred.reject("Error to user", event.target.errorCode);
          };
        },
        function (error) {
          deferred.reject("Error to check DB connection.", error);
        }
      );
      return deferred.promise;
    }

    function updateUser(obj)
    {
      var deferred = $q.defer();

      localdb.openDb().then(
        function () {
          var request = localdb.getObjectStore(DB_OBJ_STORE_NAME, 'readwrite').put(obj);

          request.onsuccess = function (event) {
            var data = event.target.result;
            deferred.resolve(data);
          };

          request.onerror = function (event) {
            deferred.reject("Error to update user", event.target.errorCode);
          };
        },
        function (error) {
          deferred.reject("Error to check DB connection.", error);
        }
      );
      return deferred.promise;
    }
  }
})();
