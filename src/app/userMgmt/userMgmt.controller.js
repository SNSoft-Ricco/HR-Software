(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('UserMgmtController', UserMgmtController);

  /** @ngInject */
  function UserMgmtController($log, $window, localdb) {
    var vm = this;

    $log.info("User Mgmt controller");
    vm.submit = submit;

    function submit() {
      $log.info(vm.username + " " + vm.pwd);
      localdb.addUser(vm.username, vm.pwd);
    }
  }
})();
