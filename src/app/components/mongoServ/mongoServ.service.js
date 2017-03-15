(function() {
'use strict';
  const SITE_URL = "http://localhost:3003"

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

      var result =  $http({method: "GET", url:SITE_URL+"/department/"});



      deferred.resolve(result);

      return deferred.promise;


  	}

    function addDept(objDepts,callback){
      var deferred = $q.defer();

          var result = $http({method:"POST", url:SITE_URL+"/department/",
            data:objDepts
          }).then(function(results){ 

           callback(results) 
          })

      return deferred.promise;
    }

    function editDept(objDept){
      var deferred = $q.defer();

      var id = objDept._id
      objDept.lastModified = new Date();
      if(!id){
        deferred.reject();
      }else{
        var result =  $http({method:"PATCH", url:SITE_URL+"/department/"+id+"/",
          data:objDept
        }).then(function(results){ 

          deferred.resolve(results)
        })
      }
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

      var result = $http({method:"POST", url:SITE_URL+"/leave/",
        data:objLeave
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


    function getLeaveByUsername(username){
      var deferred = $q.defer();
      // var leaves = [];

      // test data 1 -- test for the first data insert
      // *** need to have objectID , or it will create everytime ***
      // var leaves =[
      //   {
      //     user:"mark@snsoft.my",
      //     type:"Medical Leave",
      //     from:"2017-03-01T16:00:00.000Z",
      //     to:"2017-03-06T16:00:00.000Z",
      //     description:"Apply for Sick Leave",
      //     leaveStatus:"Pending",
      //     approveBy:"logan@snsoft.my",
      //     createdTime:"2017-03-07T16:00:00.000Z",
      //     lastModified:"1488326400",
      //     objectID:"x12345",
      //     status:1
      //   },
      //   {
      //     user:"mark@snsoft.my",
      //     type:"Medical Leave",
      //     from:"2017-03-04T16:00:00.000Z",
      //     to:"2017-03-06T16:00:00.000Z",
      //     description:"Apply for Medical Leave",
      //     leaveStatus:"Pending",
      //     approveBy:"logan@snsoft.my",
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
      //     type:"Medical Leave",
      //     from:"2017-03-04T16:00:00.000Z",
      //     to:"2017-03-06T16:00:00.000Z",
      //     description:"Apply for Medical Leave",
      //     leaveStatus:"Pending",
      //     approveBy:"logan@snsoft.my",
      //     createdTime:"2017-03-07T18:00:00.000Z",
      //     lastModified:"1488326400",
      //     objectID:"a123456",
      //     status:1
      //   },
      //   {
      //     user:"mark@snsoft.my",
      //     type:"Medical Leave",
      //     from:"2017-06-01T16:00:00.000Z",
      //     to:"2017-06-02T16:00:00.000Z",
      //     description:"Apply for emo Leave",
      //     leaveStatus:"Pending",
      //     objectID:"",
      //     approveBy:"kenny@snsoft.my",
      //     createdTime:"2017-06-07T18:00:00.000Z",
      //     lastModified:"1488326400",
      //     status:1
      //   }]



      // test data 3 - test if the date is bigger than indexdb -> save to indexeddb
      // ***** need to copy indexID , or it will create new record *****
      // var leaves = [
      //   {
      //     user:"mark@snsoft.my",
      //     type:"Medical Leave",
      //     from:"2017-09-04T16:00:00.000Z",
      //     to:"2017-09-06T16:00:00.000Z",
      //     description:"Apply for Medical Leave",
      //     leaveStatus:"Success",
      //     approveBy:"logan@snsoft.my",
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
      //     type:"Medical Leave",
      //     from:"2017-01-04T16:00:00.000Z",
      //     to:"2017-01-06T16:00:00.000Z",
      //     description:"Apply for Medical Leave",
      //     leaveStatus:"Success",
      //     approveBy:"logan@snsoft.my",
      //     createdTime:"2017-01-07T18:00:00.000Z",
      //     lastModified:"1483228800",
      //     indexID:"mark@snsoft.my-1488957854149",
      //     objectID:"a123456",
      //     status:1
      //   }]
      // return $http({method:"POST", url:"/getLeaveByUsername/",
      //   data{'data':username});
      // })
      var leaves =  $http({method: "GET", url:SITE_URL+"/leave/"});

      deferred.resolve(leaves);
      return deferred.promise;

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
        //   contactNo:"011288299292",
        //   department:"IT Department",
        //   name:"Cindy",
        //   objectID:"a123456",
        //   position:" ",
        //   status:"Active",
        //   supervisor:" ",
        //   userGroup:"1",
        //   username:"cindy@snsoft.my",
        //   password:"9999",
        //   lastModified:"1488326400"
        // },
        // {
        //   contactNo:"013288299292",
        //   department:"IT Department",
        //   name:"Evonne",
        //   objectID:"x123456",
        //   position:" ",
        //   status:"Active",
        //   supervisor:" ",
        //   userGroup:"1",
        //   username:"evonne@snsoft.my",
        //   password:"9999",
        //   lastModified:"1488326400"
        // }
      // ]

      // test data 2 -- test if the objectID is same
      // ***** need to copy indexID , or it will create new record *****
      // var users = [
      //   {
      //     contactNo:"011288299292",
      //     department:"IT Department",
      //     name:"Cindy",
      //     objectID:"a123456",
      //     position:" ",
      //     status:"Active",
      //     supervisor:" ",
      //     userGroup:"1",
      //     username:"cindy@snsoft.my",
      //     password:"9999",
      //     lastModified:"1488326400"
      //   },
      //   {
      //     contactNo:"0118288191199",
      //     department:"IT Department",
      //     name:"cecilia",
      //     // objectID:"a123456",
      //     position:" ",
      //     status:"Active",
      //     supervisor:" ",
      //     userGroup:"1",
      //     username:"cecilia@snsoft.my",
      //     password:"9999",
      //     lastModified:"1488326400"
      //   }
      // ]

      // test data 3 - test if the date is bigger than indexdb -> save to indexeddb
      // ***** need to copy indexID , or it will create new record *****
      // var users = [
      //   {
      //     contactNo:"011288299292",
      //     department:"IT Department",
      //     name:"Cindy Crow",
      //     objectID:"a123456",
      //     position:" ",
      //     status:"Active",
      //     supervisor:" ",
      //     userGroup:"1",
      //     username:"cindy@snsoft.my",
      //     password:"9999",
      //     lastModified:"1504224000"

      //   }
      // ]

      // test data 4 - test if the data is smaller than indexdb -> save to mongodb
      // ***** need to copy indexID , or it will create new record *****
      // var users = [
      //   {
      //     contactNo:"011288299292",
      //     department:"IT Department",
      //     name:"Cindy",
      //     objectID:"a123456",
      //     position:" ",
      //     status:"Active",
      //     supervisor:" ",
      //     userGroup:"1",
      //     username:"cindy@snsoft.my",
      //     password:"9999",
      //     lastModified:"1483228800",

      //   }
      // ]
      var users =  $http({method: "GET", url:SITE_URL+"/user/"});


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
    function addUser(objUser){


      var deferred = $q.defer();

      if(objUser.length!=0){

          // $http({method:"POST", url:SITE_URL+"/addUser/",
          var result = $http({method:"POST", url:SITE_URL+"/user/",
            data:objUser
          }).then(function(results){ 
           console.log('addUser');
           deferred.resolve(results);
          }, function(err){
            var errors =  err.config.data;
            for(var error in errors){
              console.log(errors[error].username +' ' +err.data.message);
            }
            deferred.resolve(err);
          })

      }else{
           deferred.resolve(results);
      }

      return deferred.promise;

      // return $http({method:"POST", url:"/addUser/",
      //   data{'data':username});
      // })
    }
    function rmUser(objUser){

      var deferred = $q.defer();

      var result = $http({method:"POST", url:SITE_URL+"/editUser/",
        data:objUser
      }).then(function(results){ 

       deferred.resolve(results)
      })

      console.log('rmUser');
      return deferred.promise;


      // return $http({method:"POST", url:"/rmUser/",
      //   data{'data':username});
      // })
    }
    function editUser(objUser, callback){

      var deferred = $q.defer();

      var id = objUser._id

      if(!id){
        deferred.reject();
      }else{

        // if(!Array.isArray(objUser)){
        //   objUser = [objUser];
        // }
        var result =  $http({method:"PATCH", url:SITE_URL+"/user/"+id+"/",
          data:objUser
        }).then(function(results){ 

          deferred.resolve(results);
        })
      }
      return deferred.promise;




      // console.log('Mongo editUser');
      // var deferred = $q.defer();

      // var result = $http({method:"POST", url:SITE_URL+"/editUserObjectID/",
      //   data:{'data':objectID}
      // }).then(function(results){ 

      //  deferred.resolve(results)
      // })

      // console.log('editUser');
      // return deferred.promise;

      // return $http({method:"POST", url:"/editUser/",
      //   data{'data':username});
      // })
    }


    //////////////
    // PERMISSION
    //////////////

    function addPermission(permission){
      var deferred = $q.defer();
      // var permission = [];
      if(permission.length>0){
        console.log('add permission record to mongodb');
      
    
       var result =  $http({method:"POST", url:SITE_URL+"/permission/",
        data:permission})
       .then(function(pm){
          deferred.resolve(pm);
       });
      }else{
          deferred.resolve([]);
      }
      return deferred.promise;
    }

    function removePermission(){

      var deferred = $q.defer();
      var id = objPm._id
      if(!id){
        deferred.reject();
      }else{

        var result =  $http({method:"PATCH", url:SITE_URL+"/permission/"+id+"/",
          data:objPm
        }).then(function(permission){ 

          deferred.resolve(permission);
        })
      }
      return deferred.promise;
    }

    function updatePermission(objPm){

      var deferred = $q.defer();
      var id = objPm._id

      if(!id){
        deferred.reject();
      }else{

        var result =  $http({method:"PATCH", url:SITE_URL+"/permission/"+id+"/",
          data:objPm
        }).then(function(permission){ 

          deferred.resolve(permission);
        })
      }
      return deferred.promise;

    }

    function getAllPermission(){
      var deferred = $q.defer();
      var permission = [];

      // test data 1 -- test for the first data insert
      // *** need to have objectID , or it will create everytime ***
      // var permission=[
      //   {
      //     permissionList:[1,2,3],
      //     code:"Operators 1",
      //     description:"Operators 1",
      //     objectID:"a12345",
      //     lastModified:14883264307
      //   },
      //   {
      //     permissionList:[1,5],
      //     code:"Shopkeeper",
      //     description:"Shopkeeper",
      //     objectID:"b12345",
      //     lastModified:1488326400
      //   }
      // ]  

      // test data 2 -- test if the objectID is same
      // ***** need to copy indexID , or it will create new record *****
      // var permission=[
      //   {
      //     permissionList:[1,2,5],
      //     code:"Operators 1",
      //     description:"Operators 1",
      //     objectID:"a12345",
      //     lastModified:14883264307
      //   },
      //   {
      //     permissionList:[1,5],
      //     code:"Cleaner",
      //     description:"Cleaner",
      //     objectID:"d12345",
      //     lastModified:1488326400
      //   }
      // ]  

      // test data 3 - test if the date is bigger than indexdb -> save to indexeddb
      // ***** need to copy indexID , or it will create new record *****
      // var permission=[
      //   {
      //     permissionList:[1,2,5],
      //     code:"Operators 423",
      //     description:"Operators 423",
      //     indexID:"admin@snsoft.my-1489118096722",
      //     objectID:"a12345",
      //     lastModified:1504224012
      //   }
      // ]
      
      // test data 4 - test if the data is smaller than indexdb -> save to mongodb
      // ***** need to copy indexID , or it will create new record *****
      // var permission=[
      //   {
      //     permissionList:[1,2,5],
      //     code:"Operators 1",
      //     description:"Operators 1",
      //     objectID:"a12345",
      //     indexID:"admin@snsoft.my-1489113382465",
      //     lastModified:1483228800
      //   }
      // ]

      var permission =  $http({method: "GET", url:SITE_URL+"/permission/"});


      deferred.resolve(permission);
      return deferred.promise;
      // return $http({method:"GET", url:"/getAllPermission/"});
      // })
    }

  }

})()


