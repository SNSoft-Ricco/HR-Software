 (function() {
  'use strict';

  angular
      .module('snsoftHr')
      .service('deptServ', deptServ);

  /** @ngInject */
  function deptServ($q, $log, localdb) {
    // Function Declaration
    this.getAllDepartments = getAllDepartments;
    this.addDept = addDept;
    this.rmDept = rmDept;
    this.editDept = editDept;
    this.getDept = getDept;

    var DB_STORENAME = 'department';

    function getAllDepartments() {
      var deferred = $q.defer();
      
      var departments = [];

      var request = 
        localdb.getObjectStore(DB_STORENAME, 'readonly')
        .openCursor();

      request.onerror = function() {
        $log.info("Open Cursor Error!");
        deferred.reject();
      };    
      // Do something when all the data is added to the database.
      request.onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
          departments.push(cursor.value);
          cursor.continue();
        }
        else {
          deferred.resolve(departments);
        }
      };

      return deferred.promise;
    }

    // Get Department By Name
    // Param    - deptName
    // Resolve  - Department object
    function getDept(deptName) {
      var deferred = $q.defer();

      var request = 
        localdb.getObjectStore(DB_STORENAME, 'readonly')
        .get(deptName);

      request.onerror = function() {
        $log.info("Open ObjectStore Error!");
      };    
      // Do something when all the data is added to the database.
      request.onsuccess = function(event) {
        var value = event.target.result;

        if (value) {
          deferred.resolve(value);
        } else {
          deferred.reject("Department not exist!");
        }
      };

      return deferred.promise;  
    }

    // Add New Department
    // Param - New Department JSON object
    // Promise Resolve - Success Message
    function addDept (objDept) {
      var deferred = $q.defer();

      // Let new department be active
      objDept.status = "Active";

      var request = 
        localdb.getObjectStore(DB_STORENAME, 'readwrite')
        .add(objDept);

      request.onerror = function(event) {
        // Add department trasaction - Error
        if (event.isTrusted)
          alert("Department has already exist.");
        else
          alert("Transaction error: " + event.target.errorCode);

        deferred.reject();
      }; 

      // Do something when all the data is added to the database.
      request.onsuccess = function() {
        deferred.resolve("Successfully added department.")
      };

      return deferred.promise;
    }

    // Remove Department
    // Param - Department To Remove JSON object
    // Promise Resolve - Success Message
    function rmDept (objDept) {
      var deferred = $q.defer();

      var request = 
        localdb.getObjectStore(DB_STORENAME, 'readwrite')
        .delete(objDept.department);

      request.onerror = function(event) {
        // Remove department trasaction - Error
        alert("Transaction error: " + event.target.errorCode);
        deferred.reject();
      }; 

      // Remove department - Success
      request.onsuccess = function() {
        deferred.resolve("Successfully removed department.")
      };

      return deferred.promise;
    }

    // Edit Department
    // Param - Department To Edit JSON object
    // Promise Resolve - Success Message
    function editDept(objDept) {
      var deferred = $q.defer();

      var request = 
        localdb.getObjectStore(DB_STORENAME, 'readwrite')
        .put(objDept);

      request.onerror = function() {
         deferred.reject("Edit Department Failed!");
       };
       request.onsuccess = function() {
         deferred.resolve("Successfully edited department information.")
       };

       return deferred.promise;
    }
  }
})();