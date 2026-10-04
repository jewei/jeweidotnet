# Architecture

## Stack

| Layer                | Choice                                                                                | Why                                                                        |
| -------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Framework            | Astro 7, `output: 'static'`                                                           | HTML-first, zero JS by default, content collections                        |
| Content              | Content collections with Zod schemas (`src/content.config.ts`)                        | Bad frontmatter fails the build with a clear message                       |
| Markdown             | `@astrojs/markdown-remark` `unified()` + local rehype plugins (`src/lib/markdown.ts`) | Code frames, figures, table scroll, heading anchors, external-link markers |
| Fonts                | Astro font API (Google provider, self-hosted at build)                                | Preload, optimized fallbacks, no third-party requests                      |
| Images               | `astro:assets` + Sharp                                                                | Responsive WebP; true social image sizes                                   |
| Social cards         | Satori + Sharp at build (`/og/<key>.png`)                                             | Unique card per page and post with no manual work                          |
| Hosting              | Cloudflare Pages, `dist/` + `functions/_middleware.js`                                | Static assets at the edge; one small function for negotiation              |
| Toolchain            | Vite+ (`vp`): Oxfmt, Oxlint (type-aware), Vitest, task runner, staged hooks           | One config file (`vite.config.ts`), fast checks                            |
| Runtime and packages | Bun (`bun.lock`, `packageManager`)                                                    | `vp install` delegates to Bun                                              |

## Request flow

```text
Browser ──► Cloudflare Pages ──► functions/_middleware.js
                                   ├─ /full-page → 301 /full-page-browser-screenshot/
                                   ├─ static file → asset (headers from public/_headers)
                                   ├─ Accept: text/markdown → <path>/index.md (or Markdown 404)
                                   └─ HTML → asset + security headers + Link: alternate, describedby
```

## Build flow

```text
vp run build
  └─ astro build
       ├─ content collections (blog, projects) → validated entries
       ├─ pages → HTML with inlined CSS
       ├─ og/[key].png → Satori → Sharp → PNG cards
       ├─ rss.xml, llms.txt, robots.txt, site.webmanifest endpoints
       └─ @astrojs/sitemap → sitemap-index.xml with lastmod
  └─ bun scripts/build-markdown.ts → dist/**/index.md from each <main>
```

## Data flow

- `src/site.config.ts` → header, footer, `<head>`, JSON-LD, RSS, manifest, llms.txt.
- `src/data/pages.ts` → fixed-page titles and descriptions, their social cards, llms.txt.
- `src/data/topics.ts` → the schema's tag enum, topic pages, topic cards, labels.
- `src/lib/posts.ts` → sorting, drafts, catalogue numbers, reading time, related posts, dates (Asia/Kuala_Lumpur).

## Client JavaScript

Two files in `public/` (CSP allows only same-origin scripts):

- `theme.js` (render-blocking, about 300 bytes): applies a stored theme before paint.
- `site.js` (deferred): theme toggle, code copy, and the `jewei.toString()` console easter egg.

Everything else is CSS: the reading progress bar (scroll timeline), view transitions, and hover states.

## Tests

| Suite                           | Needs build | Covers                                                                                                                                                                  |
| ------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/unit/content.test.ts`    | no          | slugs, topics, no body H1, image files and alt text, project links, metadata lengths                                                                                    |
| `tests/unit/middleware.test.ts` | no          | negotiation, q-values, 406, Markdown 404, redirects, security headers                                                                                                   |
| `tests/build/seo.test.ts`       | yes         | titles, descriptions, canonicals, OG/Twitter, social image sizes, JSON-LD, sitemap, legacy URLs, RSS, robots                                                            |
| `tests/build/quality.test.ts`   | yes         | lang, skip link, landmarks, alt and dimensions, unique ids, heading order, internal links, anchors, no inline scripts, Markdown copies, llms.txt, CSP parity, JS budget |
| `tests/build/browser.test.ts`   | yes         | Playwright: 320px overflow, console errors, theme toggle, code copy, skip link, focus ring, AAA contrast                                                                |

## Deployment

Cloudflare Pages builds on push to `main`.

| Setting          | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Build command    | `bun install --frozen-lockfile && bun run build` (unchanged)          |
| Output directory | `dist`                                                                |
| `BUN_VERSION`    | `1.4.0` or later; `packageManager` pins 1.4.2 locally                 |
| `VP_GIT_HOOKS`   | Optional `0` to skip hook install (`prepare` never fails the install) |

CI (`.github/workflows/ci.yml`) runs `vp run verify` with `voidzero-dev/setup-vp`.
