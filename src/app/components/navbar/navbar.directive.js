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
    function NavbarController($log, $state, $cookies) {
      var vm = this;

      vm.logout = logout;

      vm.curUserName = "ricco@snsoft.my";
      if ($cookies.getObject('loggedInUser')){
        $log.info('User Cookie', $cookies.getObject('loggedInUser'));
      }
        
      function logout() {
        $cookies.remove('loggedInUser');
        $state.go('login');
      }
    }
  }

})();
