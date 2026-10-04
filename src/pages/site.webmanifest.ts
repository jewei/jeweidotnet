import type { APIRoute } from 'astro';
import { site } from '../site.config';

export const GET: APIRoute = () =>
  Response.json({
    name: site.name,
    short_name: 'jewei',
    description: `The work and writing of ${site.author}, a senior software engineer and backend architect.`,
    start_url: '/',
    display: 'standalone',
    theme_color: '#fbfaf7',
    background_color: '#fbfaf7',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  });
