(function(){

	angular
		.module('snsoftHr')
		.service('AuthService',AuthService);

	function AuthService($q,localdb,ProfileService,PermissionService){
	  	var allowPermission = [];

		this.getAllowPermission=function(username)
	    {
	      return ProfileService.getUser(username)
	        .then(function(data){
	            return PermissionService.getPermission(data.userGroup)
	               .then (function(result){
	               	  if(result){
		                  allowPermission = result.PermissionList;
		                  return Promise.resolve(allowPermission);
		              }
		              else
		              	  return Promise.reject("Invalid permission group!");

		            },function(err) {
		                return Promise.reject("Invalid permission group!");
		            });
	        }, function(err) {
	          return Promise.reject("Invalid user!");
	        });
	    }

	    this.checkPermission=function(username, id)
	    {
	    	if(allowPermission.length == 0)
	    	{
		    	this.getAllowPermission(username).then(function(data){
		        	if(data.indexOf(id) !== -1)
		        		return true;
		        	else
		        		return false;
		        }, function(err) {
		        	return false;
		        });
		    }
		    else
		    {
		    	if(allowPermission.indexOf(id) !== -1)
	        		return true;
	        	else
	        		return false;
		    }
	    }

	    this.clearList=function()
	    {
	    	allowPermission = [];
	    }

	    /*
	    this.checkDbConnection=function()
	    {
	    	var db = localdb.getDbConn();
		    if(!db)
		    {
		    	console.log("open dbbbbb222");
	            localdb.openDb();
	        }

	        
			return localdb.getDbConn().then(
	    		function(db){
		        	if(!db){
	            		localdb.openDb().then(
	            			function(data){
	            				return Promise.resolve(data);
	            			},function(err) {
		        				return Promise.reject("Get Db connection error");
		        			}
	            		);
		        	}
		        	else
		        		Promise.resolve(db);
		        },function(err) {
		        	return Promise.reject("Get Db connection error");
		    });
	        
	    }*/

	    this.getDbConnection=function()
	    {
	    	return localdb.getDbConn();
	    }

	    this.openDbConnection=function()
	    {
	    	localdb.openDb();
	    }

	    var db = localdb.getDbConn();
	    if(!db)
	    {
            localdb.openDb();
        }
	}
})();
