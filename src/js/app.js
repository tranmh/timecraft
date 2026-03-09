/**
 * Main entry point - wires clock, renderer, demo, and themes together.
 */

import { getCurrentTime, getActiveWordKeys } from './clock.js';
import { buildGrid, highlightWords, setEffect, isEffectEnabled } from './renderer.js';
import { initDemo, isDemoMode, getDemoTime } from './demo.js';
import { initThemes, setTheme, getThemes, getTheme, setCustomBackground, resetBackground, nextWallpaper, prevWallpaper, randomWallpaper, startAutoRotate, stopAutoRotate, isAutoRotating, getAutoRotateInterval } from './themes.js';
import './wallpapers.js';
import { localeDe } from '../locales/de.js';
import { localeEn } from '../locales/en.js';
import { localeZh } from '../locales/zh.js';
import { localeEs } from '../locales/es.js';
import { localeHi } from '../locales/hi.js';
import { localeAr } from '../locales/ar.js';
import { localeFr } from '../locales/fr.js';
import { localePt } from '../locales/pt.js';
import { localeRu } from '../locales/ru.js';
import { localeJa } from '../locales/ja.js';
import { localeKo } from '../locales/ko.js';
import { localeIt } from '../locales/it.js';
import { localeLa } from '../locales/la.js';
import { localeVi } from '../locales/vi.js';
import { localeSwg } from '../locales/swg.js';
import { localeBar } from '../locales/bar.js';
import { localeSxu } from '../locales/sxu.js';
import { localeAt } from '../locales/at.js';

const LOCALES = {
  en: localeEn,
  de: localeDe,
  zh: localeZh,
  es: localeEs,
  hi: localeHi,
  ar: localeAr,
  fr: localeFr,
  pt: localePt,
  ru: localeRu,
  ja: localeJa,
  ko: localeKo,
  it: localeIt,
  la: localeLa,
  vi: localeVi,
  swg: localeSwg,
  bar: localeBar,
  sxu: localeSxu,
  at: localeAt,
};

let currentLocale = 'en';
let tickInterval = null;

function getLocale() {
  return LOCALES[currentLocale];
}

function requestWakeLock() {
  navigator.wakeLock?.request('screen').catch(() => {});
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function init() {
  requestWakeLock();
  registerServiceWorker();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') requestWakeLock();
  });

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="clock-container">
      <div class="clock-panel">
        <div id="grid-container"></div>
      </div>
    </div>
    <button id="settings-toggle" class="settings-toggle" title="Settings">&#9881;</button>
    <div class="settings-panel" id="settings-panel">
      <div class="controls">
        <div class="control-group">
          <label for="locale-select">Language</label>
          <select id="locale-select">
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="zh">中文</option>
            <option value="es">Español</option>
            <option value="hi">हिन्दी</option>
            <option value="ar">العربية</option>
            <option value="fr">Français</option>
            <option value="pt">Português</option>
            <option value="ru">Русский</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="it">Italiano</option>
            <option value="la">Latina</option>
            <option value="vi">Tiếng Việt</option>
            <option value="swg">Schwäbisch</option>
            <option value="bar">Boarisch</option>
            <option value="sxu">Sächsisch</option>
            <option value="at">Österreichisch</option>
          </select>
        </div>
        <div class="control-group">
          <label for="theme-select">Theme</label>
          <select id="theme-select"></select>
        </div>
        <div class="control-group bg-controls">
          <label>Wallpaper</label>
          <div class="bg-buttons">
            <button id="bg-prev" title="Previous wallpaper">&lsaquo;</button>
            <button id="bg-next" title="Next wallpaper">&rsaquo;</button>
            <button id="bg-shuffle" title="Random wallpaper">&#x1f500;</button>
            <label class="bg-upload-label">
              Upload
              <input type="file" id="bg-upload" accept="image/*" hidden>
            </label>
            <button id="bg-reset">Reset</button>
          </div>
        </div>
        <div class="control-group auto-rotate-controls">
          <label>Auto-rotate wallpaper</label>
          <div class="auto-rotate-row">
            <button id="auto-rotate-toggle" class="effect-toggle">Off</button>
            <select id="auto-rotate-interval">
              <option value="60000">1 min</option>
              <option value="300000" selected>5 min</option>
              <option value="900000">15 min</option>
              <option value="3600000">1 hr</option>
            </select>
          </div>
        </div>
        <div class="control-group">
          <label>Effects</label>
          <div class="effect-buttons">
            <button id="effect-breathe" class="effect-toggle">Breathe</button>
            <button id="effect-twinkle" class="effect-toggle">Twinkle</button>
            <button id="effect-matrix" class="effect-toggle">Matrix</button>
          </div>
        </div>
        <div id="demo-container"></div>
      </div>
    </div>
  `;

  const gridContainer = document.getElementById('grid-container');
  const localeSelect = document.getElementById('locale-select');
  const themeSelect = document.getElementById('theme-select');
  const bgUpload = document.getElementById('bg-upload');
  const bgReset = document.getElementById('bg-reset');
  const bgPrev = document.getElementById('bg-prev');
  const bgNext = document.getElementById('bg-next');
  const demoContainer = document.getElementById('demo-container');
  const settingsToggle = document.getElementById('settings-toggle');
  const settingsPanel = document.getElementById('settings-panel');

  // Settings toggle
  settingsToggle.addEventListener('click', () => {
    settingsPanel.classList.toggle('open');
    settingsToggle.classList.toggle('active');
  });

  // Init themes
  initThemes(app);

  // Populate theme selector
  const themes = getThemes();
  for (const t of themes) {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
    themeSelect.appendChild(opt);
  }
  themeSelect.value = getTheme();

  themeSelect.addEventListener('change', () => {
    setTheme(themeSelect.value, app);
  });

  // Locale switcher
  localeSelect.addEventListener('change', () => {
    currentLocale = localeSelect.value;
    buildGrid(getLocale(), gridContainer);
    update();
  });

  // Background upload
  bgUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomBackground(reader.result, app);
    };
    reader.readAsDataURL(file);
  });

  bgReset.addEventListener('click', () => {
    const hadCustom = localStorage.getItem(`timecraft-bg-${getTheme()}`) !== null;
    resetBackground(app);
    const origText = bgReset.textContent;
    bgReset.textContent = hadCustom ? 'Done!' : 'No custom';
    bgReset.disabled = true;
    setTimeout(() => {
      bgReset.textContent = origText;
      bgReset.disabled = false;
    }, 1500);
  });

  bgPrev.addEventListener('click', () => {
    prevWallpaper(app);
  });

  bgNext.addEventListener('click', () => {
    nextWallpaper(app);
  });

  // Shuffle button
  const bgShuffle = document.getElementById('bg-shuffle');
  bgShuffle.addEventListener('click', () => {
    randomWallpaper(app);
  });

  // Auto-rotate
  const autoRotateToggle = document.getElementById('auto-rotate-toggle');
  const autoRotateInterval = document.getElementById('auto-rotate-interval');

  // Restore saved auto-rotate state
  const savedAutoRotate = localStorage.getItem('timecraft-auto-rotate');
  const savedInterval = getAutoRotateInterval();
  autoRotateInterval.value = String(savedInterval);

  function updateAutoRotateUI() {
    const active = isAutoRotating();
    autoRotateToggle.textContent = active ? 'On' : 'Off';
    autoRotateToggle.classList.toggle('active', active);
  }

  if (savedAutoRotate === '1') {
    startAutoRotate(app, savedInterval);
  }
  updateAutoRotateUI();

  autoRotateToggle.addEventListener('click', () => {
    if (isAutoRotating()) {
      stopAutoRotate();
    } else {
      startAutoRotate(app, parseInt(autoRotateInterval.value, 10));
    }
    updateAutoRotateUI();
  });

  autoRotateInterval.addEventListener('change', () => {
    if (isAutoRotating()) {
      startAutoRotate(app, parseInt(autoRotateInterval.value, 10));
    }
  });

  // Restart auto-rotate on theme change
  themeSelect.addEventListener('change', () => {
    if (isAutoRotating()) {
      startAutoRotate(app, parseInt(autoRotateInterval.value, 10));
    }
  });

  // Effects toggles
  const savedEffects = JSON.parse(localStorage.getItem('timecraft-effects') || '[]');
  const effectNames = ['breathe', 'twinkle', 'matrix'];
  for (const name of effectNames) {
    const btn = document.getElementById(`effect-${name}`);
    if (savedEffects.includes(name)) {
      btn.classList.add('active');
      setEffect(name, true);
    }
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const enabled = btn.classList.contains('active');
      setEffect(name, enabled);
      // Persist
      const current = effectNames.filter(n => document.getElementById(`effect-${n}`).classList.contains('active'));
      localStorage.setItem('timecraft-effects', JSON.stringify(current));
    });
  }

  // Build initial grid
  buildGrid(getLocale(), gridContainer);

  // Demo mode
  initDemo(demoContainer, update);

  // Start ticking
  update();
  tickInterval = setInterval(update, 1000);
}

function update() {
  const { hours, minutes } = isDemoMode() ? getDemoTime() : getCurrentTime();
  const locale = getLocale();
  const wordKeys = locale.timeToWords(hours, minutes);
  const extraMinutes = minutes % 5;
  highlightWords(wordKeys, locale, extraMinutes);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
