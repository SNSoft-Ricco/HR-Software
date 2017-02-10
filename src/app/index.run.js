(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
