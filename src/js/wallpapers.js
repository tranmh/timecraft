/**
 * Wallpaper data for each theme.
 * During build, the WALLPAPER_DATA placeholder is replaced with base64 data URLs.
 * During development, wallpapers are loaded from image files.
 */

import { registerWallpapers } from './themes.js';

// __WALLPAPER_DATA_PLACEHOLDER__ will be replaced by build.js
const WALLPAPER_DATA = '__WALLPAPER_DATA_PLACEHOLDER__';

function initWallpapers() {
  if (typeof WALLPAPER_DATA === 'string' && WALLPAPER_DATA.includes('PLACEHOLDER')) {
    // Dev mode: load from files
    const themes = ['beautiful', 'scientific', 'modern', 'arctic', 'ember', 'forest', 'ocean', 'retro', 'sand', 'cosmos'];
    for (const theme of themes) {
      const urls = [];
      for (let i = 1; i <= 15; i++) {
        urls.push(`img/wallpapers/${theme}/${theme}-${i}.jpg`);
      }
      registerWallpapers(theme, urls);
    }
  } else {
    // Build mode: data is already base64
    for (const theme of Object.keys(WALLPAPER_DATA)) {
      registerWallpapers(theme, WALLPAPER_DATA[theme]);
    }
  }
}

initWallpapers();
