(function() {
'use strict';

  angular
      .module('snsoftHr')
      .service('mongoServ', mongoServ);

  /** @ngInject */
  function mongoServ($q, $log, $http) {

    this.departments = departments;
    this.addDept = addDept;
  	function departments(){
        return $http({method: "GET", url:"/departments"});
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
  }

})()


