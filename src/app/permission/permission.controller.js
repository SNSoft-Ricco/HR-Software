


(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('PermissionController', PermissionController);

    PermissionController.$inject = ['PermissionService'];

    function PermissionController(PermissionService) {
        var vm = this;
        
        var dynTemplate = {
            "code": {
                "fieldName": "Permission Code",
                "type": "text",
                "inputType": "textbox",
                "glyphClass": "glyphicon glyphicon-star",
                "placeholder": "Enter a permission code",
                "value": "test",
                "forEdit": "false"
            },
            "desc": {
                "fieldName": "Description",
                "type": "text",
                "inputType": "textbox",
                "glyphClass": "glyphicon glyphicon-star",
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
        vm.pmsArray = [];

        vm.PermissionChkBox = [ {id:1, name:'View own details'},
                                {id:2, name:'Manage User'},
                                {id:3, name:'Manage Group'},
                                {id:4, name:'Manage Department'},
                                {id:5, name:'Manage Permission'}
                              ];
        vm.selection = [];

        function AddPermission() {
            var i = 0;
            var fields = {};
            var obj = {};

            // Get dynamic fields
            for (var field in vm.dynFields) {
                fields[field] = vm.inputs[i];
                i++;
            }

            if(vm.id == null || vm.id=="") //insert
            {
                obj = { code: fields.code, desc: fields.desc, PermissionList:vm.selection };

                var promise = PermissionService.addPermission(obj);
                promise.then (function(){
                    refreshList();
                });
            }
            else //update
            {
                obj = { id: vm.id, code: fields.code, desc: fields.desc, PermissionList:vm.selection };

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
                //vm.desc = "";

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

                vm.id = result.id;
                vm.selection = [];
                vm.selection = result.PermissionList;
                //vm.code = result.code;
                //vm.desc = result.desc;

                for(var field in result)
                {
                    if(field == "code")
                        vm.inputs[0] = result[field];
                    else if(field == "desc")
                        vm.inputs[1] = result[field];
                }
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

        var db = PermissionService.getDbConnection();

        if(db){
            refreshList();
        }else{
            var promise = PermissionService.openDb();
            promise.then (function(){
                refreshList();
            });
        }
    }

})();
