(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('UserRgstController', UserRgstController);

  /** @ngInject */
  function UserRgstController($log, $window, $cookies, $state, localdb) {
    var vm = this;

    vm.back = back;
    vm.submit = submit;

    function back() {
      $state.go('userMgmt');
    }

    function submit() {
      var objUser = {
        username: vm.username,
        password: vm.pwd,
        usergroup: vm.dpmt,
        status: "active"
      }

      localdb.addUser(objUser).then(function(response){
        alert(response);
      });
    }
  }
})();
