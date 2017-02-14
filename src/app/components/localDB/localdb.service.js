(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .factory('localdb', localdb);

  /** @ngInject */
  function localdb($log, $window, $q) {
    var DB_NAME = "snsofthrdb";
    var DB_VERSION = 2;
    var db;

    var service = {
      openDb: openDb,
      addUser : addUser,
      editUser: editUser,
      rmUser: rmUser,
      getUser: getUser,
      getAllUsers: getAllUsers
    };

    return service;

    function addUser(objUser) {
      var deferred = $q.defer();
      var DB_STORENAME = 'user';

      // Let new user have active status
      objUser.status = "active";

      var request = 
        getObjectStore(DB_STORENAME, 'readwrite')
        .add(objUser);

      request.onerror = function(event) {
        // Add user trasaction - Error
        alert("Transaction error: " + event.target.errorCode);
        deferred.reject();
      }; 

      // Do something when all the data is added to the database.
      request.onsuccess = function() {
        deferred.resolve("Successfully added user.")
      };

      return deferred.promise;
    }

    function getUser(username) {
      var deferred = $q.defer();
      var DB_STORENAME = 'user';

      var request = 
        getObjectStore(DB_STORENAME, 'readonly')
        .get(username);

      request.onerror = function() {
        $log.info("Open ObjectStore Error!");
      };    
      // Do something when all the data is added to the database.
      request.onsuccess = function(event) {
        var value = event.target.result;

        if (value) {
          $log.info("User found!");
          deferred.resolve(value);
        } else {
          $log.info("User not exist!");
          deferred.reject("User not exist!");
        }
      };

      return deferred.promise;  
    }

    // Remove user from localDB
    function rmUser(objUser) {
      var deferred = $q.defer();
      var DB_STORENAME = 'user';

      var request = 
        getObjectStore(DB_STORENAME, 'readwrite')
        .delete(objUser.username);

      request.onerror = function(event) {
        // Remove user trasaction - Error
        alert("Transaction error: " + event.target.errorCode);
        deferred.reject();
      }; 

      request.onsuccess = function() {
        deferred.resolve("Successfully removed user.")
      };

      return deferred.promise;
    }

    // Edit user
    function editUser(objUser) {
      var deferred = $q.defer();
      var DB_STORENAME = 'user';

      var request = 
        getObjectStore(DB_STORENAME, 'readwrite')
        .put(objUser);

      request.onerror = function(event) {
         deferred.reject("Edit User Failed!");
       };
       request.onsuccess = function(event) {
         deferred.resolve("Successfully edited user information.")
       };

       return deferred.promise;
    }

    function getAllUsers() {
      var deferred = $q.defer();
      var DB_STORENAME = 'user';
      var users = [];

      var request = 
        getObjectStore(DB_STORENAME, 'readonly')
        .openCursor();

      request.onerror = function() {
        $log.info("Open Cursor Error!");
        deferred.reject();
      };    
      // Do something when all the data is added to the database.
      request.onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
          users.push(cursor.value);
          cursor.continue();
        }
        else {
          deferred.resolve(users);
        }


      };

      return deferred.promise;
    }

    function openDb() {
      $log.info("openDb ...");
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onsuccess = function () {
        // Better use "this" than "req" to get the result to avoid problems with
        // garbage collection.
        // db = req.result;
        db = this.result;
        $log.info("openDb DONE");
      };
      req.onerror = function (evt) {
        $log.info("openDb:", evt.target.errorCode);
      };

      req.onupgradeneeded = function (evt) {
        $log.info("openDb.onupgradeneeded");

        evt.currentTarget.result
        .createObjectStore("user", { keyPath : "username", autoIncrement : true });

        // Create admin account for first time access
      };
    }

    /**
     * @param {string} store_name
     * @param {string} mode either "readonly" or "readwrite"
     */
    function getObjectStore(store_name, mode) {
      var tx = db.transaction(store_name, mode);
      return tx.objectStore(store_name);
    }
  }
})();
