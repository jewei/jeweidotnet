# jewei.toString()

Personal blog at [jewei.net](https://jewei.net) — thoughts on software engineering, system design, and the craft of building things.

Built with [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), and deployed on [Cloudflare Pages](https://pages.cloudflare.com).

## Stack

| Layer           | Technology                                    |
| --------------- | --------------------------------------------- |
| Framework       | Astro 7 (static output)                       |
| Content         | Astro Content Collections (Markdown + MDX)    |
| Integrations    | MDX · RSS · Sitemap                           |
| Styling         | Tailwind CSS v4 + custom design system        |
| Fonts           | Lexend · Geist · JetBrains Mono (self-hosted) |
| Deployment      | Cloudflare Pages                              |
| Package manager | Bun                                           |
| Runtime         | Bun ≥ 1.4                                     |

## Project structure

```
src/
├── assets/            # Images optimized by Astro at build time
│   ├── content/       # Blog and page illustrations
│   ├── og-image.jpg   # Default social card image
│   └── …              # Site UI images (avatar, 404 art, etc.)
├── components/
│   └── Icon.astro     # Shared SVG icon component
├── content/
│   └── blog/          # Markdown / MDX blog posts
├── content.config.ts  # Blog collection schema
├── data/
│   └── resume.ts      # Résumé content
├── layouts/
│   ├── BaseLayout.astro      # HTML shell, nav, SEO meta, OG tags
│   ├── BlogPostLayout.astro  # Article layout + JSON-LD
│   └── PageLayout.astro      # Static pages (About)
├── pages/
│   ├── index.astro           # Homepage
│   ├── [slug].astro          # Blog post pages
│   ├── blog/
│   │   ├── index.astro       # Blog index with tag filters
│   │   └── [tag].astro       # Posts filtered by tag
│   ├── about.md
│   ├── contact.md
│   ├── privacy.md
│   ├── collections.astro     # Curated quotes and links
│   ├── resume.astro
│   ├── 404.astro
│   └── rss.xml.js
├── styles/
│   └── global.css     # Tailwind + design system tokens
└── support/
    ├── blog.ts        # Shared helpers (tagColors, postUrl, formatters)
    ├── site.ts        # Site name and page title helpers
    └── social-image.ts # OG/Twitter image resolution
functions/
└── _middleware.js     # Accept negotiation and agent-friendly Markdown 404s
scripts/
└── generate-markdown.mjs # Builds a Markdown sibling for every HTML page
public/
├── content/files/     # Static downloads (e.g. résumé PDF)
├── _headers           # Cloudflare Pages cache and security headers
├── llms.txt           # Agent guidance and site index
├── site.webmanifest
└── robots.txt
```

## Writing a post

Create a `.md` (or `.mdx`) file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A short summary shown in listings and meta tags."
pubDate: "2026-01-15"
updatedDate: "2026-06-01" # optional
tags: ["php", "open-source"]
image: ../../assets/content/my-cover.jpg # optional, path relative to this file
draft: false # optional, defaults to false
---

Post content here…

Use `../../assets/content/...` for inline images in the post body as well. Astro optimizes them at build time.
```

The filename becomes the URL slug: `my-post.md` → `/my-post/`.

## Commands

Run from the project root:

| Command              | Action                                  |
| -------------------- | --------------------------------------- |
| `bun install`        | Install dependencies                    |
| `bun run dev`        | Start dev server at `localhost:4321`    |
| `bun run build`      | Build to `./dist/`                      |
| `bun run preview`    | Preview the production build locally    |
| `bun run test:agent` | Test content negotiation and agent-readable output |
| `bun run test:smoke` | Verify build output (run after `build`) |

## CI

GitHub Actions on every push and pull request to `main`:

1. `bun install --frozen-lockfile`
2. `bun run check` (type checks `.astro`/TS via `astro check`)
3. `bun run build`
4. `bun run test:agent`
5. `bun run test:smoke`
6. Link check (Lychee) on built HTML
7. Lighthouse CI

The CI Bun version is pinned (`bun-version: 1.4.0` in `ci.yml`) to match the
`BUN_VERSION` deploy setting below. Bump both together.

## Deployment

Deployed automatically to Cloudflare Pages on every push to `main`.

**Build settings** (configured in Cloudflare Pages dashboard):

| Setting                            | Value                                            |
| ---------------------------------- | ------------------------------------------------ |
| Build command                      | `bun install --frozen-lockfile && bun run build` |
| Build output directory             | `dist`                                           |
| Environment variable `BUN_VERSION` | `1.4.0` (match CI)                               |

`wrangler.toml` sets `pages_build_output_dir = "./dist"` for local Wrangler tooling.
