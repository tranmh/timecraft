/**
 * Generate PWA and Capacitor app icons from the source SVG.
 * Usage: node scripts/generate-icons.js
 */

import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SVG = join(ROOT, 'src', 'img', 'icon.svg');
const OUT = join(ROOT, 'dist', 'icons');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function generate() {
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

  for (const size of SIZES) {
    await sharp(SVG)
      .resize(size, size)
      .png()
      .toFile(join(OUT, `icon-${size}x${size}.png`));
    console.log(`Generated icon-${size}x${size}.png`);
  }

  // Apple touch icon
  await sharp(SVG)
    .resize(180, 180)
    .png()
    .toFile(join(OUT, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  console.log('Done.');
}

generate();
