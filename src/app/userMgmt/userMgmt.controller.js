(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('UserMgmtController', UserMgmtController);

  /** @ngInject */
  function UserMgmtController($log, $cookies, $state, $timeout, userServ, deptServ) {
    var vm = this;

    vm.users = [];

    vm.register = register;
    vm.rmUser = rmUser;
    vm.editUser = editUser;
    vm.deptDetail = deptDetail;

    vm.username = "";
    //angular.fromJson($cookies.get("loggedInUser")).username;

    $timeout(showUsers,500);

    function register() {
      $state.go("userRgst");
    }

    function showUsers() {
      userServ.getAllUsers().then(function(users){
        vm.users = users;
      });
    }

    function rmUser(objUser) {
      $log.debug("Removing user: " + objUser.username);
      userServ.rmUser(objUser).then(function(result){
        alert(result);
        showUsers();
      });
    }

    function editUser(objUser) {
      $cookies.put('editUser', angular.toJson(objUser));
      $state.go("userRgst");
    }

    function deptDetail(deptName) {
      deptServ.getDept(deptName).then(function(objDept) {
        $state.go("deptDetail", {myParam: objDept});
      })
    }
  }
})();
