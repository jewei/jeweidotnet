---
name: new-blog-post
description: >-
  Create a new draft blog post for jewei.net. Use when the user provides content
  or an outline for a new post, asks to write a blog post, or wants to publish
  something to the blog.
---

# New Blog Post — jewei.net

Create a new Markdown blog post under `src/content/blog/` from the content or outline
the user provides.

## File location and naming

- Path: `src/content/blog/{slug}.md`
- Slug: lowercase, hyphen-separated, derived from the title. Keep it short (3–5 words).
- Use `.md` unless the post needs MDX features (interactive components, JSX).

## Frontmatter schema

All fields come from `src/content.config.ts`. Use exactly these keys:

```yaml
---
title: "Post Title Here"
description: "One or two sentences. Appears in SEO meta and post cards. Should entice the click."
pubDate: "YYYY-MM-DDT00:00:00.000Z" # today's date at midnight UTC
updatedDate: "YYYY-MM-DDT00:00:00.000Z" # omit unless this is a revision of an existing post
tags: ["tag1", "tag2"] # lowercase, hyphen-separated
draft: true # always true for a new draft; user removes when ready to publish
pinned: false # omit unless the user asks to pin it
image: ../../assets/content/filename.jpg # omit unless a cover image already exists
---
```

**Tag conventions observed in existing posts:**
`ai`, `open-source`, `php`, `system-design`, `database`, `infrastructure`, `entrepreneurship`
Use existing tags when the topic fits. Invent a new tag only when nothing fits.

## Writing style

Match the voice used in existing posts (`src/content/blog/the-eight-levels-of-ai-adoption.md`
is the strongest reference):

- Short paragraphs. One idea per paragraph.
- No em-dash padding. Prefer periods.
- No filler opener sentences ("In today's world…", "Have you ever wondered…").
- Bold sparingly — only for terms being introduced or key takeaways.
- Code in fenced blocks with the language identifier.
- Section headers are `##` (H2), sub-sections `###` (H3). Do not use H1 in the body.

## Workflow

1. Read the user's content or outline.
2. Pick a slug and derive the frontmatter. Set `pubDate` to today. Set `draft: true`.
3. Write the full post body in Markdown, applying the style guide above.
4. Create the file at `src/content/blog/{slug}.md`.
5. Tell the user:
   - The file path
   - The tags chosen and why (if non-obvious)
   - Any frontmatter fields they may want to fill in before publishing (e.g. `image`, `pinned`)
   - That they should remove `draft: true` when ready to publish

## Draft vs publish

A draft with `draft: true` is excluded from the public site. The user removes that line
(or sets it to `false`) when they're ready to publish. Do not publish on their behalf
unless explicitly asked.
