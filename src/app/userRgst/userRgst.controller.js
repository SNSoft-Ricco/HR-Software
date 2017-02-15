(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('UserRgstController', UserRgstController);

  /** @ngInject */
  function UserRgstController($log, $window, $cookies, $state, userServ, deptServ) {
    var vm = this;

    var dynTemplate = {
      "username": {
        "fieldName": "Username",
        "type": "text",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-user",
        "placeholder": "Enter an username",
        "value": "test"
      },
      "userpwd": {
        "fieldName": "Password",
        "type": "password",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-lock",
        "placeholder": "Enter a secure password"
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

    // Load Departments as select options
    deptServ.getAllDepartments().then(function(depts) {
      vm.depts = depts;
    })

    if ($cookies.get('editUser')) {
      var objUser = angular.fromJson($cookies.get('editUser'));
      var i = 0;

      vm.editMode = true;
      vm.title = "Edit User Information"

      for (var field in objUser) {
        if(vm.dynFields.hasOwnProperty(field)) {
          vm.inputs[i] = objUser[field];
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
        userServ.editUser(fields).then(function(response){
          alert(response);
        });
      } else {
        userServ.addUser(fields).then(function(response){
          alert(response);
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
  }
})();
