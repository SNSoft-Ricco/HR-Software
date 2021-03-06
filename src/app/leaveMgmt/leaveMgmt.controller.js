(function() {

  'use strict';

  angular
    .module('snsoftHr')
    .controller('LeaveMgmtController', LeaveMgmtController);

  /** @ngInject */
  function LeaveMgmtController($mdDialog, $document, $timeout, $cookies, $log, leaveServ, AuthService, syncData) {
    var vm = this;
    var id = 3;

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
      });

      function DialogController($log, $mdDialog, $cookies, leaveServ, toastr) {
        var vm = this;

        vm.entitleDays = 0;
        vm.checkViewPermission = checkViewPermission;
        vm.types = ["Annual Leave", "Medical Leave", "Compassionate Leave", "Hospitalization",
          "Marriage", "Maternity", "Unpaid Leave", "Paternity", "Other Reason"];

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
            approveBy: $cookies.getObject('loggedInUser').supervisor,
            type: vm.type,
            from: vm.from,
            to: vm.to,
            description: vm.description
          };

          leaveServ.addLeave(leave).then(function(msg){
            toastr.success('Your leave is now pending approval.', 'Success');
            loadCurUserLeave();
            vm.cancel();
          });
        };

        vm.loadEntitlement = function(leaveType) {
          vm.entitleDays = curUser.leaveDays[leaveType];
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
        syncData.sync()
        .then(function(result){
          syncData.mergeLeaveData(result, leaveServ.getLeaveByUsername, curUser.username)
          .then(function(leaves){
            vm.leaves = leaves;
          })
        })
      },500)
    }

    function loadPendingApprovalLeave() {
      $timeout(function() {
        leaveServ.getPendingApprovalLeaveByUsername(curUser.username).then(function(leaves) {
          vm.leavesPendingMyApprove = leaves;

          // get all leaves pending approve from department
          if (curUser.position === "Department Head") {
            leaveServ.getPendingApprovalLeaveByDepartment(curUser.department)
              .then(function(leaves) {
                leaves.forEach(function(leave) {
                  if (!vm.leavesPendingMyApprove.find(function(x) { return x.indexID === leave.indexID })
                        && curUser.username !== leave.user) {
                    vm.leavesPendingMyApprove.push(leave);
                  }
                });
            });
          }
        });
      },500);
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
