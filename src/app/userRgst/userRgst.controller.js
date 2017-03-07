(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('UserRgstController', UserRgstController);

  /** @ngInject */
  function UserRgstController(
    $log, $window, $cookies, $state, $timeout, userServ, deptServ, PermissionService, toastr,AuthService) {

    var vm = this;

    var dynTemplate = {
      "username": {
        "fieldName": "Username",
        "type": "text",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-user",
        "placeholder": "Enter an username",
        "value": "test",
				"forEdit": "false"
      },
      "userpwd": {
        "fieldName": "Password",
        "type": "password",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-lock",
        "placeholder": "Enter a secure password",
				"forEdit": "false"

      },
      "usergroup": {
        "fieldName": "User Group",
        "inputType": "selectbox",
        "glyphClass": "glyphicon glyphicon-briefcase"
      },
      "department": {
        "fieldName": "Department",
        "inputType": "selectbox",
        "glyphClass": "glyphicon glyphicon-star"
      },
      "position": {
        "fieldName": "Position",
        "inputType": "selectbox",
        "glyphClass": "glyphicon glyphicon-briefcase"
      },
      "supervisor": {
        "fieldName": "Supervisor",
        "inputType": "selectbox",
        "glyphClass": "glyphicon glyphicon-user"
      },
      "fullname": {
        "fieldName": "Full Name",
        "type": "text",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-user"
      },
      "contactno": {
        "fieldName": "Contact No.",
        "type": "text",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-earphone"
      }
    }

    vm.dynFields = dynTemplate;
    vm.editMode = false;
    vm.title = "New User Registration"

    vm.inputs = [];

    vm.back = back;
    vm.submit = submit;
    vm.newField = newField;
    vm.loadNext = loadNext;
    vm.checkViewPermission = checkViewPermission;

    setTimeout(function(){
      // Load Permission as select options
      PermissionService.getAllPermission().then(function(pms){
        vm.pms = pms;
      })

      // Load Departments as select options
      deptServ.getAllDepartments().then(function(depts) {
        vm.depts = depts;
      })

      // Load users as select options
      userServ.getAllUsers().then(function(users){
        vm.users = users;
      })
    },500)


    if ($cookies.get('editUser')) {
      var objUser = angular.fromJson($cookies.get('editUser'));
      var i = 0;

      vm.editMode = true;
      vm.title = "Edit User Information";

      for (var field in objUser) {
        if(vm.dynFields.hasOwnProperty(field)) {
          vm.inputs[i] = objUser[field];

          loadNext(field, objUser[field]);
        } else {
          vm.dynFields[field] = {
            "fieldName": field,
            "type": "text",
            "inputType": "textbox",
            "glyphClass": "glyphicon glyphicon-list-alt"
          };

          vm.inputs[i] = objUser[field];
        }

        i++;
      }
    }

    function back() {
      vm.editMode = false;
      $cookies.remove('editUser');
      $state.go('userMgmt');
    }

    function submit() {
      var i = 0;
      var fields = {};

      // Get dynamic fields
      for (var field in vm.dynFields) {
        fields[field] = vm.inputs[i];
        i++;
      }

      if (vm.editMode)
      {
        $log.info('fields',fields);
        userServ.editUser(fields).then(function(){
          toastr.success("Successfully edited employee", "Success");
          back();
        });
      } else {
        userServ.addUser(fields).then(function(){
          toastr.success("Successfully added employee", "Success");
          back();
        });
      }

    }

    function newField() {
      vm.dynFields[angular.lowercase(vm.newName)] = {
        "fieldName": vm.newName,
        "type": "text",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-list-alt"
      };
    }

    function loadNext(key, deptName) {
      switch(key) {
        case 'department':
          deptServ.getDept(deptName).then(function(dept){
            vm.positions = dept.position;
          });
          break;
        case 'position':
          break;
        default:
          break;
      }
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
