
(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('PermissionController', PermissionController);

  //PermissionController.$inject = ['PermissionService'];

  function PermissionController($cookies,$log,PermissionService,AuthService,syncData) {
    var vm = this;
    var id = 5; //permission id for permission page

    vm.test;

    vm.AddPermission = AddPermission;
    vm.DeletePermission = DeletePermission;
    vm.EditPermission = EditPermission;
    vm.refreshList = refreshList;
    vm.toggleSelection=toggleSelection;
    vm.checkViewPermission = checkViewPermission;
    vm.ViewPermissionUser = ViewPermissionUser;

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
      },
      "_id": {
        "fieldName": "_id",
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
      // Get dynamic fields
      for (var field in vm.dynFields) {
        fields[field] = vm.inputs[i];
        i++;
      }

      if(vm.id == null || vm.id=="") //insert
      {
        var indexID = syncData.generateIndexID();
        obj = { indexID:indexID, code: fields.code, description: fields.description, permissionList:vm.selection };
        obj.lastModified = parseInt((new Date().getTime())/1000);

        PermissionService.addPermission(obj).then (
          function(){
            refreshList();
          },
          function (error) {
            $log.info(error);
          }
        );
      }
      else //update
      {
        obj = {  indexID:fields.indexID, _id:fields._id, code: fields.code, description: fields.description, permissionList:vm.selection };

        PermissionService.updatePermission(obj).then (
          function(){
            refreshList();
          },
          function (error) {
            $log.info(error);
          }
        );
      }
    }

    function refreshList(){
      PermissionService.getAllPermission(true).then (
        function(result){
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

          for(var k=0; k<vm.inputs.length; k++)
          {
            vm.inputs[k] = "";
          }
        },
        function (error) {
          $log.info(error);
        }
      );
    }


    function DeletePermission (id) {
      PermissionService.removePermission(id).then (
        function(){
          refreshList();
        },
        function (error) {
          $log.info(error);
        }
      );
    }


    function EditPermission (id) {
      PermissionService.getPermission(id).then (
        function(result){
          vm.id = result.indexID;
          vm.selection = [];
          vm.selection = result.permissionList;

          for(var field in result)
          {
            if(field == "code")
              vm.inputs[0] = result[field];
            else if(field == "description")
              vm.inputs[1] = result[field];
            else if(field == "indexID")
              vm.inputs[2] = result[field];
            else if(field == "_id")
              vm.inputs[3] = result[field];
          }
        },
        function (error) {
          $log.info(error);
        }
      );
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

    function ViewPermissionUser(id)
    {
      vm.PermissionUser = [];

      PermissionService.getPermissionUser(id).then(
        function(data){
          vm.PermissionUser = data;
        },
        function(err) {
          $log.info(err);
        }
      );
    }

    checkViewPermission();
    refreshList();
  }

})();
