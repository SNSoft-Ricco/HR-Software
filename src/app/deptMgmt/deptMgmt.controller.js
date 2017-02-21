(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.controller('DeptMgmtController', DeptMgmtController);

	/** @ngInject */
	function DeptMgmtController($log, $window, $cookies, $state, $timeout, $mdDialog, localdb, deptServ) {
		var vm = this;
		
		// Function Declaration
		vm.newDept = newDept;
		vm.rmDept = rmDept;
		vm.editDept = editDept;
		vm.showDeptDetail = showDeptDetail;
		vm.showPrompt = showPrompt;
    
		// Load Departments Table
		$timeout(showAllDepts,200);

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

		// Function - show add position prompt
		function showPrompt(ev) {
			$log.info('show prompt!')
			// Appending dialog to document.body to cover sidenav in docs app
			var confirm = $mdDialog.prompt()
				.title('What is the name of new department?')
				//.textContent('Bowser is a common name.')
				.placeholder('Department Name')
				.ariaLabel('Dog name')
				//.initialValue('Buddy')
				.targetEvent(ev)
				.ok('Create')
				.cancel('Cancel');

			$mdDialog.show(confirm).then(function(result) {
				//$scope.status = 'You decided to name your dog ' + result + '.';
				$log.info(result)
			}, function() {
				//$scope.status = 'You didn\'t name your dog.';
				$log.info("selected no")
			});
		}

		//// Private Functions
		function showAllDepts () {
			deptServ.getAllDepartments().then(function(depts) {
				vm.depts = depts;
			})
		}
	}
})();