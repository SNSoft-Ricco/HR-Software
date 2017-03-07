(function() {
'use strict';

  angular
      .module('snsoftHr')
      .service('syncData', syncData);

  /** @ngInject */
  function syncData($q, $log, $http, localdb) {

    this.sync = sync;
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
  }

})()


