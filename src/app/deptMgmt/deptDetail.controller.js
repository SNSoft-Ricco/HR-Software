(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.controller('DeptDetailController', DeptDetailController);

	/** @ngInject */
	function DeptDetailController($log, $window, $cookies, $state, $stateParams, deptServ, userServ) {
		var vm = this;
    var objDept = $stateParams.myParam;

    vm.deptName = objDept.department;
    vm.users = "";

    showDeptUsers();

    //// Private Functions
    function showDeptUsers () {
      userServ.getUsersByIndex("userDepartment", objDept.department).then(function(users) {
        vm.users = users;
      })
    }
	}
})();