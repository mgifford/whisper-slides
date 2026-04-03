/**
 * Captions Button Extension for b6plus
 *
 * Adds a caption status button to the b6-ui menu bar that:
 * - Polls whisper-demo/transcript.json every 2 seconds (Whisper.cpp path)
 * - Reflects Web Speech API state when webspeech-captions.js is loaded
 * - Shows red circle (🔴) when any caption source is active (recording)
 * - Shows black square (⏹) when no caption source is running
 * - Opens a modal with setup / control instructions on click
 *
 * Load this script after b6plus.js:
 * <script src="slides/b6plus.js"></script>
 * <script src="slides/captions-button.js"></script>
 */

(function() {
  'use strict';

  // Languages supported by both the Web Speech API and Whisper.cpp.
  // `code`    – BCP 47 tag used by the Web Speech API / HTML lang attribute
  // `label`   – Human-readable name shown in the selector
  // `whisper` – ISO 639-1 code accepted by whisper-stream's -l flag
  var CAPTION_LANGUAGES = [
    { code: 'af-ZA', label: 'Afrikaans',                whisper: 'af' },
    { code: 'ar-SA', label: 'Arabic',                   whisper: 'ar' },
    { code: 'bg-BG', label: 'Bulgarian',                whisper: 'bg' },
    { code: 'bn-IN', label: 'Bengali',                  whisper: 'bn' },
    { code: 'ca-ES', label: 'Catalan',                  whisper: 'ca' },
    { code: 'cs-CZ', label: 'Czech',                    whisper: 'cs' },
    { code: 'cy-GB', label: 'Welsh',                    whisper: 'cy' },
    { code: 'da-DK', label: 'Danish',                   whisper: 'da' },
    { code: 'de-DE', label: 'German',                   whisper: 'de' },
    { code: 'el-GR', label: 'Greek',                    whisper: 'el' },
    { code: 'en-AU', label: 'English (Australia)',      whisper: 'en' },
    { code: 'en-GB', label: 'English (UK)',             whisper: 'en' },
    { code: 'en-US', label: 'English (US)',             whisper: 'en' },
    { code: 'es-ES', label: 'Spanish (Spain)',          whisper: 'es' },
    { code: 'es-MX', label: 'Spanish (Mexico)',         whisper: 'es' },
    { code: 'et-EE', label: 'Estonian',                 whisper: 'et' },
    { code: 'eu-ES', label: 'Basque',                   whisper: 'eu' },
    { code: 'fa-IR', label: 'Persian',                  whisper: 'fa' },
    { code: 'fi-FI', label: 'Finnish',                  whisper: 'fi' },
    { code: 'fr-CA', label: 'French (Canada)',          whisper: 'fr' },
    { code: 'fr-FR', label: 'French (France)',          whisper: 'fr' },
    { code: 'gl-ES', label: 'Galician',                 whisper: 'gl' },
    { code: 'gu-IN', label: 'Gujarati',                 whisper: 'gu' },
    { code: 'he-IL', label: 'Hebrew',                   whisper: 'he' },
    { code: 'hi-IN', label: 'Hindi',                    whisper: 'hi' },
    { code: 'hr-HR', label: 'Croatian',                 whisper: 'hr' },
    { code: 'hu-HU', label: 'Hungarian',                whisper: 'hu' },
    { code: 'hy-AM', label: 'Armenian',                 whisper: 'hy' },
    { code: 'id-ID', label: 'Indonesian',               whisper: 'id' },
    { code: 'it-IT', label: 'Italian',                  whisper: 'it' },
    { code: 'ja-JP', label: 'Japanese',                 whisper: 'ja' },
    { code: 'ka-GE', label: 'Georgian',                 whisper: 'ka' },
    { code: 'kk-KZ', label: 'Kazakh',                   whisper: 'kk' },
    { code: 'km-KH', label: 'Khmer',                    whisper: 'km' },
    { code: 'kn-IN', label: 'Kannada',                  whisper: 'kn' },
    { code: 'ko-KR', label: 'Korean',                   whisper: 'ko' },
    { code: 'lo-LA', label: 'Lao',                      whisper: 'lo' },
    { code: 'lt-LT', label: 'Lithuanian',               whisper: 'lt' },
    { code: 'lv-LV', label: 'Latvian',                  whisper: 'lv' },
    { code: 'mk-MK', label: 'Macedonian',               whisper: 'mk' },
    { code: 'ml-IN', label: 'Malayalam',                whisper: 'ml' },
    { code: 'mn-MN', label: 'Mongolian',                whisper: 'mn' },
    { code: 'mr-IN', label: 'Marathi',                  whisper: 'mr' },
    { code: 'ms-MY', label: 'Malay',                    whisper: 'ms' },
    { code: 'my-MM', label: 'Burmese',                  whisper: 'my' },
    { code: 'nb-NO', label: 'Norwegian Bokmål',         whisper: 'no' },
    { code: 'ne-NP', label: 'Nepali',                   whisper: 'ne' },
    { code: 'nl-NL', label: 'Dutch',                    whisper: 'nl' },
    { code: 'pa-IN', label: 'Punjabi',                  whisper: 'pa' },
    { code: 'pl-PL', label: 'Polish',                   whisper: 'pl' },
    { code: 'pt-BR', label: 'Portuguese (Brazil)',      whisper: 'pt' },
    { code: 'pt-PT', label: 'Portuguese (Portugal)',    whisper: 'pt' },
    { code: 'ro-RO', label: 'Romanian',                 whisper: 'ro' },
    { code: 'ru-RU', label: 'Russian',                  whisper: 'ru' },
    { code: 'si-LK', label: 'Sinhala',                  whisper: 'si' },
    { code: 'sk-SK', label: 'Slovak',                   whisper: 'sk' },
    { code: 'sl-SI', label: 'Slovenian',                whisper: 'sl' },
    { code: 'sq-AL', label: 'Albanian',                 whisper: 'sq' },
    { code: 'sr-RS', label: 'Serbian',                  whisper: 'sr' },
    { code: 'sv-SE', label: 'Swedish',                  whisper: 'sv' },
    { code: 'sw-KE', label: 'Swahili',                  whisper: 'sw' },
    { code: 'ta-IN', label: 'Tamil',                    whisper: 'ta' },
    { code: 'te-IN', label: 'Telugu',                   whisper: 'te' },
    { code: 'th-TH', label: 'Thai',                     whisper: 'th' },
    { code: 'tr-TR', label: 'Turkish',                  whisper: 'tr' },
    { code: 'uk-UA', label: 'Ukrainian',                whisper: 'uk' },
    { code: 'ur-PK', label: 'Urdu',                     whisper: 'ur' },
    { code: 'uz-UZ', label: 'Uzbek',                    whisper: 'uz' },
    { code: 'vi-VN', label: 'Vietnamese',               whisper: 'vi' },
    { code: 'zh-CN', label: 'Chinese (Simplified)',     whisper: 'zh' },
    { code: 'zh-TW', label: 'Chinese (Traditional)',    whisper: 'zh' },
  ];

  var STORAGE_KEY = 'whisperSlides.captionLanguage';

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

    // Create the index-view captions popup
    createIndexCaptionPopup();
    
    // Always start polling for captions and element persistence
    startPolling();

    // React immediately to Web Speech API state changes
    document.addEventListener('webspeech-status', function (e) {
      var active = e.detail && e.detail.active;
      updateCaptionButton(active);
      if (e.detail && e.detail.error === 'permission-denied') {
        console.warn('[Captions] Web Speech microphone permission denied.');
      }
    });
    
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
    // Watch for body.full class to appear/disappear (entering/leaving presentation mode)
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains('full')) {
        console.log('[Captions] Presentation mode detected, ensuring caption display exists');
        // Ensure caption display exists in presentation mode
        addLiveTranscriptDisplay();
        // Hide the index popup — the main caption bar takes over
        hideIndexCaptionPopup();
      } else {
        // Leaving presentation mode — re-show popup if captions are active
        if (isCaptionActive()) {
          showIndexCaptionPopup();
        }
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

  function createIndexCaptionPopup() {
    if (document.getElementById('caption-index-popup')) return;

    var popup = document.createElement('div');
    popup.id = 'caption-index-popup';
    popup.className = 'caption-index-popup';
    popup.setAttribute('role', 'region');
    popup.setAttribute('aria-label', 'Live captions');

    // Restore minimized state from localStorage
    var minimized = false;
    try {
      minimized = localStorage.getItem('whisperSlides.captionPopupMinimized') === 'true';
    } catch (e) { /* ignore */ }

    var header = document.createElement('div');
    header.className = 'caption-index-popup-header';

    var title = document.createElement('span');
    title.className = 'caption-index-popup-title';
    title.textContent = '🔴 Live Captions';

    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'caption-index-popup-toggle';
    toggleBtn.setAttribute('aria-label', minimized ? 'Expand captions' : 'Minimize captions');
    toggleBtn.textContent = minimized ? '▲' : '▼';

    header.appendChild(title);
    header.appendChild(toggleBtn);

    var body = document.createElement('div');
    body.className = 'caption-index-popup-body';
    body.setAttribute('aria-live', 'polite');
    body.setAttribute('aria-atomic', 'false');

    popup.appendChild(header);
    popup.appendChild(body);
    document.body.appendChild(popup);

    if (minimized) {
      popup.classList.add('minimized');
    }

    // Toggle minimize on header click
    header.addEventListener('click', function () {
      var isMin = popup.classList.toggle('minimized');
      toggleBtn.textContent = isMin ? '▲' : '▼';
      toggleBtn.setAttribute('aria-label', isMin ? 'Expand captions' : 'Minimize captions');
      try {
        localStorage.setItem('whisperSlides.captionPopupMinimized', isMin ? 'true' : 'false');
      } catch (e) { /* ignore */ }
    });

    // Mirror caption text from .live-caption-display to popup body
    function attachObserver() {
      var mainDisplay = document.querySelector('.live-caption-display');
      if (!mainDisplay) return false;
      var observer = new MutationObserver(function () {
        body.textContent = mainDisplay.textContent;
      });
      observer.observe(mainDisplay, { childList: true, subtree: true, characterData: true });
      return true;
    }

    if (!attachObserver()) {
      // .live-caption-display may not exist yet; retry up to ~10 s (20 × 500 ms)
      var retryCount = 0;
      var retryInterval = setInterval(function () {
        retryCount++;
        if (attachObserver() || retryCount >= 20) clearInterval(retryInterval);
      }, 500);
    }
  }

  function showIndexCaptionPopup() {
    var popup = document.getElementById('caption-index-popup');
    if (popup && !document.body.classList.contains('full')) {
      popup.classList.add('visible');
    }
  }

  function hideIndexCaptionPopup() {
    var popup = document.getElementById('caption-index-popup');
    if (popup) {
      popup.classList.remove('visible');
    }
  }

  function isCaptionActive() {
    if (window.WebSpeechCaptions && window.WebSpeechCaptions.isActive) return true;
    var indicator = document.querySelector('.b6-captionbutton .caption-indicator');
    return !!(indicator && indicator.textContent === '🔴');
  }

  function addCaptionButton(uiBar) {
    // Check if button already exists
    if (document.querySelector('.b6-captionbutton')) return;

    // Create caption button
    const captionbutton = document.createElement('button');
    captionbutton.className = 'b6-captionbutton';
    captionbutton.innerHTML = '<span class="caption-indicator">⏹</span> <span>captions</span>';
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

  function getCaptionLanguage() {
    // Prefer explicit user selection, then fall back to the page language
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    } catch (e) { /* ignore */ }
    var docLang = document.documentElement.lang;
    if (docLang) {
      // Normalize to canonical BCP 47 casing (e.g. 'en-us' → 'en-US')
      try {
        docLang = Intl.getCanonicalLocales(docLang)[0];
      } catch (e) {
        // Fallback for browsers without Intl.getCanonicalLocales
        var parts = docLang.split('-');
        docLang = parts[0].toLowerCase() + (parts[1] ? '-' + parts[1].toUpperCase() : '');
      }
    }
    return docLang || 'en-US';
  }

  function getLangEntry(code) {
    // Exact match first
    for (var i = 0; i < CAPTION_LANGUAGES.length; i++) {
      if (CAPTION_LANGUAGES[i].code === code) return CAPTION_LANGUAGES[i];
    }
    // Prefix match (e.g. 'en' matches 'en-US')
    var prefix = code ? code.split('-')[0].toLowerCase() : '';
    for (var j = 0; j < CAPTION_LANGUAGES.length; j++) {
      if (CAPTION_LANGUAGES[j].code.toLowerCase().startsWith(prefix + '-')) {
        return CAPTION_LANGUAGES[j];
      }
    }
    return null;
  }

  function buildLanguageSelectorHTML(currentCode, selectId) {
    var options = CAPTION_LANGUAGES.map(function(lang) {
      var sel = lang.code === currentCode ? ' selected' : '';
      return '<option value="' + lang.code + '"' + sel + '>' + lang.label + '</option>';
    }).join('');
    return (
      '<label for="' + selectId + '" style="display:block;margin-top:1em;font-weight:bold;">Speech language:</label>' +
      '<select id="' + selectId + '" style="margin-top:0.4em;padding:0.4em 0.6em;font-size:1em;border-radius:4px;border:1px solid #aaa;background:var(--slide-bg,#fff);color:var(--slide-fg,#000);">' +
      options +
      '</select>'
    );
  }

  function showCaptionHelp() {
    // Always rebuild so language selector reflects current state
    let overlay = document.getElementById('b6-caption-help-overlay');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'b6-caption-help-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center;';
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.remove();
    };

    const dialog = document.createElement('div');
    dialog.style.cssText = 'background: var(--slide-bg, #fff); color: var(--slide-fg, #000); padding: 2em; border-radius: 8px; max-width: 600px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); overflow-y: auto; max-height: 90vh;';

    // Check if captions are currently running
    const isRunning = document.querySelector('.b6-captionbutton .caption-indicator')?.textContent === '🔴';
    const webSpeech = window.WebSpeechCaptions || null;
    const webSpeechSupported = webSpeech && webSpeech.isSupported;
    const webSpeechActive = webSpeech && webSpeech.isActive;

    const currentLang = getCaptionLanguage();
    const langEntry = getLangEntry(currentLang);
    const whisperCode = langEntry ? langEntry.whisper : currentLang.split('-')[0].toLowerCase();

    // Build Web Speech section
    const codeStyle = 'background: var(--code-bg, #f0f0f0); padding: 2px 6px; border-radius: 3px;';
    const btnStyle = 'margin-top: 1em; padding: 0.5em 1.5em; border: none; border-radius: 4px; cursor: pointer; font-size: 1em;';
    const langSelector = buildLanguageSelectorHTML(currentLang, 'b6-lang-select');

    let webSpeechSection;
    if (!webSpeechSupported) {
      webSpeechSection =
        '<section>' +
        '<h3 style="margin-top: 1.5em;">Web Speech API</h3>' +
        '<p>Not supported in this browser. Use Chrome or Edge for browser-based speech recognition with no local setup required.</p>' +
        langSelector +
        '</section>';
    } else if (webSpeechActive) {
      webSpeechSection =
        '<section>' +
        '<h3 style="margin-top: 1.5em;">Web Speech API (Active ✅)</h3>' +
        '<p>Your browser is capturing speech and showing live captions below the slides.</p>' +
        langSelector +
        '<p style="margin-top:0.6em;font-size:0.9em;">Changing the language will restart recognition immediately.</p>' +
        '<button id="b6-webspeech-toggle" style="' + btnStyle + 'background: #c00; color: #fff;">Stop Web Speech</button>' +
        '</section>';
    } else {
      webSpeechSection =
        '<section>' +
        '<h3 style="margin-top: 1.5em;">Web Speech API (Available)</h3>' +
        '<p>Your browser supports the Web Speech API. Click below to start live captions — no installation required. Works on GitHub Pages over HTTPS.</p>' +
        langSelector +
        '<button id="b6-webspeech-toggle" style="' + btnStyle + 'background: #005EA2; color: #fff;">Start Web Speech Captions</button>' +
        '</section>';
    }

    if (isRunning && !webSpeechActive) {
      // Whisper is running — show usage instructions
      dialog.innerHTML =
        '<h2 style="margin-top: 0;">Using Live Captions</h2>' +
        '<p>Whisper is currently running and capturing your speech. The live transcript appears at the bottom of the slides as you speak.</p>' +
        '<h3 style="margin-top: 1.5em;">Keyboard Controls:</h3>' +
        '<ul style="line-height: 1.7;">' +
        '<li><kbd>=</kbd> or <kbd>+</kbd> — Increase caption text size</li>' +
        '<li><kbd>-</kbd> — Decrease caption text size</li>' +
        '<li>Text persists between slides so viewers can finish reading</li>' +
        '</ul>' +
        '<h3 style="margin-top: 1.5em;">Tips for Best Results:</h3>' +
        '<ul style="line-height: 1.7;">' +
        '<li>Speak clearly at a moderate pace</li>' +
        '<li>Reduce background noise when possible</li>' +
        '<li>The transcript updates every 2 seconds</li>' +
        '</ul>' +
        webSpeechSection +
        '<button id="b6-close-caption-help" style="margin-top: 1.5em; padding: 0.5em 1.5em; background: #005EA2; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Close</button>';
    } else {
      // Captions off — show setup options
      dialog.innerHTML =
        '<h2 style="margin-top: 0;">Live Caption Options</h2>' +
        webSpeechSection +
        '<section>' +
        '<h3 style="margin-top: 1.5em;">Whisper.cpp (Local Only)</h3>' +
        '<p><strong>⚠️ Local Use Only:</strong> This feature works only when running presentations locally on your machine. It will not work on deployed sites.</p>' +
        '<p>To enable live captions powered by Whisper.cpp:</p>' +
        '<ol style="line-height: 1.7;">' +
        '<li>Install SDL2: <code style="' + codeStyle + '">brew install sdl2</code></li>' +
        '<li>Build whisper.cpp in the presentations directory (see README)</li>' +
        '<li>Download a Whisper model (e.g., base.en)</li>' +
        '<li>Set language if needed: <code style="' + codeStyle + '">WHISPER_LANGUAGE=' + whisperCode + ' npm run dev:whisper</code></li>' +
        '</ol>' +
        '</section>' +
        '<button id="b6-close-caption-help" style="margin-top: 1.5em; padding: 0.5em 1.5em; background: #005EA2; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Close</button>';
    }

    const closeBtn = dialog.querySelector('#b6-close-caption-help');
    if (closeBtn) closeBtn.onclick = () => overlay.remove();

    // Wire up the language selector
    const langSelect = dialog.querySelector('#b6-lang-select');
    if (langSelect) {
      langSelect.onchange = () => {
        var newLang = langSelect.value;
        try { localStorage.setItem(STORAGE_KEY, newLang); } catch (e) { /* ignore */ }
        if (webSpeech && webSpeech.setLanguage) {
          webSpeech.setLanguage(newLang);
        }
        // Rebuild dialog to refresh Whisper command line hint
        overlay.remove();
        showCaptionHelp();
      };
    }

    // Wire up the Web Speech toggle button if present
    const wsToggle = dialog.querySelector('#b6-webspeech-toggle');
    if (wsToggle && webSpeech) {
      wsToggle.onclick = () => {
        if (webSpeech.isActive) {
          overlay.remove();
          webSpeech.stop();
        } else {
          const started = webSpeech.start();
          if (started === false) {
            // start() returned false synchronously — not supported or already failed
            wsToggle.textContent = 'Could not start — check browser support';
            wsToggle.disabled = true;
          } else {
            overlay.remove();
          }
        }
      };
    }

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  }

  function updateCaptionButton(running) {
    const buttons = document.querySelectorAll('.b6-captionbutton');
    const webSpeechActive = window.WebSpeechCaptions && window.WebSpeechCaptions.isActive;
    const webSpeechRemote = window.WebSpeechCaptions && window.WebSpeechCaptions.isRemoteActive;
    buttons.forEach(button => {
      const indicator = button.querySelector('.caption-indicator');
      if (running) {
        let source;
        if (webSpeechActive) source = 'Web Speech API active';
        else if (webSpeechRemote) source = 'Web Speech API active (another window)';
        else source = 'Whisper transcript available';
        button.setAttribute('title', 'Captions On: ' + source);
        if (indicator) indicator.textContent = '🔴';
      } else {
        button.setAttribute('title', 'Captions Off: Click for help');
        if (indicator) indicator.textContent = '⏹';
      }
    });

    // Show or hide the index-view popup depending on caption state and mode
    if (running) {
      showIndexCaptionPopup();
    } else {
      hideIndexCaptionPopup();
    }
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
    // If Web Speech API is currently active (locally or in another window via
    // BroadcastChannel), it owns the caption display; skip the Whisper JSON poll
    // to avoid overwriting the live transcript.
    if (window.WebSpeechCaptions && (window.WebSpeechCaptions.isActive || window.WebSpeechCaptions.isRemoteActive)) {
      updateCaptionButton(true);
      return;
    }

    try {
      const res = await fetch('whisper-demo/transcript.json', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        let isActive = false;

        // Prefer an explicit active flag from the producer
        if (data && data.active === true) {
          isActive = true;
        } else if (data && data.generated) {
          const t = Date.parse(data.generated);
          if (!Number.isNaN(t)) {
            const secondsSince = (Date.now() - t) / 1000;
            isActive = secondsSince < 10; // recent within 10s
            console.log('[Captions] Data generated age:', Math.round(secondsSince), 's | Active:', isActive);
          }
        } else {
          // Fallback: last-modified header as a hint
          const lastModified = res.headers.get('Last-Modified');
          if (lastModified) {
            const modifiedDate = new Date(lastModified);
            const secondsSinceUpdate = (Date.now() - modifiedDate) / 1000;
            isActive = secondsSinceUpdate < 10;
            console.log('[Captions] Last-Modified age hint:', Math.round(secondsSinceUpdate), 's | Active:', isActive);
          }
        }

        console.log('[Captions] Data received, text length:', data?.text?.length || 0);
        updateCaptionButton(isActive);
        updateLiveTranscript(data?.text || '');
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
