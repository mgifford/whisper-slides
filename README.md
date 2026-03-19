# Whisper Live Captioning Presentation Template

An accessible HTML presentation template with real-time live captioning powered by [Whisper.cpp](https://github.com/ggerganov/whisper.cpp). This is a standalone, test-driven presentation you can use as a starting point for creating your own presentations with live transcription.

The transcripts will only work when running locally, and not on GitHub Pages where this project is hosted. 

## ✨ Features

- **Accessible HTML slides** using the [B6+ framework](https://www.w3.org/Talks/Tools/b6plus/)
- **Real-time live captioning** with Whisper.cpp speech recognition (**local only** - see note below)
- **Standalone and portable** - no build system required, just open `index.html` in a browser
- **Test-driven** - includes scripts to validate links and accessibility
- **Keyboard navigation** - full presentation control without a mouse
- **Responsive design** - works on desktop and mobile devices

> **⚠️ Important**: Live captioning with Whisper.cpp only works when running locally on your machine. It **will not work** on GitHub Pages or other static hosting because it requires a local server process with microphone access. The presentation slides themselves work fine on GitHub Pages, but without live captions.

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

**For GitHub Pages deployment**: You can view the presentation at `https://mgifford.github.io/whisper-slides/` but live captioning will not be available (local-only feature).

### 3. (Optional) Enable Live Captioning

**Note**: Live captioning only works when running the presentation locally, not on GitHub Pages or other static hosting.

To enable real-time live captioning:

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
│   ├── captions-button.js  # Live caption controls
│   └── whisper-transcript.js # Transcript polling
├── whisper-demo/           # Demo assets and transcript output
│   ├── index.html          # Whisper web demo (optional)
│   └── transcript.json     # Generated transcript (gitignored)
├── whisper.cpp/            # Git submodule for live captioning
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
**Used during development**: Yes. GitHub Copilot (powered by large language models) was used as a coding assistant to help write code, scripts, documentation, and configuration files in this repository.  
**Used at runtime**: No. GitHub Copilot is a developer tool only; it does not run when users view or use the presentation.  
**Browser-based AI**: No.

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
- Created by [Mike Gifford](https://ox.ca)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
