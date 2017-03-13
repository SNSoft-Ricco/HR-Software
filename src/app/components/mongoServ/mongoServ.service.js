(function() {
'use strict';

  angular
      .module('snsoftHr')
      .service('mongoServ', mongoServ);

  /** @ngInject */
  function mongoServ($q, $log, $http) {
    // department
    this.getAllDepartments = getAllDepartments;
    this.addDept = addDept;
    this.editDept = editDept;
    this.rmDept = rmDept;
    this.editDeptObjectID = editDeptObjectID;

    //leave
    this.getLeaveByUsername = getLeaveByUsername;
    this.getPendingApprovalLeaveByUsername = getPendingApprovalLeaveByUsername;
    this.addLeave = addLeave;
    this.editLeave = editLeave;
    //user
    this.getAllUsers = getAllUsers;
    this.getUser = getUser; 
    this.addUser = addUser;
    this.rmUser = rmUser;
    this.editUser = editUser;
    this.editUserObjectID = editUserObjectID;
    //permission
    this.addPermission = addPermission;
    this.removePermission = removePermission;
    this.updatePermission = updatePermission;
    this.getAllPermission = getAllPermission;

    //////////
    ///   Departments
    /////////
  	function getAllDepartments(lastSync){
      var deferred = $q.defer();
      var result = [];

      // test data 1 -- test for the first data insert
      // *** need to have objectID , or it will create everytime ***
      // var result = [
      //   {
      //     department:"Logistic Department",
      //     objectID:"a12345",
      //     lastModified:"1488326400",
      //     // indexID:,
      //   },
      //   {
      //     department:"Oversea Department",
      //     objectID:"c12345",
      //     lastModified:"1488326400",
      //     // indexID:,
      //   }]


      // test data 2 -- test if the objectID is same 
      // ***** need to copy indexID , or it will create new record *****
      // var result = [
      //   {
      //     department:"Logistic Department",
      //     objectID:"a12345",
      //     lastModified:"1488326400",
      //     indexID:"admin@snsoft.my-1489031111072",
      //   },
      //   {
      //     department:"Global Department",
      //     lastModified:"1488326400",
      //     // indexID:,
      //   }]


      // test data 3 - test if the date is bigger than indexdb -> save to indexeddb
      // ***** need to copy indexID , or it will create new record *****
      // var result = [
      //   {
      //     department:"Logistic xXx Department",
      //     objectID:"a12345",
      //     lastModified:"1504224000",
      //     indexID:"admin@snsoft.my-1489034768347",
      //     // indexID:,
      //   }]


      // test data 4 - test if the data is smaller than indexdb -> save to mongodb
      // ***** need to copy indexID , or it will create new record *****
      // var result = [
      //   {
      //     department:"Logistic Department",
      //     objectID:"a12345",
      //     lastModified:"1483228800",
      //     indexID:"admin@snsoft.my-1489034768347",
      //     // indexID:,
      //   }]
      // return result

      var result =  $http({method: "GET", url:"http://localhost:3003/departments/"});



      deferred.resolve(result);

      return deferred.promise;


  	}

    function addDept(objDepts,callback){
      var deferred = $q.defer();

      if(Array.isArray(objDepts)){
        for(var objDept in objDepts){
          var result = $http({method:"POST", url:"http://localhost:3003/addDept/",
            data:{'data':objDepts[objDept]}
          }).then( function(results){ callback(results) })
        }
      }else{
          var result = $http({method:"POST", url:"http://localhost:3003/addDept/",
            data:{'data':objDepts}
          }).then(function(results){ 

           callback(results) 
          })
      }

      // deferred.resolve(result);
      return deferred.promise;
    }

    function editDept(objDept){
      return $http({method:"POST", url:"/editDept/",
        data:{'data':objDept}
      })
      console.log('editDept');
    }


    function editDeptObjectID(objectID){
      var deferred = $q.defer();

      var result = $http({method:"POST", url:"http://localhost:3003/editDeptObjectID/",
        data:{'data':objectID}
      }).then(function(results){ 

       deferred.resolve(results)
      })

      // return $http({method:"POST", url:"/editDeptObjectID/",
      //   data:{'data':objectID}
      // })
      console.log('editDept');
      return deferred.promise;

    }



    function rmDept(objDept){
      // return $http({method:"POST", url:"/editDept/",
      //   data:{'data':objDept}
      // })
    }

    /////////////
    // LEAVE
    /////////////

    function addLeave(objLeave, callback){
      // return $http({method:"POST", url:"/addLeave/",
      //   data{'data':objDept});
      // })
      var deferred = $q.defer();

      var result = $http({method:"POST", url:"http://localhost:3003/addLeave/",
        data:{'data':objLeave}
      }).then(function(results){ 

        callback(results)
      })

      // return $http({method:"POST", url:"/editDeptObjectID/",
      //   data:{'data':objectID}
      // })
      console.log('addLeave');
      return deferred.promise;

    }


    function editLeave(objLeaves){
      // return $http({method:"POST", url:"/editLeave/",
      //   data{'data':objDept});
      // })
      if(objLeaves.length>0){
        console.log(objLeaves);
        console.log('Edit Leave');
      }
    }

    function editLeaveObjectID(objLeave){
      var deferred = $q.defer();

      var result = $http({method:"POST", url:"http://localhost:3003/editLeaveObjectID/",
        data:{'data':objectID}
      }).then(function(results){ 

       deferred.resolve(results)
      })

      // return $http({method:"POST", url:"/editDeptObjectID/",
      //   data:{'data':objectID}
      // })
      console.log('editDept');
      return deferred.promise;
    }

    function getLeaveByUsername(username){
      var deferred = $q.defer();
      var leaves = [];

      // test data 1 -- test for the first data insert
      // *** need to have objectID , or it will create everytime ***
      // var leaves =[
      //   {
      //     user:"mark@snsoft.my",
      //     leaveType:"Medical Leave",
      //     fromDate:"2017-03-01T16:00:00.000Z",
      //     toDate:"2017-03-06T16:00:00.000Z",
      //     description:"Apply for Sick Leave",
      //     leaveStatus:"Pending",
      //     approvalBy:"logan@snsoft.my",
      //     createdTime:"2017-03-07T16:00:00.000Z",
      //     lastModified:"1488326400",
      //     objectID:"x12345",
      //     status:1
      //   },
      //   {
      //     user:"mark@snsoft.my",
      //     leaveType:"Medical Leave",
      //     fromDate:"2017-03-04T16:00:00.000Z",
      //     toDate:"2017-03-06T16:00:00.000Z",
      //     description:"Apply for Medical Leave",
      //     leaveStatus:"Pending",
      //     approvalBy:"logan@snsoft.my",
      //     createdTime:"2017-03-07T18:00:00.000Z",
      //     lastModified:"1488326400",
      //     objectID:"a123456",
      //     status:1
      //   }
      //   ]

        // test data 2 -- test if the objectID is same
      // ***** need to copy indexID , or it will create new record *****
      // var leaves = [
      //   {
      //     user:"mark@snsoft.my",
      //     leaveType:"Medical Leave",
      //     fromDate:"2017-03-04T16:00:00.000Z",
      //     toDate:"2017-03-06T16:00:00.000Z",
      //     description:"Apply for Medical Leave",
      //     leaveStatus:"Pending",
      //     approvalBy:"logan@snsoft.my",
      //     createdTime:"2017-03-07T18:00:00.000Z",
      //     lastModified:"1488326400",
      //     objectID:"a123456",
      //     status:1
      //   },
      //   {
      //     user:"mark@snsoft.my",
      //     leaveType:"Medical Leave",
      //     fromDate:"2017-06-01T16:00:00.000Z",
      //     toDate:"2017-06-02T16:00:00.000Z",
      //     description:"Apply for emo Leave",
      //     leaveStatus:"Pending",
      //     objectID:"",
      //     approvalBy:"kenny@snsoft.my",
      //     createdTime:"2017-06-07T18:00:00.000Z",
      //     lastModified:"1488326400",
      //     status:1
      //   }]



      // test data 3 - test if the date is bigger than indexdb -> save to indexeddb
      // ***** need to copy indexID , or it will create new record *****
      // var leaves = [
      //   {
      //     user:"mark@snsoft.my",
      //     leaveType:"Medical Leave",
      //     fromDate:"2017-09-04T16:00:00.000Z",
      //     toDate:"2017-09-06T16:00:00.000Z",
      //     description:"Apply for Medical Leave",
      //     leaveStatus:"Success",
      //     approvalBy:"logan@snsoft.my",
      //     createdTime:"2017-09-07T18:00:00.000Z",
      //     lastModified:"1504224000",
      //     indexID:"mark@snsoft.my-1488957854149",
      //     objectID:"a123456",
      //     status:1
      //   }]

      // test data 4 - test if the data is smaller than indexdb -> save to mongodb
      // ***** need to copy indexID , or it will create new record *****
      // var leaves = [
      //   {
      //     user:"mark@snsoft.my",
      //     leaveType:"Medical Leave",
      //     fromDate:"2017-01-04T16:00:00.000Z",
      //     toDate:"2017-01-06T16:00:00.000Z",
      //     description:"Apply for Medical Leave",
      //     leaveStatus:"Success",
      //     approvalBy:"logan@snsoft.my",
      //     createdTime:"2017-01-07T18:00:00.000Z",
      //     lastModified:"1483228800",
      //     indexID:"mark@snsoft.my-1488957854149",
      //     objectID:"a123456",
      //     status:1
      //   }]


      deferred.resolve(leaves);
      return deferred.promise;
      // return $http({method:"POST", url:"/getLeaveByUsername/",
      //   data{'data':username});
      // })
    }

    function getPendingApprovalLeaveByUsername(username){
      // return $http({method:"POST", url:"/getLeaveByUsername/",
      //   data{'data':username});
      // })

    }

    ////////////
    // USERS
    ////////////
    function getAllUsers(objLeave, callback){
      var deferred = $q.defer();

      // test data 1 -- test for the first data insert
      // *** need to have objectID , or it will create everytime ***
      // need tp see the indexeId first
      var users = [];
      // var users = [
        // {
        //   contactno:"011288299292",
        //   department:"IT Department",
        //   fullname:"Cindy",
        //   objectID:"a123456",
        //   position:" ",
        //   status:"Active",
        //   supervisor:" ",
        //   usergroup:"1",
        //   username:"cindy@snsoft.my",
        //   userpwd:"9999",
        //   lastModified:"1488326400"
        // },
        // {
        //   contactno:"013288299292",
        //   department:"IT Department",
        //   fullname:"Evonne",
        //   objectID:"x123456",
        //   position:" ",
        //   status:"Active",
        //   supervisor:" ",
        //   usergroup:"1",
        //   username:"evonne@snsoft.my",
        //   userpwd:"9999",
        //   lastModified:"1488326400"
        // }
      // ]

      // test data 2 -- test if the objectID is same
      // ***** need to copy indexID , or it will create new record *****
      // var users = [
      //   {
      //     contactno:"011288299292",
      //     department:"IT Department",
      //     fullname:"Cindy",
      //     objectID:"a123456",
      //     position:" ",
      //     status:"Active",
      //     supervisor:" ",
      //     usergroup:"1",
      //     username:"cindy@snsoft.my",
      //     userpwd:"9999",
      //     lastModified:"1488326400"
      //   },
      //   {
      //     contactno:"0118288191199",
      //     department:"IT Department",
      //     fullname:"cecilia",
      //     // objectID:"a123456",
      //     position:" ",
      //     status:"Active",
      //     supervisor:" ",
      //     usergroup:"1",
      //     username:"cecilia@snsoft.my",
      //     userpwd:"9999",
      //     lastModified:"1488326400"
      //   }
      // ]

      // test data 3 - test if the date is bigger than indexdb -> save to indexeddb
      // ***** need to copy indexID , or it will create new record *****
      // var users = [
      //   {
      //     contactno:"011288299292",
      //     department:"IT Department",
      //     fullname:"Cindy Crow",
      //     objectID:"a123456",
      //     position:" ",
      //     status:"Active",
      //     supervisor:" ",
      //     usergroup:"1",
      //     username:"cindy@snsoft.my",
      //     userpwd:"9999",
      //     lastModified:"1504224000"

      //   }
      // ]

      // test data 4 - test if the data is smaller than indexdb -> save to mongodb
      // ***** need to copy indexID , or it will create new record *****
      // var users = [
      //   {
      //     contactno:"011288299292",
      //     department:"IT Department",
      //     fullname:"Cindy",
      //     objectID:"a123456",
      //     position:" ",
      //     status:"Active",
      //     supervisor:" ",
      //     usergroup:"1",
      //     username:"cindy@snsoft.my",
      //     userpwd:"9999",
      //     lastModified:"1483228800",

      //   }
      // ]
      var users =  $http({method: "GET", url:"http://localhost:3003/users/"});


      deferred.resolve(users);
      return deferred.promise;
      // return $http({method:"GET", url:"/getAllUsers/"});
      // })
    }

    function getUser(){
      // return $http({method:"POST", url:"/getLeaveByUsername/",
      //   data{'data':username});
      // })
    }
    function getUsersByIndex(){
      // return $http({method:"POST", url:"/getUsersByIndex/",
      //   data{'data':username});
      // })
    }
    function addUser(objUser, callback){


      var deferred = $q.defer();

      if(objUser.length!=0){

          // $http({method:"POST", url:"http://localhost:3003/addUser/",
          var result = $http({method:"POST", url:"http://localhost:3003/user/",
            data:{'data':objUser}
          }).then(function(results){ 

           callback(results) 
          })
          console.log('addUser');

      }else{
          callback([])
      }

      return deferred.promise;

      // return $http({method:"POST", url:"/addUser/",
      //   data{'data':username});
      // })
    }
    function rmUser(){
      // return $http({method:"POST", url:"/rmUser/",
      //   data{'data':username});
      // })
    }
    function editUser(){
      console.log('Mongo editUser');
      // return $http({method:"POST", url:"/editUser/",
      //   data{'data':username});
      // })
    }

    function editUserObjectID(objectID){

      var deferred = $q.defer();

      var result = $http({method:"POST", url:"http://localhost:3003/editUserObjectID/",
        data:{'data':objectID}
      }).then(function(results){ 

       deferred.resolve(results)
      })

      console.log('editUser');
      return deferred.promise;

    }

    //////////////
    // PERMISSION
    //////////////

    function addPermission(){
      var deferred = $q.defer();
      var permission = [];
      if(permission.length>0){
        console.log('add permission record to mongodb');
      }
     
      deferred.resolve(permission);
      return deferred.promise;
      // return $http({method:"POST", url:"/addPermission/",
      //   data{'data':username});
      // })
    }

    function removePermission(){
      var deferred = $q.defer();
      var permission = [];
      
      deferred.resolve(permission);
      return deferred.promise;
      // return $http({method:"POST", url:"/removePermission/",
      //   data{'data':username});
      // })
    }

    function updatePermission(){
      var deferred = $q.defer();
      var permission = [];
      
      deferred.resolve(permission);
      return deferred.promise;
      // return $http({method:"POST", url:"/updatePermission/",
      //   data{'data':username});
      // })
    }

    function getAllPermission(){
      var deferred = $q.defer();
      var permission = [];

      // test data 1 -- test for the first data insert
      // *** need to have objectID , or it will create everytime ***
      // var permission=[
      //   {
      //     PermissionList:[1,2,3],
      //     code:"Operators 1",
      //     desc:"Operators 1",
      //     objectID:"a12345",
      //     lastModified:14883264307
      //   },
      //   {
      //     PermissionList:[1,5],
      //     code:"Shopkeeper",
      //     desc:"Shopkeeper",
      //     objectID:"b12345",
      //     lastModified:1488326400
      //   }
      // ]  

      // test data 2 -- test if the objectID is same
      // ***** need to copy indexID , or it will create new record *****
      // var permission=[
      //   {
      //     PermissionList:[1,2,5],
      //     code:"Operators 1",
      //     desc:"Operators 1",
      //     objectID:"a12345",
      //     lastModified:14883264307
      //   },
      //   {
      //     PermissionList:[1,5],
      //     code:"Cleaner",
      //     desc:"Cleaner",
      //     objectID:"d12345",
      //     lastModified:1488326400
      //   }
      // ]  

      // test data 3 - test if the date is bigger than indexdb -> save to indexeddb
      // ***** need to copy indexID , or it will create new record *****
      // var permission=[
      //   {
      //     PermissionList:[1,2,5],
      //     code:"Operators 423",
      //     desc:"Operators 423",
      //     indexID:"admin@snsoft.my-1489118096722",
      //     objectID:"a12345",
      //     lastModified:1504224012
      //   }
      // ]
      
      // test data 4 - test if the data is smaller than indexdb -> save to mongodb
      // ***** need to copy indexID , or it will create new record *****
      // var permission=[
      //   {
      //     PermissionList:[1,2,5],
      //     code:"Operators 1",
      //     desc:"Operators 1",
      //     objectID:"a12345",
      //     indexID:"admin@snsoft.my-1489113382465",
      //     lastModified:1483228800
      //   }
      // ]

      deferred.resolve(permission);
      return deferred.promise;
      // return $http({method:"GET", url:"/getAllPermission/"});
      // })
    }

  }

})()


