---
name: open-graph-image
description: >-
  Generate Open Graph social preview images (1200×630) for jewei.net blog posts.
  Use when creating or updating OG images, social cards, Twitter/X preview images,
  or the `image` frontmatter field on blog posts.
---

# Open Graph Image — jewei.net

Generate branded social preview images for blog posts on **jewei.toString()** ([jewei.net](https://jewei.net)). Each image must be **exactly 1200×630 px** and reflect the specific post's topic while matching the site's "Playful-Minimal" / "Cute but Premium" aesthetic.

## When to Use

- A blog post needs a new or updated social preview image
- The user asks for an OG image, social card, or Twitter/X card
- A post currently points at the generic default (`src/assets/og-image.jpg`) and deserves a custom card

## Output Contract

| Requirement | Value |
|---|---|
| Dimensions | **1200 × 630 px** (1.91:1) — exact, no exceptions |
| Format | JPEG (`.jpg`), quality ≥ 85 |
| Save location | `src/assets/content/{slug}-og-image.jpg` |
| Frontmatter | `image: ../../assets/content/{slug}-og-image.jpg` |
| Fallback default | `src/assets/og-image.jpg` |

After saving, wire the image into the post frontmatter and verify the build.

## Site Identity (hardcoded)

| Key | Value |
|---|---|
| Site name / wordmark | `jewei.toString()` |
| Domain (footer) | `jewei.net` |
| Author | Jewei Mak |
| Homepage tagline | "Thoughts, stories and ideas." |
| Theme color | `#630ed4` |

There is no separate logo SVG. The brand mark is the **text wordmark** `jewei.toString()` rendered in **Lexend Bold**, colored primary purple. Use favicon only as a small accent if needed:

- `public/favicon-32x32.png`
- `public/android-chrome-512x512.png` (higher-res icon)

Author avatar (optional accent, not required on every card): `src/assets/jewei.jpg`

## Design Tokens (hardcoded)

Source of truth: `DESIGN.md` (project root) and `src/styles/global.css` (`@theme` block).

### Colors

```
primary:           #630ed4
surface-tint:      #732ee4
on-primary:        #ffffff
secondary:         #0058be
secondary-container: #2170e4
tertiary:          #005b33
tertiary-container: #007644

surface:           #f9f9ff
surface-container: #e7eefe
surface-container-low: #f0f3ff
on-surface:        #151c27
on-surface-variant: #4a4455
outline-variant:   #ccc3d8

inverse-primary:   #c084fc   (dark-mode accent)
bg-dark:           #0F071D
surface-dark:      #1A1429
inverse-on-surface: #ebf1ff
```

**Light-mode cards (default):** airy off-white surface (`#f9f9ff`) with soft purple/blue blob washes at ~8% opacity. **Dark-mode cards (optional):** deep purple-tinted `#0F071D` background — use when the post topic feels technical or the cover art is dark.

### Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Site wordmark | Lexend | 700 | `jewei.toString()` — primary purple |
| Post title | Lexend | 600–700 | 48–64 px, `-0.02em` letter-spacing, max 2 lines |
| Description / tagline | Geist | 400 | 22–28 px, `on-surface-variant`, max 2 lines |
| Tags | Geist | 600 | 14 px, uppercase, pill chips |
| Domain footer | Geist | 600 | 18 px, `on-surface-variant` or `inverse-on-surface/60` |
| Code accents | JetBrains Mono | 400 | Only when the post is code-heavy |

Fonts are self-hosted via Astro (`astro.config.mjs`): Lexend, Geist, JetBrains Mono.

### Shapes & Decoration

Match the live site (`src/pages/index.astro`, `src/layouts/BaseLayout.astro`):

- **Blob backgrounds:** large blurred circles (`filter: blur(80px)`, ~8% opacity) in primary and secondary
- **Sparkle doodles:** small 4-point stars in primary/secondary at ~30% opacity
- **Cards:** `rounded-xl` (24 px radius), 1 px border `outline-variant/30`, faint primary-tinted shadow
- **Buttons/gradients:** `linear-gradient(to right, #630ed4, #732ee4)`
- **Tag chips:** pill shape, cycling through `primary-fixed` / `secondary-fixed` / `tertiary-fixed` backgrounds (see `src/support/blog.ts` → `tagColors`)

### Spacing

8 px rhythm. Content safe area: **64 px** padding on all sides (leaves ~1072×502 px content box).

## Content Structure

Every OG image should include these layers, top to bottom:

1. **Site wordmark** — `jewei.toString()` in Lexend Bold, primary purple, top-left
2. **Post title** — the blog post `title` from frontmatter; this is the hero text
3. **Description** — the post `description` field, or a one-line summary derived from the post body
4. **Visual anchor** — illustration, diagram, screenshot crop, or abstract motif tied to the post topic (right side or background)
5. **Tags** (optional) — pill chips from the post `tags` array
6. **Domain** — `jewei.net` anchored bottom-left or bottom-center

The image must be **readable at thumbnail size** (~300 px wide in Slack/Twitter previews). Prioritize title contrast and size over decorative detail.

## Workflow

### 1. Read the blog post

```
src/content/blog/{slug}.md
```

Extract from frontmatter: `title`, `description`, `tags`, `pubDate`. Skim the body for a visual hook (diagram, metaphor, key phrase).

### 2. Check for existing assets

Look in `src/assets/content/` for images already used in the post body that could be adapted:

| Post slug | Existing content image | Current OG image |
|---|---|---|
| `the-eight-levels-of-ai-adoption` | `eight-levels-of-ai-adoption-infographic.jpg` | `eight-levels-of-ai-og-image.jpg` ✓ |
| `introducing-typeid-php` | `typeid-php-thumb.png` | `typeid-cover.jpg` |
| `they-said-php-is-dead` | `midwit-php.jpeg` | same (reused) |
| `the-spectrum-of-software-makers` | `spectrum-of-software-makers-2x.png` | same (reused) |
| `laravel-skeleton` | `laravel-skeleton-1.png` | same (reused) |
| `database-primary-key` | — | `../../assets/og-image.jpg` (generic) |
| `scale-to-millions-of-users` | — | `../../assets/og-image.jpg` (generic) |

Prefer a **dedicated** `-og-image.jpg` over reusing an in-article screenshot. Dedicated cards include branding layers the article image lacks.

### 3. Generate the image

Use the `GenerateImage` tool (or hand-craft in Figma/Canva) with a prompt that includes:

- Exact dimensions: 1200×630
- Color palette values from above
- Font families: Lexend + Geist
- Post title and description text (spell exactly as in frontmatter)
- Visual style: playful-minimal, soft gradients, sparkle accents, developer blog
- Domain text: `jewei.net`

**Example prompt skeleton:**

> Social media preview card, 1200×630 pixels. Developer blog "jewei.toString()" brand. Light airy background #f9f9ff with soft purple (#630ed4) and blue (#0058be) gradient blobs. Top-left: "jewei.toString()" in bold purple Lexend font. Center-left: post title "{title}" in large bold Lexend dark text (#151c27). Below title: "{description}" in Geist regular gray (#4a4455). {visual description for this post}. Small sparkle star decorations. Bottom: "jewei.net" in subtle gray. Clean, premium, playful-minimal aesthetic. High contrast for small preview sizes. No watermarks.

Save the raw generated image to a temp path (any dimensions), then optimize in the next step.

### 4. Optimize with Sharp

Resize, center-crop, and compress to the exact OG spec using **Sharp** — already available via Astro's image toolchain (no extra install).

```bash
bun scripts/optimize-og-image.mjs /tmp/{slug}-draft.jpg src/assets/content/{slug}-og-image.jpg
```

Or via the package script:

```bash
bun run optimize:og /tmp/{slug}-draft.jpg src/assets/content/{slug}-og-image.jpg
```

The script (`scripts/optimize-og-image.mjs`) will:

- Center-crop to **1200×630** (`fit: 'cover'`)
- Encode as JPEG at quality **85** with mozjpeg
- Write directly to `src/assets/content/`
- Print final dimensions and file size

At build time, `src/support/social-image.ts` runs a second pass through Astro's `getImage()` (also Sharp-backed) for the deployed asset. Optimizing the source file keeps repo size down and ensures correct dimensions before commit.

### 5. Wire into the post

Add or update the `image` field in the post frontmatter (path is relative to the markdown file):

```yaml
image: ../../assets/content/{slug}-og-image.jpg
```

### 6. Verify

```bash
bun run build
```

The build pipeline resolves OG images through `src/support/social-image.ts` → `resolveSocialImage()`, which optimizes to **1200 px wide JPEG**. `src/layouts/BaseLayout.astro` emits `og:image`, `og:image:width`, `og:image:height`, and `twitter:image` meta tags.

Optionally preview locally:

```bash
bun run dev
# Visit the post URL and inspect <meta property="og:image"> in page source
```

## Layout Templates

### A — Text-forward (default)

Best for opinion/essay posts without a strong visual.

```
┌──────────────────────────────────────────────────────────┐
│  jewei.toString()                          ✦ (sparkle)  │
│                                                          │
│  ┌─────────────────────────────────┐   ╭── blob ──╮    │
│  │  Post Title in Large Lexend     │   │  purple  │    │
│  │  Description in Geist           │   ╰──────────╯    │
│  │  #tag1  #tag2                   │                    │
│  └─────────────────────────────────┘                     │
│                                                          │
│  jewei.net                                               │
└──────────────────────────────────────────────────────────┘
```

### B — Visual-forward

Best for tutorials, infographics, or posts with a strong diagram.

```
┌──────────────────────────────────────────────────────────┐
│  jewei.toString()                                        │
│                                                          │
│  Post Title          ┌──────────────────────┐           │
│  Description         │  infographic/crop/   │  ✦        │
│  #tags               │  product visual      │           │
│                      └──────────────────────┘           │
│  jewei.net                                               │
└──────────────────────────────────────────────────────────┘
```

### C — Code/technical

Best for posts with code blocks (`hasCodeBlocks()` in `src/support/blog.ts`).

- Dark card variant (`#0F071D` background, `#ebf1ff` text)
- JetBrains Mono for a short code snippet or terminal motif
- Purple syntax accent (`#7c3aed`)

## Reference Examples

**Good dedicated OG image:** `src/assets/content/eight-levels-of-ai-og-image.jpg` — branded card for "The Eight Levels of AI Adoption" with title, site name, and topic-relevant visual.

**Generic fallback:** `src/assets/og-image.jpg` — site-wide default (1600×840 source, resized at build). Replace with post-specific images whenever possible.

## Checklist

- [ ] Image is exactly **1200×630 px**
- [ ] Post `title` and `description` are spelled exactly as in frontmatter
- [ ] Colors match the palette above (not generic purple/blue)
- [ ] `jewei.toString()` wordmark and `jewei.net` domain are present
- [ ] Readable at ~300 px width (squint test)
- [ ] Optimized with `bun scripts/optimize-og-image.mjs` → `src/assets/content/{slug}-og-image.jpg`
- [ ] Frontmatter `image:` field updated
- [ ] `bun run build` succeeds

## Do Not

- Use dimensions other than 1200×630
- Invent a logo — the wordmark **is** the logo
- Use fonts other than Lexend / Geist / JetBrains Mono
- Save OG images to `public/` — they belong in `src/assets/content/` so Astro optimizes them at build time
- Leave posts on the generic `src/assets/og-image.jpg` when a custom card is requested
- Add unrelated branding, watermarks, or stock-photo aesthetics that clash with the playful-minimal system
