(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.controller('LeaveMgmtController', LeaveMgmtController);

	/** @ngInject */
	function LeaveMgmtController($mdDialog, $document, $timeout, $cookies, $log, leaveServ) {
		var vm = this;

		// Function Declaration
        vm.newLeave = newLeave;

        // Variables
        var curUser = $cookies.getObject('loggedInUser');

		// Load current user leaves
        loadCurUserLeave();

		//// Public Functions
        function newLeave (ev) {
            $mdDialog.show({
                controller: DialogController,
                controllerAs: 'dialog',
                templateUrl: '/app/leaveMgmt/leaveMgmt.newLeave.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: vm.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
                vm.status = 'You said the information was "' + answer + '".';
            }, function() {
                vm.status = 'You cancelled the dialog.';
            });

            function DialogController($log, $mdDialog, $cookies, leaveServ, toastr) {
                var vm = this;
                vm.leaveTypes = ["Annual Leave", "Medical Leave", "Other Reason"];

                vm.hide = function() {
                    $mdDialog.hide();
                };

                vm.cancel = function() {
                    $mdDialog.cancel();
                };

                vm.applyLeave = function() {
                    var leave = {
                        user: $cookies.getObject('loggedInUser').username,
                        leaveType: vm.leaveType,
                        fromDate: vm.fromDate,
                        toDate: vm.toDate,
                        description: vm.description
                    };

                    leaveServ.addLeave(leave).then(function(msg){
                        toastr.success('Your leave is now pending approval.', 'Success');
                        loadCurUserLeave();
                        vm.cancel();
                    });
                };
            } 
        }

		//// Private Functions
        function loadCurUserLeave() {
            $timeout(function() {
                leaveServ.getLeaveByUsername(curUser.username).then(function(leaves) {
                    vm.leaves = leaves;
                });
            },200);
        }

	}
})();