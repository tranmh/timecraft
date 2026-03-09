/**
 * Build Script
 *
 * Reads all source files, resolves ES module imports, and inlines everything
 * into a single dist/index.html file that works with file:// protocol.
 *
 * Usage: node build.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SRC_DIR = join(__dirname, 'src');
const DIST_DIR = join(__dirname, 'dist');
const HTML_FILE = join(SRC_DIR, 'index.html');

// Build variants: each gets its own subfolder under dist/
const BUILD_VARIANTS = [
  { name: 'lite', maxWallpapers: 3 },
  { name: 'full', maxWallpapers: 15 },
];

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

function buildWallpaperData(maxPerTheme) {
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
    for (let i = 1; i <= maxPerTheme; i++) {
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

  // Prepare shared HTML template (CSS inlined, JS resolved, but no wallpaper data yet)
  let baseHtml = readFile(HTML_FILE);
  const allCSS = collectCSS(baseHtml);

  baseHtml = baseHtml.replace(/<link\s+rel="stylesheet"\s+href="[^"]+"\s*\/?>\n?/g, '');

  const jsMatch = baseHtml.match(/<script\s+type="module"\s+src="([^"]+)"\s*><\/script>/);
  let baseJS = '';
  if (jsMatch) {
    const jsEntryPath = join(SRC_DIR, jsMatch[1]);
    baseJS = resolveModules(jsEntryPath);
  }

  baseHtml = baseHtml.replace(/<script\s+type="module"\s+src="[^"]+"\s*><\/script>\n?/g, '');

  // PWA meta tags
  const pwaMeta = `  <link rel="manifest" href="./manifest.json">
  <meta name="theme-color" content="#1a1a2e">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="apple-touch-icon" href="./icons/apple-touch-icon.png">`;

  baseHtml = baseHtml.replace('</head>', `${pwaMeta}\n</head>`);

  if (allCSS) {
    baseHtml = baseHtml.replace(
      '</head>',
      `  <style>\n${allCSS}\n  </style>\n</head>`,
    );
  }

  // Build each variant
  for (const variant of BUILD_VARIANTS) {
    const variantDir = join(DIST_DIR, variant.name);
    mkdirSync(variantDir, { recursive: true });

    let html = baseHtml;

    if (baseJS) {
      let js = baseJS;
      const wpData = buildWallpaperData(variant.maxWallpapers);
      const wpCount = Object.values(wpData).reduce((sum, arr) => sum + arr.length, 0);
      console.log(`[${variant.name}] Embedding ${wpCount} wallpapers (max ${variant.maxWallpapers}/theme)...`);
      js = js.replace(
        "'__WALLPAPER_DATA_PLACEHOLDER__'",
        JSON.stringify(wpData),
      );

      html = html.replace(
        '</body>',
        `  <script>\n${js}\n  </script>\n</body>`,
      );
    }

    const outputPath = join(variantDir, 'index.html');
    writeFileSync(outputPath, html, 'utf-8');

    // Copy PWA assets
    copyFileSync(join(SRC_DIR, 'manifest.json'), join(variantDir, 'manifest.json'));
    copyFileSync(join(SRC_DIR, 'sw.js'), join(variantDir, 'sw.js'));

    // Copy icons directory
    const iconsSrc = join(DIST_DIR, 'icons');
    if (existsSync(iconsSrc)) {
      const iconsDest = join(variantDir, 'icons');
      mkdirSync(iconsDest, { recursive: true });
      for (const file of readdirSync(iconsSrc)) {
        copyFileSync(join(iconsSrc, file), join(iconsDest, file));
      }
    }

    const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
    console.log(`[${variant.name}] Build complete: dist/${variant.name}/index.html (${sizeKB} KB)`);
  }

  console.log('All builds complete.');
}

build();
