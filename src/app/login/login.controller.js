(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($log, $window, $state, localdb) {
    var vm = this;

    vm.login = login;

    localdb.getLocal();
    localdb.addUser();

    var accessData = angular.fromJson($window.localStorage['storageName']);
    $log.info(accessData);
    vm.userEmail = accessData.username;

    function login() {
      $state.go("userMgmt");
    }
  }
})();
