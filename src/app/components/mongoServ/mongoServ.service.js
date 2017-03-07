(function() {
'use strict';

  angular
      .module('snsoftHr')
      .service('mongoServ', mongoServ);

  /** @ngInject */
  function mongoServ($q, $log, $http) {

    this.getAllDepartments = getAllDepartments;
    this.addDept = addDept;
    this.editDept = editDept;
    this.rmDept = rmDept;
    this.syncDept = syncDept;
  	function getAllDepartments(lastSync){

      if(!lastSync){
        // if sent 0 , which means return all result
        return $http({method: "GET", url:"/departments/0/"});
      }else{
        // if sent a number, only return the data after the last sync time
        return $http({method: "GET", url:"/departments/"+lastSync+"/"})
      }
        
  	}

    function addDept(objDept,callback){
      // return $http({method:"POST", url:"/addDept/",
      //   data:{'data':objDept}
      // })
      var result = {'data':{'code':204, 'status':'its done'}}
      callback(result);
    }

    function editDept(objDept,callback){
      // return $http({method:"POST", url:"/editDept/",
      //   data:{'data':objDept}
      // })
      callback();
    }
    function rmDept(objDept, callback){
      // return $http({method:"POST", url:"/editDept/",
      //   data:{'data':objDept}
      // })
      callback();
    }
    function syncDept(objDepts,callback){
      // return $http({method:"POST", url:"/syncDept/",
      //   data{'data':objDept});

    // })


    }
  }

})()


