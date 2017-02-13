(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })

      .state('userMgmt', {
        url: '/user-management',
        templateUrl: 'app/userMgmt/userMgmt.html',
        controller: 'UserMgmtController',
        controllerAs: 'userMgmt'
      })
      // Login Page
      // .state('login', {
      //   url: '/login',
      //   templateUrl: 'app/login/login.html',
      //   controller: 'LoginController',
      //   controllerAs: 'login'
      // });

    $urlRouterProvider.otherwise('/');
  }

})();
