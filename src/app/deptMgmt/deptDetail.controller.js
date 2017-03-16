(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('DeptDetailController', DeptDetailController);

  /** @ngInject */
  function DeptDetailController($log, $window, $cookies, $state, $stateParams, $mdDialog, deptServ, userServ, AuthService) {
    var vm = this;
    var objDept = $stateParams.myParam;
    var id = 4;

    // Function Declaration
    vm.addPosition = addPosition;

    // Refresh Page Handler
    if (objDept == null) {
      $state.go('deptMgmt');
    }
    else {
      vm.deptName = objDept.department;
      vm.headName = objDept.head;
      vm.checkViewPermission = checkViewPermission;
      vm.users = "";

      showDeptUsers();
    }

    // Function - show add position prompt
    function addPosition(ev) {
      var confirm = $mdDialog.prompt()
        .title('What is the name of new position?')
        //.textContent('Bowser is a common name.')
        .placeholder('Position Name')
        .ariaLabel('Position name')
        //.initialValue('Buddy')
        .targetEvent(ev)
        .ok('Create')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        if (!objDept.position) {
          objDept.position = [];
        }

        objDept.position.push({
          positionId: 1,
          positionName: result
        });

        deptServ.editDept(objDept).then(function(msg){
          alert(msg);
        })
      }, function() {
        //$scope.status = 'You didn\'t name your dog.';
        $log.info("selected no")
      });
    }

    //// Private Functions
    function showDeptUsers () {
      userServ.getUsersByIndex("userDepartment", objDept.department).then(function(users) {
        vm.users = users;
      })
    }

    function checkViewPermission()
    {
      if(document.cookie.indexOf('loggedInUser') > -1){
        var username = $cookies.getObject('loggedInUser').username;
        var promise = AuthService.checkPermission(username,id);
        promise.then(function(data){
          vm.isAllowed = data;
        }, function(err) {
          console.log("invalid permission checking");
        });
      }
      else
        console.log("cookies not exist");
    }

    this.checkViewPermission();
  }
})();
