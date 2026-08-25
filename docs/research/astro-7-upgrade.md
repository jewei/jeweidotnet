# Astro 7.2 upgrade findings

Checked 2026-08-25. Scope: `package.json`, `astro.config.mjs`, `src/`, `scripts/`, and `tests/`. Version targets use each package's stable npm `latest` tag. Only first-party release posts, Astro documentation, package registries, and package-owned changelogs/docs were used.

## Recommendation

Upgrade to Astro 7.2.6, keep the existing unified Markdown pipeline, and pin TypeScript to 6.0.3 for now. The repository already follows the current content collection, font, image, sitemap, RSS, and Tailwind integration APIs. The required source changes are small:

1. Declare `@astrojs/markdown-remark` and `sharp` directly.
2. Add explicit spaces around inline elements affected by Astro 7's JSX whitespace rules.
3. Make the CSS-output test insensitive to minifier serialization.
4. Add Astro's Node requirement to `engines`.

A clean-room rehearsal with Astro 7.2.6, the dependency targets below, Bun 1.4.0, Node 26.7.0, and TypeScript 6.0.3 produced zero `astro check` diagnostics. The build and smoke test passed. One agent test failed because Vite 8 serialized `@media (min-width:48rem)` as `@media (width>=48rem)`.

## Dependency plan

| Package | Current | Target | Action |
| --- | ---: | ---: | --- |
| `astro` | 6.4.8 | 7.2.6 | Upgrade. |
| `@astrojs/rss` | 4.0.19 | 4.0.19 | Already latest. |
| `@astrojs/sitemap` | 3.7.3 | 3.7.3 | Already latest. |
| `@tailwindcss/vite` | 4.3.3 | 4.3.3 | Already latest and accepts Vite 8. |
| `tailwindcss` | 4.3.3 | 4.3.3 | Already latest. |
| `rehype-external-links` | 3.0.0 | 3.0.0 | Already latest. |
| `yaml` | 2.9.0 | 2.9.0 | Already latest. |
| `@astrojs/check` | 0.9.10 | 0.9.10 | Already latest. |
| `turndown` | 7.2.4 | 7.2.4 | Already latest. |
| `typescript` | 6.0.3 | 6.0.3 | Do not take npm `latest` 7.0.2 yet. `astro check` requires the programmatic API still shipped by TypeScript 6, and `@astrojs/check` declares only TypeScript 5 or 6 as peers. |
| `@astrojs/markdown-remark` | transitive | 7.2.4 | Add as a direct dependency because `astro.config.mjs` imports it and Astro 7 no longer installs it by default. |
| `sharp` | transitive | 0.35.3 | Add as a direct development dependency because `scripts/optimize-og-image.mjs` imports it. Do not rely on Astro's dependency tree. |

Version and compatibility sources: [Astro package](https://www.npmjs.com/package/astro), [Astro changelog](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md), [RSS package](https://www.npmjs.com/package/@astrojs/rss), [sitemap changelog](https://github.com/withastro/astro/blob/main/packages/integrations/sitemap/CHANGELOG.md), [Astro check package](https://www.npmjs.com/package/@astrojs/check), [TypeScript 7 tracking discussion](https://github.com/withastro/roadmap/discussions/1321), [Tailwind releases](https://github.com/tailwindlabs/tailwindcss/releases), [rehype-external-links releases](https://github.com/rehypejs/rehype-external-links/releases), [YAML releases](https://github.com/eemeli/yaml/releases), [Turndown releases](https://github.com/mixmark-io/turndown/releases), [TypeScript releases](https://github.com/microsoft/TypeScript/releases), and [Sharp changelog](https://sharp.pixelplumbing.com/changelog/).

## Required migration work

### Runtime and tooling

Astro 7 requires Node 22.12.0 or newer and does not support odd-numbered Node releases. `package.json` currently declares only Bun. Add a Node engine such as `"node": ">=22.12.0"`; CI and deployment must use a supported even-numbered release. Keep the Bun constraint because the build, scripts, and tests call Bun-specific APIs. Astro documents Bun installation, `bun run build`, integrations, and Bun's test runner, but does not state an Astro-specific minimum Bun version. Sources: [install requirements](https://docs.astro.build/en/install-and-setup/) and [Bun recipe](https://docs.astro.build/en/recipes/bun/).

Astro 7 moves to Vite 8 and Rolldown. This repository has no Vite-internal configuration; its only Vite plugin is the official `@tailwindcss/vite`, whose current peer range includes Vite 8. No config change is needed. Exact generated CSS is not a stable test contract. Change `tests/agent-readiness.test.js` to accept equivalent media-query serialization or, better, assert the desktop behavior without matching a minified byte sequence. Sources: [Astro 7 release](https://astro.build/blog/astro-7/) and [Astro 7 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v7/#dependency-upgrades).

### Compiler and whitespace

The Rust compiler no longer repairs invalid HTML and now rejects unclosed non-void tags and unterminated attributes. It also leaves semantically invalid nesting for the browser to repair. The rehearsal build found no compiler errors in this repository. Still perform a visual pass because CSS serialization can differ. Source: [Rust compiler migration](https://docs.astro.build/en/guides/upgrade-to/v7/#rust-compiler).

Astro 7 changes `compressHTML` from `true` to `'jsx'`. Newlines between inline elements no longer create spaces. This causes a confirmed regression in `src/pages/index.astro`: the sign-off renders as `theRSS feedfirst. Orcome say hi`. Add explicit `{' '}` expressions around those links. Audit similar text-plus-inline-element markup, including the empty-state copy. Prefer explicit spaces over restoring `compressHTML: true`; it records the intended output locally. Source: [whitespace migration](https://docs.astro.build/en/guides/upgrade-to/v7/#new-default-whitespace-handling-compresshtml-jsx).

There is no `src/fetch.ts` or `src/fetch.js`, so Astro 7's reserved advanced-routing entrypoint does not conflict. The repository also does not use removed Astro DB or transition internals. Source: [Astro 7 breaking changes](https://docs.astro.build/en/guides/upgrade-to/v7/#breaking-changes).

### Markdown processor

Astro 7 defaults to the Rust-based Satteri processor and stops installing `@astrojs/markdown-remark`. This project cannot switch without replacing `rehype-external-links` and the custom `rehypeTableScroll` tree transform. The supported low-risk migration is to keep the existing `unified({...})` config and add `@astrojs/markdown-remark@7.2.4` directly. A later Satteri port may improve Markdown build speed, but it is not required for Astro 7. Sources: [Astro 7 Markdown announcement](https://astro.build/blog/astro-7/#markdown--mdx-in-rust), [processor migration](https://docs.astro.build/en/guides/upgrade-to/v7/#new-default-markdown-processor-sätteri), and [Markdown processor setup](https://docs.astro.build/en/guides/markdown-content/#setting-up-a-markdown-processor).

### Content collections

`src/content.config.ts` already uses the current `src/content.config.ts` location, `glob()` loader, `astro/zod`, schema callback `image()`, `getCollection()`, and `render(entry)`. The code also sorts `getCollection()` results, as the docs require because loader order is not deterministic. No mandatory change is needed. Source: [content collections guide](https://docs.astro.build/en/guides/content-collections/).

Astro 7.1 adds `deferRender: true` to `glob()` for large Markdown collections that should not cache rendered HTML during sync. This blog has 11 entries, so enabling it would trade away rebuild caching for no useful memory saving. Leave it off. Source: [Astro 7.1 release](https://astro.build/blog/astro-710/#lower-memory-usage-for-large-content-collections).

Astro 7.2's incremental static build is optional and experimental. If adopted, add `experimental.incrementalBuild: true`, persist `node_modules/.astro/`, and return `cacheKey` from `src/pages/[slug].astro`. Do not use only `post.digest`: each page also renders previous and next post data. Use a stable composite of the current, previous, and next IDs/digests so navigation changes invalidate the page. Routes without a key continue to render normally. Target 7.2.6 rather than 7.2.0 because the patch series fixes incremental builds with fonts, images, shared dependency graphs, and stale CSS. Sources: [Astro 7.2 release](https://astro.build/blog/astro-720/#experimental-incremental-static-builds) and [Astro changelog](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md).

### Fonts and images

The font setup is current: providers belong in `fonts` config, each family has a CSS variable, and layouts render `<Font />` in `<head>`. Preloading only Bricolage is consistent with the guidance to preload sparingly; JetBrains Mono is loaded only on code-heavy posts. No migration is required. Source: [Astro fonts guide](https://docs.astro.build/en/guides/fonts/).

The image setup is also current. Local files live under `src/assets`; content images use the schema `image()` helper; components use `<Image />`; generated social images use server-side `getImage()`; and the global constrained layout makes Markdown `![]()` images responsive. Explicit `layout="none"` correctly opts hand-tuned images out. Keep `responsiveStyles: true` only if Astro should own the base sizing rules. Astro 7.1 wraps these generated rules in `@layer astro.images`, below user layers, and 7.2 patches several content-image and incremental-build bugs. Source: [images guide](https://docs.astro.build/en/guides/images/#responsive-image-behavior) and [Astro changelog](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md).

### Official integrations

`@astrojs/sitemap` remains correctly configured with `site` and `serialize()`. Version 3.7.3 improves sitemap-index `lastmod` accuracy and needs no code change. The repository's disk-based frontmatter map is still necessary because the integration hook cannot query `astro:content`. Source: [sitemap docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/) and [sitemap changelog](https://github.com/withastro/astro/blob/main/packages/integrations/sitemap/CHANGELOG.md).

`src/pages/rss.xml.js` uses the supported `@astrojs/rss` endpoint and content-collection pattern. Version 4.0.19 is already latest. Source: [RSS guide](https://docs.astro.build/en/guides/rss/).

## Verification after implementation

Run, in order:

```sh
bun install
bun run check
bun run build
bun run test:smoke
bun run test:agent
```

Then compare key pages visually, focusing on inline text spacing, responsive images, fonts, Markdown external-link additions, wrapped tables, sitemap `lastmod`, and RSS URLs. Astro 7.1's `deferRender`, chunked collection storage, and Astro 7.2's incremental builds are optional optimizations, not migration requirements. The background `dev` and `preview` modes and `session: false` likewise do not affect this static site. Sources: [Astro 7 release](https://astro.build/blog/astro-7/), [Astro 7.1 release](https://astro.build/blog/astro-710/), and [Astro 7.2 release](https://astro.build/blog/astro-720/).
