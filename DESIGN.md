---
name: Luminous Developer Narrative
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#4a4455'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#7b7487'
  outline-variant: '#ccc3d8'
  surface-tint: '#6a1dd9'
  primary: '#630ed4'
  on-primary: '#ffffff'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#d2bbff'
  secondary: '#004aa8'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#005b33'
  on-tertiary: '#ffffff'
  tertiary-container: '#007644'
  on-tertiary-container: '#94fbb8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#91f8b6'
  tertiary-fixed-dim: '#75db9b'
  on-tertiary-fixed: '#00210f'
  on-tertiary-fixed-variant: '#00522e'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
  bg-light: '#F9FAFB'
  bg-dark: '#0F071D'
  surface-dark: '#1A1429'
  text-main: '#1A1A1A'
typography:
  display:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  code:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1100px
  gutter: 24px
  margin-mobile: 20px
  stack-sm: 12px
  stack-md: 32px
  stack-lg: 64px
---

## Brand & Style

The design system is built for a personal developer blog that balances technical authority with a whimsical, approachable personality. The aesthetic is "Playful-Minimal"—a hybrid style that leverages the clarity of high-end SaaS interfaces with the charm of indie-creative portfolios. 

The emotional goal is to feel **"Cute but Premium."** This is achieved through a "Calm and Elegant" hierarchy where generous whitespace ensures high readability, while organic decorative elements like tiny doodles, sparkles, and blobs break the rigidity of a standard grid. The system avoids a corporate feel by using soft-tinted backgrounds and expressive typography, ensuring it remains distinctive and personal.

## Colors

The palette is anchored by a vibrant **Vivid Purple** primary, used for main brand accents and key calls to action. A **Bright Blue** serves as the secondary color for interactive highlights and links, while **Forest Green** is reserved for decorative details and positive feedback states.

- **Light Mode:** Uses an off-white, airy background (#F9FAFB) to reduce eye strain compared to pure white. Surfaces should feel lifted with subtle borders.
- **Dark Mode:** Employs a deep, purple-tinted "cozy" dark (#0F071D). Avoid pure black; instead, use layered purples to maintain depth and warmth.
- **Contrast:** Text remains high-contrast (Near-black in light mode, near-white in dark mode) to prioritize legibility for long-form technical articles.

## Typography

The system uses a pairing of **Lexend** for headlines and **Geist** for body copy. Lexend provides a friendly, geometric rhythm that feels approachable, while Geist offers a clean, technical precision ideal for a developer blog.

- **Headlines:** Use tighter letter-spacing for large display text to create a "premium" feel.
- **Body Text:** Set with generous line heights (1.6x - 1.7x) to ensure comfortable long-form reading experience.
- **Technical Content:** Code snippets must use **JetBrains Mono** to maintain the developer-centric focus, styled with a soft background container to match the overall theme.

## Layout & Spacing

This design system follows a **Fixed-Fluid hybrid grid**. Content is centered within a maximum container width of 1100px to prevent lines of text from becoming too long. 

- **The 8px Rhythm:** All spacing (padding, margins, gaps) should be multiples of 8px to maintain visual harmony.
- **Vertical Rhythm:** Use large vertical gaps (stack-lg) between major article sections to emphasize the "airy" brand personality.
- **Mobile:** On devices under 768px, margins shrink to 20px and the layout collapses to a single column. Horizontal padding within cards should be reduced to 16px to maximize screen real estate.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Ambient Shadows** rather than heavy skeuomorphism.

- **Surfaces:** In light mode, use very subtle 1px borders (#E5E7EB) combined with low-opacity, diffused shadows (Blur: 20px, Opacity: 4%, Color: Primary) to make elements feel like they are floating on a soft plane.
- **Glassmorphism:** Use semi-transparent backgrounds with a 12px backdrop-blur for navigation bars and floating "sticker" elements to add a modern, polished layer.
- **Interactive Depth:** On hover, cards and buttons should "lift" slightly (translating -4px on the Y-axis) and their shadow should become slightly more pronounced and tinted with the primary color.

## Shapes

The shape language is defined by **Soft Roundedness**. While the base unit is 0.5rem (8px), large containers and decorative "blobs" should use `rounded-xl` (24px) to emphasize the playful nature of the brand.

- **Buttons & Chips:** Always use fully rounded "pill" shapes or `rounded-lg` (16px) to maintain the friendly aesthetic.
- **Decorations:** Incorporate organic, non-geometric SVG blobs and hand-drawn doodle accents (sparkles, underscores) behind or adjacent to key headings. These should have a "hand-crafted" feel to offset the clean typography.

## Components

- **Buttons:** Primary buttons use a solid Purple gradient with white text. Secondary buttons use a Ghost style with a thin border and the secondary Blue text. All buttons have a high border-radius (min 12px).
- **Cards:** Blog post previews should be contained in cards with a `rounded-xl` corner, a subtle 1px border, and a faint primary-tinted shadow.
- **Input Fields:** Search and contact inputs use a soft-gray background (#F3F4F6) and transition to a 2px Purple border on focus.
- **Chips/Tags:** Used for article categories. These are small, pill-shaped elements with low-saturation backgrounds derived from the primary, secondary, or tertiary colors.
- **Stickers & Doodles:** A unique component class for this system. These are small, non-interactive SVG graphics (stars, loops, arrows) that appear to be "stuck" onto the layout, often overlapping borders or corners of cards to add whimsy.
- **Code Blocks:** Syntax highlighting should use a custom theme that incorporates the primary Purple and secondary Blue, set against a dark-mode surface even in the light-mode theme.

---

# Hallmark 2026 Lock

This section replaces the earlier visual draft. Use it as the current source of truth.

## Genre

Playful. The interface is energetic, direct, and tactile. It takes broad inspiration from learning apps, but it does not copy another brand.

## Macrostructure family

- Home: **Ecosystem Index**. It uses distinct rails for pinned posts, recent writing, and topics.
- Blog and tag indexes: **Index-First**. Links are the main interface.
- Posts and About: **Long Document**. Reading measure is 65 characters or less.
- Résumé: **Split Studio**. Summary and evidence use an asymmetric two-column layout.
- 404: **Split Studio** recovery page. One clear message and one recovery action.

## Theme

- `--color-paper`: `oklch(97% 0.016 105)`
- `--color-paper-2`: `oklch(94% 0.026 105)`
- `--color-paper-3`: `oklch(90% 0.038 105)`
- `--color-ink`: `oklch(20% 0.018 145)`
- `--color-ink-2`: `oklch(34% 0.022 145)`
- `--color-rule`: `oklch(79% 0.030 105)`
- `--color-accent`: `oklch(70% 0.18 145)`
- `--color-focus`: `oklch(42% 0.20 145)`

The accent is sprout green. It marks active states and primary actions. It must not cover large page areas.

## Typography

- Display: Bricolage Grotesque, weight 800, roman.
- Body: Geist, weight 400.
- Code: JetBrains Mono, weight 400.
- Display tracking: `-0.035em`.
- Display size: `clamp(2.75rem, 6vw, 5.25rem)`.

## Spacing

Use the named 4-point scale in `tokens.css`. Do not add raw spacing values to page components.

## Motion

- Easings: `--ease-out`, `--ease-in`, and `--ease-in-out` from `tokens.css`.
- Motion primitives: tactile press and short card lift.
- Reduced motion: limit feedback to 150 ms.

## Component voice

- Navigation: N7 Rounded Slab. It has a strong bottom rule and no blur.
- Footer: Ft5 Statement with a static metadata row.
- Primary buttons: green fill, dark text, 2 px ink border, and a short bottom edge.
- Secondary buttons: paper fill with the same border and edge.
- Cards: 12 px maximum radius, 2 px ink border, and one hard shadow.
- Tags: compact pills. Tags use one accent system, not many unrelated colours.
- Headings: roman only. Do not use italic emphasis in headings.

## What pages must share

- Wordmark, navigation, footer, palette, type pair, focus ring, button behavior, and card border language.
- No glass effects, colour gradients, blurred blobs, decorative sparkles, or invented metrics.

## What pages may change

- The named macrostructure for the route type.
- Image use. Only existing content images and the existing portrait are permitted.
- Card density and section rhythm.

## Exports

### tokens.css

```css
:root {
  --color-paper: oklch(97% 0.016 105);
  --color-paper-2: oklch(94% 0.026 105);
  --color-paper-3: oklch(90% 0.038 105);
  --color-ink: oklch(20% 0.018 145);
  --color-ink-2: oklch(34% 0.022 145);
  --color-rule: oklch(79% 0.030 105);
  --color-accent: oklch(70% 0.18 145);
  --color-accent-ink: oklch(20% 0.018 145);
  --color-focus: oklch(42% 0.20 145);
  --font-display: var(--font-bricolage), sans-serif;
  --font-body: var(--font-geist), sans-serif;
  --font-outlier: var(--font-jetbrains-mono), monospace;
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2.5rem;
  --space-2xl: 4rem;
  --space-3xl: 6rem;
  --text-base: 1rem;
  --text-md: 1.25rem;
  --text-lg: 1.5625rem;
  --text-xl: 1.9531rem;
  --text-display: clamp(2.75rem, 6vw, 5.25rem);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 120ms;
  --dur-short: 220ms;
  --dur-long: 420ms;
  --radius-card: 0.75rem;
  --radius-pill: 999px;
  --radius-input: 0.5rem;
}
```

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(97% 0.016 105);
  --color-paper-2: oklch(94% 0.026 105);
  --color-paper-3: oklch(90% 0.038 105);
  --color-ink: oklch(20% 0.018 145);
  --color-ink-2: oklch(34% 0.022 145);
  --color-accent: oklch(70% 0.18 145);
  --color-focus: oklch(42% 0.20 145);
  --font-display: var(--font-bricolage), sans-serif;
  --font-body: var(--font-geist), sans-serif;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --text-md: 1.25rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### DTCG tokens.json

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": { "$value": "oklch(97% 0.016 105)", "$type": "color" },
    "paper-2": { "$value": "oklch(94% 0.026 105)", "$type": "color" },
    "ink": { "$value": "oklch(20% 0.018 145)", "$type": "color" },
    "accent": { "$value": "oklch(70% 0.18 145)", "$type": "color" },
    "focus": { "$value": "oklch(42% 0.20 145)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Bricolage Grotesque, sans-serif", "$type": "fontFamily" },
    "body": { "$value": "Geist, sans-serif", "$type": "fontFamily" }
  },
  "space": {
    "md": { "$value": "1rem", "$type": "dimension" },
    "lg": { "$value": "1.5rem", "$type": "dimension" }
  }
}
```

### shadcn/ui CSS variables

```css
:root {
  --background: 97% 0.016 105;
  --foreground: 20% 0.018 145;
  --card: 94% 0.026 105;
  --card-foreground: 20% 0.018 145;
  --primary: 70% 0.18 145;
  --primary-foreground: 20% 0.018 145;
  --secondary: 90% 0.038 105;
  --secondary-foreground: 34% 0.022 145;
  --muted: 79% 0.030 105;
  --muted-foreground: 48% 0.025 145;
  --border: 79% 0.030 105;
  --input: 79% 0.030 105;
  --ring: 42% 0.20 145;
  --radius: 0.75rem;
}
```
