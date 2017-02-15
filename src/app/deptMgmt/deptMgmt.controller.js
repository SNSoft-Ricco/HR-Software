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
		vm.editDept = editDept;
		vm.showDeptDetail = showDeptDetail;

		// Load Departments Table
		showAllDepts();

		//// Public Functions
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

		// Function - Edit Department
		function editDept(objDept) {
			$state.go("deptReg", {myParam: objDept});
		}

		function showDeptDetail(objDept) {
			$state.go("deptDetail", {myParam: objDept});
		}

		//// Private Functions
		function showAllDepts () {
			deptServ.getAllDepartments().then(function(depts) {
				vm.depts = depts;
			})
		}
	}
})();