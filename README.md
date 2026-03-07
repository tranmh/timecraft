# Timecraft - Word Clock

A word clock web app that displays time as illuminated words. Supports 12 languages with 10 visual themes and built-in wallpapers. Installable as a Progressive Web App (PWA).

## Features

- **Word clock display** - Time shown as highlighted words on a letter grid
- **12 languages** - English, German, Chinese, Spanish, Hindi, Arabic, French, Portuguese, Russian, Japanese, Korean, Italian
- **10 themes** - Modern, Beautiful, Scientific, Arctic, Ember, Forest, Ocean, Retro, Sand, Cosmos (each with unique styling and wallpapers)
- **15 wallpapers per theme** - Cycle through with prev/next controls, or upload your own
- **PWA support** - Installable as a Progressive Web App with offline caching via service worker
- **Minute indicators** - Extra minute precision beyond the 5-minute word grid
- **Demo mode** - Manually set time for testing/display
- **Fully offline** - Build produces a single HTML file with all assets inlined, works via `file://`
- **Persistent settings** - Theme, wallpaper, and custom backgrounds saved to localStorage

## Build

```bash
npm install
npm run build
```

The build produces a single `dist/index.html` file with all assets (CSS, JS, wallpapers as base64) embedded inline.

## Development

```bash
npm run dev        # Start dev server (serves src/ on port 3000)
npm test           # Run unit tests (Jest + jsdom)
npm run test:e2e   # Run end-to-end tests (Playwright + Chromium)
npm run test:all   # Run both unit and e2e tests
```

## Project Structure

```
src/
  index.html          # Entry point
  js/
    app.js             # Main entry - wires everything together
    clock.js           # Core time logic
    renderer.js        # DOM rendering for the word grid
    themes.js          # Theme switcher with wallpaper management
    wallpapers.js      # Wallpaper data registration
    demo.js            # Demo mode (manual time control)
  locales/
    en.js              # English locale (grid layout, word positions, time-to-words)
    de.js              # German locale
    zh.js              # Chinese (Mandarin) locale
    es.js              # Spanish locale
    hi.js              # Hindi locale (romanized)
    ar.js              # Arabic locale (romanized)
    fr.js              # French locale
    pt.js              # Portuguese locale
    ru.js              # Russian locale (Cyrillic grid)
    ja.js              # Japanese locale (Kanji grid)
    ko.js              # Korean locale (Hangul grid)
    it.js              # Italian locale
  css/
    base.css           # Base styles
    themes/            # Theme-specific CSS (10 themes)
  img/
    wallpapers/        # Wallpaper images per theme (15 each)
    backgrounds/       # SVG background patterns per theme
  manifest.json        # PWA manifest
  sw.js                # Service worker for offline caching
build.js               # Build script - inlines everything into dist/index.html
tests/
  unit/                # Jest unit tests
  e2e/                 # Playwright end-to-end tests
```

## Supported Languages

| Language | Code | Grid Script | Time Pattern |
|----------|------|-------------|-------------|
| English | en | Latin | IT IS [hour] PAST/TO [minutes] |
| German | de | Latin (+ umlauts) | ES IST [hour] NACH/VOR [minutes] |
| Chinese | zh | Hanzi | 现在 [hour]点 [minutes]分 |
| Spanish | es | Latin | ES/SON LA/LAS [hour] Y/MENOS [min] |
| Hindi | hi | Latin (romanized) | ABHI [hour] BAJE / KAM [min] |
| Arabic | ar | Latin (romanized) | ESSA [hour] WA/ILLA [min] |
| French | fr | Latin | IL EST [hour] HEURE(S) [min] |
| Portuguese | pt | Latin | E/SAO [hour] E/MENOS [min] |
| Russian | ru | Cyrillic | [hour] [min] / БЕЗ [min] [hour] |
| Japanese | ja | Kanji | 今 [hour]時 [minutes]分 |
| Korean | ko | Hangul | 지금 [hour]시 [minutes]분 |
| Italian | it | Latin | SONO LE / È L' [hour] E/MENO [min] |

Each locale defines a 10x11 character grid, word position map, and time-to-words logic. See `src/locales/` for implementations.

## Wallpaper Sources & Copyright

Each theme includes 15 wallpapers downloaded from external sources. All rights belong to their respective owners.

### Beautiful Theme

Source: [Pixabay - Beautiful Wallpaper](https://pixabay.com/de/images/search/beautiful%20wallpaper/)

Pixabay images are released under the [Pixabay Content License](https://pixabay.com/service/license-summary/), which allows free use for commercial and non-commercial purposes without attribution (though attribution is appreciated).

| File | Description |
|------|-------------|
| beautiful-1.jpg | Girl, Woman, Street, Glow, Portrait |
| beautiful-2.jpg | Peony Leaves, Peonies, Flower |
| beautiful-3.jpg | Pion, Flower Background, Peonies, Pink |
| beautiful-4.jpg | Flowers, Flower Background |
| beautiful-5.jpg | Pion, Peonies, Pink, Strong Color, Nature |

### Scientific Theme

Source: [wallpaper.mob.com.de - Star Wars: Episode VI Die Ruckkehr der Jedi Ritter](https://wallpaper.mob.com.de/pc/gallery/tag=star%20wars:%20episode%20vi%20die%20r%C3%BCckkehr%20der%20jedi%20ritter/)

Star Wars wallpapers sourced via mob.com.de. Star Wars is a trademark of Lucasfilm Ltd. / Disney. Wallpaper images are copyright their respective creators.

Copyright: mob.com.de. Alle Rechte vorbehalten.

| File | Source Hash |
|------|------------|
| scientific-1.jpg | fb8e9d9b4cb029a3a8ce95d3bec6839a |
| scientific-2.jpg | a4b00040cd444b6047330d59d5c5eaa2 |
| scientific-3.jpg | 4472e49156c2ee4b4c81143cc0ecbc54 |
| scientific-4.jpg | 707ff7d9b88d88a4336f938e482b07f7 |
| scientific-5.jpg | 36b82cb818bbcfb9d2e2441fde8b5a8b |

### Modern Theme

Source: [Selected Wallpapers - Contemporary Wallpaper Collection](https://www.selectedwallpapers.com/de-de/collections/contemporary-wallpaper)

Wallpaper designs by Wall & Deco, distributed by Selected Wallpapers & Interiors (selectedwallpapers.com). All designs are copyrighted by their respective designers.

| File | Design Name |
|------|-------------|
| modern-1.jpg | Midsummer Night |
| modern-2.jpg | Volare |
| modern-3.jpg | Daphne |
| modern-4.jpg | Mandala |
| modern-5.jpg | La Isla Bonita |

## License

All rights reserved. This project is not licensed for redistribution or reuse. Wallpaper images are copyrighted by their respective owners (see above).

## Contributing

This is a personal project. Contributions are not currently accepted.
