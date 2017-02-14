(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('UserRgstController', UserRgstController);

  /** @ngInject */
  function UserRgstController($log, $window, $cookies, $state, localdb) {
    var vm = this;

    var dynTemplate = {
      "username": {
        "fieldName": "Username",
        "type": "text",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-user",
        "placeholder": "Enter an username"
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
      "contactno": {
        "fieldName": "Contact No.",
        "type": "text",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-earphone"
      }
    }

    vm.dynFields = dynTemplate;

    vm.inputs = [];

    vm.back = back;
    vm.submit = submit;
    vm.newField = newField;

    function back() {
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

      localdb.addUser(fields).then(function(response){
        alert(response);
      });
    }

    function newField() {
      vm.dynFields[angular.lowercase(vm.newName)] = {
        "fieldName": vm.newName,
        "type": "text",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-list-alt"
      };
      $log.info(vm.dynFields);
    }
  }
})();
