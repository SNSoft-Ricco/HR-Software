/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('snsoftHr')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('angular-sqlite', angularSqlite);
})();
