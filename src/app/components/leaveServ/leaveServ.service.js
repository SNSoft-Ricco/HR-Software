 (function() {
  'use strict';

  angular
      .module('snsoftHr')
      .service('leaveServ', leaveServ);

  /** @ngInject */
  function leaveServ($q, $log, localdb, mongoServ) {
    //// Function Declaration
    this.addLeave = addLeave;
    this.getLeaveByUsername = getLeaveByUsername;
    this.getPendingApprovalLeaveByUsername = getPendingApprovalLeaveByUsername;
    this.approveLeave = approveLeave;

    //// Local Variable Declaration
    var DB_STORENAME = 'leave';

    // Get Leaves By Username
    // Param    - Username
    // Resolve  - Users object
    function getLeaveByUsername(username) {
      var deferred = $q.defer();

      var singleKeyRange = IDBKeyRange.only(username);
      
      var request = 
        localdb.getObjectStore(DB_STORENAME, 'readonly')
        .index('user')
        .getAll(singleKeyRange);

      request.onerror = function() {
        $log.info("Open ObjectStore Error!");
      };    
      // Do something when all the data is added to the database.
      request.onsuccess = function(event) {
        var value = event.target.result;

        if (value) {
          // logic-> update data without objectid,
          // then fetch the latest data into it.
          
          // mongoServ.addLeaves(leaveData)
          // .success(function(data){
          // });
          mongoServ.syncLeaveByUsername([], value)
          .then(function(data){
              for(var d in data){
                //return data from mongodb
                //if dont exist in indexDB, then create it.
                addLeave(data[d]);
              }
            });
          deferred.resolve(value);
        } else {
          deferred.reject("Leave not exist!");
        }
      };

      return deferred.promise;  
    }

    // Add New Leave
    // Param    - New Leave JSON object
    // Resolve  - Success Message
    function addLeave(objLeave) {
      var deferred = $q.defer();

      // Set Leave as Pending
      objLeave.status = "Pending";
      objLeave.objectID = "";

      var request = 
        localdb.getObjectStore(DB_STORENAME, 'readwrite')
        .add(objLeave);

      request.onerror = function(event) {
        // Add leave trasaction - Error
        $log.debug("Transaction error: ", event);
        deferred.reject();
      }; 
      request.onsuccess = function() {
        deferred.resolve("Leave applied.")
        // Add leave to mongodb
        // mongoServ.addLeave(objLeave)
        // .success(function(data){
        //   objLeave.objectID = data.objectID;
        // });
      };

      return deferred.promise;
    }

    // get pending approval leave by username
    // Param    - username
    // Resolve  - leave objects array
    function getPendingApprovalLeaveByUsername(username) {
      var deferred = $q.defer();

      var singleKeyRange = IDBKeyRange.only(username);
      var request = 
        localdb.getObjectStore(DB_STORENAME, 'readonly')
        .index('approvalBy')
        .getAll(singleKeyRange);

      request.onerror = function() {
        $log.info("Open ObjectStore Error!");
      };    
      request.onsuccess = function(event) {
        var value = event.target.result;
        if (value) {
          // mongoServ.getPendingApprovalLeaveByUsername(username)
          deferred.resolve(value);
        } else {
          deferred.reject("Leave not exist!");
        }
      };

      return deferred.promise;  
    }

    // approve 
    // Param    - username
    // Resolve  - leave objects array
    function approveLeave(leaveId) {
      //var deferred = $q.defer();
      $log.info("leaveId", leaveId)
      // var singleKeyRange = IDBKeyRange.only(username);
      
      // var request = 
      //   localdb.getObjectStore(DB_STORENAME, 'readonly')
      //   .index('approvalBy')
      //   .getAll(singleKeyRange);

      // request.onerror = function() {
      //   $log.info("Open ObjectStore Error!");
      // };    
      // request.onsuccess = function(event) {
      //   var value = event.target.result;

      //   if (value) {
      //     deferred.resolve(value);
      //   } else {
      //     deferred.reject("Leave not exist!");
      //   }
      // };

      //return deferred.promise;  
    }
  }
})();