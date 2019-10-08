(function() {
  'use strict';

  angular
    .module('minesweeper')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
