(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .factory('localdb', localdb);

  /** @ngInject */
  function localdb($log, $window, $q) {
    var DB_NAME = "snsofthrdb";
    var DB_VERSION = 4;
    /**
     * IndexedDB Version Changelog
     * 4 (Ricco): added leave table
     *          : added department as leave table index
     */
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

        var dataBase = evt.target.result;
        var txn = evt.target.transaction;

        var leaveObjStore;

        var storeCreateIndex = function (objectStore, name, options) {
            if (!objectStore.indexNames.contains(name)) {
                objectStore.createIndex(name, name, options);
            }
        }

        switch(true) {
          case (evt.oldVersion < 3):
            $log.info("IndexedDB Version 3");
            var usrObjStore = dataBase.createObjectStore("user", { keyPath : "username", autoIncrement : true });

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

            // default departments
            txn.objectStore('department').add({department: "IT Department"});
            txn.objectStore('department').add({department: "HR Department"});
            txn.objectStore('department').add({department: "R&D Department"});
          case (evt.oldVersion < 4):      
            $log.info("IndexedDB Version 4");
            leaveObjStore = dataBase.createObjectStore("leave", { keyPath : "_id", autoIncrement : true });
            storeCreateIndex(leaveObjStore, "department", { unique: false });
        }

        deferred.resolve();
      };

      req.onsuccess = function () {
        db = this.result;
        deferred.resolve(db);
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
