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
    this.syncDept = syncDept;
    //leave
    this.syncLeaveByUsername = syncLeaveByUsername
    this.getLeaveByUsername = getLeaveByUsername;
    this.getPendingApprovalLeaveByUsername = getPendingApprovalLeaveByUsername;
    this.addLeave = addLeave;
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

    function addDept(objDept,callback){
      // return $http({method:"POST", url:"/addDept/",
      //   data:{'data':objDept}
      // })
      var result ={}
      callback(result);
    }

    function editDept(objDept,callback){
      // return $http({method:"POST", url:"/editDept/",
      //   data:{'data':objDept}
      // })
      callback();
    }
    function rmDept(objDept, callback){
      // return $http({method:"POST", url:"/editDept/",
      //   data:{'data':objDept}
      // })
      callback();
    }
    function syncDept(objDepts,collections, callback){
      var deferred = $q.defer();

      // $http({method:"POST", url:"/syncDept/",
      //   data:{'data':objDepts}
      // })
      // .success(function(){
          getAllDepartments().then(function(data){
            // data from mongodb
            for(var d in data){
              // data from indexDB
              for(var collection in collections){
                var evens = _.find(data, function(num){ return num.ObjectId == collections[collection].ObjectID });

                //if the lastModified dont match , update this record to mongo
                if(evens[0] && evens[0].lastModified != collections[collection].lastModified){
                  editDept(collections[collection]);
                }
              }
            }
          })
      // })

      deferred.resolve();
      return deferred.promise;
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

    function syncLeaveByUsername(objLeaves, collections, username){
        var deferred = $q.defer();





        getLeaveByUsername().then(function(data){
          
          var modifyCollection = {
            // need to create in both side -- ADD
            'indexDBNotExist':[],
            'mongoDBtimeNotMatch':[],
            // need to update in both side -- PUT
            'indexDBtimeNotMatch':[],

          }
          // data from mongodb
          for(var d in data){
            // data from indexDB
            var evens = _.find(collections, function(num){ return (num.objectID!=""&&num.ObjectId == data[d].ObjectID) });
            if(!evens||data[d].objectID==""){
              modifyCollection['indexDBNotExist'].push(data[d]);
            }
            for(var collection in collections){

              /** this is for time not matching [MONGODB] -> [INDEXDB] **/
              // if record objectID exist
              if(data[d].objectID && data[d].objectID !=""){
                // if objectID same
                if(data[d].objectID==collections[collection].objectID){
                  // but modified
                  if(data[d].lastModified > collections[collection].lastModified){
                    // if mongodb date bigger than indexdb , update this record to indexdb
                    modifyCollection['mongoDBtimeNotMatch'].push(data[d]);
                  }else if(data[d].lastModified<collections[collection].lastModified){
                    // if indexdb date bigger than mongodb , update this record to mongod
                    modifyCollection['indexDBtimeNotMatch'].push(collections[collection]);
                  }else{
                    // if same , dont update
                  }
                }
              }else{
                console.log('the objectID do exist');
              }
              /** this is for time not matching [INDEXDB] -> [MONGODB] **/
            }
          }

          addLeave(modifyCollection);
          editLeave(modifyCollection['indexDBtimeNotMatch']);
          deferred.resolve(modifyCollection);
        })
      
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


