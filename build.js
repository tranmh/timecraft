/**
 * Build Script
 *
 * Reads all source files, resolves ES module imports, and inlines everything
 * into a single dist/index.html file that works with file:// protocol.
 *
 * Usage: node build.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SRC_DIR = join(__dirname, 'src');
const DIST_DIR = join(__dirname, 'dist');
const HTML_FILE = join(SRC_DIR, 'index.html');

// Maximum number of wallpapers to embed per theme (1-15). Lower = smaller dist/index.html.
const MAX_WALLPAPERS_PER_THEME = 3;

function readFile(filePath) {
  return readFileSync(filePath, 'utf-8');
}

function resolveModules(entryPath) {
  const visited = new Set();
  const modules = [];

  function visit(filePath) {
    const absPath = resolve(filePath);
    if (visited.has(absPath)) return;
    visited.add(absPath);

    let content = readFile(absPath);
    const dir = dirname(absPath);

    // Match named imports: import { x } from '...' / import x from '...' / import * as x from '...'
    const namedImportRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/g;
    // Match side-effect imports: import '...'
    const sideEffectImportRegex = /import\s+['"]([^'"]+)['"]\s*;?/g;

    let match;

    while ((match = namedImportRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('.')) {
        const resolvedPath = resolve(dir, importPath);
        visit(resolvedPath);
      }
    }

    while ((match = sideEffectImportRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('.')) {
        const resolvedPath = resolve(dir, importPath);
        visit(resolvedPath);
      }
    }

    content = content.replace(/import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"][^'"]+['"]\s*;?\n?/g, '');
    content = content.replace(/import\s+['"][^'"]+['"]\s*;?\n?/g, '');

    content = content.replace(/^export\s+(class|function|const|let|var)\s+/gm, '$1 ');
    content = content.replace(/^export\s+default\s+/gm, '');
    content = content.replace(/^export\s+\{[^}]*\}\s*;?\n?/gm, '');

    const relPath = relative(SRC_DIR, absPath);
    modules.push(`// --- ${relPath} ---\n${content.trim()}`);
  }

  visit(entryPath);
  return modules.join('\n\n');
}

function collectCSS(html) {
  const cssRegex = /<link\s+(?=[^>]*rel="stylesheet")[^>]*href="([^"]+)"[^>]*\/?>/g;
  const cssContents = [];
  let match;

  while ((match = cssRegex.exec(html)) !== null) {
    const cssPath = join(SRC_DIR, match[1]);
    if (existsSync(cssPath)) {
      cssContents.push(`/* --- ${match[1]} --- */\n${readFile(cssPath).trim()}`);
    }
  }

  return cssContents.join('\n\n');
}

function buildWallpaperData() {
  const wpDir = join(SRC_DIR, 'img', 'wallpapers');
  const themes = ['beautiful', 'scientific', 'modern', 'arctic', 'ember', 'forest', 'ocean', 'retro', 'sand', 'cosmos'];
  const data = {};

  for (const theme of themes) {
    const themeDir = join(wpDir, theme);
    if (!existsSync(themeDir)) {
      data[theme] = [];
      continue;
    }

    const files = [];
    for (let i = 1; i <= MAX_WALLPAPERS_PER_THEME; i++) {
      const filepath = join(themeDir, `${theme}-${i}.jpg`);
      if (existsSync(filepath)) {
        const buf = readFileSync(filepath);
        files.push(`data:image/jpeg;base64,${buf.toString('base64')}`);
      }
    }
    data[theme] = files;
  }

  return data;
}

function build() {
  console.log('Building...');

  if (!existsSync(DIST_DIR)) {
    mkdirSync(DIST_DIR, { recursive: true });
  }

  let html = readFile(HTML_FILE);

  const allCSS = collectCSS(html);

  html = html.replace(/<link\s+rel="stylesheet"\s+href="[^"]+"\s*\/?>\n?/g, '');

  const jsMatch = html.match(/<script\s+type="module"\s+src="([^"]+)"\s*><\/script>/);
  let allJS = '';
  if (jsMatch) {
    const jsEntryPath = join(SRC_DIR, jsMatch[1]);
    allJS = resolveModules(jsEntryPath);
  }

  html = html.replace(/<script\s+type="module"\s+src="[^"]+"\s*><\/script>\n?/g, '');

  // PWA meta tags
  const pwaMeta = `  <link rel="manifest" href="./manifest.json">
  <meta name="theme-color" content="#1a1a2e">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="apple-touch-icon" href="./icons/apple-touch-icon.png">`;

  html = html.replace('</head>', `${pwaMeta}\n</head>`);

  if (allCSS) {
    html = html.replace(
      '</head>',
      `  <style>\n${allCSS}\n  </style>\n</head>`,
    );
  }

  if (allJS) {
    // Embed wallpaper data as base64
    const wpData = buildWallpaperData();
    const wpCount = Object.values(wpData).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`Embedding ${wpCount} wallpapers...`);
    allJS = allJS.replace(
      "'__WALLPAPER_DATA_PLACEHOLDER__'",
      JSON.stringify(wpData),
    );

    html = html.replace(
      '</body>',
      `  <script>\n${allJS}\n  </script>\n</body>`,
    );
  }

  const outputPath = join(DIST_DIR, 'index.html');
  writeFileSync(outputPath, html, 'utf-8');

  // Copy PWA assets
  copyFileSync(join(SRC_DIR, 'manifest.json'), join(DIST_DIR, 'manifest.json'));
  copyFileSync(join(SRC_DIR, 'sw.js'), join(DIST_DIR, 'sw.js'));
  console.log('Copied PWA assets (manifest.json, sw.js)');

  const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
  console.log(`Build complete: dist/index.html (${sizeKB} KB)`);
}

build();
