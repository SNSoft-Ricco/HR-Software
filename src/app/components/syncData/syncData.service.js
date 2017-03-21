(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .service('syncData', syncData);

  /** @ngInject */
  function syncData($q, $log, $http, $cookies, localdb) {

    this.sync = sync;
    this.compare = compare;
    this.generateIndexID = generateIndexID;
    this.mergeData = mergeData;
    this.mergeLeaveData = mergeLeaveData;

    function sync(){
      var deferred = $q.defer();
      // check lastSync in localdb , if null ,then fetch all the database
      // if not null , fetch time only after lastSyncTime
      localdb.openDb().then(function() {
        var syncTime = localdb.getObjectStore('lastSync', 'readonly').get('syncDB');
        $log.info('Sync Data Start....!');

        syncTime.onsuccess = function(event){
          var result = event.target.result;
          var dateNow = result.lastSync;
          $log.info('sync done');

          // will uncomment when the api is ready.
          if(dateNow==null||dateNow==""){
            deferred.resolve(true);

          }else{
            deferred.resolve(false);
          }

        };
        syncTime.onerror = function(){
          $log.info("Sync data Error!")
        };
      });

      return deferred.promise;
    }



    function compare(collections, saveFn ,getFn){
      var deferred = $q.defer();

      getFn().then(function(data){
        $log.info(data);
        var data = data.data;
        var modifyCollection = {
          'mongoDBNotExist':[],
          // need to create in both side -- ADD
          'indexDBNotExist':[],
          // update this record to indexdb
          'mongoDBtimeNotMatch':[],
          // update this record to mongod
          'indexDBtimeNotMatch':[],

        }
        // data from mongodb
        for(var d in data){
          // data from indexDB
          var evens = _.find(collections, function(num){
            return (num._id&&num._id!=""&&num._id == data[d]._id)
          });
          if(!evens||data[d]._id==""||!data[d]._id){
            modifyCollection['indexDBNotExist'].push(data[d]);
          }
          for(var collection in collections){
            var indexDB = collections[collection];
            /** this is for time not matching [MONGODB] & [INDEXDB] **/
            // if record _id exist
            if(data[d]._id && data[d]._id !=""){
              // if _id same
              if(data[d]._id==indexDB._id){
                // but modified
                var mongoLastModified = new Date(data[d].lastModified).getTime();
                var idbLastModified = new Date(collections[collection].lastModified).getTime();

                if(mongoLastModified > idbLastModified){
                  // if mongodb date bigger than indexdb , update this record to indexdb
                  modifyCollection['mongoDBtimeNotMatch'].push(data[d]);
                }else if(mongoLastModified < idbLastModified){
                  // if indexdb date bigger than mongodb , update this record to mongod
                  modifyCollection['indexDBtimeNotMatch'].push(indexDB);
                }else{
                  // if same , dont update
                }
              }
            }else{
              console.log('the _id do exist');
            }


            /*  */

          }
        }

        /* find record are not exists in mongodb*/
        for(var collection in collections){
          if(!collections[collection]._id||collections[collection]._id==""||collections[collection]._id==" "){

            if(collections[collection].username!="admin@snsoft.my"){
              modifyCollection['mongoDBNotExist'].push(collections[collection]);
            }

          }
        }
        deferred.resolve(modifyCollection);
      })
      return deferred.promise;
    }


    function generateIndexID(){
      var username = $cookies.getObject('loggedInUser').username;
      return username+"-"+new Date().getTime();

    }

    function mergeData(sync, fn){
      var deferred = $q.defer();

      if(sync){
        fn(false)
          .then(fn)
          .then(function(data){
            deferred.resolve(data);
          })
      }else{
        fn().then(function(data){
          deferred.resolve(data);
        })
      }
      return deferred.promise;
    }


    function mergeLeaveData(sync, fn, param1){
      var deferred = $q.defer();
      sync = false;
      if(sync){
        fn(param1,false)
          .then(fn(param1))
          .then(function(data){
            deferred.resolve(data);
          })
      }else{
        fn(param1).then(function(data){
          deferred.resolve(data);
        })
      }

      return deferred.promise;
    }



  }
})()


