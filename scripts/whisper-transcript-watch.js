#!/usr/bin/env node
// Simple watcher: mirror a source transcript (txt or json) into
// presentations/whisper-demo/transcript.json for the deck to poll.

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { src: null, dst: path.resolve(__dirname, '..', 'presentations', 'whisper-demo', 'transcript.json') };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if ((a === '--src' || a === '-s') && args[i + 1]) {
      out.src = path.resolve(args[++i]);
    } else if ((a === '--dst' || a === '-d') && args[i + 1]) {
      out.dst = path.resolve(args[++i]);
    } else if (a === '--help' || a === '-h') {
      console.log('Usage: node scripts/whisper-transcript-watch.js --src <source.txt|json> [--dst <output.json>]');
      process.exit(0);
    }
  }
  if (!out.src) {
    console.error('Error: --src is required');
    process.exit(1);
  }
  return out;
}

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

function toJsonPayload(srcPath, content) {
  const ext = path.extname(srcPath).toLowerCase();
  if (ext === '.json') {
    try {
      const obj = JSON.parse(content);
      if (typeof obj === 'string') return { text: obj, updatedAt: new Date().toISOString() };
      if (obj && typeof obj.text === 'string') return { text: obj.text, updatedAt: new Date().toISOString() };
      return { text: JSON.stringify(obj), updatedAt: new Date().toISOString() };
    } catch {
      // fall through to txt
    }
  }
  return { text: content, updatedAt: new Date().toISOString() };
}

function writeOut(dst, payload) {
  ensureDir(dst);
  fs.writeFileSync(dst, JSON.stringify(payload, null, 2));
}

function syncOnce(src, dst) {
  try {
    const content = fs.readFileSync(src, 'utf8');
    const payload = toJsonPayload(src, content);
    writeOut(dst, payload);
    return true;
  } catch (e) {
    return false;
  }
}

function main() {
  const { src, dst } = parseArgs();
  console.log(`[whisper-transcript-watch] Watching: ${src}`);
  console.log(`[whisper-transcript-watch] Writing to: ${dst}`);

  // Initial sync (retry until available)
  const interval = setInterval(() => {
    if (syncOnce(src, dst)) {
      clearInterval(interval);
      console.log('[whisper-transcript-watch] Initial sync complete');
    } else {
      process.stdout.write('.');
    }
  }, 1000);

  // Watch for changes
  fs.watch(path.dirname(src), { persistent: true }, (eventType, filename) => {
    if (!filename) return;
    const full = path.resolve(path.dirname(src), filename);
    if (full !== src) return;
    if (eventType === 'change' || eventType === 'rename') {
      if (syncOnce(src, dst)) {
        console.log(`\n[whisper-transcript-watch] Updated from change: ${new Date().toLocaleTimeString()}`);
      }
    }
  });
}

main();
