# AGENTS.md

Authoring guidance for creating accessible, well-structured presentations with this template.

## Purpose
- Maintain accessible, keyboard-navigable, screen reader-friendly slide decks.
- Use the B6+ framework for consistent structure and presentation flow.
- Support live captioning with Whisper.cpp for inclusive presentations.
- Keep slides simple, clear, and focused on content over decoration.

## Accessibility First

### Structure & Semantics
- **Headings**: Keep headings in order (no skipped levels); one `h1` on the cover slide, `h2` per content slide.
- **ARIA labels**: Each slide should have `aria-label="Slide Title"` for screen reader navigation.
- **Semantic HTML**: Use proper elements (`<section>`, `<article>`, `<ul>`, `<code>`, etc.).
- **Keyboard navigation**: All interactive elements must be keyboard accessible.
- **Link text**: Use clear, descriptive link text; avoid "click here."
- **Images**: Always include `alt` text for images; use empty `alt=""` for decorative images.

### Live Captions
- The template includes automatic live captioning support via Whisper.cpp.
- **Important**: Live captioning only works when running locally - it will not work on GitHub Pages or other static hosting.
- Whisper.cpp requires a local server process with microphone access and file system writes.
- Caption display appears at the bottom of slides when active.
- Use the caption button in the UI to check status and get setup help.
- Test captions before presentations to ensure audio quality.

### Color & Contrast
- All color combinations meet **WCAG 2.2 AA** contrast requirements (4.5:1 for normal text, 3:1 for large text).
- Supports both light and dark modes automatically based on system preference.
- Never rely on color alone to convey information.

### Plain Language (Orwell's 6 Rules)
- Never use a metaphor, simile, or figure of speech you see often in print.
- Never use a long word where a short one will do.
- If you can cut a word out, always cut it out.
- Never use the passive where you can use the active.
- Never use a foreign phrase, scientific term, or jargon if an everyday equivalent exists.
- Break any of these rules sooner than say anything outright barbarous.

## Slide Structure (B6+ Framework)

### Basic Slide Template
```html
<section class="slide" id="slide-id" aria-label="Slide Title">
  <h2>Slide Title</h2>
  <ul>
    <li>First point</li>
    <li>Second point</li>
  </ul>
  <div class="notes" hidden>
    <p>Speaker notes for this slide.</p>
  </div>
</section>
```

### Cover Slide
```html
<section class="slide cover clear" id="cover" aria-label="Cover: Presentation Title">
  <h1>Presentation Title</h1>
  <h2>Subtitle or Tagline</h2>
  <address>Your Name / Organization</address>
  <div class="notes" hidden>Brief description of the talk.</div>
</section>
```

### Progressive Disclosure
Use incremental lists to reveal content step by step:
```html
<ul class="emerge">
  <li>First point (visible immediately)</li>
  <li class="next">Second point (appears on next click)</li>
  <li class="next">Third point (appears on another click)</li>
</ul>
```

### Two-Column Layout
```html
<div class="columns">
  <div>
    <h3>Left Column</h3>
    <p>Content for left side</p>
  </div>
  <div>
    <h3>Right Column</h3>
    <p>Content for right side</p>
  </div>
</div>
```

### Emphasis
```html
<p class="shout">Big Important Message</p>
```

### Speaker Notes
Only one notes block per slide:
```html
<div class="notes" hidden>
  <p>These notes are only visible in presenter mode.</p>
  <p>Include full URLs: https://example.com/resource</p>
</div>
```

## Presentation Controls

### Required Elements
Keep these in the `<body>` for proper presentation functionality:
```html
<aside class="progress" aria-label="Presentation progress"></aside>
<aside class="clock" aria-label="Presentation timer"></aside>
<section aria-live="assertive" aria-label="Slide mode status">Leaving slide mode.</section>
```

### Body Class
```html
<body class="shower fade-in duration=30 warn=5 hidemouse">
```
- `shower` - Activates the B6+ framework
- `fade-in` - Smooth transitions between slides
- `duration=30` - Total presentation time in minutes
- `warn=5` - Warning when 5 minutes remain
- `hidemouse` - Hide cursor during presentation

### Keyboard Shortcuts
- `→` / `Space` - Next slide
- `←` - Previous slide
- `Home` - First slide
- `End` - Last slide
- `F` - Fullscreen mode
- `P` - Preview mode (shows notes)
- `C` - Caption controls

## Content Guidelines

### Typography
- **Headings**: Use sentence case or title case consistently
- **Bullets**: No trailing periods unless the bullet is a full sentence
- **Lists**: Keep structure parallel and concise
- **Code**: Use `<code>` for inline code, `<pre><code>` for code blocks

### Spelling & Language
- Use en-US spelling by default (or en-CA if preferred)
- Spell out acronyms on first use: "Web Content Accessibility Guidelines (WCAG)"
- Prefer literal characters; use HTML entities only when required (`&amp;`, `&lt;`, `&gt;`)

### Voice & Tone
- Write in second person when giving guidance ("You can use...")
- Keep tone direct, welcoming, and accessible
- Focus on practical, actionable content
- Avoid jargon without explanation

## Styling & Customization

### CSS Variables
The template uses CSS custom properties for easy theming:
```css
--slide-bg: #ffffff;
--slide-fg: #171717;
--link-fg: #0066cc;
--h3-fg: #0066cc;
--code-bg: #F0F0F0;
```

Edit `slides/slides.css` to customize colors, fonts, and spacing.

### Background Decorations
The template includes optional seeded SVG backgrounds. Configure in `index.html`:
```javascript
window.SeededSVG = {
  density: 20,
  colors: ["#1a1a1a", "#0066cc", "#73B3E7"],
  opacityRange: [0.05, 0.15],
  shapes: { circles: true, lines: false, blobs: false }
};
```

## Testing & Quality

This project follows **test-driven development (TDD)** principles. Run tests before committing changes.

### Quick Test Commands
```bash
npm test              # Run all tests (HTML, links, spelling)
npm run test:html     # Validate HTML structure and semantics
npm run test:links    # Check for broken links
npm run test:spell    # Spell check all content
npm run test:a11y     # Accessibility audit (requires local server)
```

### Test Categories

#### 1. HTML Validation (`npm run test:html`)
Validates HTML structure, semantics, and best practices using [html-validate](https://html-validate.org/).

**What it checks:**
- Proper nesting of elements
- Required attributes (e.g., `alt` on images)
- ARIA usage and accessibility
- Landmark uniqueness
- Semantic HTML structure

**Configuration**: [.htmlvalidate.json](.htmlvalidate.json)

**Common failures:**
- Missing `alt` attributes on images
- Improper heading hierarchy
- Invalid ARIA attributes
- Inline styles (generates warnings)

**Fix strategy:**
1. Read the error message carefully - it points to line numbers
2. Check the [HTML Validate docs](https://html-validate.org/rules/) for the specific rule
3. Fix the markup, don't disable the rule unless absolutely necessary

#### 2. Link Checking (`npm run test:links`)
Verifies all local file references exist and are accessible.

**What it checks:**
- Local files referenced in `href` and `src` attributes
- Handles query parameters (e.g., `?v=2`)
- Handles fragment identifiers (e.g., `#section`)

**What it skips:**
- External URLs (to avoid network dependency in tests)
- `mailto:` links
- Fragment-only anchors (`#top`)

**Common failures:**
- Typos in file paths
- Case sensitivity issues (Linux/macOS difference)
- Missing files in `slides/` directory

**Fix strategy:**
1. Check the reported path carefully
2. Verify the file exists at that exact location
3. Check for typos in `index.html`

#### 3. Spell Checking (`npm run test:spell`)
Checks spelling in HTML, Markdown, JavaScript, and CSS files using [CSpell](https://cspell.org/).

**What it checks:**
- Common English words (US spelling by default)
- Technical terms in the built-in dictionary
- Project-specific terms in [cspell/project-terms.txt](cspell/project-terms.txt)

**Configuration**: [cspell.json](cspell.json)

**Common failures:**
- Typos in content or code comments
- Technical jargon not in dictionary
- British vs American spelling

**Fix strategy:**
1. Fix actual typos
2. Add legitimate technical terms to `cspell/project-terms.txt`
3. Add inline exceptions for one-off terms: `<!-- cspell:ignore technicalterm -->`

**Adding project terms:**
```bash
# Add to cspell/project-terms.txt
echo "MyTechnicalTerm" >> cspell/project-terms.txt
```

#### 4. Accessibility Auditing (`npm run test:a11y`)
Runs automated accessibility tests using [Pa11y](https://pa11y.org/) with WCAG 2 AA standard.

**What it checks:**
- Color contrast ratios
- Form labels
- ARIA usage
- Heading structure
- Keyboard accessibility
- Screen reader support

**Requirements:**
- Needs the presentation served via HTTP (not file://)
- Start a local server: `python3 -m http.server 8000`
- Run: `npm run test:a11y`

**Configuration**: [.pa11yci.json](.pa11yci.json)

**Common failures:**
- Insufficient color contrast
- Missing form labels
- Empty links or buttons
- Improper ARIA usage

**Fix strategy:**
1. Pa11y provides specific WCAG criteria violated
2. Check [WCAG Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) for guidance
3. Fix the issue, don't just hide it from the test

**Important**: Automated tests catch ~30-40% of accessibility issues. Always do manual testing with:
- Keyboard navigation
- Screen reader (VoiceOver on macOS, NVDA on Windows)
- Browser zoom (up to 200%)
- Dark mode and light mode

### Test-Driven Development Workflow

#### Before Writing Content
1. **Understand the requirement**: What slide are you adding? What's its purpose?
2. **Write a test first** (if applicable):
   - Will you add new technical terms? Add them to `cspell/project-terms.txt`
   - Will you reference new files? Ensure they exist or create placeholders
3. **Run tests to see them fail**: `npm test` should fail initially

#### While Writing Content
1. **Add your slide content** to `index.html`
2. **Run tests frequently**: `npm test` after each slide or major change
3. **Fix issues immediately**: Don't accumulate technical debt
4. **Check manually**: Navigate with keyboard, test in dark mode

#### Before Committing
1. **Run full test suite**: `npm run test:all`
2. **Manual accessibility check**:
   - [ ] Tab through all interactive elements
   - [ ] Test with screen reader
   - [ ] Verify in dark mode
   - [ ] Check responsive behavior
3. **Fix all failures**: Zero tolerance for broken tests
4. **Commit with descriptive message**: Mention what you added and that tests pass

### Continuous Integration Readiness

All tests are designed to run in CI/CD environments:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm install
  
- name: Run tests
  run: npm test
```

Tests are non-blocking by default (use `|| true`) to provide feedback without stopping the build. Modify this in `package.json` for stricter enforcement.

### Adding New Tests

When adding features to your presentation, consider adding tests:

#### Example: Testing Custom JavaScript
```javascript
// test/custom-features.test.js
const assert = require('assert');
const fs = require('fs');

describe('Custom Features', () => {
  it('should have SeededSVG configuration', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    assert(html.includes('window.SeededSVG'), 'Missing SeededSVG config');
  });
});
```

#### Example: Testing CSS Custom Properties
```bash
# scripts/test-css-vars.sh
#!/usr/bin/env bash
required_vars=("--slide-bg" "--slide-fg" "--link-fg")
css_file="slides/slides.css"

for var in "${required_vars[@]}"; do
  if ! grep -q "$var" "$css_file"; then
    echo "Missing required CSS variable: $var"
    exit 1
  fi
done
```

### Performance Testing

While not automated, consider manual performance checks:

#### Lighthouse Audit
```bash
# Install lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:8000/index.html --view
```

**Target scores:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 90+
- SEO: 80+

#### File Size Budget
Keep the presentation lightweight:
- Total HTML + CSS + JS: < 500KB
- Individual images: < 200KB
- Consider WebP for images
- Minimize external dependencies

### Regression Testing

When making changes to `slides/` framework:

1. **Test existing presentations**: Ensure they still work
2. **Test browser compatibility**: Chrome, Firefox, Safari, Edge
3. **Test keyboard shortcuts**: F, P, C, arrows, Home, End
4. **Test fullscreen mode**: Especially after `fullscreen-fix.js` changes
5. **Test live captions**: If Whisper integration changed

### Before Presenting
- [ ] Test keyboard navigation through all slides
- [ ] Verify all links work
- [ ] Check color contrast in both light and dark modes
- [ ] Test live captions if using Whisper
- [ ] Run `npm run test:links` to check for broken links
- [ ] View in multiple browsers

### Accessibility Checklist
- [ ] One `h1` per deck (on cover slide)
- [ ] Headings in sequential order
- [ ] All slides have `aria-label` attributes
- [ ] Images have descriptive `alt` text
- [ ] Links have descriptive text
- [ ] Color contrast meets WCAG AA
- [ ] Presentation works with keyboard only
- [ ] Speaker notes don't contain critical visual information

## Live Captioning with Whisper

### Setup
1. Build Whisper.cpp: `cd whisper.cpp && cmake -B build -DWHISPER_SDL2=ON && cmake --build build`
2. Download a model: `bash whisper.cpp/models/download-ggml-model.sh base.en`
3. Start captioning: `npm run dev:whisper`

### Best Practices
- Test audio quality before presenting
- Speak clearly at a moderate pace
- Reduce background noise when possible
- Allow the caption display to remain visible
- Have a backup plan if captions fail

## File Organization

```
presentation-name/
├── index.html              # Main presentation file
├── slides/                 # Presentation framework
│   ├── slides.css          # Styling (edit this)
│   ├── b6plus.js           # Core engine (don't edit)
│   ├── captions-button.js  # Caption controls
│   └── whisper-transcript.js # Transcript polling
└── assets/                 # Your images, etc.
```

## Common Patterns

### Resources Slide
```html
<section class="slide" id="resources" aria-label="Resources">
  <h2>Resources</h2>
  <ul>
    <li><a href="https://www.w3.org/WAI/WCAG22/quickref/">WCAG 2.2 Quick Reference</a></li>
    <li><a href="https://github.com/ggerganov/whisper.cpp">Whisper.cpp on GitHub</a></li>
  </ul>
</section>
```

### Final Slide
```html
<section class="slide" id="questions" aria-label="Questions">
  <h2>Questions?</h2>
  <address>
    <strong>Your Name</strong><br>
    <a href="mailto:you@example.com">you@example.com</a><br>
    <a href="https://yoursite.com">yoursite.com</a>
  </address>
</section>
```

## External References
- [B6+ Documentation](https://www.w3.org/Talks/Tools/b6plus/)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [Whisper.cpp](https://github.com/ggerganov/whisper.cpp)
- [Accessible Presentations](https://www.w3.org/WAI/teach-advocate/accessible-presentations/)

## Change Review Checklist
- [ ] Slide structure validated (proper `<section>` elements)
- [ ] Headings in sequential order
- [ ] All slides have `aria-label` attributes  
- [ ] Links have descriptive text
- [ ] Images have `alt` text
- [ ] Color contrast verified
- [ ] Keyboard navigation tested
- [ ] Speaker notes don't duplicate visible content
- [ ] Link checker passes: `npm run test:links`
