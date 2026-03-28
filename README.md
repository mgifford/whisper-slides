# Whisper Live Captioning Presentation Template

An accessible HTML presentation template with real-time live captioning. Two captioning options are supported:

- **Web Speech API** — works directly in Chrome or Edge, including on [GitHub Pages](https://mgifford.github.io/whisper-slides/), with no installation needed.
- **Whisper.cpp** — a high-accuracy local speech recognition binary that runs offline on your machine.

This is a standalone, test-driven presentation you can use as a starting point for creating your own presentations with live transcription.

## ✨ Features

- **Accessible HTML slides** using the [B6+ framework](https://www.w3.org/Talks/Tools/b6plus/)
- **Browser-based live captioning** with the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — works on GitHub Pages in Chrome and Edge, no install needed
- **High-accuracy local captioning** with [Whisper.cpp](https://github.com/ggerganov/whisper.cpp) when running on your own machine
- **Standalone and portable** - no build system required, just open `index.html` in a browser
- **Test-driven** - includes scripts to validate links and accessibility
- **Keyboard navigation** - full presentation control without a mouse
- **Responsive design** - works on desktop and mobile devices

See [FEATURES.md](FEATURES.md) for exhaustive documentation of all features, including accessibility details, the presenter/audience view, Whisper integration, and customization options.

See [EVENTS.md](EVENTS.md) for a practical guide to deploying live captions at conferences, camps, and meet-ups — including room setup, volunteer responsibilities, and lessons from the [MidCamp live-captioning project](https://github.com/MidCamp/live-captioning).

> **ℹ️ Note**: The **Web Speech API** works directly in Chrome and Edge — including on [GitHub Pages](https://mgifford.github.io/whisper-slides/) — and requires no installation. The **Whisper.cpp** local binary offers higher accuracy but only works when running locally on your machine. The presentation slides themselves work in any browser.

## 🌐 GitHub Pages Alternatives

If you need live captioning on GitHub Pages or another static host, several alternatives work without a local binary:

| Option | How it works | Works on static hosting? | Quality | Setup effort |
|--------|-------------|--------------------------|---------|--------------|
| **Web Speech API** | Built into Chrome and Edge; no installation | ✅ Yes | Good (browser-dependent) | None |
| **Whisper WASM** | Whisper model compiled to WebAssembly; runs in browser | ✅ Yes (needs HTTPS + CORS) | High (same model as local) | Medium |
| **VibeVoice** | Browser-based voice-notes tool | ✅ Yes | Untested | Low |
| **Cloud API proxy** | OpenAI Whisper API / Azure Speech / AssemblyAI via a small server | ⚠️ Needs a proxy server | High | Medium–High |

### Web Speech API

The [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) (`SpeechRecognition`) is built into Chrome and Edge. It requires no installation, runs over HTTPS, and works on GitHub Pages. Firefox does not support it natively.

**How to use:**

1. Open the presentation in Chrome or Edge.
2. Click the **captions** button in the toolbar.
3. Choose **Start Web Speech Captions** in the dialog.
4. Allow microphone access when prompted — transcription begins immediately.

The integration (`slides/webspeech-captions.js`) uses continuous recognition with interim results so words appear in real time. When Web Speech is active, the Whisper JSON poll is paused so the two sources do not conflict. Accuracy depends on the browser's built-in speech engine.

### Whisper WASM (Browser-Based)

The `whisper-demo/` directory has a placeholder for a [WebAssembly build of Whisper.cpp](https://whisper.ggerganov.com). When a WASM build is present the Whisper model is downloaded to the browser and runs entirely on-device — no audio is sent to any server. This approach works on static hosting but requires HTTPS and serving the model file (tens to hundreds of MB) from a CORS-enabled origin.

### VibeVoice

[VibeVoice](https://github.com/mgifford/whisper-slides/issues/1) is a browser-first voice-transcription tool. It has not been fully tested with this project, but it is a candidate for static-hosting captioning. See [issue #1](https://github.com/mgifford/whisper-slides/issues/1) for the current discussion.

### Cloud Speech API Proxy

Services such as the [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text), [Azure Cognitive Services Speech](https://azure.microsoft.com/en-us/products/ai-services/speech-to-text), and [AssemblyAI](https://www.assemblyai.com/) offer high-accuracy transcription over HTTPS. They require:

1. An API key (keep it secret — never commit it to a public repo).
2. A small server-side proxy (e.g., a Cloudflare Worker, Vercel Edge Function, or simple Node.js server) that forwards audio to the API and writes the result to a publicly readable endpoint.
3. The presentation polls that endpoint the same way it polls `whisper-demo/transcript.json` today.

This is the most accurate option for cloud deployment but requires the most setup.

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mgifford/whisper-slides.git
cd whisper-slides

# Initialize the whisper.cpp submodule
git submodule update --init --recursive
```

### 2. View the Presentation

Simply open `index.html` in your web browser. The presentation works without any build step!

**On GitHub Pages**: You can view and use the presentation at `https://mgifford.github.io/whisper-slides/`. The Web Speech API captions work there too — open the presentation in Chrome or Edge and click the captions button.

### 3. (Optional) Enable Local Captioning with Whisper.cpp

**Note**: Whisper.cpp captioning only works when running the presentation locally, not on GitHub Pages or other static hosting. For browser-based captioning, use the Web Speech API option described above — it works everywhere.

#### Build Whisper.cpp

```bash
cd whisper.cpp

# Install SDL2 (required for microphone capture)
brew install sdl2  # macOS
# or: apt-get install libsdl2-dev  # Linux

# Build with CMake
cmake -B build -DWHISPER_SDL2=ON
cmake --build build --config Release
```

#### Download a Whisper Model

```bash
# Download a model (base.en is recommended for English)
cd whisper.cpp
bash ./models/download-ggml-model.sh base.en
```

#### Run the Captioning System

```bash
# Install dependencies
npm install

# Start the live caption system
npm run dev:whisper

# Or use a simpler text-file watcher for testing
npm run dev:transcript
```

The caption system will:
- Capture audio from your microphone using Whisper.cpp
- Write real-time transcription to `whisper-demo/transcript.json`
- Update the presentation slides automatically

## 📁 Project Structure

```
whisper-slides/
├── index.html              # Main presentation file
├── slides/                 # Presentation framework (B6+)
│   ├── slides.css          # Styling
│   ├── b6plus.js           # Core presentation engine
│   ├── captions-button.js  # Live caption controls and status display
│   ├── webspeech-captions.js # Browser-based Web Speech API captions
│   └── whisper-transcript.js # Transcript polling (local Whisper.cpp)
├── whisper-demo/           # Demo assets and transcript output
│   ├── index.html          # Whisper web demo (optional)
│   └── transcript.json     # Generated transcript (gitignored)
├── whisper.cpp/            # Git submodule for local live captioning
└── package.json            # NPM scripts for development
```

## 🎯 Using This as a Template

1. **Edit the slides**: Modify `index.html` to create your presentation content
2. **Customize styling**: Edit `slides/slides.css` or add your own CSS
3. **Add your content**: Replace the demo slides with your own
4. **Test accessibility**: Run `npm run test:accessibility` (requires npm install)

## 🧪 Testing

This project follows **test-driven development (TDD)** principles. All code changes should be validated with automated tests before committing.

```bash
# Install test dependencies first
npm install

# Run all tests (HTML validation, link checking, spell checking, CSS)
npm test

# Run individual test suites
npm run test:html      # Validate HTML structure and accessibility
npm run test:links     # Check for broken links
npm run test:spell     # Spell check all content
npm run test:css       # Validate CSS syntax
npm run test:a11y      # Accessibility audit (requires local server)
```

### Test Categories

- **HTML Validation**: Checks semantic HTML, ARIA usage, and proper nesting
- **Link Checking**: Verifies all local file references exist
- **Spell Checking**: Validates spelling in content and code
- **CSS Validation**: Checks for syntax errors and common issues
- **Accessibility**: Automated WCAG 2 AA compliance checks

See [AGENTS.md](AGENTS.md#testing--quality) for detailed testing guidance and TDD workflow.

### Continuous Integration

The project includes a GitHub Actions workflow ([.github/workflows/quality.yml](.github/workflows/quality.yml)) that runs all tests on every push and pull request.

## ⌨️ Keyboard Shortcuts

- `→` / `Space` - Next slide
- `←` - Previous slide
- `Home` - First slide
- `End` - Last slide
- `F` - Fullscreen mode
- `P` - Preview mode (shows notes)
- `C` - Caption controls

## 🔧 Configuration

### Environment Variables

- `WHISPER_BIN` - Path to whisper-stream binary (default: `whisper.cpp/build/bin/whisper-stream`)
- `WHISPER_MODEL` - Path to Whisper model file (default: `whisper.cpp/models/ggml-base.en.bin`)

### NPM Scripts

- `npm run dev:whisper` - Start live captioning with Whisper.cpp
- `npm run dev:transcript` - Mirror a text file to JSON for testing
- `npm test` - Run all quality checks

## 🤖 AI Disclosure

This project is committed to transparency about AI use. The following AI tools have been used in this project.

### GitHub Copilot

**Provider**: GitHub / Microsoft  
**Used during development**: Yes. GitHub Copilot (powered by large language models) was used as a coding assistant to help write code, scripts, documentation, and configuration files in this repository, including the [FEATURES.md](FEATURES.md) feature reference and the Web Speech API integration (`slides/webspeech-captions.js`).  
**Used at runtime**: No. GitHub Copilot is a developer tool only; it does not run when users view or use the presentation.  
**Browser-based AI**: No.

### Browser Web Speech API

**Provider**: Google (Chrome engine); Microsoft (Edge engine)  
**Used during development**: No.  
**Used at runtime**: Yes, when the user clicks **Start Web Speech Captions** in the captions button dialog. The browser's built-in `SpeechRecognition` API captures microphone audio and returns transcript text in real time. All processing happens inside the browser — no audio is sent to the project's servers. This feature requires Chrome or Edge; Firefox does not support `SpeechRecognition`.  
**Browser-based AI**: Yes — the speech-to-text model runs inside the browser engine.

### OpenAI Whisper (via Whisper.cpp)

**Provider**: OpenAI (model); Georgi Gerganov (Whisper.cpp C++ port)  
**Used during development**: No. Whisper itself was not used as a development assistant.  
**Used at runtime**: Yes. When live captioning is enabled, the Whisper speech recognition model runs **locally** on your machine via [Whisper.cpp](https://github.com/ggerganov/whisper.cpp). It transcribes microphone audio to text in real time and writes the output to `whisper-demo/transcript.json`. This is an on-device AI feature — no data is sent to external servers.  
**Browser-based AI**: Optional. The `whisper-demo/` directory can host a WebAssembly (WASM) build of Whisper.cpp, which runs the speech recognition model entirely in the browser. This is not enabled by default; see `whisper-demo/index.html` for setup instructions.

## 📝 License

This template is released under the [GNU AGPLv3](LICENSE) license.

The B6+ presentation framework is from [W3C](https://www.w3.org/Talks/Tools/b6plus/) and has its own license.

Whisper.cpp is from [ggerganov/whisper.cpp](https://github.com/ggerganov/whisper.cpp) and has its own license.

## 🙏 Credits

- Presentation framework: [B6+ by Bert Bos (W3C)](https://www.w3.org/Talks/Tools/b6plus/)
- Speech recognition: [Whisper.cpp by Georgi Gerganov](https://github.com/ggerganov/whisper.cpp)
- Event captioning inspiration: [MidCamp Live Captioning](https://github.com/MidCamp/live-captioning)
- Created by [Mike Gifford](https://ox.ca)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
