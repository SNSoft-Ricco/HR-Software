 (function() {
  'use strict';

  angular
      .module('snsoftHr')
      .service('deptServ', deptServ);

  /** @ngInject */
  function deptServ($q, $log, localdb, mongoServ, syncData) {
    // Function Declaration
    this.getAllDepartments = getAllDepartments;
    this.addDept = addDept;
    this.rmDept = rmDept;
    this.editDept = editDept;
    this.getDept = getDept;

    var DB_STORENAME = 'department';

    function getAllDepartments(collections) {
      

      var deferred = $q.defer();
      var departments = [];
      var unSyncData = [];

      

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

          // compare the file between indexDB & mongoDB , then sync it
          syncData.compare(departments, mongoServ.addDept, mongoServ.getAllDepartments)
          .then(function(data){

              mongoServ.addDept(data);
              mongoServ.editDept(data['indexDBtimeNotMatch']);

              var indexDBNotExist = data.indexDBNotExist;
              var mongoDBtimeNotMatch = data.mongoDBtimeNotMatch;

              for(var idb in indexDBNotExist){
                // insert no exist record(from mongo) to indexDB
                addDept(indexDBNotExist[idb]);
              }

              for(var tnm in mongoDBtimeNotMatch){
                //update indexDB data, because the lastmodified date is different(compared to mongodb)
                editDept(mongoDBtimeNotMatch[tnm]);
              }
          })
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
      objDept.objectID = "";
      objDept.indexID = syncData.generateIndexID();

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
      request.onsuccess = function(event) {
        deferred.resolve("Successfully added department.");

        //create a department record in mongodb
        mongoServ.addDept(objDept,function(udata){
          //return the objectid created by mongodb
          objDept.objectID = "x12345";
          editDept(objDept);
        })
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
        // mongoServ.rmDept(objDept, function(){
        //   objDept.status = "False";
        //   editDept(objDept);
        // });
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
         //after change the indexDB department name , update to mongodb too.
         mongoServ.editDept(objDept,function(){});
       };

       return deferred.promise;
    }


    function syncAllDepartments(collections){
      var request = localdb.getObjectStore(DB_STORENAME,'readonly').getAll();
      request.onsuccess = function(event){
        // sync data with db 
        var result = event.target.result;
        var unSyncData = []
        for(var r in result){

          if(result[r].objectID != ""){
            // if objectID exist, then leave it.
            console.log('it exist , dont create');
          }else{
            // if dont have objectID , then create a new record
            unSyncData.push(result[r]);
            console.log('create a new record');
          }
        }
        mongoServ.syncDept(unSyncData);
      }
      request.onerror = function(event){
        console.log(event.target.result)
      }
    }



  }
})();


