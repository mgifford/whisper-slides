(() => {
  const POLL_MS = 1000;
  const DEFAULT_SRC = 'whisper-demo/transcript.json';

  function selectEl() {
    return document.getElementById('whisper-transcript');
  }

  async function fetchTranscript(src) {
    try {
      const res = await fetch(src, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (typeof json === 'string') return json;
        if (json && typeof json.text === 'string') return json.text;
        // Fallback: stringify unknown JSON shape
        return JSON.stringify(json);
      } catch (_) {
        return text;
      }
    } catch (err) {
      return null; // Indicates unavailable; caller decides how to render
    }
  }

  function setText(el, next) {
    if (el.dataset.prevText === next) return;
    el.dataset.prevText = next;
    el.textContent = next;
    el.scrollTop = el.scrollHeight;
  }

  async function startPolling() {
    const el = selectEl();
    if (!el) return;
    const src = el.getAttribute('data-transcript-src') || DEFAULT_SRC;
    // Initial hint
    setText(el, 'Waiting for transcript…');
    const tick = async () => {
      const t = await fetchTranscript(src);
      if (t === null) {
        // Keep prior text; show hint if empty
        if (!el.dataset.prevText || el.dataset.prevText === 'Waiting for transcript…') {
          setText(el, 'Waiting for transcript…');
        }
      } else {
        const trimmed = t.trim();
        setText(el, trimmed.length ? trimmed : '');
      }
    };
    tick();
    setInterval(tick, POLL_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPolling);
  } else {
    startPolling();
  }
})();
