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
    function NavbarController($log, $state, $cookies, AuthService) {
      var vm = this;

      vm.logout = logout;

      vm.loginStatus = "";

      var curUser = $cookies.getObject('loggedInUser');

      if (curUser){
        vm.loginStatus = "Signed in as " + curUser.username;
      }
        
      function logout() {
        AuthService.clearList();
        $cookies.remove('loggedInUser');
        $state.go('login');
      }
    }
  }

})();
