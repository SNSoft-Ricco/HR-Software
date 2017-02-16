(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .factory('localdb', localdb);

  /** @ngInject */
  function localdb($log, $window, $q) {
    var DB_NAME = "snsofthrdb";
    var DB_VERSION = 3;
    var db;

    var service = {
      openDb: openDb,
      getObjectStore: getObjectStore,
      getDbConn: getDbConn
    };

    return service;
    
    //// Public Functions
    function openDb() {
      var deferred = $q.defer();
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      var justUpgraded = false;

      req.onerror = function (evt) {
        $log.info("openDb:", evt.target.errorCode);
        deferred.reject();
      };

      req.onupgradeneeded = function (evt) {
        $log.info("openDb.onupgradeneeded");

        var usrObjStore = evt.currentTarget.result
        .createObjectStore("user", { keyPath : "username", autoIncrement : true });

        evt.currentTarget.result
        .createObjectStore("department", { keyPath : "department"});

        // Create Index
        usrObjStore.createIndex("userDepartment", "department", { unique: false });

        //Permission object store
        var store = evt.currentTarget.result
        .createObjectStore("permission", { keyPath: 'id', autoIncrement: true });
        store.createIndex('code', 'code', { unique: false });
        store.createIndex('desc', 'desc', { unique: false });
        store.createIndex('PermissionList', 'PermissionList', { unique: false });

        justUpgraded = true;
        // Create admin account for first time access
        deferred.resolve();
      };

      req.onsuccess = function () {
        $log.info("openDb");
        db = this.result;
        deferred.resolve(db);

        if (justUpgraded) {
          getObjectStore('department', 'readwrite')
          .add({department: "IT Department"});

          getObjectStore('department', 'readwrite')
          .add({department: "HR Department"});

          getObjectStore('department', 'readwrite')
          .add({department: "R&D Department"});
        }
      };
      return deferred.promise;
    }

    /**
     * @param {string} store_name
     * @param {string} mode either "readonly" or "readwrite"
     */
    function getObjectStore(store_name, mode) {
      var tx = db.transaction(store_name, mode);

      return tx.objectStore(store_name);
    }

    function getDbConn()
    {
      return db;
    }
  }
})();
