


(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('PermissionController', PermissionController);

    //PermissionController.$inject = ['PermissionService'];

    function PermissionController($timeout,$cookies,PermissionService,AuthService, syncData) {
        var vm = this;
        var id = 5;

        var dynTemplate = {



            "code": {
                "fieldName": "Permission Code",
                "type": "text",
                "inputType": "textbox",
                "glyphClass": "glyphicon glyphicon-font",
                "placeholder": "Enter a permission code",
                "value": "test",
                "forEdit": "false"
            },
            "description": {
                "fieldName": "Description",
                "type": "text",
                "inputType": "textbox",
                "glyphClass": "glyphicon glyphicon-info-sign",
                "placeholder": "Enter a description",
                "value": "test",
                "forEdit": "false"
            },
            "indexID": {
                "fieldName": "indexID",
                "type": "text",
                "inputType": "textbox",
                "glyphClass": "glyphicon glyphicon-info-sign",
                "placeholder": "Enter a description",
                "value": "test",
                "forEdit": "false"
            }



        }
        vm.dynFields = dynTemplate;
        vm.editMode = false;
        vm.inputs = [];
        vm.title = "Permission Management";

        vm.AddPermission = AddPermission;
        vm.DeletePermission = DeletePermission;
        vm.EditPermission = EditPermission;
        vm.refreshList = refreshList;
        vm.toggleSelection=toggleSelection;
        vm.checkViewPermission = checkViewPermission;
        vm.ViewPermissionUser = ViewPermissionUser;
        vm.pmsArray = [];
        vm.PermissionUser = [];

        vm.PermissionChkBox = [ {id:1, name:'View own details'},
                                {id:2, name:'Manage User'},
                                {id:3, name:'Manage Leave'},
                                {id:4, name:'Manage Department'},
                                {id:5, name:'Manage Permission'}
                              ];
        vm.selection = [];

        function AddPermission() {
            var i = 0;
            var fields = {};
            var obj = {};
            // var indexID = syncData.generateIndexID();
            // Get dynamic fields
            for (var field in vm.dynFields) {
                fields[field] = vm.inputs[i];
                i++;
            }

            if(vm.id == null || vm.id=="") //insert
            {
                obj = {  code: fields.code, description: fields.description, permissionList:vm.selection };

                var promise = PermissionService.addPermission(obj);
                promise.then (function(){
                    refreshList();
                });
            }
            else //update
            {
                obj = {  code: fields.code, description: fields.description, permissionList:vm.selection };

                var promise = PermissionService.updatePermission(obj);
                promise.then (function(){
                    refreshList();
                });
            }
        }

        function refreshList(){
            
            var promise = PermissionService.getAllPermission();
            promise.then (function(result){
                var tmpArray = result;

                for(var i=0;i<tmpArray.length;i++)
                {
                  for(var j=0;j<tmpArray[i].array.length;j++)
                  {
                    var txt = "";
                    if(tmpArray[i].array[j] == 1)      txt = vm.PermissionChkBox[0].name;
                    else if(tmpArray[i].array[j] == 2) txt = vm.PermissionChkBox[1].name;
                    else if(tmpArray[i].array[j] == 3) txt = vm.PermissionChkBox[2].name;
                    else if(tmpArray[i].array[j] == 4) txt = vm.PermissionChkBox[3].name;
                    else if(tmpArray[i].array[j] == 5) txt = vm.PermissionChkBox[4].name;

                    tmpArray[i].array[j] = txt;
                  }
                }

                vm.pmsArray=tmpArray;
                vm.id = "";
                vm.selection = [];
                //vm.code = "";
                //vm.description = "";

                for(var i=0; i<vm.inputs.length; i++)
                {
                    vm.inputs[i] = "";
                }
            });
        }

        function DeletePermission (id) {
            var promise = PermissionService.removePermission(id);
            promise.then (function(){
                refreshList();
            });
        }

        function EditPermission (id) {
            var promise = PermissionService.getPermission(id);
            promise.then (function(result){

                vm.id = result.indexID;
                vm.selection = [];
                vm.selection = result.permissionList;
                //vm.code = result.code;
                //vm.description = result.description;

                for(var field in result)
                {
                    if(field == "code")
                        vm.inputs[0] = result[field];
                    else if(field == "description")
                        vm.inputs[1] = result[field];
                    else if(field == "indexID")
                        vm.inputs[2] = result[field];                }
            });
        }

        function toggleSelection(id)
        {
            var idx = vm.selection.indexOf(id);

            // Is currently selected
            if (idx > -1) {
              vm.selection.splice(idx, 1); //remove frim array
            }

            // Is newly selected
            else {
              vm.selection.push(id);
            }
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

        function ViewPermissionUser(id)
        {
            vm.PermissionUser = [];

            var promise = PermissionService.getPermissionUser(id);
            promise.then(function(data){
                vm.PermissionUser = data;
            }, function(err) {
              alert("Invalid user for this permission group!");
            });
        }

      this.checkViewPermission();
      this.refreshList();
    }

})();
