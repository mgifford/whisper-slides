/**
 * Automatically hide footer text when it overlaps with slide content
 * Checks all slides and toggles .hide-footer-text class based on overlap detection
 */

(function() {
  'use strict';

  function checkFooterOverlap() {
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach(slide => {
      const footer = slide.querySelector('.ca-footer');
      if (!footer) return;
      
      // Get all content elements (h1, h2, p, ul, ol, div, etc.) but exclude footer and notes
      const contentElements = slide.querySelectorAll('h1, h2, h3, p, ul, ol, div, section, article');
      let hasOverlap = false;
      
      const footerRect = footer.getBoundingClientRect();
      
      contentElements.forEach(element => {
        // Skip if it's the footer itself or notes/details
        if (element.closest('.ca-footer') || 
            element.classList.contains('notes') || 
            element.classList.contains('note') ||
            element.hasAttribute('hidden')) {
          return;
        }
        
        const elementRect = element.getBoundingClientRect();
        
        // Check if elements overlap
        if (!(elementRect.right < footerRect.left || 
              elementRect.left > footerRect.right || 
              elementRect.bottom < footerRect.top || 
              elementRect.top > footerRect.bottom)) {
          hasOverlap = true;
        }
      });
      
      // Toggle the hide-footer-text class based on overlap
      if (hasOverlap) {
        slide.classList.add('hide-footer-text');
      } else {
        slide.classList.remove('hide-footer-text');
      }
    });
  }
  
  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkFooterOverlap);
  } else {
    checkFooterOverlap();
  }
  
  // Re-check on window resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(checkFooterOverlap, 150);
  });
  
  // Re-check when slide changes (for b6+ navigation)
  document.addEventListener('slidechange', checkFooterOverlap);
  
  // Also check after a short delay to catch any dynamic content loading
  setTimeout(checkFooterOverlap, 500);
})();
