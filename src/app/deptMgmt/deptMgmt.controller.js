(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.controller('DeptMgmtController', DeptMgmtController);

	/** @ngInject */
	function DeptMgmtController($log, $window, $cookies, $state, $timeout, $mdDialog, localdb, deptServ, toastr, AuthService, syncData, mongoServ) {
		var vm = this;
		var id = 4;

		// Function Declaration
		vm.newDept = newDept;
		vm.rmDept = rmDept;
		vm.editDept = editDept;
		vm.showDeptDetail = showDeptDetail;
		vm.checkViewPermission = checkViewPermission;

		// Load Departments Table
		$timeout(showAllDepts,200);

		//// Public Functions
		function newDept () {
			$state.go('deptReg');
		}

		// Function - Remove Department
		function rmDept(objDept) {
			deptServ.rmDept(objDept).then(function(msg) {
				toastr.success('Successfully removed department', 'Success');
				objDept.status = 0;
				mongoServ.editDept(objDept).then(function(){
					showAllDepts();	
				})
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
			syncData.sync()
			.then(function(result){
				syncData.mergeData(result, deptServ.getAllDepartments)
				.then(function(depts){
					vm.depts = depts;
				})
			})
		}

    function checkViewPermission()
    {
      if($cookies.getObject('loggedInUser')){
        var username = $cookies.getObject('loggedInUser').username;

        AuthService.checkPermission(username,id).then(
          function(data){
            vm.isAllowed = data;
          },
          function(err) {
            $log.info(err);
          }
        );
      }
      else
        $log.info("cookies not exist");
    }
    checkViewPermission();
	}
})();
