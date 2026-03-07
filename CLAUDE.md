# CLAUDE.md

## Project Overview

Timecraft is a word clock web app. It displays the current time as illuminated words on a letter grid, supporting 12 languages and 10 visual themes with wallpapers. Installable as a PWA.

## Tech Stack

- Vanilla JavaScript (ES modules, no framework)
- Custom build script (`build.js`) that inlines all assets into a single `dist/index.html`
- Jest + jsdom for unit tests
- Playwright + Chromium for e2e tests

## Key Commands

```bash
npm run dev        # Dev server (npx serve src on port 3000)
npm test           # Unit tests (Jest, requires --experimental-vm-modules)
npm run test:e2e   # E2E tests (Playwright, starts dev server automatically)
npm run test:all   # Both unit and e2e
npm run build      # Build single-file dist/index.html
```

## Architecture

- **No bundler** - build.js resolves ES module imports, strips import/export, and concatenates into a single `<script>` block
- **Wallpapers** are base64-encoded into the build via `'__WALLPAPER_DATA_PLACEHOLDER__'` in wallpapers.js
- **Locales** define the letter grid (`GRID`), word positions (`WORDS`), and time-to-words mapping (`timeToWords`)
- **Themes** are CSS-based (`theme-{name}` class on `#app`) with per-theme wallpaper cycling
- **PWA** - manifest.json + service worker (`sw.js`) for installability and offline caching
- **State** is persisted in localStorage (theme, wallpaper index, custom backgrounds)

## File Layout

- `src/js/app.js` - Main entry, wires clock + renderer + demo + themes
- `src/js/clock.js` - `getCurrentTime()`, `getActiveWords()`
- `src/js/renderer.js` - `buildGrid()`, `highlightWords()` (DOM rendering)
- `src/js/themes.js` - Theme/wallpaper management (10 themes: modern, beautiful, scientific, arctic, ember, forest, ocean, retro, sand, cosmos)
- `src/js/demo.js` - Demo mode (manual time control)
- `src/locales/*.js` - Locale definitions (grid, words, time logic) for 12 languages
- `src/css/base.css` + `src/css/themes/` - Styles
- `src/manifest.json` - PWA manifest
- `src/sw.js` - Service worker for offline caching
- `build.js` - Build script
- `tests/unit/` - Jest tests
- `tests/e2e/` - Playwright tests

## Conventions

- ES modules with `"type": "module"` in package.json
- No TypeScript, no framework, no bundler dependencies
- Single HTML output file that works offline and via `file://` protocol
- 15 wallpapers per theme stored as JPGs in `src/img/wallpapers/{theme}/`

## Locales

12 languages: en, de, zh, es, hi, ar, fr, pt, ru, ja, ko, it. Each locale file exports:
- `GRID` - 10x11 character array (Latin, Cyrillic, Hanzi, Kanji, Hangul, or romanized)
- `WORDS` - Map of word keys to `{ row, col, length }` positions in the grid
- `timeToWords(hours, minutes)` - Returns array of word keys to highlight
- `LOCALE_NAME`, `MINUTE_LABEL`, `MINUTE_LABEL_SINGULAR`

Grid scripts vary: Latin (en, de, es, fr, pt, it, hi, ar), Cyrillic (ru), Hanzi (zh), Kanji (ja), Hangul (ko). Hindi and Arabic use romanized Latin to avoid complex script rendering in grids.

## License & Contributing

All rights reserved. Contributions not accepted. Wallpaper images copyrighted by their respective owners (see README.md).
