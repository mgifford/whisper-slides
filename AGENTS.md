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
<div class="progress"></div>
<div class="clock"></div>
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
