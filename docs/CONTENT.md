# Content guide

How to add and change posts, projects, topics, and pages. The schemas in `src/content.config.ts` enforce most rules at build time; `tests/unit/content.test.ts` enforces the rest.

## Posts

One Markdown file per post: `src/content/blog/<slug>.md`. The filename is the URL (`/<slug>/`). Use lowercase kebab-case, 3–5 words.

```yaml
---
title: 'Post title' # 3–70 chars. Shown as H1 and <title>.
description: 'One or two sentences.' # 40–200 chars; aim for 120–160. Meta description and dek.
pubDate: '2026-10-04T00:00:00.000+08:00' # Publication time
updatedDate: '2026-10-10T00:00:00.000+08:00' # Optional. Only for real revisions.
tags: ['ai', 'open-source'] # 1+ keys from src/data/topics.ts. First tag = primary topic (breadcrumb).
draft: true # Optional. Hidden from build, RSS, sitemap. Visible in dev.
image: ../../assets/content/<slug>-og-image.jpg # Optional custom social card
imageAlt: 'What the card shows.' # Required when image is set
---
```

Body rules:

- Do not write an H1. The layout renders the title. Start sections at `##`.
- Three or more `##` headings show a contents list in the article rail.
- Fenced code needs a language. Add a filename with `title="file.ts"` after the language: ` ```php title="UserController.php" `.
- Images: `![Alt text](../../assets/content/file.webp "Optional visible caption")`. Alt text is required and must describe the image.
- Links to other posts are root-relative: `[Uppa](/uppa/)`. External links get a ↗ marker automatically.
- Raw HTML is allowed for figures that need it (see `a-new-look.md`), but must include `alt`, `width`, and `height`.

Social card: without `image`, the build renders `/og/post-<slug>.png` from the title and description. Use a custom card only when it adds something the generated one cannot.

## Topics

Tags must be keys in `src/data/topics.ts`. Each topic has a page at `/blog/<key>/` that uses its `name` as the H1 and its `description` (70–160 characters) as the meta description and intro. Add the topic before using it.

## Projects

One YAML file per project: `src/content/projects/<id>.yaml`. The filename is the anchor on `/projects/`.

| Field               | Rule                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `order`             | Unique positive integer. Lower shows first. The first four `featured` projects show on the home page. |
| `summary`           | 40–160 characters. One sentence about what it does.                                                   |
| `image`, `imageAlt` | 16:10 cover in `src/assets/projects/` or `src/assets/content/`                                        |
| `story`             | Root-relative URL of the post about it, for example `/uppa/`. Must exist.                             |
| `links`             | Labelled absolute URLs. `Source` becomes `codeRepository` / `sameAs` in structured data.              |
| `schemaType`        | `SoftwareApplication` (apps, extensions) or `SoftwareSourceCode` (libraries, self-hosted code)        |
| `platform`          | Operating system line for apps                                                                        |

## Fixed pages

Titles, descriptions, and social card text for `/`, `/blog/`, `/projects/`, `/about/`, `/resume/`, `/collections/`, `/contact/`, and `/privacy/` live in `src/data/pages.ts`. Edit them there.

- Contact and Privacy are Markdown in `src/pages/` with `layout: ../layouts/Prose.astro` and `page: <key>`.
- About, Collections, Projects, and Résumé are Astro pages. Their copy is in the page file (About, Collections) or `src/data/resume.ts` (Résumé).
- The résumé PDF is linked from `src/data/resume.ts` (`resumePdfUrl`). Add a new versioned file under `public/content/files/<year>/<month>/`; keep old PDFs so old links work.

## Voice

Short paragraphs, one idea each. No filler openers. Specific commands, trade-offs, and results over general advice. British or American spelling: follow the existing post.
