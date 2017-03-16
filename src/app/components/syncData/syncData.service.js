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
      var syncTime = localdb.getObjectStore('lastSync', 'readonly').get('syncDB');
      console.log('Sync Data Start....!')

      syncTime.onsuccess = function(event){
        var result = event.target.result;
        var dateNow = result.lastSync;
        console.log('sync done');

        // will uncomment when the api is ready.
        if(dateNow==null||dateNow==""){
          deferred.resolve(true);

        }else{
          deferred.resolve(false);
        }

      }
      syncTime.onerror = function(){
        $log.info("Sync data Error!")
      }

      return deferred.promise;
  	}



    function compare(collections, saveFn ,getFn){
        var deferred = $q.defer();

        getFn().then(function(data){
            console.log(data);
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
                return (num.objectID&&num.objectID!=""&&num.objectID == data[d].objectID)
                 });
              if(!evens||data[d].objectID==""||!data[d].objectID){
                modifyCollection['indexDBNotExist'].push(data[d]);
              }
              for(var collection in collections){
                var indexDB = collections[collection];
                /** this is for time not matching [MONGODB] -> [INDEXDB] **/
                // if record objectID exist
                if(data[d].objectID && data[d].objectID !=""){
                  // if objectID same
                  if(data[d].objectID==indexDB.objectID){
                    // but modified
                    if(data[d].lastModified > indexDB.lastModified){
                      // if mongodb date bigger than indexdb , update this record to indexdb
                      modifyCollection['mongoDBtimeNotMatch'].push(data[d]);
                    }else if(data[d].lastModified < indexDB.lastModified){
                      // if indexdb date bigger than mongodb , update this record to mongod
                      modifyCollection['indexDBtimeNotMatch'].push(indexDB);
                    }else{
                      // if same , dont update
                    }
                  }
                }else{
                  console.log('the objectID do exist');
                }


                /*  */
                if(!indexDB.objectID||indexDB.objectID==""){
                  modifyCollection['mongoDBNotExist'].push(indexDB);
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
        fn(true)
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

      if(sync){
        fn(param1,true)
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

