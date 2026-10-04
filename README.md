# jewei.toString()

The personal site of Jewei Mak at [jewei.net](https://jewei.net): technical writing, projects, and a résumé.

Astro 7 static output on Cloudflare Pages. Bun for packages and scripts. Vite+ for formatting, linting, type checks, tests, tasks, and Git hooks. No client framework; about 3 KB of JavaScript.

## Quick start

```sh
vp install          # dependencies (Bun) and Git hooks
vp run dev          # http://localhost:4321
vp run verify       # format, lint, type-check, build, and every test
```

No global `vp`? Use `bunx vp …`.

## Docs

| Doc                                          | Read it when you…                                             |
| -------------------------------------------- | ------------------------------------------------------------- |
| [AGENTS.md](AGENTS.md)                       | work on the repo at all (rules, commands, recipes)            |
| [docs/CONTENT.md](docs/CONTENT.md)           | add a post, project, topic, or page                           |
| [docs/DESIGN.md](docs/DESIGN.md)             | change anything visual                                        |
| [docs/SEO.md](docs/SEO.md)                   | touch metadata, structured data, feeds, or discovery files    |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | need the build, request, or test flow, or deployment settings |
| [docs/REVIEW.md](docs/REVIEW.md)             | review a change against the AAA bar                           |

## Write a post

```sh
$EDITOR src/content/blog/my-post.md   # see docs/CONTENT.md for frontmatter
vp run dev                            # drafts show in dev only
vp run verify
```

## Deploy

Cloudflare Pages builds `main` with `bun install --frozen-lockfile && bun run build` into `dist/`.
