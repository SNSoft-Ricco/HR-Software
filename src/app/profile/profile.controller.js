


(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('ProfileController', ProfileController);

    //ProfileController.$inject = ['ProfileService'];

    function ProfileController($timeout,$cookies,ProfileService,AuthService) {
        var vm = this;
        vm.title = "Profile Management";
        vm.loadProfile = loadProfile;
        vm.updateUser = updateUser;
        vm.checkViewPermission = checkViewPermission;

        $timeout(loadProfile,1000);

        function loadProfile()
        {
            var username = $cookies.getObject('loggedInUser').username;

            ProfileService.getUser(username)
                .then(function(data){
                    vm.username = data.username;
                    vm.name = data.name;
                    vm.userGroup = data.userGroup;
                    vm.department = data.department;
                    vm.position = data.position;
                    vm.supervisor = data.supervisor;
                    vm.contactNo = data.contactNo;
                    vm.nameModal = data.name;
                    vm.contactnoModal = data.contactNo;

                }, function() {
                  alert("Invalid user!");
                });
        }

        function updateUser()
        {
            var username = $cookies.getObject('loggedInUser').username;
            var obj = { username: username, name: vm.nameModal, userGroup:vm.userGroup, department:vm.department,position:vm.position,
                        supervisor: vm.supervisor, contactNo: vm.contactnoModal };

            ProfileService.updateUser(obj).then(
                function(){
                    loadProfile();
            });   
        }

        
        function checkViewPermission(id)
        {
            if(document.cookie.indexOf('loggedInUser') > -1){
                var username = $cookies.getObject('loggedInUser').username;
                var isAllowed = AuthService.checkPermission(username,id);
                return isAllowed;
            }
            else
                $log.info("cookies not exist");
        }

        /*
        var db = ProfileService.getDbConnection();

        if(db){
            loadProfile();
        }else{
            var promise = ProfileService.openDb();
            promise.then (function(){
                loadProfile();
            });
        }*/
    }

})();
