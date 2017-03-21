(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .factory('localdb', localdb);

  /** @ngInject */
  function localdb($log, $window, $q, mongoServ) {
    var DB_NAME = "snsofthrdb";
    var DB_VERSION = 10;
    var bOpenDB = false;
    /**
     * IndexedDB Version Changelog
     * 4 (Ricco): added leave table
     *          : added department as leave table index
     */
    var db;

    var service = {
      openDb: openDb,
      getObjectStore: getObjectStore
    };

    return service;

    //// Public Functions
    function openDb() {
      var deferred = $q.defer();

      if(bOpenDB) {
        $log.info("DB has been opened previously");
        deferred.resolve(true);
        return deferred.promise;
      }

      var req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onerror = function (evt) {
        $log.info("openDb:", evt.target.errorCode);
        deferred.reject();
      };

      req.onupgradeneeded = function (evt) {
        $log.info("openDb.onupgradeneeded");

        var dataBase = evt.target.result;
        var txn = evt.target.transaction;

        var usrObjStore, deptObjStore, leaveObjStore, systemObjStore, lastSyncStore;

        var storeCreateIndex = function (objectStore, name, options) {
          if (!objectStore.indexNames.contains(name)) {
            objectStore.createIndex(name, name, options);
          }
        };

        switch(true) {
          case (evt.oldVersion < 4):
            $log.info("IndexedDB Version 3");

            usrObjStore = dataBase.createObjectStore("user", { keyPath : "username" });
            usrObjStore.createIndex('userGroup', 'userGroup', { unique: false });

            lastSyncStore = dataBase.createObjectStore("lastSync", {keyPath : "sync"});
            lastSyncStore.put({'sync':'syncDB','lastSync':null});
            deptObjStore = dataBase.createObjectStore("department", { keyPath : "indexID"});
            leaveObjStore = dataBase.createObjectStore("leave", { keyPath : "indexID" });

            // Create Index
            usrObjStore.createIndex("userDepartment", "department", { unique: false });

            storeCreateIndex(leaveObjStore, "department", { unique: false });
            storeCreateIndex(deptObjStore, "name", { unique: true });

            //Permission object store
            var store = evt.currentTarget.result
              .createObjectStore("permission", { keyPath:"indexID"});
            store.createIndex('code', 'code', { unique: false });
            store.createIndex('desc', 'desc', { unique: false });
            store.createIndex('PermissionList', 'PermissionList', { unique: false });

            // default departments
            var timestamp = new Date().getTime();

            txn.objectStore('department')
              .add({indexID:'admin@snsoft.my-1931993199319231',  name: "IT Department", lastModified:timestamp,
                position:[{ positionId: 1, positionName: 'Department Head'}]});
            txn.objectStore('department')
              .add({indexID:'admin@snsoft.my-1931993199319232',  name: "HR Department", lastModified:timestamp,
                position:[{ positionId: 1, positionName: 'Department Head'}]});
            txn.objectStore('department')
              .add({indexID:'admin@snsoft.my-1931993199319233',  name: "R&D Department", lastModified:timestamp,
                position:[{ positionId: 1, positionName: 'Department Head'}]});

            // default admin user
            txn.objectStore('user')
              .add({username: "admin@snsoft.my",password: "123",userGroup: "admin@snsoft.my-1931993199319233",supervisor: "",status: 1,
                position: "",name: "admin",department: "",contactNo: "123", _id:" "});

            // default permission group
            var list = [1, 2, 3, 4, 5];
            txn.objectStore('permission').add({
              code: "P001", desc: "System Administrator permission",
              PermissionList: list, indexID: 'admin@snsoft.my-1931993199319233'
            });

          case (evt.oldVersion < 7):
            $log.info("IndexedDB Version 7");
            leaveObjStore = txn.objectStore('leave');
            storeCreateIndex(leaveObjStore, "user", { unique: true, multiEntry: true});
          case (evt.oldVersion < 8):
            $log.info("IndexedDB Version 8");
            leaveObjStore = txn.objectStore('leave');
            leaveObjStore.deleteIndex('user');
            storeCreateIndex(leaveObjStore, "user", { unique: true, multiEntry: true});
          case (evt.oldVersion < 9):
            $log.info("IndexedDB Version 9");
            leaveObjStore = txn.objectStore('leave');
            leaveObjStore.deleteIndex('user');
            storeCreateIndex(leaveObjStore, "user", { unique: false, multiEntry: true});
          case (evt.oldVersion < 10):
            $log.info("IndexedDB Version 10");
            leaveObjStore = txn.objectStore('leave');
            storeCreateIndex(leaveObjStore, "approveBy", { unique: false, multiEntry: true});
        }

        deferred.resolve();
      };

      req.onsuccess = function () {
        db = this.result;

        db.onerror = function(event) {
          deferred.reject("Database error: " + event.target.errorCode);
        };

        bOpenDB = true;
        //deferred.resolve(db);
        deferred.resolve(true);
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
  }
})();
