(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })

      .state('userMgmt', {
        url: '/',
        templateUrl: 'app/userMgmt/userMgmt.html',
        controller: 'UserMgmtController',
        controllerAs: 'userMgmt'
      })

      .state('userRgst', {
        url: '/user-registration',
        templateUrl: 'app/userRgst/userRgst.html',
        controller: 'UserRgstController',
        controllerAs: 'userRgst'
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
