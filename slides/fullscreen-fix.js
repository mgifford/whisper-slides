/**
 * Fullscreen Fix
 *
 * Suppresses NotAllowedError alert dialogs when entering fullscreen fails.
 * This error is common on first page load or on static hosting like GitHub Pages
 * where fullscreen permissions may not be granted.
 *
 * Note: b6plus.js defines toggleFullscreen() in its own scope; it is not
 * accessible as window.toggleFullscreen. This file patches window.alert
 * instead, which is what b6plus.js calls when fullscreen fails.
 *
 * Must be loaded AFTER b6plus.js
 */

(function() {
  'use strict';

  // Suppress window.alert calls for fullscreen errors
  const originalAlert = window.alert;
  window.alert = function(message) {
    // Don't show alerts about fullscreen errors with NotAllowedError
    if (typeof message === 'string' &&
        message.includes('fullscreen') &&
        message.includes('NotAllowedError')) {
      console.log('Suppressed fullscreen alert:', message);
      return;
    }
    originalAlert.apply(window, arguments);
  };

})();
