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
  surface-tint: '#732ee4'
  primary: '#630ed4'
  on-primary: '#ffffff'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#d2bbff'
  secondary: '#0058be'
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