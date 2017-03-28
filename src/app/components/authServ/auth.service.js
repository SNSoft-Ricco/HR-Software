(function(){

  angular
    .module('snsoftHr')
    .service('AuthService',AuthService);

  function AuthService(localdb, ProfileService, PermissionService, $q){
    this.getAllowPermission = getAllowPermission;
    this.checkPermission = checkPermission;
    this.clearList = clearList;

    var allowPermission = [];


    function getAllowPermission(username)
    {
      var deferred = $q.defer();

      ProfileService.getUser(username).then(
        function (data) {
          PermissionService.getPermission(data.userGroup).then(
            function (result) {
              if (result) {
                allowPermission = result.permissionList;
                deferred.resolve(allowPermission);
              }
              else
                deferred.reject("Invalid permission group!");

            }, function (err) {
              deferred.reject("Invalid permission group.", err);
            }
          );
        },function (err) {
          deferred.reject("Error to get user profile.", err);
        }
      );
      return deferred.promise;
    }

    function checkPermission (username, id)
    {
      var deferred = $q.defer();

      getAllowPermission(username).then(
        function (data) {
          if (data.indexOf(id) !== -1) {
            deferred.resolve(true);
          }
          else {
            deferred.resolve(false);
          }
        }, function (err) {
          deferred.reject("Error to get all permission.", err);
        }
      );
      return deferred.promise;
    }

    function clearList()
    {
      allowPermission = [];
    }
  }
})();
