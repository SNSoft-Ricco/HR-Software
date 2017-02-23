(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.controller('LeaveMgmtController', LeaveMgmtController);

	/** @ngInject */
	function LeaveMgmtController($mdDialog, $document) {
		var vm = this;

		// Function Declaration
        vm.newLeave = newLeave;

		// Load Departments Table

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
        }

		//// Private Functions
        function DialogController($log, $mdDialog, systemServ) {
            var vm = this;

            vm.leaveTypes = {
                1: "Annual Leave",
                2: "Medical Leave",
                99: "Other Reason"
            }

            vm.hide = function() {
                $mdDialog.hide();
            };

            vm.cancel = function() {
                $mdDialog.cancel();
            };

            vm.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }

	}
})();