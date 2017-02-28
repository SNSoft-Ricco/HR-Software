(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.controller('DeptDetailController', DeptDetailController);

	/** @ngInject */
	function DeptDetailController($log, $window, $cookies, $state, $stateParams, deptServ, userServ) {
		var vm = this;
    var objDept = $stateParams.myParam;

    // Refresh Page Handler
    if (objDept == null) {
      $state.go('deptMgmt');
    }
    else {
      vm.deptName = objDept.department;
      vm.headName = objDept.head;
      vm.users = "";

      showDeptUsers();
    }

    //// Private Functions
    function showDeptUsers () {
      userServ.getUsersByIndex("userDepartment", objDept.department).then(function(users) {
        vm.users = users;
      })
    }
	}
})();