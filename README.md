# Whisper Live Captioning Presentation Template

An accessible HTML presentation template with real-time live captioning powered by [Whisper.cpp](https://github.com/ggerganov/whisper.cpp). This is a standalone, test-driven presentation you can use as a starting point for creating your own presentations with live transcription.

## ✨ Features

- **Accessible HTML slides** using the [B6+ framework](https://www.w3.org/Talks/Tools/b6plus/)
- **Real-time live captioning** with Whisper.cpp speech recognition
- **Standalone and portable** - no build system required, just open `index.html` in a browser
- **Test-driven** - includes scripts to validate links and accessibility
- **Keyboard navigation** - full presentation control without a mouse
- **Responsive design** - works on desktop and mobile devices

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/whisper-demo-presentation.git
cd whisper-demo-presentation

# Initialize the whisper.cpp submodule
git submodule update --init --recursive
```

### 2. View the Presentation

Simply open `index.html` in your web browser. The presentation works without any build step!

### 3. (Optional) Enable Live Captioning

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
whisper-demo-presentation/
├── index.html              # Main presentation file
├── ca-slides/              # Presentation framework (B6+)
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
2. **Customize styling**: Edit `ca-slides/slides.css` or add your own CSS
3. **Add your content**: Replace the demo slides with your own
4. **Test accessibility**: Run `npm run test:accessibility` (requires npm install)

## 🧪 Testing

```bash
# Install dependencies first
npm install

# Check for broken links
npm run test:links

# Run all quality checks
npm test
```

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
