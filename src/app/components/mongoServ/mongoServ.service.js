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
            console.log(evens);
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

    }

    function syncLeaveByUsername(objLeaves, collections, username){
        var deferred = $q.defer();
        getLeaveByUsername().then(function(data){
         
          var modifyCollection = {
            // need to update in both side -- PUT
            'timeNotMatching':[],
            // need to create in both side -- ADD
            'indexDBNotExist':[]
          }
          // data from mongodb
          for(var d in data){
            // data from indexDB
            for(var collection in collections){
              
              
              // var evens = _.find(data, function(num){ return num.ObjectId == collections[collection].ObjectID });
              // //if the lastModified dont match , update this record to mongo
              // if(evens[0] && evens[0].lastModified != collections[collection].lastModified){
              //   addLeave(collections[collection]);
              // }
            }
          }
          deferred.resolve(data);
        })
      
      return deferred.promise;
    }




    function getLeaveByUsername(username){
      var deferred = $q.defer();
      var leaves =[
        {
          user:"mark@snsoft.my",
          leaveType:"Medical Leave",
          fromDate:"2017-03-01T16:00:00.000Z",
          toDate:"2017-03-06T16:00:00.000Z",
          description:"Apply for Sick Leave",
          leaveStatus:"Pending",
          approvalBy:"logan@snsoft.my",
          createdTime:"2017-03-07T16:00:00.000Z",
          lastModified:"2017-03-07T16:00:00.000Z",
          status:1
        },
        {
          user:"mark@snsoft.my",
          leaveType:"Medical Leave",
          fromDate:"2017-03-04T16:00:00.000Z",
          toDate:"2017-03-06T16:00:00.000Z",
          description:"Apply for Medical Leave",
          leaveStatus:"Pending",
          approvalBy:"logan@snsoft.my",
          createdTime:"2017-03-07T16:00:00.000Z",
          lastModified:"2017-03-07T16:00:00.000Z",
          status:1
        },
        {
          user:"mark@snsoft.my",
          leaveType:"Medical Leave",
          fromDate:"2017-03-05T16:00:00.000Z",
          toDate:"2017-03-06T16:00:00.000Z",
          description:"Apply for emo Leave",
          leaveStatus:"Pending",
          approvalBy:"logan@snsoft.my",
          createdTime:"2017-03-07T16:00:00.000Z",
          lastModified:"2017-03-07T16:00:00.000Z",
          status:1
        }]

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


