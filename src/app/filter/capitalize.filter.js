(function() {
	'use strict';

	angular
		.module('snsoftHr')
		.filter('capitalize', capitalize);

	/** @ngInject */
	function capitalize($log) {
		return function(input, scope) {
			if (input!=null)
				input = input.toLowerCase();

			return input.substring(0,1).toUpperCase()+input.substring(1);
		}
	}

})();
