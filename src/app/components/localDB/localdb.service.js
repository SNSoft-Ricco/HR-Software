(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .factory('localdb', localdb);

  /** @ngInject */
  function localdb($log,$window) {
    const dbName = "snsofthrdb";

    var service = {
      getLocal : getLocal,
      addUser : addUser
    };

    return service;

    function getLocal() {
      // In the following line, you should include the prefixes of implementations you want to test.
      //$window.indexedDB = $window.indexedDB || $window.mozIndexedDB || $window.webkitIndexedDB || $window.msIndexedDB;
      // DON'T use "var indexedDB = ..." if you're not in a function.
      // Moreover, you may need references to some $window.IDB* objects:
      //$window.IDBTransaction = $window.IDBTransaction || $window.webkitIDBTransaction || $window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
      //$window.IDBKeyRange = $window.IDBKeyRange || $window.webkitIDBKeyRange || $window.msIDBKeyRange;
      // (Mozilla has never prefixed these objects, so we don't need $window.mozIDB*)

      if (!$window.indexedDB) {
        $window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
      }

      // Open database
      const dbName = "snsofthrdb";

      var db;
      var request = indexedDB.open(dbName, 2);

      // Open database - Response
      request.onerror = function(event) {
        // Open database - Error
        alert("Database error: " + event.target.errorCode);
      };
      request.onupgradeneeded = function(event) {
        var db = event.target.result;

        // Create an objectStore to hold information about our customers. We're
        // going to use "ssn" as our key path because it's guaranteed to be
        // unique - or at least that's what I was told during the kickoff meeting.
        var objectStore = 
          db.createObjectStore("user", { keyPath : "username", autoIncrement : true });
      };
      request.onsuccess = function(event) {
        // Open database - Success
        $log.info("Success open database");
        db = event.target.result;
      };



    }

    function addUser(username, password) {
      var db;
      var request = indexedDB.open(dbName, 2);

      var newUser = {
        username: username,
        password: password
      }

      $log.info(newUser);

      // Open database - Response
      request.onerror = function(event) {
        // Open database - Error
        alert("Database error: " + event.target.errorCode);
      };
      request.onupgradeneeded = function(event) {
        var db = event.target.result;

        // Create an objectStore to hold information about our customers. We're
        // going to use "ssn" as our key path because it's guaranteed to be
        // unique - or at least that's what I was told during the kickoff meeting.
        var objectStore = 
          db.createObjectStore("user", { keyPath : "username", autoIncrement : true });
      };
      request.onsuccess = function(event) {
        // Open database - Success
        $log.info("Success open database");
        db = event.target.result;

        var transaction = db.transaction(["user"], "readwrite");
        var userObjStore = transaction.objectStore("user");
        var request = userObjStore.add(newUser);

        // Do something when all the data is added to the database.
        transaction.oncomplete = function(event) {
          $log.info("Execute add");
        };

        transaction.onerror = function(event) {
          // Add user trasaction - Error
          alert("Transaction error: " + event.target.errorCode);
        };        
      };


    }
  }
})();
