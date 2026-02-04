# Testing Guide

This document provides a detailed overview of the testing strategy for the **Whisper Live Captioning Presentation Template**.

For authoring guidance and accessibility best practices, see [AGENTS.md](AGENTS.md).

## Test Overview

We use the following tools for quality assurance:

- **html-validate**: HTML structure and accessibility validation
- **Custom link checker**: Local link integrity
- **CSpell**: Spell checking across content and code
- **Custom CSS validator**: Lightweight CSS sanity checks
- **Pa11y**: Automated accessibility audits (WCAG 2 AA)

All tests are run via npm scripts defined in [package.json](package.json).

## Running Tests

```bash
# Install dependencies
npm install

# Run everything
npm test

# Individual test suites
npm run test:html
npm run test:links
npm run test:spell
npm run test:css
npm run test:a11y
```

## HTML Validation

- Tool: [html-validate](https://html-validate.org/)
- Config: [.htmlvalidate.json](.htmlvalidate.json)

Checks include:
- Proper element nesting
- Required attributes (e.g., `alt` on images)
- ARIA usage
- Landmark uniqueness

## Link Checking

- Script: [scripts/check-links.sh](scripts/check-links.sh)

Behavior:
- Scans `index.html` for `href` and `src` attributes
- Resolves local paths relative to the project root
- Ignores external URLs and `mailto:` links

## Spell Checking

- Tool: [CSpell](https://cspell.org/)
- Config: [cspell.json](cspell.json)
- Project dictionary: [cspell/project-terms.txt](cspell/project-terms.txt)

## CSS Validation

- Script: [scripts/validate-css.sh](scripts/validate-css.sh)

Checks:
- Balanced `{}` braces
- Common syntax issues (e.g., `;;`)

## Accessibility Audits

- Tool: [Pa11y](https://pa11y.org/)
- Config: [.pa11yci.json](.pa11yci.json)

Run with:

```bash
python3 -m http.server 8000 &
npm run test:a11y
```

## CI Integration

See [.github/workflows/quality.yml](.github/workflows/quality.yml) for the GitHub Actions workflow configuration.
