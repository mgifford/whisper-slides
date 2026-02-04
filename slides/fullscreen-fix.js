/**
 * Fullscreen Fix
 * 
 * Patches b6plus.js to silently handle NotAllowedError when entering fullscreen.
 * This error is common on first page load or on static hosting like GitHub Pages
 * where fullscreen permissions may not be granted.
 * 
 * Must be loaded AFTER b6plus.js
 */

(function() {
  'use strict';

  // Store the original toggleFullscreen function
  const originalToggleFullscreen = window.toggleFullscreen;
  
  if (typeof originalToggleFullscreen !== 'function') {
    console.warn('fullscreen-fix.js: toggleFullscreen function not found. Is b6plus.js loaded?');
    return;
  }

  // Wrap toggleFullscreen to suppress NotAllowedError alerts
  window.toggleFullscreen = async function(onoff) {
    try {
      await originalToggleFullscreen(onoff);
    } catch (err) {
      // Silently ignore NotAllowedError - it's expected when:
      // - User denies permission
      // - Browser blocks fullscreen (e.g., on GitHub Pages)
      // - First interaction on page load
      if (err.name === 'NotAllowedError') {
        console.log('Fullscreen denied (expected):', err.message);
      } else {
        // Re-throw unexpected errors
        throw err;
      }
    }
  };

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
