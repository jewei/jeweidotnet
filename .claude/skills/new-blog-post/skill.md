---
name: new-blog-post
description: >-
  Create a new draft blog post for jewei.net. Use when the user provides content
  or an outline for a new post, asks to write a blog post, or wants to publish
  something to the blog.
---

# New blog post — jewei.net

Read `AGENTS.md` and `docs/CONTENT.md` first. They are the source of truth; this skill is the short path.

## Steps

1. Pick a slug: lowercase kebab-case, 3–5 words. The file is `src/content/blog/<slug>.md`; the URL is `/<slug>/`. It must not clash with a fixed page (`blog`, `projects`, `about`, `resume`, `collections`, `contact`, `privacy`, `og`).
2. Pick 1–3 topics that already exist in `src/data/topics.ts`. The first is the primary topic (breadcrumb). Add a new topic there only if nothing fits, with a 70–160 character description.
3. Write the frontmatter:

   ```yaml
   ---
   title: "Post title"
   description: "120–160 characters. Specific. Appears as meta description and under the title."
   pubDate: "YYYY-MM-DDT00:00:00.000+08:00"
   tags: ["ai"]
   draft: true
   ---
   ```

   Add `image` and `imageAlt` only for a custom social card. Without them, the build generates one.
4. Write the body in the user's voice (strongest reference: `the-eight-levels-of-ai-adoption.md`): short paragraphs, no filler openers, specific commands and results. Start sections at `##`; no H1. Code fences need a language; add `title="file.ext"` for filenames. Images need real alt text.
5. Optimize any new raster images with Squoosh (see `AGENTS.md`) and put them in `src/assets/content/`.
6. Run `vp test tests/unit` (fast content rules), then `vp run verify`.
7. Tell the user the path, the topics and why, and that `draft: true` keeps it hidden until they remove it. Do not publish unless asked.
