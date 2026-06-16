#!/usr/bin/env node
/**
 * Resize and optimize an OG image to exactly 1200×630 JPEG.
 * Uses Sharp (transitive dependency of Astro — no extra install).
 *
 * Usage:
 *   bun scripts/optimize-og-image.mjs <input> <output>
 *   bun scripts/optimize-og-image.mjs draft.jpg src/assets/content/my-post-og-image.jpg
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [input, output] = process.argv.slice(2);

if (!input || !output) {
  console.error('Usage: bun scripts/optimize-og-image.mjs <input> <output>');
  process.exit(1);
}

if (!fs.existsSync(input)) {
  console.error(`optimize-og-image: input not found: ${input}`);
  process.exit(1);
}

const WIDTH = 1200;
const HEIGHT = 630;

fs.mkdirSync(path.dirname(output), { recursive: true });

const { width, height, size } = await sharp(input)
  .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(output);

if (width !== WIDTH || height !== HEIGHT) {
  console.error(`optimize-og-image: expected ${WIDTH}×${HEIGHT}, got ${width}×${height}`);
  process.exit(1);
}

const kb = (size / 1024).toFixed(1);
console.log(`optimize-og-image: ${output} (${width}×${height}, ${kb} KB)`);
