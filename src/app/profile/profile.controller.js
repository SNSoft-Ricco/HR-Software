


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
                    vm.fullname = data.fullname;
                    vm.usergroup = data.usergroup;
                    vm.department = data.department;
                    vm.position = data.position;
                    vm.supervisor = data.supervisor;
                    vm.contactno = data.contactno;
                    vm.fullnameModal = data.fullname;
                    vm.contactnoModal = data.contactno;

                }, function() {
                  alert("Invalid user!");
                });
        }

        function updateUser()
        {
            var username = $cookies.getObject('loggedInUser').username;
            var obj = { username: username, fullname: vm.fullnameModal, usergroup:vm.usergroup, department:vm.department,position:vm.position,
                        supervisor: vm.supervisor, contactno: vm.contactnoModal };

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
                console.log("cookies not exist");
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
