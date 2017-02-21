(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($log, $cookies, $window, $state, userServ) {
    var vm = this;

    vm.login = login;

    // Check cookies
    if ($cookies.get("loggedInUser")) {
      var loggedInUser = angular.fromJson($cookies.get("loggedInUser"));
      $state.go("userMgmt");
    }

    function login() {
      userServ
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
