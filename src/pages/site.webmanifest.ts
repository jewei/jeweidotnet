import type { APIRoute } from 'astro';
import { site } from '../site.config';
import { oklchToHex } from '../lib/color';
import tokens from '../styles/tokens.css?raw';

// The manifest takes one fixed colour: the light theme's --bg (the first in tokens.css).
const bg = /--bg:\s*([^;]+);/.exec(tokens)?.[1];
if (!bg) throw new Error('site.webmanifest.ts: no --bg in tokens.css');
const color = oklchToHex(bg);

export const GET: APIRoute = () =>
  Response.json({
    name: site.name,
    short_name: 'jewei',
    description: `The work and writing of ${site.author}, a senior software engineer and backend architect.`,
    start_url: '/',
    display: 'standalone',
    theme_color: color,
    background_color: color,
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  });
