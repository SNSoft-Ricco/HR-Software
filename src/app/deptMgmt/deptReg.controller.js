(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.controller('DeptRegController', DeptRegController);

	/** @ngInject */
	function DeptRegController($log, $window, $cookies, $state, deptServ) {
		var vm = this;
		
		var dynTemplate = {
				"department": {
					"fieldName": "Department",
					"type": "text",
					"inputType": "textbox",
					"glyphClass": "glyphicon glyphicon-user",
					"placeholder": "Enter a department name",
					"value": "test"
				}
			}

		vm.dynFields = dynTemplate;
		vm.editMode = false;
		vm.inputs = [];
		vm.newDept = newDept;

		// Load Departments as select options
		deptServ.getAllDepartments().then(function(depts) {
			vm.depts = depts;
		})

		function newDept () {
			var i = 0;
      var fields = {};

      // Get dynamic fields
      for (var field in vm.dynFields) {
        fields[field] = vm.inputs[i];
        i++;
      }

      $log.info(fields);

      if (vm.editMode)
      {
        deptServ.editUser(fields).then(function(response){
          alert(response);
        });
      } else {
        deptServ.addDept(fields).then(function(response){
          alert(response);
        });
      }
		}
	}
})();