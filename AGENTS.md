# AGENTS.md — jewei.net

The personal site of Jewei Mak: writing, projects, and résumé. Astro 7 static output on Cloudflare Pages. Bun is the package manager and runtime. Vite+ (`vp`) is the toolchain.

This file is the rule source for every agent. Read it before you change anything. Detail lives in `docs/`.

## Golden rules

1. **Content is sacred.** Do not edit post prose, résumé facts, or page copy unless the user asks. Metadata fixes (frontmatter, alt text) are allowed when a rule below requires them; report them.
2. **One source per fact.** Identity and nav → `src/site.config.ts`. Page titles and descriptions → `src/data/pages.ts`. Topics → `src/data/topics.ts`. Tokens → `src/styles/tokens.css`. Never hard-code these elsewhere.
3. **Tokens only.** Styles use the CSS custom properties in `tokens.css`. No raw colours, font stacks, or spacing values in components.
4. **Keep every URL.** Post URLs are `/<slug>/`; topics are `/blog/<topic>/`. `tests/build/legacy-urls.txt` lists URLs that must keep working. Renames need a redirect in `functions/_middleware.js`.
5. **No client frameworks.** Zero hydration. The only JavaScript is `public/theme.js` and `public/site.js` (under 8 KB together). The CSP forbids inline scripts.
6. **Green gate before done.** Run `vp run verify`. It must pass. Never weaken a test to make it pass; fix the cause or ask.

## Commands

Run everything through Vite+. It calls Bun and Astro for you.

| Command                                             | What it does                                                                                                  |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `vp install`                                        | Install dependencies (uses Bun, `bun.lock`)                                                                   |
| `vp run dev`                                        | Astro dev server. Drafts are visible in dev only.                                                             |
| `vp run build`                                      | `astro build`, then Markdown copies of every page into `dist/`                                                |
| `vp check` / `vp check --fix`                       | Format (Oxfmt), lint (Oxlint), type-aware checks                                                              |
| `vp run typecheck`                                  | `astro check` for `.astro` files (cached)                                                                     |
| `vp test tests/unit`                                | Content rules and middleware tests. No build needed.                                                          |
| `vp run test:build`                                 | Build, then SEO, quality, and Playwright browser tests                                                        |
| `vp run verify`                                     | The full gate: check, typecheck, unit tests, build tests                                                      |
| `vp run shots -- / /blog/ --widths=375,1440 --full` | Screenshots into `.shots/` for design review                                                                  |
| `vp run clean`                                      | Delete `dist/` and Astro caches. **Run after editing `src/lib/markdown.ts`**: Astro caches rendered Markdown. |
| `vp run og:optimize -- <in> <out.jpg>`              | Crop a custom social card to 1200×630                                                                         |

`vp test` runs Vitest (import from `vite-plus/test`). `vp run <task>` runs tasks from `vite.config.ts`. `package.json` has only two scripts: `build` (Cloudflare Pages runs `bun run build`) and `prepare` (installs the Vite+ Git hooks).

## Where things live

```text
src/
  site.config.ts        identity, URLs, nav, footer, analytics
  content.config.ts     schemas: blog posts, projects
  content/blog/*.md     posts — filename is the URL slug
  content/projects/*.yaml   projects — filename is the /projects/#anchor
  data/pages.ts         title, description, card text for fixed pages
  data/topics.ts        topic registry (post tags must be keys here)
  data/resume.ts        résumé content
  lib/                  posts, projects, seo (JSON-LD), og (cards), markdown (rehype)
  layouts/Base.astro    <head>, SEO tags, header, footer — every page
  layouts/Prose.astro   Markdown pages (contact, privacy)
  components/           Header, Footer, PostList, ProjectCard, PageHeader, TopicNav, Icon, Wordmark
  pages/                routes; [slug].astro = posts; og/[key].png.ts = social cards
  styles/               tokens.css, base.css, prose.css
public/                 _headers, theme.js, site.js, icons, /content files (PDF, legacy images)
functions/_middleware.js  Markdown negotiation, redirects, security headers
scripts/                build-markdown.ts, screenshots.ts, optimize-og-image.ts
tests/unit/             no-build tests;   tests/build/  needs dist/
docs/                   ARCHITECTURE, DESIGN, CONTENT, SEO, REVIEW
```

## Recipes

Each recipe ends with `vp run verify`.

- **New post:** add `src/content/blog/<slug>.md`. See `docs/CONTENT.md` for frontmatter. Set `draft: true` until the user says publish. Use topics from `src/data/topics.ts`. Without `image`, a social card is generated.
- **New topic:** add a key with `name` and a 70–160 character `description` to `src/data/topics.ts`.
- **New project:** add `src/content/projects/<id>.yaml` (copy an existing one). `story` must point to an existing post. Set `order`.
- **New fixed page:** add an entry to `src/data/pages.ts`, then the route in `src/pages/`. Prose pages: Markdown with `layout: ../layouts/Prose.astro` and `page: <key>`. Add it to `footerNav` in `site.config.ts` if visitors need it.
- **Design change:** read `docs/DESIGN.md` first. Change tokens before components. Run `vp run shots` and look at 320, 768, 1440 in both themes.
- **Rename a URL:** add a 301 in `functions/_middleware.js`, a test in `tests/unit/middleware.test.ts`, and keep the old path in `legacy-urls.txt` only if it still resolves.

## Skills

Project skills live in `.claude/skills/`. Use them for these tasks:

| Skill                    | Use for                                        |
| ------------------------ | ---------------------------------------------- |
| `new-blog-post`          | Drafting a post                                |
| `open-graph-image`       | Generated or custom social cards               |
| `resume-review`          | Résumé content, page, and PDF                  |
| `web-perf`               | Core Web Vitals and Lighthouse work            |
| `wrangler`, `cloudflare` | Pages deploys, headers, and the Pages Function |

## Images

Use [Squoosh](https://squoosh.app/) to optimize all new raster image assets before committing them. Store the optimized files in the repository and update their code references. Check the images at their display size. Keep text and interface details legible.

Keep uncompressed generated originals outside the repository unless the user asks to include them.

Post images go in `src/assets/content/` and are referenced relatively from Markdown so Astro resizes them. Every image needs real alt text; a Markdown image title (`![alt](src "Caption")`) becomes a visible caption.

## Definition of done

- `vp run verify` passes.
- For visual changes: screenshots at 320, 768, and 1440 in light and dark were reviewed against `docs/REVIEW.md`.
- New rules or gotchas are written into this file or the right doc, not left in a chat.
- Commits are small and use Conventional Commit prefixes (`feat`, `fix`, `docs`, `test`, `perf`, `chore`).

## Gotchas

- Astro caches rendered Markdown in `node_modules/.astro`. After changing rehype plugins, run `vp run clean`.
- `build` is not cached on purpose: the Markdown step reads `dist/`.
- Astro's `compressHTML` is off on purpose: it removed spaces next to links.
- Shiki output uses the class `astro-code`, not `shiki`.
- The CSP in `public/_headers` and `functions/_middleware.js` must match (a test checks it).
- Satori (social cards) cannot render `№`; cards use `No.`.
