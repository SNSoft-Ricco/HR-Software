(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.controller('DeptDetailController', DeptDetailController);

	/** @ngInject */
	function DeptDetailController($log, $window, $cookies, $state, $stateParams, deptServ) {
		var vm = this;
    var objDept = $stateParams.myParam;

    vm.deptName = objDept.department;
	}
})();