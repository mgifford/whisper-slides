/**
 * Captions Button Extension for b6plus
 * 
 * Adds a caption status button to the b6-ui menu bar that:
 * - Polls whisper-demo/transcript.json every 2 seconds
 * - Shows green circle (🟢) when Whisper is running
 * - Shows grey circle (⏺) when Whisper is not running  
 * - Opens a modal with presentation instructions on click
 * 
 * Load this script after b6plus.js:
 * <script src="ca-slides/b6plus.js"></script>
 * <script src="ca-slides/captions-button.js"></script>
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('[Captions] Init function called');
    console.log('[Captions] Window location:', window.location.href);
    console.log('[Captions] Is iframe:', window !== window.top);
    
    // Always create caption display immediately (even if b6-ui doesn't exist yet)
    addLiveTranscriptDisplay();
    
    // Always start polling for captions and element persistence
    startPolling();
    
    // Debug: Check element state every 2 seconds
    setInterval(() => {
      const el = document.querySelector('.live-caption-display');
      const hasFull = document.body.classList.contains('full');
      if (el) {
        const styles = window.getComputedStyle(el);
        console.log('[Captions] Health check - Element exists:', !!el, '| body.full:', hasFull, '| Parent:', el?.parentElement?.tagName);
        console.log('  Content length:', el.textContent.length, '| Display:', styles.display, '| Visibility:', styles.visibility, '| Bottom:', styles.bottom);
      } else {
        console.log('[Captions] Health check - Element exists: false | body.full:', hasFull);
      }
      if (!el && hasFull) {
        console.error('[Captions] ⚠️ Element missing but body.full is true! Recreating...');
        addLiveTranscriptDisplay();
      }
    }, 2000);
    
    // Wait for b6-ui to exist (created by b6plus.js)
    const checkUIInterval = setInterval(() => {
      const uiBar = document.querySelector('.b6-ui');
      if (uiBar) {
        console.log('[Captions] Found b6-ui, adding button');
        clearInterval(checkUIInterval);
        addCaptionButton(uiBar);
        
        // Monitor for presentation mode changes
        monitorPresentationMode();
      }
    }, 100);

    // Give up after 5 seconds if b6-ui never appears
    setTimeout(() => {
      clearInterval(checkUIInterval);
      console.log('[Captions] Stopped waiting for b6-ui (but polling continues)');
    }, 5000);
  }

  function monitorPresentationMode() {
    // Watch for body.full class to appear (presentation mode)
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains('full')) {
        console.log('[Captions] Presentation mode detected, ensuring caption display exists');
        // Ensure caption display exists in presentation mode
        addLiveTranscriptDisplay();
      }
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Also check immediately in case we're already in full mode
    if (document.body.classList.contains('full')) {
      console.log('[Captions] Already in presentation mode');
      addLiveTranscriptDisplay();
    }
    
    // Also periodically check if element disappeared and recreate it
    setInterval(() => {
      if (document.body.classList.contains('full')) {
        if (!document.querySelector('.live-caption-display')) {
          console.log('[Captions] Element disappeared, recreating');
          addLiveTranscriptDisplay();
        }
      }
    }, 1000);
  }

  function addCaptionButton(uiBar) {
    // Check if button already exists
    if (document.querySelector('.b6-captionbutton')) return;

    // Create caption button
    const captionbutton = document.createElement('button');
    captionbutton.className = 'b6-captionbutton';
    captionbutton.innerHTML = '<span class="caption-indicator">⏺</span> <span>captions</span>';
    captionbutton.setAttribute('title', 'Captions Off: Click for help');
    captionbutton.setAttribute('aria-live', 'polite');
    
    // Add click handler
    captionbutton.addEventListener('click', (ev) => {
      showCaptionHelp();
      ev.currentTarget.blur();
      ev.preventDefault();
      ev.stopPropagation();
    });

    // Append to ui bar
    uiBar.appendChild(captionbutton);
  }

  function addLiveTranscriptDisplay() {
    // Check if already exists
    const existing = document.querySelector('.live-caption-display');
    if (existing) {
      console.log('[Captions] Display element already exists');
      return;
    }

    console.log('[Captions] Creating live caption display element');
    
    const display = document.createElement('div');
    display.className = 'live-caption-display';
    display.setAttribute('aria-live', 'polite');
    display.setAttribute('aria-atomic', 'false');
    display.setAttribute('data-size', 'medium'); // Default size
    display.textContent = '[Waiting for captions...]';
    
    document.body.appendChild(display);
    console.log('[Captions] Display element created');
    
    // Add keyboard controls for text size
    document.addEventListener('keydown', (e) => {
      const display = document.querySelector('.live-caption-display');
      if (!display || !document.body.classList.contains('full')) return;
      
      const sizes = ['small', 'medium', 'large', 'xlarge'];
      const currentSize = display.getAttribute('data-size') || 'medium';
      const currentIndex = sizes.indexOf(currentSize);
      
      if (e.key === '=' || e.key === '+') {
        // Increase size
        const newIndex = Math.min(currentIndex + 1, sizes.length - 1);
        display.setAttribute('data-size', sizes[newIndex]);
        console.log('[Captions] Text size:', sizes[newIndex]);
        e.preventDefault();
      } else if (e.key === '-') {
        // Decrease size
        const newIndex = Math.max(currentIndex - 1, 0);
        display.setAttribute('data-size', sizes[newIndex]);
        console.log('[Captions] Text size:', sizes[newIndex]);
        e.preventDefault();
      }
    });
  }

  function showCaptionHelp() {
    let overlay = document.getElementById('b6-caption-help-overlay');
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'b6-caption-help-overlay';
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center;';
      overlay.onclick = (e) => { 
        if (e.target === overlay) overlay.remove(); 
      };
      
      const dialog = document.createElement('div');
      dialog.style.cssText = 'background: var(--slide-bg, #fff); color: var(--slide-fg, #000); padding: 2em; border-radius: 8px; max-width: 600px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);';
      
      // Check if captions are currently running
      const isRunning = document.querySelector('.b6-captionbutton .caption-indicator')?.textContent === '🟢';
      
      if (isRunning) {
        // Show presentation usage instructions
        dialog.innerHTML = '<h2 style="margin-top: 0;">Using Live Captions</h2>' +
          '<p>Whisper is currently running and capturing your speech. The live transcript appears at the bottom of the slides as you speak.</p>' +
          '<h3 style="margin-top: 1.5em;">Keyboard Controls:</h3>' +
          '<ul style="line-height: 1.7;">' +
          '<li><kbd>=</kbd> or <kbd>+</kbd> - Increase caption text size</li>' +
          '<li><kbd>-</kbd> - Decrease caption text size</li>' +
          '<li>Text persists between slides so viewers can finish reading</li>' +
          '</ul>' +
          '<h3 style="margin-top: 1.5em;">Tips for Best Results:</h3>' +
          '<ul style="line-height: 1.7;">' +
          '<li>Speak clearly at a moderate pace</li>' +
          '<li>Reduce background noise when possible</li>' +
          '<li>The transcript updates every 2 seconds</li>' +
          '</ul>' +
          '<button style="margin-top: 1.5em; padding: 0.5em 1.5em; background: #005EA2; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Close</button>';
      } else {
        // Show setup instructions
        dialog.innerHTML = '<h2 style="margin-top: 0;">Live Caption Setup</h2>' +
          '<p><strong>⚠️ Local Use Only:</strong> This feature works only when running presentations locally on your machine. It will not work on deployed sites.</p>' +
          '<p>To enable live captions powered by Whisper.cpp:</p>' +
          '<ol style="line-height: 1.7;">' +
          '<li>Install SDL2: <code style="background: var(--code-bg, #f0f0f0); padding: 2px 6px; border-radius: 3px;">brew install sdl2</code></li>' +
          '<li>Build whisper.cpp in the presentations directory (see README)</li>' +
          '<li>Download a Whisper model (e.g., base.en)</li>' +
          '<li>Run <code style="background: var(--code-bg, #f0f0f0); padding: 2px 6px; border-radius: 3px;">npm run dev:whisper</code> from the project root</li>' +
          '</ol>' +
          '<p>When active, this button will show a green indicator (🟢).</p>' +
          '<p style="margin-top: 1.5em;"><a href="/presentations/README-whisper.html" target="_blank" style="color: #005EA2; text-decoration: underline;">→ View detailed setup instructions</a></p>' +
          '<button style="margin-top: 1.5em; padding: 0.5em 1.5em; background: #005EA2; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Close</button>';
      }
      
      const closeBtn = dialog.querySelector('button');
      closeBtn.onclick = () => overlay.remove();
      
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
    } else {
      overlay.style.display = 'flex';
    }
  }

  function updateCaptionButton(running) {
    const buttons = document.querySelectorAll('.b6-captionbutton');
    buttons.forEach(button => {
      const indicator = button.querySelector('.caption-indicator');
      if (running) {
        button.setAttribute('title', 'Captions On: Whisper transcript available');
        if (indicator) indicator.textContent = '🟢';
      } else {
        button.setAttribute('title', 'Captions Off: Click for help');
        if (indicator) indicator.textContent = '⏺';
      }
    });
  }

  function updateLiveTranscript(text) {
    const display = document.querySelector('.live-caption-display');
    if (!display) {
      console.log('[Captions] updateLiveTranscript - No display element found');
      return;
    }
    
    if (text) {
      // Clean up the text - remove ANSI codes and [BLANK_AUDIO] markers
      const cleanText = text
        .replace(/\x1b\[[0-9;]*[mK]/g, '') // Remove ANSI escape codes
        .replace(/\[BLANK_AUDIO\]/g, '') // Remove blank audio markers
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      // Get the last few words (approximately 2-3 lines worth)
      const words = cleanText.split(' ').filter(w => w.length > 0);
      const recentWords = words.slice(-30).join(' '); // Last ~30 words
      
      // Only update if there's actual content
      if (recentWords) {
        display.textContent = recentWords;
        console.log('[Captions] Updated transcript:', recentWords.substring(0, 50) + '...');
      } else {
        console.log('[Captions] No content after cleaning, keeping previous text');
      }
      // Don't clear if recentWords is empty - keep previous text visible
    } else {
      console.log('[Captions] updateLiveTranscript called with no text');
    }
    // Never clear the display - text persists for slow readers
  }

  async function checkCaptions() {
    try {
      const res = await fetch('whisper-demo/transcript.json', { cache: 'no-store' });
      if (res.ok) {
        // Check if file was recently modified (within last 10 seconds)
        const lastModified = res.headers.get('Last-Modified');
        let isActive = false;
        
        if (lastModified) {
          const modifiedDate = new Date(lastModified);
          const now = new Date();
          const secondsSinceUpdate = (now - modifiedDate) / 1000;
          isActive = secondsSinceUpdate < 10; // File updated in last 10 seconds
          console.log('[Captions] Fetch successful - Age:', Math.round(secondsSinceUpdate), 's | Active:', isActive);
        }
        
        const data = await res.json();
        console.log('[Captions] Data received, length:', data.text?.length || 0);
        // Button shows active status based on file modification time
        updateCaptionButton(isActive);
        // But always show the latest transcript text (even if slightly old)
        updateLiveTranscript(data.text);
      } else {
        console.log('[Captions] Fetch failed:', res.status);
        updateCaptionButton(false);
        updateLiveTranscript('');
      }
    } catch (err) {
      console.log('[Captions] Fetch error:', err.message);
      updateCaptionButton(false);
      updateLiveTranscript('');
    }
  }

  function startPolling() {
    checkCaptions();
    setInterval(checkCaptions, 2000);
    
    // Also aggressively ensure the caption display exists
    setInterval(() => {
      if (!document.querySelector('.live-caption-display')) {
        console.log('[Captions] ⚠️ Element disappeared, recreating now!');
        addLiveTranscriptDisplay();
      }
    }, 500);
  }

})();
