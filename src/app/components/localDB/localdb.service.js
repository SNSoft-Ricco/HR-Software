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

    openDb();

    var service = {
      addUser : addUser,
      getUser: getUser
    };

    return service;

    function addUser(username, password) {
      //var deferred = $q.defer();
      var DB_STORENAME = 'user';

      var newUser = {
        username: username,
        password: password
      }

      var request = 
        getObjectStore(DB_STORENAME, 'readwrite')
        .add(newUser);

      request.onerror = function(event) {
        // Add user trasaction - Error
        alert("Transaction error: " + event.target.errorCode);
      }; 

      // Do something when all the data is added to the database.
      request.onsuccess = function(event) {
        $log.info("Execute add");
      };
    }

    function getUser(username) {
      var deferred = $q.defer();
      var DB_STORENAME = 'user';

      var request = 
        getObjectStore(DB_STORENAME, 'readonly')
        .get(username);

      request.onerror = function(event) {
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

    function openDb() {
      $log.info("openDb ...");
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onsuccess = function (evt) {
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
        var store = 
          evt.currentTarget.result
          .createObjectStore("user", { keyPath : "username", autoIncrement : true });
      };
    }

    /**
     * @param {string} store_name
     * @param {string} mode either "readonly" or "readwrite"
     */
    function getObjectStore(store_name, mode) {
      $log.info("getObjectStore: " + db);
      var tx = db.transaction(store_name, mode);
      return tx.objectStore(store_name);
    }
  }
})();
