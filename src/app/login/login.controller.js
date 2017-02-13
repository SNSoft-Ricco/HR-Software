(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($log, $window, $state, localdb) {
    var vm = this;

    vm.login = login;

    function login() {
      localdb
        .getUser(vm.userEmail)
        .then(function(data){
          // Verify success
          $log.info("Verify success!");
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
