# Copilot Instructions

## Primary Reference

All authoring guidance, accessibility requirements, slide structure conventions, testing commands, and contribution workflows are documented in:

- **[AGENTS.md](../AGENTS.md)** — the authoritative guide for working in this repository. Read this first.
- **[TESTING.md](../TESTING.md)** — detailed notes on the test suite and how to run it.
- **[README.md](../README.md)** — project overview, quick-start steps, and feature summary.

## Quick Orientation

This repository is an accessible HTML presentation template with real-time live captioning powered by [Whisper.cpp](https://github.com/ggerganov/whisper.cpp). Key facts:

- Slides live in `index.html`; the B6+ framework files are in `slides/`.
- **No build step** is required to view the presentation — open `index.html` directly.
- Live captioning works **locally only** (not on GitHub Pages).
- The project follows **test-driven development**: run `npm test` before and after every change.

## Testing

```bash
npm test              # Run all tests (HTML validation, link check, spell check)
npm run test:html     # Validate HTML structure and semantics
npm run test:links    # Check for broken local file references
npm run test:spell    # Spell check all content
npm run test:a11y     # Accessibility audit (requires a running local server)
```

Add any new technical terms that are not common English words to `cspell/project-terms.txt` so the spell checker does not flag them.

## Accessibility Standards

All changes must meet **WCAG 2.2 AA**. See the full checklist in [AGENTS.md](../AGENTS.md#accessibility-first). Key rules:

- One `h1` per deck (cover slide only); `h2` for each content slide.
- Every `<section class="slide">` must have an `aria-label` attribute.
- Images require descriptive `alt` text; decorative images use `alt=""`.
- Never rely on color alone to convey information.

## Common Errors and Workarounds

| Error | Cause | Fix |
|-------|-------|-----|
| Spell-check failure on a technical term | Term not in dictionary | Add to `cspell/project-terms.txt` |
| Link-check failure | File path typo or missing file | Verify the exact path exists; check case sensitivity |
| HTML validation: missing `alt` | Image without alt attribute | Add `alt="description"` or `alt=""` for decorative images |
| HTML validation: heading skip | e.g. `h2` → `h4` | Keep headings sequential; use CSS for visual size |
| Pa11y contrast failure | Color pair below 4.5:1 | Adjust `--slide-fg` / `--slide-bg` in `slides/slides.css` |
