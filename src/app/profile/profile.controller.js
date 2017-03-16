


(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('ProfileController', ProfileController);

    //ProfileController.$inject = ['ProfileService'];

    function ProfileController($timeout,$cookies,ProfileService,AuthService) {
        var vm = this;
        var id = 1;
        vm.title = "Profile Management";
        vm.loadProfile = loadProfile;
        vm.updateUser = updateUser;
        vm.checkViewPermission = checkViewPermission;

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

        function checkViewPermission()
        {
          if(document.cookie.indexOf('loggedInUser') > -1){
            var username = $cookies.getObject('loggedInUser').username;
            var promise = AuthService.checkPermission(username,id);
            promise.then(function(data){
              vm.isAllowed = data;
            }, function(err) {
              console.log("invalid permission checking");
            });
          }
          else
            console.log("cookies not exist");
        }

      this.checkViewPermission();
      this.loadProfile();
    }

})();
