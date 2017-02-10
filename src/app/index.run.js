(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.run(runBlock);

	/** @ngInject */
	function runBlock($log, $window, $http) {

		// Inject temporary account to local storage

		$http.get('data/user.json').success(function(data){
			$window.localStorage['storageName'] = angular.toJson(data);
		})



		$log.debug('runBlock end');
	}

})();
