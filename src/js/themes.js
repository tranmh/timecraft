/**
 * Theme switcher with background management.
 */

const THEMES = ['modern', 'beautiful', 'scientific', 'arctic', 'ember', 'forest', 'ocean', 'retro', 'sand', 'cosmos'];
let currentTheme = 'modern';

// Wallpaper data per theme - populated by wallpapers.js
const WALLPAPERS = {
  modern: [],
  beautiful: [],
  scientific: [],
  arctic: [],
  ember: [],
  forest: [],
  ocean: [],
  retro: [],
  sand: [],
  cosmos: [],
};

// Current wallpaper index per theme
const wallpaperIndex = { modern: 0, beautiful: 0, scientific: 0, arctic: 0, ember: 0, forest: 0, ocean: 0, retro: 0, sand: 0, cosmos: 0 };

export function registerWallpapers(theme, dataUrls) {
  WALLPAPERS[theme] = dataUrls;
}

export function initThemes(appEl) {
  const saved = localStorage.getItem('timecraft-theme');
  currentTheme = (saved && THEMES.includes(saved)) ? saved : 'modern';

  // Restore saved wallpaper indices
  for (const t of THEMES) {
    const idx = parseInt(localStorage.getItem(`timecraft-wp-idx-${t}`), 10);
    if (!isNaN(idx)) wallpaperIndex[t] = idx;
  }

  applyTheme(currentTheme, appEl);
}

export function setTheme(themeName, appEl) {
  if (!THEMES.includes(themeName)) return;
  currentTheme = themeName;
  localStorage.setItem('timecraft-theme', themeName);
  applyTheme(themeName, appEl);
}

export function getTheme() {
  return currentTheme;
}

export function getThemes() {
  return [...THEMES];
}

export function nextWallpaper(appEl) {
  const wps = WALLPAPERS[currentTheme];
  if (!wps.length) return;
  wallpaperIndex[currentTheme] = (wallpaperIndex[currentTheme] + 1) % wps.length;
  localStorage.setItem(`timecraft-wp-idx-${currentTheme}`, wallpaperIndex[currentTheme]);
  applyBackground(currentTheme, appEl);
}

export function prevWallpaper(appEl) {
  const wps = WALLPAPERS[currentTheme];
  if (!wps.length) return;
  wallpaperIndex[currentTheme] = (wallpaperIndex[currentTheme] - 1 + wps.length) % wps.length;
  localStorage.setItem(`timecraft-wp-idx-${currentTheme}`, wallpaperIndex[currentTheme]);
  applyBackground(currentTheme, appEl);
}

function applyTheme(themeName, appEl) {
  for (const t of THEMES) {
    appEl.classList.remove(`theme-${t}`);
  }
  appEl.classList.add(`theme-${themeName}`);
  applyBackground(themeName, appEl);
}

function applyBackground(themeName, appEl) {
  const customBg = localStorage.getItem(`timecraft-bg-${themeName}`);
  if (customBg) {
    appEl.style.backgroundImage = `url(${customBg})`;
    appEl.classList.add('custom-bg');
  } else {
    const wps = WALLPAPERS[themeName];
    if (wps.length) {
      const idx = wallpaperIndex[themeName] % wps.length;
      appEl.style.backgroundImage = `url(${wps[idx]})`;
      appEl.classList.add('custom-bg');
    } else {
      appEl.style.backgroundImage = '';
      appEl.classList.remove('custom-bg');
    }
  }
}

export function setCustomBackground(dataUrl, appEl) {
  localStorage.setItem(`timecraft-bg-${currentTheme}`, dataUrl);
  applyBackground(currentTheme, appEl);
}

export function resetBackground(appEl) {
  localStorage.removeItem(`timecraft-bg-${currentTheme}`);
  applyBackground(currentTheme, appEl);
}
