(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($log, $cookies, $window, $state, localdb) {
    var vm = this;

    vm.login = login;

    function login() {
      localdb
        .getUser(vm.userEmail)
        .then(function(data){
          // Verify success
          $log.info("Verify success!");
          $cookies.put("loggedInUser", angular.toJson(data));
          $state.go("userMgmt");
        }, function() {
          // Verify failed
          alert("Invalid credentials!");

          // DEVELOPMENT
          $state.go("userMgmt");
        });
    }
  }
})();
