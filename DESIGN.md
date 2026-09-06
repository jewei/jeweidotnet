# Design — jewei.net

A locked design system for the full site. Every page must read this file before it changes visual or interaction code. Amend this file before a page departs from the system.

## Product position

Jewei Mak is a senior software engineer, backend architect, builder, and writer. The primary audience is engineering peers. The primary tasks are to explore his work and read his writing.

The site is a senior engineer's digital garden, technical publication, and professional portfolio. It must feel minimal, technical, editorial, personal, fast, and exact. It must never look like a startup landing page, an agency site, a résumé template, or terminal cosplay.

## Genre

Editorial.

## Macrostructure family

- Discovery pages (`/` and `/projects/`): **Workbench**. Real project captures and technical facts provide the proof. No sales bar or product-tour script.
- Index pages (`/blog/`, tag archives, and `/collections/`): **Index-First**. Links, dates, topics, and short descriptions are the design.
- Content pages (articles, `/about/`, `/contact/`, `/privacy/`, and the 404 page): **Long Document**. Reading comes first. There are no page-load reveals.
- Résumé: **Split Studio allowance**. The main document and a compact facts rail can share the width on large screens. Print becomes one linear document.

## Component archetypes

- Hero: H2 Split Diptych. Use a 7:5 ratio, the existing portrait, and negative space as the divider.
- Section heads: S2 Hanging. Use a plain heading and an optional action. Do not use numbered eyebrows.
- Professional proof: T4 Numbered Stat Strip. Use modest type, tabular numbers, and no counter animation.
- Calls to action: C3 Typographic Link for most actions. A solid ink button is allowed for one primary hero action.
- Navigation: N6 Compact Masthead. `issue-line=none`, `wordmark=xl`, `rule=single`, `sticky=no`. The mobile version becomes wordmark plus menu and theme controls.
- Footer: Ft6 Letter Close. `signoff=roman`, `postscript=yes`, `width=60ch`.

## Theme

Custom theme. Vibe: **quiet technical journal, personal and exact**.

The anchor hue is Jewei's existing green. Green is a signal, not a surface. It occupies less than 3% of a normal viewport.

### Light

- `--color-paper` `oklch(97.5% 0.008 145)`
- `--color-paper-2` `oklch(94.5% 0.010 145)`
- `--color-paper-3` `oklch(91% 0.012 145)`
- `--color-ink` `oklch(20% 0.012 145)`
- `--color-ink-2` `oklch(36% 0.012 145)`
- `--color-rule` `oklch(82% 0.010 145)`
- `--color-rule-2` `oklch(72% 0.012 145)`
- `--color-muted` `oklch(45% 0.012 145)`
- `--color-neutral` `oklch(31% 0.012 145)`
- `--color-accent` `oklch(42% 0.120 150)`
- `--color-accent-ink` `oklch(97.5% 0.008 145)`
- `--color-focus` `oklch(48% 0.180 150)`

### Dark

- `--color-paper` `oklch(14% 0.010 145)`
- `--color-paper-2` `oklch(18% 0.012 145)`
- `--color-paper-3` `oklch(22% 0.014 145)`
- `--color-ink` `oklch(94% 0.008 145)`
- `--color-ink-2` `oklch(78% 0.010 145)`
- `--color-rule` `oklch(31% 0.012 145)`
- `--color-rule-2` `oklch(39% 0.014 145)`
- `--color-muted` `oklch(70% 0.010 145)`
- `--color-neutral` `oklch(83% 0.010 145)`
- `--color-accent` `oklch(76% 0.100 150)`
- `--color-accent-ink` `oklch(14% 0.010 145)`
- `--color-focus` `oklch(80% 0.150 150)`

## Typography

- Display and reading: Newsreader, weights 400 and 700, normal style.
- Interface and résumé: Geist, weights 400 and 700.
- Code and technical labels: JetBrains Mono, weight 400.
- Display tracking: `-0.025em`.
- Label tracking: `0.06em`.
- Body minimum: `1rem`.
- Article measure: `65ch`.
- Article line height: `1.68`.
- Display cap: `clamp(2.75rem, 5vw + 1rem, 4.5rem)`.
- Home name allowance: `--text-hero-name` uses `clamp(5rem, 10vw, 7rem)` for the single word `Jewei.`. The greeting uses a smaller size on its own line.

Newsreader carries headings and long-form prose. Geist carries navigation, summaries, controls, data, and the résumé. JetBrains Mono is only for code and small technical labels.

## Content widths

- Site shell: `82rem`.
- Standard content: `72rem`.
- Reading column: `65ch`.
- Narrow note: `48rem`.
- Page gutter: `clamp(1rem, 4vw, 2.5rem)`.

## Spacing

Use this 4-point named scale. Pages must use tokens, not raw spacing values.

- `--space-3xs` `0.125rem`
- `--space-2xs` `0.25rem`
- `--space-xs` `0.5rem`
- `--space-sm` `0.75rem`
- `--space-md` `1rem`
- `--space-lg` `1.5rem`
- `--space-xl` `2.5rem`
- `--space-2xl` `4rem`
- `--space-3xl` `6rem`
- `--space-4xl` `9rem`

## Rules, radius, and depth

- Hairline rule: `1px`.
- Strong rule: `2px`, used only for code frames and print structure.
- Small radius: `2px`.
- Card or media radius: `6px` maximum.
- Pill radius: only for compact topic labels and status labels. Do not use pills as the main component shape.
- Shadows: none by default. A single low-opacity 1px shadow is allowed for a lifted menu.

## Motion

- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)`.
- `--ease-in`: `cubic-bezier(0.7, 0, 0.84, 0)`.
- `--ease-in-out`: `cubic-bezier(0.65, 0, 0.35, 1)`.
- Micro duration: `120ms`.
- Short duration: `200ms`.
- Long duration: `300ms`.
- Page reveal: none.
- Allowed movement: link underline, button press, menu state, copy feedback, and at most 2px of media movement.
- Reduced motion: remove spatial movement and keep state feedback at 150ms or less.

## Microinteractions stance

- Keyboard state comes before hover state.
- Focus appears at once with a 2px ring and a 2px offset.
- Touch targets are at least 44 by 44 CSS pixels.
- Hover styles only apply when the device supports hover.
- Code-copy success changes the control label to `Copied`. It does not create a toast.
- Menu Escape closes the menu and returns focus to the menu button.
- Theme state is stored. The initial theme applies before paint.
- There are no decorative toasts, scroll animations, counters, or infinite animations.

## CTA voice

- Primary hero action: compact solid ink rectangle, 2px radius, verb-first copy.
- Secondary action: typographic link with a 1px underline and arrow.
- Tertiary action: plain text link with an arrow.
- Do not use promotional copy, large rounded buttons, gradients, or two filled actions together.

## Per-page rules

### Home

Order: introduction, Selected Work, professional evidence, Pinned Posts, Latest Writing, Topics, shared footer. Work is the first action. Writing is the second action.

The hero uses the standard content width and a two-line greeting, with the name as the largest text. The portrait has a thin offset frame and a caption with an About link. Below 60rem, use a 7rem square portrait beside its caption, after the introduction and actions. Use the existing portrait asset.

Home sections use `--space-xl` above and below each dividing rule on small screens, and `--space-2xl` from 60rem. Pinned Posts use text rows without covers. Put the RSS and contact sentence below Latest Writing. The shared footer provides the only closing message and motto.

Topic cells keep `--space-lg` of space after the post count.

### Projects

Show Claude Meter, Bopop, Uppa, TypeID PHP, and Full Page. The homepage shows the first four as Selected Work. Each entry needs a purpose, platform or category, stack, source availability, direct links, and related writing. Do not add filters for five items. Do not use star counts.

Project covers use a 16:10 frame. New covers keep titles and product previews inside generous side margins. Generated covers can use existing product captures as references and must match the site's editorial style.

### Writing indexes

Use dates, titles, short descriptions, and topics. Topic controls must not occupy most of the first mobile view. Avoid boxes around every row.

Show all available post topics as links, with natural wrapping. A topic archive can omit its current topic from each post's metadata.

### Articles

Show the description in the header. Show a table of contents only when the article has at least three useful second-level headings. Provide syntax highlighting, copy feedback, local horizontal code scrolling, optional filenames, figures, captions, related posts, and previous or next links.

### About

Keep the multilingual greeting and personal interests. The page sequence is engineer, builder, writer, photography, books, cooking, and music. The portrait supports the introduction; it does not delay it.

### Résumé

Use dense document hierarchy, not dashboard cards. Keep the PDF action. Print must hide site navigation, theme controls, footer, and web-only actions. Print must use black text, white paper, stable URLs, and clear page breaks.

### Collections

Treat the page as a small growing index. Do not imply that it is a complete knowledge base.

## What all pages must share

- `jewei.toString()` as the main wordmark.
- One green accent and the same light and dark palettes.
- Newsreader, Geist, and JetBrains Mono in their defined roles.
- The same focus ring, link underline, rules, and content widths.
- The same navigation and footer.
- Semantic HTML, logical heading order, and descriptive alt text.

## What pages may change

- The content width can change between index, reading, and résumé pages.
- A project may use its existing image colour inside the image only.
- Articles may omit a contents list when it does not help navigation.
- The résumé may use smaller type and tighter spacing than editorial pages.

## Performance and accessibility

- Keep static Astro output and zero framework hydration.
- Load only required font files and weights. Match fallback metrics to reduce layout shift.
- Use Astro image processing and explicit image dimensions.
- Target WCAG AA. Target 7:1 for normal body text where practical.
- Support 320, 375, 390, 414, 768, 1024, 1440, and 1920 CSS-pixel widths.
- Use `overflow-x: clip` on `html` and `body`. Code and tables can scroll inside their own containers.
- Keep RSS, sitemap, canonical URLs, Markdown alternatives, analytics, security headers, and all current article URLs.

## Exports

### tokens.css

```css
:root {
  --color-paper: oklch(97.5% 0.008 145);
  --color-paper-2: oklch(94.5% 0.010 145);
  --color-paper-3: oklch(91% 0.012 145);
  --color-ink: oklch(20% 0.012 145);
  --color-ink-2: oklch(36% 0.012 145);
  --color-rule: oklch(82% 0.010 145);
  --color-rule-2: oklch(72% 0.012 145);
  --color-muted: oklch(45% 0.012 145);
  --color-neutral: oklch(31% 0.012 145);
  --color-accent: oklch(42% 0.120 150);
  --color-accent-ink: oklch(97.5% 0.008 145);
  --color-focus: oklch(48% 0.180 150);
  --font-display: var(--font-newsreader), ui-serif, serif;
  --font-body: var(--font-geist), ui-sans-serif, sans-serif;
  --font-outlier: var(--font-jetbrains-mono), ui-monospace, monospace;
  --space-3xs: 0.125rem;
  --space-2xs: 0.25rem;
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2.5rem;
  --space-2xl: 4rem;
  --space-3xl: 6rem;
  --space-4xl: 9rem;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-md: 1.25rem;
  --text-lg: 1.5625rem;
  --text-xl: 1.9531rem;
  --text-2xl: 2.4414rem;
  --text-3xl: 3.0518rem;
  --text-display: clamp(2.75rem, 5vw + 1rem, 4.5rem);
  --text-hero-name: clamp(5rem, 10vw, 7rem);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 120ms;
  --dur-short: 200ms;
  --dur-long: 300ms;
  --radius-card: 6px;
  --radius-pill: 999px;
  --radius-input: 2px;
}
```

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(97.5% 0.008 145);
  --color-paper-2: oklch(94.5% 0.010 145);
  --color-paper-3: oklch(91% 0.012 145);
  --color-ink: oklch(20% 0.012 145);
  --color-ink-2: oklch(36% 0.012 145);
  --color-rule: oklch(82% 0.010 145);
  --color-rule-2: oklch(72% 0.012 145);
  --color-muted: oklch(45% 0.012 145);
  --color-neutral: oklch(31% 0.012 145);
  --color-accent: oklch(42% 0.120 150);
  --color-focus: oklch(48% 0.180 150);
  --font-display: var(--font-newsreader), ui-serif, serif;
  --font-body: var(--font-geist), ui-sans-serif, sans-serif;
  --font-outlier: var(--font-jetbrains-mono), ui-monospace, monospace;
  --spacing-3xs: 0.125rem;
  --spacing-2xs: 0.25rem;
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2.5rem;
  --spacing-2xl: 4rem;
  --spacing-3xl: 6rem;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-md: 1.25rem;
  --text-lg: 1.5625rem;
  --text-xl: 1.9531rem;
  --text-2xl: 2.4414rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --radius-card: 6px;
  --radius-pill: 999px;
  --radius-input: 2px;
}
```

### DTCG `tokens.json`

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": { "$value": "oklch(97.5% 0.008 145)", "$type": "color" },
    "paper-2": { "$value": "oklch(94.5% 0.010 145)", "$type": "color" },
    "paper-3": { "$value": "oklch(91% 0.012 145)", "$type": "color" },
    "ink": { "$value": "oklch(20% 0.012 145)", "$type": "color" },
    "ink-2": { "$value": "oklch(36% 0.012 145)", "$type": "color" },
    "rule": { "$value": "oklch(82% 0.010 145)", "$type": "color" },
    "rule-2": { "$value": "oklch(72% 0.012 145)", "$type": "color" },
    "muted": { "$value": "oklch(45% 0.012 145)", "$type": "color" },
    "neutral": { "$value": "oklch(31% 0.012 145)", "$type": "color" },
    "accent": { "$value": "oklch(42% 0.120 150)", "$type": "color" },
    "accent-ink": { "$value": "oklch(97.5% 0.008 145)", "$type": "color" },
    "focus": { "$value": "oklch(48% 0.180 150)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Newsreader, ui-serif, serif", "$type": "fontFamily" },
    "body": { "$value": "Geist, ui-sans-serif, sans-serif", "$type": "fontFamily" },
    "outlier": { "$value": "JetBrains Mono, ui-monospace, monospace", "$type": "fontFamily" }
  },
  "space": {
    "3xs": { "$value": "0.125rem", "$type": "dimension" },
    "2xs": { "$value": "0.25rem", "$type": "dimension" },
    "xs": { "$value": "0.5rem", "$type": "dimension" },
    "sm": { "$value": "0.75rem", "$type": "dimension" },
    "md": { "$value": "1rem", "$type": "dimension" },
    "lg": { "$value": "1.5rem", "$type": "dimension" },
    "xl": { "$value": "2.5rem", "$type": "dimension" },
    "2xl": { "$value": "4rem", "$type": "dimension" },
    "3xl": { "$value": "6rem", "$type": "dimension" },
    "4xl": { "$value": "9rem", "$type": "dimension" }
  },
  "duration": {
    "micro": { "$value": "120ms", "$type": "duration" },
    "short": { "$value": "200ms", "$type": "duration" },
    "long": { "$value": "300ms", "$type": "duration" }
  }
}
```

### shadcn/ui CSS variables

```css
:root {
  --background: 97.5% 0.008 145;
  --foreground: 20% 0.012 145;
  --card: 94.5% 0.010 145;
  --card-foreground: 20% 0.012 145;
  --popover: 94.5% 0.010 145;
  --popover-foreground: 20% 0.012 145;
  --primary: 42% 0.120 150;
  --primary-foreground: 97.5% 0.008 145;
  --secondary: 91% 0.012 145;
  --secondary-foreground: 36% 0.012 145;
  --muted: 82% 0.010 145;
  --muted-foreground: 45% 0.012 145;
  --accent: 42% 0.120 150;
  --accent-foreground: 97.5% 0.008 145;
  --destructive: 55% 0.190 28;
  --destructive-foreground: 97.5% 0.008 145;
  --border: 82% 0.010 145;
  --input: 82% 0.010 145;
  --ring: 48% 0.180 150;
  --radius: 6px;
}

.dark {
  --background: 14% 0.010 145;
  --foreground: 94% 0.008 145;
  --card: 18% 0.012 145;
  --card-foreground: 94% 0.008 145;
  --popover: 18% 0.012 145;
  --popover-foreground: 94% 0.008 145;
  --primary: 76% 0.100 150;
  --primary-foreground: 14% 0.010 145;
  --secondary: 22% 0.014 145;
  --secondary-foreground: 78% 0.010 145;
  --muted: 31% 0.012 145;
  --muted-foreground: 70% 0.010 145;
  --accent: 76% 0.100 150;
  --accent-foreground: 14% 0.010 145;
  --border: 31% 0.012 145;
  --input: 31% 0.012 145;
  --ring: 80% 0.150 150;
}
```
