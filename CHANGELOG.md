# Changelog

All notable changes to this project are documented here.

## [2.1.0] — 2026-09-18

### Performance & SEO
- Views are now code-split (lazy-loaded) — only the active view loads on first paint. Lighthouse: **99 desktop / 91 mobile** performance, **100** accessibility & SEO.
- Added rich link previews — Open Graph / Twitter cards with a terminal-themed share image — plus `robots.txt`.

### Accessibility
- Skip-to-content link, `<main>` landmarks in both views, and a full WCAG-AA contrast pass across all eight themes.

### UI
- Native theme/effect dropdowns replaced with a custom, fully theme-styled accessible dropdown.
- New Ubuntu type system, an initial loading screen, refined keyboard-focus states, and softened muted-text contrast.
- About section header removed (content kept).

### Internal
- Codebase quality/lint refactor, expanded tests, and updated docs (README + WALKTHROUGH).
