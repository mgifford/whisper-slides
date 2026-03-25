# Feature Reference

Complete documentation for the Whisper Live Captioning Presentation Template.

---

## Table of Contents

1. [Overview](#overview)
2. [Presentation Framework (B6+)](#presentation-framework-b6)
   - [Index (Audience) View](#index-audience-view)
   - [Slide (Presentation) Mode](#slide-presentation-mode)
   - [Presenter View — The Second Window](#presenter-view--the-second-window)
   - [Keyboard and Mouse Navigation](#keyboard-and-mouse-navigation)
   - [Progressive Disclosure](#progressive-disclosure)
   - [Table of Contents](#table-of-contents-1)
   - [Automatic Slide Show](#automatic-slide-show)
   - [Sync Mode](#sync-mode)
   - [Dark Mode](#dark-mode)
   - [Annotation (Drawing)](#annotation-drawing)
3. [Slide Structure and Layouts](#slide-structure-and-layouts)
   - [Cover Slide](#cover-slide)
   - [Content Slide](#content-slide)
   - [Two-Column Layout](#two-column-layout)
   - [Shout / Emphasis Slide](#shout--emphasis-slide)
   - [Speaker Notes](#speaker-notes)
4. [Accessibility Features](#accessibility-features)
   - [Semantic HTML and Heading Order](#semantic-html-and-heading-order)
   - [ARIA Labelling](#aria-labelling)
   - [Live Regions](#live-regions)
   - [Keyboard Accessibility](#keyboard-accessibility)
   - [Color and Contrast](#color-and-contrast)
   - [Screen Reader Compatibility](#screen-reader-compatibility)
   - [Offline Indicator](#offline-indicator)
5. [Whisper Integration](#whisper-integration)
   - [How It Works](#how-it-works)
   - [GitHub Pages / Cloud Alternatives](#github-pages--cloud-alternatives)
   - [Setup Guide](#setup-guide)
   - [Running the Caption System](#running-the-caption-system)
   - [Caption Display](#caption-display)
   - [Caption Status Button](#caption-status-button)
   - [Transcript Polling](#transcript-polling)
   - [Text Size Controls](#text-size-controls)
   - [Browser-Based (WebAssembly) Mode](#browser-based-webassembly-mode)
6. [Supporting Features](#supporting-features)
   - [Fullscreen Fix](#fullscreen-fix)
   - [Footer Overlap Detector](#footer-overlap-detector)
   - [Seeded SVG Backgrounds](#seeded-svg-backgrounds)
7. [Theming and Customization](#theming-and-customization)
   - [CSS Custom Properties](#css-custom-properties)
   - [Body Classes and Configuration](#body-classes-and-configuration)
   - [Presentation Timer](#presentation-timer)
8. [Testing and Quality](#testing-and-quality)
9. [Project Structure](#project-structure)
10. [Environment Variables and NPM Scripts](#environment-variables-and-npm-scripts)

---

## Overview

This template lets you build and deliver accessible HTML slide presentations with
optional real-time live captions powered by
[Whisper.cpp](https://github.com/ggerganov/whisper.cpp).

Key characteristics:

- **No build step.** Open `index.html` directly in a browser.
- **Local-first captioning.** Live captions require a local server process.
  They do not work on GitHub Pages or other static hosts.
- **Test-driven.** HTML validation, link checking, spell checking, and
  accessibility audits run with `npm test`.
- **WCAG 2.2 AA.** Accessibility is a first-class requirement, not an add-on.

---

## Presentation Framework (B6+)

The slides are powered by [B6+](https://www.w3.org/Talks/Tools/b6plus/), a
W3C-developed JavaScript framework included in `slides/b6plus.js`.
It has two primary display modes: **index mode** (the default) and
**slide mode** (full-screen presentation).

### Index (Audience) View

When you open `index.html` in a browser you see the **index view**: all slides
are listed on the page, one after the other, styled with a dark background and
light text. This view is useful for:

- Reading or sharing the deck without presenting it.
- Linking to a specific slide via its `#id` anchor.
- Reviewing speaker notes (toggle with `C`).

In index mode you can see the slide thumbnail, any speaker notes (press `C` to
show or hide them), and a slide count. The Alt/Option key temporarily shows the
URL of each slide so you can copy a direct link.

### Slide (Presentation) Mode

Press `A`, double-click a slide, or tap three fingers on a touch screen to enter
**slide mode**. The browser fills the viewport with a single slide, scaled to
fit. Navigation controls appear in a thin UI bar at the top of the page.

The `body` element gains the class `full` when slide mode is active. CSS rules
scoped to `body.full` apply slide-mode-only styles (such as padding to
accommodate the live caption bar).

Add `?full` to the URL to open the presentation already in slide mode:

```
index.html?full
```

Press `F` or `F1` to toggle fullscreen inside slide mode. A fullscreen-fix
script (`slides/fullscreen-fix.js`) silently swallows `NotAllowedError` so
the first interaction on a page does not produce an error dialog.

### Presenter View — The Second Window

The B6+ framework supports a **two-window presenter setup**:

| Window | What you see |
|--------|-------------|
| First window (your screen) | Index view with speaker notes and slide preview |
| Second window (projector / audience screen) | Single slide in full slide mode |

**How to open the second window:**

1. With the first window in index mode, press `2`.
2. A second browser window opens, automatically entering slide mode.
3. Navigate slides from either window — they stay in sync.

**How it works:** The two windows communicate via `postMessage`. When you press
a navigation key in the first window, that keypress is forwarded to the second
window (and vice versa). Timers, dark mode, and pause/resume events are also
mirrored.

**Presenter workflow:**

1. Open `index.html` on your laptop.
2. Press `2` — the slide window opens.
3. Drag the slide window to the projector screen and make it fullscreen with `F`.
4. Your laptop shows the index/preview view with notes. The audience sees the
   slide window.

### Keyboard and Mouse Navigation

Press `?` at any time to display the interactive help popup with all shortcuts.

| Key / Gesture | Action |
|---|---|
| `A` | Toggle between index mode and slide mode |
| `Space`, `→`, `↓`, click | Next slide or reveal next incremental element |
| `←`, `↑` | Previous slide (or hide last revealed incremental element) |
| `Page Down` | Next slide (skips incremental steps) |
| `Page Up` | Previous slide (skips incremental steps) |
| `Home` | First slide |
| `End` | Last slide |
| `F` or `F1` | Toggle fullscreen (in slide mode) |
| `2` | Open slides in a second window (from index mode) |
| `C` | Table of contents (in slide mode) / show-hide notes (in index mode) |
| `D` | Toggle dark mode |
| `W` | Start/stop drawing on the slide |
| `S` | Toggle sync mode on/off (requires sync server) |
| `P` or media-play key | Pause/resume automatic slide show |
| `Esc` | Leave slide mode |
| `?` | Show keyboard/mouse help |
| `Alt` / `Option` | Show the URL of each slide (index mode only) |
| Swipe left | Next slide (touch screens) |
| Swipe right | Previous slide (touch screens) |
| 3-finger tap | Toggle slide mode (touch screens) |

### Progressive Disclosure

Add the class `emerge` to a list to make it a **step-by-step reveal** list.
Mark items that should be hidden initially with the class `next`:

```html
<ul class="emerge">
  <li>This point is visible immediately.</li>
  <li class="next">This point appears on the first click.</li>
  <li class="next">This point appears on the second click.</li>
</ul>
```

Each press of `Space`, `→`, or `↓` reveals the next item. Past items receive
the class `visited`; the current item receives `active`.

Pressing `←` or `↑` hides the most recently revealed item. When all items
have been visited, the next press advances to the following slide.

### Table of Contents

Press `C` in slide mode to open a **table of contents** dialog. The dialog
lists all slides and their `aria-label` values. Clicking a row jumps to that
slide.

### Automatic Slide Show

Set a `data-timing` attribute on individual slides to control how long (in
seconds) B6+ waits before advancing automatically:

```html
<section class="slide" data-timing="10" aria-label="Auto-advancing Slide">
  <h2>This slide advances after 10 seconds</h2>
</section>
```

Press `P` (or the media-play key) to pause/resume the automatic advance.

### Sync Mode

If you configure a sync server URL, press `S` to toggle **sync mode**. In sync
mode all connected clients navigate together. This is useful for broadcasting
a presentation to remote viewers.

### Dark Mode

Press `D` in slide mode to toggle **dark mode**. The CSS stylesheet includes a
`darkmode` class with matching custom property overrides, and also responds
automatically to the `prefers-color-scheme: dark` media query.

### Annotation (Drawing)

Press `W` in slide mode to toggle freehand drawing mode. You can sketch directly
on top of a slide using the mouse or stylus to highlight or annotate content
live during a presentation.

---

## Slide Structure and Layouts

Every slide is a `<section class="slide">` element inside `<main>` in
`index.html`. A slide must have an `aria-label` attribute for screen reader
navigation.

### Cover Slide

```html
<section class="slide cover clear" id="cover" aria-label="Cover: Presentation Title">
  <h1>Presentation Title</h1>
  <h2>Subtitle or Tagline</h2>
  <address>Speaker Name / Organization</address>
  <div class="notes" hidden>Speaker notes for the opening.</div>
</section>
```

Key rules:
- Only **one** `<h1>` per presentation, on the cover slide.
- `class="cover"` applies the cover background image.
- `class="clear"` removes the slide number counter.

### Content Slide

```html
<section class="slide" id="my-slide" aria-label="My Slide Title">
  <h2>My Slide Title</h2>
  <ul>
    <li>First point</li>
    <li>Second point</li>
  </ul>
  <div class="notes" hidden>
    <p>What to say here…</p>
  </div>
</section>
```

Use `<h2>` for every non-cover slide title. Never skip heading levels.

### Two-Column Layout

```html
<div class="columns">
  <div>
    <h3>Left Column</h3>
    <p>Left side content</p>
  </div>
  <div>
    <h3>Right Column</h3>
    <p>Right side content</p>
  </div>
</div>
```

### Shout / Emphasis Slide

```html
<p class="shout">Big Important Message</p>
```

`class="shout"` renders the text very large, centered on the slide — useful
for key takeaways or transitions.

### Speaker Notes

```html
<div class="notes" hidden>
  <p>Detailed notes only visible in presenter/index mode.</p>
  <p>Include full URLs: https://example.com/resource</p>
</div>
```

Notes are hidden in slide mode and visible in index mode (toggle with `C`).
Only one notes block per slide is supported.

---

## Accessibility Features

Accessibility is designed in from the start, following WCAG 2.2 AA.

### Semantic HTML and Heading Order

- **One `<h1>`** per deck, on the cover slide only.
- **`<h2>`** for every content slide title.
- **`<h3>`** for sub-headings within a slide.
- Never skip heading levels (e.g., from `<h2>` directly to `<h4>`).
- Use proper semantic elements: `<ul>`, `<ol>`, `<code>`, `<address>`,
  `<section>`, `<article>`.

The `test:headings` script (`scripts/test-heading-order.js`) validates heading
order automatically.

### ARIA Labelling

Every slide must have an `aria-label` attribute:

```html
<section class="slide" aria-label="Setup Instructions">
```

This label appears in the B6+ table of contents and is announced by screen
readers when navigating between slides.

The presentation also includes:

- `<aside class="progress" aria-label="Presentation progress">` — progress bar.
- `<aside class="clock" aria-label="Presentation timer">` — elapsed/remaining
  time counter.
- `<section aria-live="assertive" aria-label="Slide mode status">` — announces
  when the user enters or leaves slide mode.

### Live Regions

The framework uses two ARIA live regions:

| Element | Role | Purpose |
|---------|------|---------|
| `<section aria-live="assertive">` | Status messages | Announces mode changes to screen readers |
| `.live-caption-display` (dynamic) | `aria-live="polite"` | Speaks new caption text as it arrives |

The caption display also has `aria-atomic="false"` so screen readers only
announce the new text, not the entire element.

### Keyboard Accessibility

All interactive elements are reachable by keyboard:

- Slides are navigated with arrow keys, `Space`, `Home`, and `End`.
- The UI bar buttons (fullscreen, captions, etc.) are proper `<button>`
  elements with descriptive `title` attributes.
- Modal dialogs (help popup, table of contents) trap focus and close on
  `Escape`.
- The caption button and its help dialog are keyboard-operable.

### Color and Contrast

The stylesheet defines a full set of CSS custom properties for both light and
dark modes, meeting WCAG 2.2 AA contrast ratios (4.5:1 for normal text,
3:1 for large text):

| Mode | Background | Foreground | Ratio |
|------|-----------|-----------|-------|
| Light | `#ffffff` | `#171717` | > 12:1 |
| Dark | `#171717` | `#f0f0f0` | > 12:1 |

Link colors (`--link-fg: #0066cc` in light mode, `#73B3E7` in dark mode) are
also contrast-compliant against their backgrounds.

The presentation **never relies on color alone** to convey meaning.

Run the automated contrast check:

```bash
python3 -m http.server 8000 &
npm run test:a11y
```

### Screen Reader Compatibility

- All images require `alt` text; decorative images use `alt=""`.
- Code samples use `<code>` (inline) and `<pre><code>` (blocks).
- Speaker notes hidden with the `hidden` attribute are still accessible to
  screen readers in index mode.
- The B6+ engine adds `role="application"` to the slide area in slide mode
  so keyboard events are not intercepted by the browser's virtual cursor.

### Offline Indicator

`slides/offline-indicator.js` monitors network connectivity by periodically
sending a `HEAD` request to the current page. When connectivity is lost, it
adds the class `offline` to `<body>`. Speaker notes blocks receive a visible
`offline` badge so the presenter knows the network is down without leaving
slide mode.

---

## Whisper Integration

### How It Works

The captioning system has three independent parts that communicate through a
single JSON file:

```
Whisper.cpp          transcript.json         Browser
(microphone) ──────► whisper-demo/       ──► caption display
  binary               transcript.json        (polled every 2s)
```

1. **`run-whisper.js`** (Node.js script) launches the `whisper-stream`
   binary, captures its stdout, and writes the current transcript to
   `whisper-demo/transcript.json`.
2. **The browser** polls `whisper-demo/transcript.json` every 2 seconds via
   `fetch()`. No WebSocket or server-sent events are needed.
3. **`captions-button.js`** reads the JSON, decides if Whisper is active,
   and updates the caption display at the bottom of the screen.

The JSON file format is:

```json
{
  "text": "The spoken text accumulated so far.",
  "generated": "2026-03-21T15:00:00.000Z",
  "active": true
}
```

- `text` — Accumulated transcript text. The browser shows the last ~30 words.
- `generated` — ISO timestamp of when the file was last written. Used to
  detect whether Whisper is still running (stale if older than 10 seconds).
- `active` — Optional explicit flag; takes priority over the timestamp check.

> **Why local only?**  
> `whisper-stream` is a native binary that reads from the microphone and writes
> to the local filesystem. Static hosting platforms (GitHub Pages, Netlify,
> etc.) cannot run native binaries or provide filesystem access.

### GitHub Pages / Cloud Alternatives

If you need live captions on GitHub Pages or another static host, these options
avoid the need for a local binary:

| Option | How it works | Static hosting? | Quality | Setup |
|--------|-------------|-----------------|---------|-------|
| **Web Speech API** | Browser built-in (Chrome/Edge) | ✅ Yes | Good | None |
| **Whisper WASM** | Whisper in WebAssembly, runs in browser | ✅ Yes (HTTPS + CORS) | High | Medium |
| **VibeVoice** | Browser-based voice transcription | ✅ Yes | Untested | Low |
| **Cloud API proxy** | OpenAI / Azure / AssemblyAI + proxy | ⚠️ Needs proxy | High | Medium–High |

#### Web Speech API

The [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
(`SpeechRecognition`) is built into Chrome and Edge. It requires no install,
works over HTTPS, and is compatible with static hosting including GitHub Pages.
Because the API exposes transcript text directly to JavaScript, the output can
be formatted to match the `whisper-demo/transcript.json` schema so the existing
caption display picks it up without any other changes to the presentation.
Firefox does not support `SpeechRecognition` natively.

#### Whisper WASM

The `whisper-demo/` directory has a placeholder for a
[WebAssembly build of Whisper.cpp](https://whisper.ggerganov.com). The model
runs entirely in the browser: no audio is sent to any server. Requirements:

- HTTPS origin (GitHub Pages qualifies).
- The model file (75 MB – 1.5 GB depending on model) must be served from the
  same origin or a CORS-enabled origin.
- WebAssembly + SharedArrayBuffer support (check
  [MDN compatibility tables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#browser_compatibility)
  for current minimum versions).

#### VibeVoice

[VibeVoice](https://github.com/mgifford/whisper-slides/issues/1) is a
browser-first voice-transcription tool that has been mentioned as a candidate
for static-hosting captioning. It has not been tested with this project; see
[issue #1](https://github.com/mgifford/whisper-slides/issues/1) for discussion.

#### Cloud Speech API Proxy

Services such as the [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text),
[Azure Cognitive Services Speech](https://azure.microsoft.com/en-us/products/ai-services/speech-to-text),
and [AssemblyAI](https://www.assemblyai.com/) offer high-accuracy cloud
transcription. Key considerations:

- **API key security**: Never expose API keys in client-side JavaScript or
  commit them to a public repository.
- **Proxy required**: A small server-side proxy (Cloudflare Worker, Vercel Edge
  Function, or a Node.js server) forwards audio to the API and writes the JSON
  transcript to a public endpoint.
- The presentation polls that endpoint the same way it polls
  `whisper-demo/transcript.json` today — no changes to the browser code needed.

### Setup Guide

#### 1. Install SDL2 (audio capture library)

```bash
# macOS
brew install sdl2

# Ubuntu / Debian
sudo apt-get install libsdl2-dev
```

#### 2. Build Whisper.cpp

```bash
cd whisper.cpp
cmake -B build -DWHISPER_SDL2=ON
cmake --build build --config Release
```

The compiled binary will be at `whisper.cpp/build/bin/whisper-stream`.

#### 3. Download a Model

```bash
cd whisper.cpp
bash ./models/download-ggml-model.sh base.en
```

Recommended models:

| Model | Size | Speed | Accuracy |
|-------|------|-------|----------|
| `tiny.en` | ~75 MB | Fastest | Lower |
| `base.en` | ~142 MB | Fast | Good (recommended) |
| `small.en` | ~466 MB | Moderate | Better |
| `medium.en` | ~1.5 GB | Slow | High |

#### 4. Install Node.js Dependencies

```bash
npm install
```

### Running the Caption System

#### Option A — Full Whisper.cpp Integration

```bash
npm run dev:whisper
```

This runs `scripts/run-whisper.js`, which:

1. Looks for the `whisper-stream` binary at:
   - The path in the `WHISPER_BIN` environment variable, or
   - `whisper.cpp/build/bin/whisper-stream` (default).
2. Looks for the model at:
   - The path in the `WHISPER_MODEL` environment variable, or
   - `whisper.cpp/models/ggml-base.en.bin` (default).
3. Passes `--step` and `--length` flags for streaming window size
   (defaults: 500 ms step, 5000 ms context length).
4. Writes transcript updates to `whisper-demo/transcript.json`.

Override defaults with environment variables:

```bash
WHISPER_BIN=/path/to/whisper-stream \
WHISPER_MODEL=/path/to/ggml-small.en.bin \
WHISPER_THREADS=4 \
npm run dev:whisper
```

Or pass flags directly:

```bash
npm run dev:whisper -- --step 250 --length 8000
```

#### Option B — Text File Watcher (for testing)

```bash
npm run dev:transcript
```

This runs `scripts/whisper-transcript-watch.js`, which watches a plain-text
file (`transcript.txt` by default) and mirrors its contents to
`whisper-demo/transcript.json`. Useful for testing the caption display without
building Whisper.cpp.

### Caption Display

When Whisper is running, a dark caption bar appears at the bottom of each slide
during slide mode (class `body.full`):

- The bar is always positioned at the very bottom of the viewport with
  `position: fixed`.
- It shows the most recent ~30 words of the transcript.
- Text persists when you advance to the next slide so slow readers can finish.
- ANSI escape codes and `[BLANK_AUDIO]` markers are stripped from the raw
  Whisper output before display.
- The bar is hidden in index mode (`body:not(.full)`) to avoid cluttering the
  slide list.
- The slide area gains `padding-bottom: 5em` in slide mode so content is never
  obscured by the caption bar.

### Caption Status Button

The caption button appears in the B6+ UI bar at the top of the page.

| State | Indicator | Tooltip |
|-------|-----------|---------|
| Whisper running | 🟢 green circle | "Captions On: Whisper transcript available" |
| Whisper not running | ⏺ grey circle | "Captions Off: Click for help" |

Clicking the button opens a modal dialog:

- **When Whisper is running:** Shows keyboard shortcuts for caption control and
  tips for best captioning results.
- **When Whisper is not running:** Shows step-by-step setup instructions.

The button is a standard `<button>` element with an `aria-live="polite"` region
so screen readers announce status changes.

### Transcript Polling

Two polling mechanisms run in parallel:

| Script | Element | Interval | Purpose |
|--------|---------|----------|---------|
| `captions-button.js` | `.live-caption-display` | 2 s | Bottom-of-screen caption bar |
| `whisper-transcript.js` | `#whisper-transcript` | 1 s | In-slide transcript box (demo slides) |

Both scripts:

- Use `fetch()` with `cache: 'no-store'` to prevent stale cached responses.
- Degrade gracefully if the JSON file is missing or the fetch fails (they keep
  the last displayed text rather than clearing it).
- Accept either a plain-text response or a JSON object with a `text` property.

`captions-button.js` also detects Whisper activity by checking:

1. `data.active === true` (explicit flag — highest priority).
2. `data.generated` timestamp less than 10 seconds old.
3. The HTTP `Last-Modified` header as a fallback hint.

### Text Size Controls

While in slide mode with captions visible, use these keys to adjust caption size:

| Key | Action |
|-----|--------|
| `=` or `+` | Increase caption text size |
| `-` | Decrease caption text size |

Four sizes are available: `small` (0.9 em), `medium` (1.1 em, default),
`large` (1.4 em), and `xlarge` (1.8 em). The size is stored in the
`data-size` attribute of the `.live-caption-display` element.

### Browser-Based (WebAssembly) Mode

The `whisper-demo/` directory can host a WebAssembly build of Whisper.cpp that
runs entirely in the browser — no native binary required. This is not enabled
by default. See `whisper-demo/index.html` for placeholder instructions.

When a WASM build is present, the Whisper model is downloaded to the browser
and runs locally. No audio data is sent to any server.

---

## Supporting Features

### Fullscreen Fix

`slides/fullscreen-fix.js` must be loaded **after** `b6plus.js`. It patches
`window.toggleFullscreen` to silently swallow `NotAllowedError` exceptions,
which browsers throw when a fullscreen request is blocked (e.g., on first page
load before any user gesture, or on static hosting). Without this fix, B6+
would show an `alert()` dialog that interrupts the presentation.

The script also suppresses `window.alert` calls that contain the string
`"fullscreen"` and `"NotAllowedError"` for defensive coverage.

### Footer Overlap Detector

`slides/footer-overlap-detector.js` checks every slide for visual overlap
between the footer element (`.ca-footer`) and slide content. When overlap is
detected it adds the class `hide-footer-text` to that slide, hiding the footer
text. This runs:

- On page load.
- On `resize` (debounced to 150 ms).
- On the `slidechange` event fired by B6+.
- Once more 500 ms after load (to catch dynamically loaded content).

### Seeded SVG Backgrounds

`slides/seeded-svgs.js` draws decorative SVG shapes in the background of each
slide. Shapes are generated deterministically from a seed derived from the
page URL and slide number, so the decoration is stable across reloads.

Configure it in `index.html` before the script tag:

```html
<script>
window.SeededSVG = {
  density: 20,
  colors: ["#1a1a1a", "#0066cc", "#73B3E7"],
  opacityRange: [0.05, 0.15],
  shapes: { circles: true, lines: false, blobs: false }
};
</script>
<script src="slides/seeded-svgs.js" defer></script>
```

Available options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `density` | number | `24` | Number of shapes per slide |
| `layers` | number | `3` | Number of stacked shape layers |
| `colors` | string[] | Multi-color | Fill/stroke colors |
| `opacityRange` | [min, max] | `[0.08, 0.22]` | Opacity range for shapes |
| `strokeWidthRange` | [min, max] | `[1, 3]` | Stroke width range |
| `shapes.circles` | boolean | `true` | Enable circle shapes |
| `shapes.triangles` | boolean | `true` | Enable triangle shapes |
| `shapes.lines` | boolean | `true` | Enable line shapes |
| `shapes.confetti` | boolean | `true` | Enable confetti shapes |
| `shapes.blobs` | boolean | `true` | Enable blob shapes |
| `avoidCenter` | boolean | `true` | Keep center clear for content |
| `centerAvoidRadius` | number | `0.22` | Fraction of slide width to keep clear |
| `zIndex` | number | `0` | CSS z-index for the SVG layer |

SVGs are rendered as inline SVG elements inserted at the start of each slide
(`afterbegin`), so they sit behind slide content.

---

## Theming and Customization

### CSS Custom Properties

All colors are defined as CSS custom properties in `slides/slides.css`. Edit
them to rebrand the presentation:

```css
html, .lightmode {
  --slide-bg:    #ffffff;   /* Slide background */
  --slide-fg:    #171717;   /* Slide text */
  --link-fg:     #0066cc;   /* Hyperlink color */
  --visited-fg:  #004080;   /* Visited link color */
  --h3-fg:       #0066cc;   /* h3 heading color */
  --code-bg:     #F0F0F0;   /* Inline code background */
  --em-bg:       #FFBC78;   /* Highlighted/emphasized background */
  --index-bg:    #1a1a1a;   /* Index-mode page background */
  --index-fg:    #ffffff;   /* Index-mode text color */
  --cover-bg:    #F0F0F0;   /* Cover slide background */
  --note-bg:     #eef2f6;   /* Speaker notes background */
  --note-border: #c7d1dc;   /* Speaker notes border */
}
```

Dark-mode overrides live inside `@media (prefers-color-scheme: dark)` and can
also be forced with `class="darkmode"` on `<html>`.

### Body Classes and Configuration

The `<body>` element uses space-separated classes to configure the framework:

```html
<body class="shower fade-in duration=30 warn=5 hidemouse">
```

| Class / Attribute | Meaning |
|---|---|
| `shower` | Required: activates the B6+ framework |
| `fade-in` | Smooth fade transition between slides |
| `duration=N` | Total presentation time in minutes (default: 30) |
| `warn=N` | Warn when N minutes remain (default: 5) |
| `hidemouse` | Hide the cursor after a short delay in slide mode |
| `full` | Added automatically when in slide mode |
| `time-warning` | Added automatically when time is low |
| `offline` | Added by offline-indicator.js when network is lost |

### Presentation Timer

The `<aside class="clock">` element shows elapsed and remaining time. It
reads `duration=N` from `body.class`.

Controls in the clock widget (visible in the B6+ UI bar):

| Button | Action |
|--------|--------|
| Pause/Resume | Pause or resume the countdown |
| −1 | Subtract one minute from the total |
| +1 | Add one minute to the total |
| ↺ | Reset the timer to the configured duration |

---

## Testing and Quality

This project uses automated tests to enforce HTML correctness, accessibility,
link integrity, spelling, and CSS syntax. Run all checks with:

```bash
npm install   # First time only
npm test
```

Individual test suites:

| Command | Tool | What it checks |
|---------|------|----------------|
| `npm run test:html` | html-validate | Semantic HTML, ARIA, proper nesting, required attributes |
| `npm run test:landmarks` | custom shell script | Presence of required landmark elements |
| `npm run test:links` | custom shell script | All local `href`/`src` paths exist |
| `npm run test:spell` | CSpell | Spelling in HTML, Markdown, JS, and CSS |
| `npm run test:css` | custom shell script | CSS brace balance and common syntax errors |
| `npm run test:a11y` | Pa11y | WCAG 2 AA automated audit (requires local server) |
| `npm run test:headings` | custom Node.js script | Heading level order (no skipped levels) |

Add technical terms that are not common English words to
`cspell/project-terms.txt` to prevent false spell-check failures.

For the accessibility audit (`test:a11y`), start a local HTTP server first:

```bash
python3 -m http.server 8000 &
npm run test:a11y
```

See [TESTING.md](TESTING.md) for detailed guidance on each test suite.

---

## Project Structure

```
whisper-slides/
├── index.html                    # Main presentation file (edit this)
├── slides/
│   ├── slides.css                # All styles — theming, layouts, captions
│   ├── b6plus.js                 # B6+ presentation engine (do not edit)
│   ├── captions-button.js        # Caption status button and live display
│   ├── whisper-transcript.js     # In-slide transcript box polling
│   ├── fullscreen-fix.js         # Suppress fullscreen error dialogs
│   ├── offline-indicator.js      # Network connectivity monitor
│   ├── footer-overlap-detector.js# Hide footer when it overlaps content
│   └── seeded-svgs.js            # Deterministic decorative SVG backgrounds
├── whisper-demo/
│   ├── index.html                # Whisper WASM demo placeholder
│   └── transcript.json           # Runtime output — gitignored
├── whisper.cpp/                  # Git submodule (Whisper.cpp source)
├── scripts/
│   ├── run-whisper.js            # Start Whisper.cpp and write transcript JSON
│   ├── whisper-transcript-watch.js # Mirror text file to transcript JSON
│   ├── check-links.sh            # Local link integrity checker
│   ├── validate-css.sh           # CSS syntax checker
│   ├── test-heading-order.js     # Heading level order validator
│   ├── test-landmarks.sh         # Landmark presence checker
│   └── check-main-landmark.sh    # Main landmark checker
├── cspell/
│   └── project-terms.txt         # Custom spell-check dictionary
├── package.json                  # NPM scripts and dev dependencies
├── .htmlvalidate.json            # html-validate configuration
├── .pa11yci.json                 # Pa11y configuration
└── cspell.json                   # CSpell configuration
```

---

## Environment Variables and NPM Scripts

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WHISPER_BIN` | `whisper.cpp/build/bin/whisper-stream` | Path to the compiled whisper-stream binary |
| `WHISPER_MODEL` | `whisper.cpp/models/ggml-base.en.bin` | Path to the Whisper GGML model file |
| `WHISPER_THREADS` | CPU count − 1 | Thread count for Whisper inference |
| `WHISPER_STEP` | `500` | Audio step size in milliseconds |
| `WHISPER_LENGTH` | `5000` | Audio context window length in milliseconds |

### NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:whisper` | Launch Whisper.cpp and write live transcript to JSON |
| `npm run dev:transcript` | Watch a text file and mirror it to transcript JSON |
| `npm test` | Run all automated quality checks |
| `npm run test:html` | HTML structure and semantics validation |
| `npm run test:landmarks` | Check for required landmark elements |
| `npm run test:links` | Check for broken local file references |
| `npm run test:spell` | Spell check all content |
| `npm run test:css` | CSS syntax validation |
| `npm run test:a11y` | Accessibility audit (requires local HTTP server) |
| `npm run test:headings` | Heading level order check |
| `npm run test:all` | Alias for all tests except `test:a11y` |
