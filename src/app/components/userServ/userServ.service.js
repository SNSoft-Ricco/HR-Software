(function () {
  'use strict';

  angular
    .module('snsoftHr')
    .service('userServ', userServ);

  /** @ngInject */
  function userServ($q, $log, localdb, mongoServ, syncData) {
    //// Function Declaration
    this.getAllUsers = getAllUsers;
    this.addUser = addUser;
    this.rmUser = rmUser;
    this.editUser = editUser;
    this.getUser = getUser;
    this.getUsersByIndex = getUsersByIndex;

    //// Local Variable Declaration
    var DB_STORENAME = 'user';

    // Get All Users
    // Param    - None
    // Resolve  - Users object
    function getAllUsers(sync) {
      var deferred = $q.defer();
      var users = [];
      var userData = [];

      var request =
        localdb.getObjectStore(DB_STORENAME, 'readonly')
          .openCursor();

      request.onerror = function () {
        $log.info("Open Cursor Error!");
        deferred.reject();
      };
      request.onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
          users.push(cursor.value);
          cursor.continue();
        }
        else {
          if(sync){
              // compare the file between indexDB & mongoDB , then sync it
              syncData.compare(users, mongoServ.addUser, mongoServ.getAllUsers)
              .then(function(data){

                // mongoServ.addUser(data['mongoDBNotExist']);
                mongoServ.addUser(data['mongoDBNotExist'])
                .then(function(udata){
                    // assign objectID to departments
                    if(udata.length==0){ return }
                        udata.data.forEach(function(userRecord){
                          var _id = userRecord._id;
                          getUser(userRecord.username)
                            .then(function(indexData){
                              indexData._id = _id;
                              editUser(indexData);
                            });
                        });
                      
                    // })
                });


                  mongoServ.editUser(data['indexDBtimeNotMatch'], function(){


                  });

                  var indexDBNotExist = data.indexDBNotExist;
                  var mongoDBtimeNotMatch = data.mongoDBtimeNotMatch;

                  for(var idb in indexDBNotExist){

                    // insert no exist record(from mongo) to indexDB
                    if(indexDBNotExist[idb].username!="admin@snsoft.my"){
                      addUser(indexDBNotExist[idb]);
                    }
                  }

                  for(var tnm in mongoDBtimeNotMatch){
                    //update indexDB data, because the lastmodified date is different(compared to mongodb)
                    editUser(mongoDBtimeNotMatch[tnm]);
                  }
              })
          }

          deferred.resolve(users);
        }
      };

      return deferred.promise;
    }

    // Get Users By Username
    // Param    - Username
    // Resolve  - Users object
    function getUser(username) {
      var deferred = $q.defer();
      console.log(username);
      var request =
        localdb.getObjectStore(DB_STORENAME, 'readonly')
          .get(username);

      request.onerror = function () {
        $log.info("Open ObjectStore Error!");
      };
      // Do something when all the data is added to the database.
      request.onsuccess = function (event) {
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

    // Get Users By Index
    // Param    - Index Name
    // Resolve  - Users object
    function getUsersByIndex(index, key) {
      var deferred = $q.defer();
      var users = [];

      var singleKeyRange = IDBKeyRange.only(key);

      var request =
        localdb.getObjectStore(DB_STORENAME, 'readonly')
          .index(index)
          .openCursor(singleKeyRange);

      request.onerror = function () {
        $log.info("Open ObjectStore Error!");
      };
      // Do something when all the data is added to the database.
      request.onsuccess = function (event) {
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


    // Add New User
    // Param    - New User JSON object
    // Resolve  - Success Message
    function addUser(objUser) {
      var deferred = $q.defer();

      // Let new user have active status
      objUser.status = 1;
      objUser.indexID = syncData.generateIndexID();
      if(!objUser.lastModified){
        objUser.lastModified = new Date().getTime();
      }
      var request = 
        localdb.getObjectStore(DB_STORENAME, 'readwrite')
          .add(objUser);

      request.onerror = function (event) {
        // Add user trasaction - Error
        // alert("Transaction error: " + event.target.errorCode);
        console.log(event.target.error.message);
        deferred.reject();

      }; 
      request.onsuccess = function() {
        deferred.resolve("Successfully added user.")
      };

      return deferred.promise;
    }

    // Remove user from localDB
    // Param    - User To Remove JSON object
    // Resolve  - Success Message
    function rmUser(objUser) {
      var deferred = $q.defer();
      objUser.status = 0;
      var request =
        localdb.getObjectStore(DB_STORENAME, 'readwrite')
          .put(objUser);

      request.onerror = function (event) {
        // Remove user trasaction - Error
        alert("Transaction error: " + event.target.errorCode);
        deferred.reject();
      };

      request.onsuccess = function() {
        mongoServ.editUser(objUser).then(function(data){
          console.log(data)
          editUser(data);
        })
        deferred.resolve("Successfully removed user.");

      };

      return deferred.promise;
    }

    // Edit user
    // Param    - User To Edit JSON object
    // Resolve  - Success Message
    function editUser(objUser) {
      var deferred = $q.defer();

      var request =
        localdb.getObjectStore(DB_STORENAME, 'readwrite')
          .put(objUser);

      request.onerror = function() {
         deferred.reject("Edit User Failed!");
       };
       request.onsuccess = function() {
        // mongoServ.editUser(objUser).success(function(data){
        // console.log(data);
        // })
         deferred.resolve("Successfully edited user information.")
       };


      return deferred.promise;
    }

  }
})();
