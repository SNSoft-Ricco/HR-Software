(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($log, $window) {
    var vm = this;

    var accessData = angular.fromJson($window.localStorage['storageName']);
    $log.info(accessData);
    vm.userEmail = accessData.username;
  }
})();
