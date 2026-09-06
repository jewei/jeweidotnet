# jewei.toString()

Personal site at [jewei.net](https://jewei.net). It is a technical journal, project index, and professional profile for Jewei Mak.

The site uses Astro static output and deploys to Cloudflare Pages. It has no client framework and uses small, native JavaScript files only where needed.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Astro 7, static output |
| Content | Astro Content Collections and Markdown |
| Feeds and discovery | RSS, sitemap, robots.txt, `llms.txt` |
| Styling | Native CSS and custom tokens |
| Fonts | Newsreader, Geist, JetBrains Mono; self-hosted |
| Images | Astro image processing and Sharp |
| Deployment | Cloudflare Pages |
| Package manager | Bun 1.4 or later |

## Project structure

```text
src/
├── assets/                 # Source images and the default social card
├── components/             # Post, project, section, social, and icon components
├── content/blog/           # Technical articles in Markdown
├── data/
│   ├── projects.ts         # Project index data
│   └── resume.ts           # Résumé data
├── layouts/                # Site shell, article layout, and prose page layout
├── pages/                  # Static routes, indexes, résumé, RSS, and 404
├── styles/global.css       # Shared component and page styles
└── support/                # Blog, metadata, code-block, and social-image helpers
tokens.css                  # Color, type, spacing, width, and motion tokens
functions/_middleware.js    # HTML or Markdown content negotiation
scripts/                    # Build-output and smoke-test scripts
tests/                      # Agent-readiness and page-quality contracts
public/                     # Headers, icons, scripts, résumé PDF, and discovery files
```

## Write an article

Create a `.md` file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A short and specific summary."
pubDate: "2026-01-15"
updatedDate: "2026-06-01" # optional
tags: ["php", "open-source"]
image: ../../assets/content/my-cover.jpg # optional
imageAlt: "A useful description of the social image."
draft: false # optional; false by default
---

Post content here.
```

The filename becomes the root article URL. For example, `my-post.md` becomes `/my-post/`.

Add `title="filename.ext"` after a fenced-code language to show a filename and copy control:

````markdown
```php title="UserController.php"
final class UserController {}
```
````

## Commands

| Command | Action |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run dev` | Start the development server |
| `bun run check` | Check Astro and TypeScript |
| `bun run build` | Build HTML, assets, and Markdown copies into `dist/` |
| `bun run preview` | Preview the production build |
| `bun test` | Run all Bun tests |
| `bun run test:agent` | Test agent-readable output and page contracts |
| `bun run test:smoke` | Test required build output after a build |

## Quality controls

CI runs the type check, build, tests, internal-link check, and Lighthouse CI. The Lighthouse minimum is 95 for Performance, Accessibility, Best Practices, and SEO on five representative routes.

The résumé page has a separate A4 print layout. The current downloadable PDF is at `public/content/files/2026/09/jewei-mak-resume-2026.pdf`; the previous URL remains available for compatibility.

## Deployment

Cloudflare Pages builds `dist/` after each push to `main`.

| Setting | Value |
| --- | --- |
| Build command | `bun install --frozen-lockfile && bun run build` |
| Build output directory | `dist` |
| `BUN_VERSION` | `1.4.0` |

Keep the CI Bun version and the Cloudflare `BUN_VERSION` value equal. `wrangler.toml` also sets `pages_build_output_dir = "./dist"` for local tools.
