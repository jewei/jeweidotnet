# jewei.toString()

Personal blog at [jewei.net](https://jewei.net) — thoughts on software engineering, system design, and the craft of building things.

Built with [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), and deployed on [Cloudflare Pages](https://pages.cloudflare.com).

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 6 (static output) |
| Styling | Tailwind CSS v4 + custom design system |
| Fonts | Lexend · Geist · JetBrains Mono |
| Deployment | Cloudflare Pages |
| Package manager | Bun |

## Project structure

```
src/
├── content/
│   └── blog/          # Markdown blog posts
├── layouts/
│   ├── BaseLayout.astro      # HTML shell, nav, SEO meta, OG tags
│   ├── BlogPostLayout.astro  # Article layout + JSON-LD
│   └── PageLayout.astro      # Static pages (About, Résumé)
├── pages/
│   ├── index.astro           # Homepage
│   ├── [slug].astro          # Blog post pages
│   ├── blog/
│   │   ├── index.astro       # Blog index with tag filters
│   │   └── [tag].astro       # Posts filtered by tag
│   ├── about.md
│   ├── resume.md
│   └── rss.xml.js
├── styles/
│   └── global.css     # Tailwind + design system tokens
└── utils/
    └── blog.ts        # Shared helpers (tagColors, postUrl, formatters)
public/
├── content/images/    # Post and page images
├── og-image.jpg       # Default social card image
└── robots.txt
```

## Writing a post

Create a `.md` (or `.mdx`) file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A short summary shown in listings and meta tags."
pubDate: "2026-01-15"
tags: ["php", "open-source"]
image: /content/images/2026/01/cover.jpg   # optional, used as og:image
draft: false
---

Post content here…
```

The filename becomes the URL slug: `my-post.md` → `/my-post/`.

## Commands

Run from the project root:

| Command | Action |
|---------|--------|
| `bun install` | Install dependencies |
| `bun run dev` | Start dev server at `localhost:4321` |
| `bun run build` | Build to `./dist/` |
| `bun run preview` | Preview the production build locally |

## Deployment

Deployed automatically to Cloudflare Pages on every push to `main`.

**Build settings** (configured in Cloudflare Pages dashboard):

| Setting | Value |
|---------|-------|
| Build command | `bun install && bun run build` |
| Build output directory | `dist` |
| Environment variable `BUN_VERSION` | `1` |
