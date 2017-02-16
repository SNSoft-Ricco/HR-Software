(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.controller('DeptRegController', DeptRegController);

	/** @ngInject */
	function DeptRegController($log, $window, $cookies, $state, $stateParams, deptServ) {
		var vm = this;
		
		var dynTemplate = {
				"department": {
					"fieldName": "Department",
					"type": "text",
					"inputType": "textbox",
					"glyphClass": "glyphicon glyphicon-user",
					"placeholder": "Enter a department name",
					"value": "test",
					"forEdit": "false"
				},
        "head": {
					"fieldName": "Head",
					"type": "text",
					"inputType": "textbox",
					"glyphClass": "glyphicon glyphicon-user",
					"placeholder": "",
					"value": "test",
					"forEdit": "true"
				}
			}

		vm.dynFields = dynTemplate;
		vm.editMode = false;
		vm.inputs = [];
		vm.title = "New Department Registration"

		vm.newDept = newDept;
		vm.newField = newField;

		// Edit Mode
		if (angular.isObject($stateParams.myParam)) {
      var objDept = $stateParams.myParam;
      var i = 0;

      vm.editMode = true;
      vm.title = "Edit Department Information"

      for (var dept in objDept) {
        if(vm.dynFields.hasOwnProperty(dept)) {
          vm.inputs[i] = objDept[dept];
        } else {
          vm.dynFields[dept] = {
            "fieldName": dept,
            "type": "text",
            "inputType": "textbox",
            "glyphClass": "glyphicon glyphicon-list-alt"
          };

          vm.inputs[i] = objDept[dept];
        }

        i++;
      }
		}
	
		// Load Departments as select options
		// deptServ.getAllDepartments().then(function(depts) {
		// 	vm.depts = depts;
		// })

		function newDept () {
			var i = 0;
      var fields = {};

      // Get dynamic fields
      for (var field in vm.dynFields) {
        fields[field] = vm.inputs[i];
        i++;
      }

      if (vm.editMode)
      {
        deptServ.editDept(fields).then(function(response){
          alert(response);
          $state.go('deptMgmt');
        });
      } else {
        deptServ.addDept(fields).then(function(response){
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