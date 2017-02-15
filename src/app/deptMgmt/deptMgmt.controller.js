(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.controller('DeptMgmtController', DeptMgmtController);

	/** @ngInject */
	function DeptMgmtController($log, $window, $cookies, $state, localdb, deptServ) {
		var vm = this;
		
		vm.newDept = newDept;

		// Load Departments as select options
		deptServ.getAllDepartments().then(function(depts) {
			vm.depts = depts;
		})

		function newDept () {
			$state.go('deptReg');
		}
	}
})();