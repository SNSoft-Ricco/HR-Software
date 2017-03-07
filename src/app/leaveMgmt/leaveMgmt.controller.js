(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('LeaveMgmtController', LeaveMgmtController);

  /** @ngInject */
  function LeaveMgmtController($mdDialog, $document, $timeout, $cookies, $log, leaveServ, AuthService) {
    var vm = this;

    // Function Declaration
    vm.newLeave = newLeave;
    vm.approveLeave = approveLeave;
    vm.checkViewPermission = checkViewPermission;

    // Variables
    var curUser = $cookies.getObject('loggedInUser');
    vm.selectedApproval = [];

    // Load current user leaves
    loadCurUserLeave();
    loadPendingApprovalLeave();

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
        vm.checkViewPermission = checkViewPermission;
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
            department: $cookies.getObject('loggedInUser').department,
            approvalBy: $cookies.getObject('loggedInUser').supervisor,
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

    function approveLeave() {
      for (var leaveId in vm.selectedApproval) {
        if (vm.selectedApproval[leaveId] == true) {
          leaveServ.approveLeave(leaveId);
        }
      }
    }

    //// Private Functions
    function loadCurUserLeave() {
      $timeout(function() {
        leaveServ.getLeaveByUsername(curUser.username).then(function(leaves) {
          vm.leaves = leaves;
        });
      },500);
    }

    function loadPendingApprovalLeave() {
      $timeout(function() {
        leaveServ.getPendingApprovalLeaveByUsername(curUser.username).then(function(leaves) {
          vm.leavesPendingMyApprove = leaves;
          $log.info("leaves",leaves);
        });
      },500);
    }


    function checkViewPermission(id)
    {
      if(document.cookie.indexOf('loggedInUser') > -1){
        var username = $cookies.getObject('loggedInUser').username;
        var isAllowed = AuthService.checkPermission(username,id);
        return isAllowed;
      }
      else
        console.log("cookies not exist");
    }

  }
})();
