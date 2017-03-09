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

      // User Registration/Edit View
      .state('userRgst', {
        url: '/user-registration',
        templateUrl: 'app/userRgst/userRgst.html',
        controller: 'UserRgstController',
        controllerAs: 'userRgst',
        params: {myParam: null, isRegister: false}
      })

      // Department Management View
      .state('deptMgmt', {
        url: '/department-management',
        templateUrl: 'app/deptMgmt/deptMgmt.html',
        controller: 'DeptMgmtController',
        controllerAs: 'deptMgmt'
      })

      // Department Registration View
      .state('deptReg', {
        url: '/department-registration',
        templateUrl: 'app/deptMgmt/deptReg.html',
        controller: 'DeptRegController',
        controllerAs: 'deptReg',
        params: {myParam: null}
      })

      // Department Detail View
      .state('deptDetail', {
        url: '/department-detail',
        templateUrl: 'app/deptMgmt/deptDetail.html',
        controller: 'DeptDetailController',
        controllerAs: 'deptDetail',
        params: {myParam: null}
      })

      // Department Management View
      .state('pmsMgmt', {
        url: '/permission-management',
        templateUrl: 'app/permission/permission.html',
        controller: 'PermissionController',
        controllerAs: 'Permission'
      })

      // Leave Management View
      .state('leaveMgmt', {
        url: '/leave-management',
        templateUrl: 'app/leaveMgmt/leaveMgmt.html',
        controller: 'LeaveMgmtController',
        controllerAs: 'leaveMgmt'
      })

      // Profile
      .state('profile', {
        url: '/profile-management',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileController',
        controllerAs: 'profile'
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
