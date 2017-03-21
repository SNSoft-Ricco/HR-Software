(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('UserRgstController', UserRgstController);

  /** @ngInject */
  function UserRgstController(
    $log, $cookies, $state, $timeout, $stateParams,
    userServ, deptServ, PermissionService, toastr, AuthService, mongoServ) {

    var vm = this;
    var id = 2;
    var objUser = $stateParams.myParam;
    var isRegister = $stateParams.isRegister;

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
      "password": {
        "fieldName": "Password",
        "type": "password",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-lock",
        "placeholder": "Enter a secure password",
				"forEdit": "false"

      },
      "userGroup": {
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
      "name": {
        "fieldName": "Full Name",
        "type": "text",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-user"
      },
      "contactNo": {
        "fieldName": "Contact No.",
        "type": "text",
        "inputType": "textbox",
        "glyphClass": "glyphicon glyphicon-earphone"
      }
    };

    var leaveDaysTemplate = {
      "Annual Leave":8,
      "Medical Leave":14,
      "Compassionate Leave":0,
      "Hospitalization":60,
      "Marriage":0,
      "Maternity":0,
      "Unpaid Leave":0,
      "Paternity":0,
      "Other Reason":0};

    var hiddenFields = ['indexID', 'lastModified', 'userGroupName', 'leaveDays'];

    vm.userStatusList = {0: 'Suspended' ,1: 'Active'};// ['Active', 'Disabled'];
    vm.dynFields = dynTemplate;
    vm.editMode = false;
    vm.title = "New User Registration";

    vm.inputs = [];

    vm.back = back;
    vm.submit = submit;
    vm.newField = newField;
    vm.loadNext = loadNext;
    vm.checkViewPermission = checkViewPermission;

    // Load Permission as select options
    PermissionService.getAllPermission().then(function(pms){
      vm.pms = pms;
    });

    // Load Departments as select options
    deptServ.getAllDepartments().then(function(depts) {
      vm.depts = depts;
    });

    // Load users as select options
    userServ.getAllUsers().then(function(users){
      vm.users = users;
    });

    // Refresh Page Handler
    if (!isRegister) {
      if (objUser == null) {
        $state.go('userMgmt');
      }
      else {
        var i = 0;

        vm.editMode = true;
        vm.title = "Edit User Information";

        for (var field in objUser) {
          if(vm.dynFields.hasOwnProperty(field)) {
            vm.inputs[i] = objUser[field];

            loadNext(field, objUser[field]);
          } else {
            if (hiddenFields.indexOf(field) < 0) {
              vm.dynFields[field] = {
                "fieldName": field,
                "type": "text",
                "inputType": "textbox",
                "glyphClass": "glyphicon glyphicon-list-alt"
              };

              if (field == 'status') {
                vm.dynFields[field].inputType = "selectBox";
              }

              vm.inputs[i] = objUser[field];
            }
          }

          i++;
        }
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

      // to be removed - add leave days template to existing users
      fields['leaveDays'] = leaveDaysTemplate;

      // Special handling to set user as department head
      if (fields['position'] === 'Department Head') {
        $log.info("Department Head");
        deptServ.getDept(fields['department']).then(function(objDept){
          objDept.head = fields['name'];
          deptServ.editDept(objDept).then(function(){
            toastr.success("Successfully set department head", "Success");
          })
        })
      }

      if (vm.editMode)
      {
        userServ.editUser(fields).then(function(){
          toastr.success("Successfully edited employee");
          back();
        })
        .then(function(){
          mongoServ.editUser(fields);
        })
      } else {
        userServ.addUser(fields).then(function(){
          toastr.success("Successfully added employee");
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
            $log.info('vm.positions',vm.positions);
          });
          break;
        case 'position':
          break;
        default:
          break;
      }
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
