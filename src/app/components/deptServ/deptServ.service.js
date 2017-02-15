 (function() {
  'use strict';

  angular
      .module('snsoftHr')
      .service('deptServ', deptServ);

  /** @ngInject */
  function deptServ($q, $log, localdb) {
    this.getAllDepartments = getAllDepartments;

    function getAllDepartments() {
      var deferred = $q.defer();
      var DB_STORENAME = 'department';
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
  }
})();