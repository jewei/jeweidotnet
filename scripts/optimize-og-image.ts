/// <reference types="bun" />
/**
 * Crop and compress a custom social card to exactly 1200×630 JPEG.
 *
 *   vp run og:optimize -- draft.png src/assets/content/<slug>-og-image.jpg
 *
 * Then pass the result through Squoosh (see AGENTS.md) and set `image` and
 * `imageAlt` in the post frontmatter. Posts without `image` get a generated
 * card at /og/post-<slug>.png automatically.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('Usage: vp run og:optimize -- <input> <output.jpg>');
  process.exit(1);
}
if (!fs.existsSync(input)) {
  console.error(`optimize-og-image: input not found: ${input}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(output), { recursive: true });
const { width, height, size } = await sharp(input)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(output);

console.log(`optimize-og-image: ${output} (${width}×${height}, ${(size / 1024).toFixed(1)} KB)`);
