/**
 * Web Speech API Captions for b6plus presentations
 *
 * Uses the browser's built-in SpeechRecognition API (Chrome/Edge) to provide
 * live captioning without any local server or install. Works on GitHub Pages
 * and any HTTPS-hosted static site.
 *
 * Exposes window.WebSpeechCaptions with:
 *   .isSupported  — true if SpeechRecognition is available
 *   .isActive     — true while recognition is running
 *   .start()      — request microphone and begin recognition
 *   .stop()       — stop recognition
 *
 * Transcript text is written directly to the .live-caption-display element
 * (created by captions-button.js). A 'webspeech-status' CustomEvent is
 * dispatched on document whenever active state changes.
 */

(function () {
  'use strict';

  var SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  var isSupported = !!SpeechRecognition;
  var recognition = null;
  var finalBuffer = '';
  var MAX_DISPLAY_WORDS = 30; // Keep approximately 2–3 visible lines of text

  // Public API
  window.WebSpeechCaptions = {
    isSupported: isSupported,
    isActive: false,
    start: start,
    stop: stop
  };

  function getDisplay() {
    return document.querySelector('.live-caption-display');
  }

  function dispatchStatus(active, errorCode) {
    var detail = { active: active };
    if (errorCode) detail.error = errorCode;
    document.dispatchEvent(
      new CustomEvent('webspeech-status', { detail: detail })
    );
  }

  function start() {
    if (!isSupported) {
      console.warn('[WebSpeech] SpeechRecognition not supported in this browser.');
      return false;
    }
    if (window.WebSpeechCaptions.isActive) return true;

    finalBuffer = '';
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || 'en-US';

    recognition.onstart = function () {
      window.WebSpeechCaptions.isActive = true;
      console.log('[WebSpeech] Recognition started.');
      dispatchStatus(true);
    };

    recognition.onresult = function (event) {
      var interim = '';
      for (var i = event.resultIndex; i < event.results.length; i++) {
        var transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalBuffer += transcript + ' ';
          // Keep roughly the last MAX_DISPLAY_WORDS words in the final buffer
          var words = finalBuffer.trim().split(/\s+/);
          if (words.length > MAX_DISPLAY_WORDS) {
            finalBuffer = words.slice(-MAX_DISPLAY_WORDS).join(' ') + ' ';
          }
        } else {
          interim += transcript;
        }
      }

      var displayText = (finalBuffer + interim).trim();
      var display = getDisplay();
      if (display && displayText) {
        display.textContent = displayText;
      }
    };

    recognition.onerror = function (event) {
      console.warn('[WebSpeech] Error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        window.WebSpeechCaptions.isActive = false;
        recognition = null;
        dispatchStatus(false, 'permission-denied');
      }
      // Other errors (network, no-speech, audio-capture) are transient;
      // onend will fire and trigger a restart if still active.
    };

    recognition.onend = function () {
      // Restart automatically if we are still supposed to be running
      // (browser stops after a period of silence or on some mobile browsers)
      if (window.WebSpeechCaptions.isActive && recognition) {
        try {
          recognition.start();
          console.log('[WebSpeech] Restarted after onend.');
        } catch (e) {
          console.warn('[WebSpeech] Could not restart:', e.message);
          window.WebSpeechCaptions.isActive = false;
          recognition = null;
          dispatchStatus(false);
        }
      } else {
        dispatchStatus(false);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn('[WebSpeech] Could not start:', e.message);
      recognition = null;
      return false;
    }
    return true;
  }

  function stop() {
    window.WebSpeechCaptions.isActive = false;
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
      recognition = null;
    }
    console.log('[WebSpeech] Stopped.');
    dispatchStatus(false);
  }
})();
