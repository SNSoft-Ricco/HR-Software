(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('UserMgmtController', UserMgmtController);

  /** @ngInject */
  function UserMgmtController($log, $cookies, $state, $timeout, userServ, deptServ, PermissionService, AuthService, syncData) {
    var vm = this;
    var id=2;

    vm.users = [];

    vm.register = register;
    vm.rmUser = rmUser;
    vm.editUser = editUser;
    vm.deptDetail = deptDetail;
    vm.checkViewPermission = checkViewPermission;
    vm.getStatusName = getStatusName;

    vm.username = "";
    //angular.fromJson($cookies.get("loggedInUser")).username;

      showUsers();

    function register() {
      $state.go("userRgst", {isRegister: true});
    }

    function showUsers() {
      syncData.sync()
      .then(function(result){
        syncData.mergeData(result, userServ.getAllUsers)
        .then(function(users){
          vm.users = users;

          vm.users.map(function(user) {
            PermissionService.getUserGroupNameByID(user.userGroup)
              .then(function(code) {
                user.userGroupName = code;
              });
          });
        })
      })
    }

    function rmUser(objUser) {
      $log.debug("Removing user: " + objUser.username);
      userServ.rmUser(objUser).then(function(result){
        alert(result);
        showUsers();
      });
    }

    function editUser(objUser) {
      $state.go("userRgst", {myParam: objUser});
    }

    function deptDetail(deptName) {
      deptServ.getDept(deptName).then(function(objDept) {
        $state.go("deptDetail", {myParam: objDept});
      })
    }

    function checkViewPermission()
    {
      if($cookies.getObject('loggedInUser')){
        var username = $cookies.getObject('loggedInUser').username;

        AuthService.checkPermission(username,id).then(
          function(data){
            vm.isAllowed = data;
          },
          function(err) {
            $log.info(err);
          }
        );
      }
      else
        $log.info("cookies not exist");
    }

    function getStatusName(statusID) {
      var userStatusList = {0: 'Suspended' ,1: 'Active'};

      return userStatusList[statusID];
    }

    checkViewPermission();
  }
})();
