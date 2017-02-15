(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.controller('DeptMgmtController', DeptMgmtController);

	/** @ngInject */
	function DeptMgmtController($log, $window, $cookies, $state, localdb, deptServ) {
		var vm = this;
		
		// Function Declaration
		vm.newDept = newDept;
		vm.rmDept = rmDept;

		// Load Departments Table
		showAllDepts();

		function showAllDepts () {
			deptServ.getAllDepartments().then(function(depts) {
				vm.depts = depts;
			})
		}

		function newDept () {
			$state.go('deptReg');
		}

		// Function - Remove Department
		function rmDept(objDept) {
			deptServ.rmDept(objDept).then(function(msg) {
				alert(msg);
				showAllDepts();
			})
		}
	}
})();