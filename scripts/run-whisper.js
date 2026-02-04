#!/usr/bin/env node
// Launch whisper.cpp's whisper-stream (or compatible) and write a live transcript
// to presentations/whisper-demo/transcript.json for the deck to poll.
//
// Usage examples:
//   WHISPER_BIN=~/code/whisper.cpp/build/bin/whisper-stream \
//   WHISPER_MODEL=~/models/ggml-base.en.bin \
//   node scripts/run-whisper.js --step 500 --length 5000
//
//   node scripts/run-whisper.js --bin /path/to/whisper-stream --model /path/to/model.bin
//
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const cfg = {
    bin: process.env.WHISPER_BIN || null,
    model: process.env.WHISPER_MODEL || null,
    threads: parseInt(process.env.WHISPER_THREADS || String(Math.max(1, os.cpus().length - 1))),
    step: parseInt(process.env.WHISPER_STEP || '500'),
    length: parseInt(process.env.WHISPER_LENGTH || '5000'),
    extra: [],
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    switch (a) {
      case '--bin':
        cfg.bin = args[++i];
        break;
      case '--model':
        cfg.model = args[++i];
        break;
      case '--threads':
        cfg.threads = parseInt(args[++i]);
        break;
      case '--step':
        cfg.step = parseInt(args[++i]);
        break;
      case '--length':
        cfg.length = parseInt(args[++i]);
        break;
      case '--':
        cfg.extra = args.slice(i + 1);
        i = args.length; // end
        break;
      case '-h':
      case '--help':
        console.log(`Usage: node scripts/run-whisper.js [--bin <path>] [--model <path>] [--threads N] [--step ms] [--length ms] [-- <extra flags>]

Environment variables:
  WHISPER_BIN, WHISPER_MODEL, WHISPER_THREADS, WHISPER_STEP, WHISPER_LENGTH
`);
        process.exit(0);
      default:
        // passthrough unknown flags to extra
        cfg.extra.push(a);
    }
  }
  return cfg;
}

function resolveBin(bin) {
  if (bin && fs.existsSync(bin)) return bin;
  const candidates = [
    // Common local build locations (relative to repo root)
    path.resolve(__dirname, '..', 'presentations', 'whisper.cpp', 'build', 'bin', 'whisper-stream'),
    path.resolve(__dirname, '..', 'whisper.cpp', 'build', 'bin', 'whisper-stream'),
    path.resolve(__dirname, '..', 'build', 'bin', 'whisper-stream'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function resolveModel(model) {
  if (model && fs.existsSync(model)) return model;
  const candidates = [
    path.resolve(__dirname, '..', 'models', 'ggml-base.en.bin'),
    path.resolve(os.homedir(), 'models', 'ggml-base.en.bin'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function ensureOutPath() {
  const out = path.resolve(__dirname, '..', 'presentations', 'whisper-demo', 'transcript.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  return out;
}

function debounce(fn, wait) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

async function main() {
  const cfg = parseArgs();
  const bin = resolveBin(cfg.bin);
  const model = resolveModel(cfg.model);
  const outFile = ensureOutPath();

  if (!bin) {
    console.error('Could not find whisper-stream binary. Set --bin or WHISPER_BIN.');
    process.exit(1);
  }
  if (!model) {
    console.error('Could not find model file. Set --model or WHISPER_MODEL.');
    process.exit(1);
  }

  const args = ['-m', model, '-t', String(cfg.threads), '--step', String(cfg.step), '--length', String(cfg.length), ...cfg.extra];
  console.log(`[run-whisper] Launching: ${bin} ${args.join(' ')}`);
  console.log(`[run-whisper] Writing transcript to: ${outFile}`);

  let transcript = '';
  const writeOut = debounce(() => {
    const payload = { text: transcript.trim(), updatedAt: new Date().toISOString() };
    try {
      fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
    } catch (e) {
      // ignore transient write errors
    }
  }, 200);

  const child = spawn(bin, args, { stdio: ['ignore', 'pipe', 'pipe'] });

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    // Heuristic: strip typical progress lines; keep recognized text.
    const lines = String(chunk).split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      // Filter out obvious non-text patterns if present.
      if (/^(\[\d{2}:\d{2}:\d{2}\]|\d+ms|system\:|sampling\:|processing\:)/i.test(trimmed)) continue;
      transcript += (transcript.endsWith(' ') ? '' : ' ') + trimmed;
    }
    writeOut();
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => {
    // Keep stderr quiet; uncomment to debug
    // process.stderr.write(chunk);
  });

  const shutdown = () => {
    try { child.kill('SIGINT'); } catch {}
    writeOut();
    setTimeout(() => process.exit(0), 250);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  child.on('exit', (code) => {
    writeOut();
    console.log(`\n[run-whisper] whisper-stream exited with code ${code}`);
    process.exit(code || 0);
  });
}

main();
