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

    //////////
    ///   Departments
    /////////
  	function getAllDepartments(lastSync){
      var deferred = $q.defer();
      var result =[ 
          {
            "_id" : 'ObjectId("58be48f79dc3a9cf9e086a1b")',
            "name" : "Operation Department",
            "status" : "True",
            "lastModified" : "2017-03-06T16:00:00.000Z"
          },
          {
            "_id" : 'ObjectId("58be48f79dc3a9cf9e086c1b")',
            "name" : "Logistic Department",
            "status" : "True",
            "lastModified" : "2017-03-06T19:00:00.000Z"
          }]
      // return result

      deferred.resolve(result);

      return deferred.promise;

      // if(!lastSync){
      //   // if sent 0 , which means return all result
      //   return $http({method: "GET", url:"/departments/0/"});
      // }else{
      //   // if sent a number, only return the data after the last sync time
      //   return $http({method: "GET", url:"/departments/"+lastSync+"/"})
      // }
  	}

    function addDept(objDept){
      // return $http({method:"POST", url:"/addDept/",
      //   data:{'data':objDept}
      // })

    }

    function editDept(objDept,callback){
      // return $http({method:"POST", url:"/editDept/",
      //   data:{'data':objDept}
      // })
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
      console.log('add 1 leave');
      console.log(objLeave);

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

      // test data 1 -- test for the first data insert
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

      var leaves = [];

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
      var users = [
        {
          contactno:"011288299292",
          department:"IT Department",
          fullname:"Cindy",
          objectID:"a123456",
          position:" ",
          status:"Active",
          supervisor:" ",
          usergroup:"1",
          username:"cindy@snsoft.my",
          userpwd:"9999",
          lastModified:"1488326400"
        },
        {
          contactno:"013288299292",
          department:"IT Department",
          fullname:"Evonne",
          objectID:"x123456",
          position:" ",
          status:"Active",
          supervisor:" ",
          usergroup:"1",
          username:"evonne@snsoft.my",
          userpwd:"9999",
          lastModified:"1488326400"
        }

        // need tp see the indexeId first
      ]
      // test data 2 -- test if the objectID is same
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
      //   }
      // ]
      // test data 3 - test if the date is bigger than indexdb -> save to indexeddb

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
      //     lastModified:"1504224000"

      //   }
      // ]
      // test data 4 - test if the data is smaller than indexdb -> save to mongodb
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
    function addUser(){
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
      // return $http({method:"POST", url:"/editUser/",
      //   data{'data':username});
      // })
    }

  }

})()


