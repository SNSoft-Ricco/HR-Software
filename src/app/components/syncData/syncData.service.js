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
  	function sync(){
      var deferred = $q.defer();
      // check lastSync in localdb , if null ,then fetch all the database
      // if not null , fetch time only after lastSyncTime
      var syncTime = localdb.getObjectStore('lastSync', 'readonly').openCursor();
      console.log('Sync Data Start....!')

      syncTime.onsuccess = function(event){
        var result = event.target.result;
        var dateNow = result.key;
        console.log('sync done');

        
        // will uncomment when the api is ready.
        if(dateNow==null||dateNow==""){
          deferred.resolve(true);

        }else{
          deferred.resolve(false);
        //   mongoServ.getAllDepartments(dateNow).success(function(collections){
        //     getAllDepartments(collections);
        //   })
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
              var evens = _.find(collections, function(num){ return (num.objectID&&num.objectID!=""&&num.ObjectID == data[d].ObjectID) });
              if(!evens||data[d].objectID==""){
                modifyCollection['indexDBNotExist'].push(data[d]);
              }
              for(var collection in collections){

                /** this is for time not matching [MONGODB] -> [INDEXDB] **/
                // if record objectID exist
                if(data[d].objectID && data[d].objectID !=""){
                  // if objectID same
                  if(data[d].objectID==collections[collection].objectID){
                    // but modified
                    if(data[d].lastModified > collections[collection].lastModified){
                      // if mongodb date bigger than indexdb , update this record to indexdb
                      modifyCollection['mongoDBtimeNotMatch'].push(data[d]);
                    }else if(data[d].lastModified<collections[collection].lastModified){
                      // if indexdb date bigger than mongodb , update this record to mongod
                      modifyCollection['indexDBtimeNotMatch'].push(collections[collection]);
                    }else{
                      // if same , dont update
                    }
                  }
                }else{
                  console.log('the objectID do exist');
                }
                /** this is for time not matching [INDEXDB] -> [MONGODB] **/
              }
            }
            // addLeave(modifyCollection);
            // editLeave(modifyCollection['indexDBtimeNotMatch']);
            deferred.resolve(modifyCollection);
        })
        return deferred.promise;
    }


    function generateIndexID(){
      var username = $cookies.getObject('loggedInUser').username;
      return username+"-"+new Date().getTime();
      
    }
  }
})()


