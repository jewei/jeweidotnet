---
name: open-graph-image
description: >-
  Create or update Open Graph social preview images (1200×630) for jewei.net.
  Use when creating or updating OG images, social cards, Twitter/X preview
  images, or the `image` frontmatter field on blog posts.
---

# Social cards — jewei.net

Read `docs/SEO.md` and `docs/DESIGN.md` first.

## Default: generated cards (no work needed)

Every page, topic, and post without `image` gets a card at `/og/<key>.png`, rendered at build time by `src/lib/og.ts` (Satori + Sharp): signal-orange background with ink text, `jewei.toString()` wordmark, eyebrow (`No. 012 · Writing`) and title in Zalando Sans Expanded (700 and 800, from `@fontsource/zalando-sans-expanded`), description in Geist, ink bar, `jewei.net`. The wide face needs smaller title steps than Geist; `titleSize()` in `og.ts` sets them. Pages link a card as `/og/<key>.png?v=<hash>` (`ogImage()`; `Base.astro` adds the hash to any `/og/` path), so a changed card is a new URL and edge caches never serve the old one.

- Change the design for all cards in `src/lib/og.ts`. Keep it in line with `docs/DESIGN.md`.
- Check a card: `vp run build`, then open `dist/og/post-<slug>.png`.
- Satori has no `№` glyph and needs WOFF/TTF fonts (from `@fontsource/*`).

## Custom card for one post

Use a custom card only when the post has a strong visual (product screenshot, diagram) that the generated card cannot show.

1. Design at 1200×630 in the site style: signal orange `#fa761b` with ink `#0f0a08` (7.2:1), or concrete `#e1e0dc` with an off-white plate `#f4f3f0` and an orange accent; Zalando Sans Expanded 800 for titles, Geist for subtitles, generous margins (64px+). Readable at 300px wide.
2. Crop and compress: `vp run og:optimize -- /tmp/draft.png src/assets/content/<slug>-og-image.jpg`.
3. Optimize with Squoosh (see `AGENTS.md`). Keep the raw original outside the repo.
4. Add to the post frontmatter:

   ```yaml
   image: ../../assets/content/<slug>-og-image.jpg
   imageAlt: "What the card shows, in one sentence."
   ```

5. `vp run verify`. The SEO tests check that `og:image` dimensions match the real file.
