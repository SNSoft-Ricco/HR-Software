

(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .controller('ProfileController', ProfileController);

  //ProfileController.$inject = ['ProfileService'];

  function ProfileController($log,$cookies,ProfileService,AuthService) {
    var vm = this;
    var id = 1; //permission id for profile page
    vm.title = "My Profile";
    vm.loadProfile = loadProfile;
    vm.updateUser = updateUser;
    vm.checkViewPermission = checkViewPermission;

    function loadProfile()
    {
      var username = $cookies.getObject('loggedInUser').username;

      ProfileService.getUser(username).then(
        function(data){
          vm.username = data.username;
          vm.name = data.name;
          vm.userGroup = data.userGroup;
          vm.department = data.department;
          vm.position = data.position;
          vm.supervisor = data.supervisor;
          vm.contactNo = data.contactNo;
          vm.nameModal = data.name;
          vm.contactnoModal = data.contactNo;

        }, function(error) {
          $log.info(error);
        }
      );
    }

    function updateUser()
    {
      var username = $cookies.getObject('loggedInUser').username;
      var obj = { username: username, name: vm.nameModal, userGroup:vm.userGroup, department:vm.department,position:vm.position,
        supervisor: vm.supervisor, contactNo: vm.contactnoModal };

      ProfileService.updateUser(obj).then(
        function(){
          loadProfile();
        }, function(error) {
          $log.info(error);
        }
      );
    }

    function checkViewPermission()
    {
      if(document.cookie.indexOf('loggedInUser') > -1){
        var username = $cookies.getObject('loggedInUser').username;

        AuthService.checkPermission(username,id).then(
          function(data){
            vm.isAllowed = data;
          },
          function(err) {
            $log.info(err);
          }
        );
      }
      else
        $log.info("cookies not exist");
    }

    this.checkViewPermission();
    this.loadProfile();
  }
})();
