


(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('PermissionController', PermissionController);

    PermissionController.$inject = ['PermissionService'];

    function PermissionController(PermissionService,$scope) {
        var vm = this;
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
            if(vm.id == null || vm.id=="") //insert
            {
                var promise = PermissionService.addPermission(vm.code,vm.desc,vm.id,vm.selection);
                promise.then (function(){
                    refreshList();
                });
            }
            else //update
            {
                var promise = PermissionService.updatePermission(vm.code,vm.desc,vm.id,vm.selection);
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
                vm.code = "";
                vm.desc = "";
                vm.selection = [];
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
                vm.code = result.code;
                vm.desc = result.desc;
                vm.selection = [];
                vm.selection = result.PermissionList;
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

        var promise = PermissionService.openDb();
        promise.then (function(){
            refreshList();
        });
    }

})();
