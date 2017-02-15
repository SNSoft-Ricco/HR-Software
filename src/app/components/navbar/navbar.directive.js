(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .directive('snsNavbar', snsNavbar);

  /** @ngInject */
  function snsNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController($log, moment) {
      var vm = this;

      // "vm.creationDate" is available by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();
      vm.logout = logout;

      function logout() {
        $log.info("LOGOUT!!!");
      }
    }
  }

})();
