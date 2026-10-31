/**
 * URLs for the two client scripts in public/. Each URL carries a hash of the
 * file's content (`/site.js?v=<hash>`). The files keep fixed names, and caches
 * can keep an old copy after a deploy: the Cloudflare edge, and browsers
 * through the zone's 4-hour Browser Cache TTL, which overrides `_headers`.
 * A changed script gets a new URL, so new HTML never runs old JavaScript.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

function versioned(file: 'site.js' | 'theme.js'): string {
  const source = fs.readFileSync(path.resolve('public', file));
  return `/${file}?v=${createHash('sha256').update(source).digest('hex').slice(0, 10)}`;
}

export const scripts = {
  theme: versioned('theme.js'),
  site: versioned('site.js'),
};
