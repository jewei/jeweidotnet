# Review checklist (the AAA bar)

Use this for every visual or content change. Capture with `vp run shots -- <routes> --widths=320,768,1440 --full` (light and dark by default) and look at every image. If any line below fails, the change is not done.

## Layout

- [ ] No horizontal overflow at 320px (the script and browser tests report it).
- [ ] Reading column is centred and 40rem or less; nothing intrudes into it.
- [ ] Vertical rhythm uses `--space-*` and `--section`; no doubled gaps (section padding + margin).
- [ ] Rails, sticky elements, and grids collapse cleanly below 64rem.
- [ ] Wrapped controls (buttons, pills, nav) still look intentional at 320 and 375.

## Type

- [ ] One H1. Heading levels never skip.
- [ ] No missing spaces next to links ("also<a>").
- [ ] No widows in headings that `text-wrap: balance` can fix; no orphaned single words in short ledes.
- [ ] Glyphs exist in the font (Geist Mono has no `№`).
- [ ] Numbers in tables, dates, and stats are tabular.

## Colour and contrast

- [ ] Text reaches 7:1 in both themes (browser test). Decorative green (`--accent-mark`) is never text.
- [ ] Code tokens are readable on `--bg-sunken` (check comments).
- [ ] Bright screenshots are dimmed in dark mode.

## Interaction

- [ ] Every interactive element has a 44px target (36px allowed inside dense lists) and a visible focus ring.
- [ ] Hover effects only on `(hover: hover)`; nothing depends on hover.
- [ ] Theme toggle: correct icon, label, and `aria-pressed`; persists across pages.
- [ ] Copy button announces "Copied".
- [ ] Reduced motion removes movement.

## Content and SEO

- [ ] Title and description are unique and within range; social card looks right at thumbnail size.
- [ ] Images have meaningful alt text; captions add information, not repetition.
- [ ] The Markdown copy (`dist/<path>/index.md`) starts with the H1 and reads cleanly.
- [ ] Ledes do not repeat the first paragraph.

## Critique log

The rebuild went through these rounds. Each finding is now covered by a fix and, where possible, a test.

| Round | Finding                                                                | Fix                                       |
| ----- | ---------------------------------------------------------------------- | ----------------------------------------- |
| 1     | Theme toggle showed both icons (scoped CSS did not reach child SVGs)   | `:global()` selectors in `Header.astro`   |
| 1     | `№` rendered as a fallback glyph in Geist Mono                         | Use `No.`                                 |
| 1     | Missing spaces before inline links                                     | `compressHTML: false`                     |
| 1     | Article column sat left of centre at wide widths                       | Centred grid; rail in the left margin     |
| 2     | Code had no syntax colour (`.shiki` vs `.astro-code`)                  | Selector fix                              |
| 2     | Hero buttons wrapped unevenly on phones                                | Two-up grid below 30rem                   |
| 3     | Résumé bullets were hollow circles (nested list default)               | `list-style: disc`                        |
| 3     | White screenshots glared in dark mode                                  | Dim prose images in dark                  |
| 3     | Social images reported 630px height for 600px files                    | Largest true 1.91:1 crop                  |
| 3     | Markdown copies started with eyebrow labels, not the H1                | Converter hoists the H1                   |
| 4     | Nav clipped "Résumé" at 320px                                          | Space-between row, tighter padding        |
| 4     | Doubled gaps between projects                                          | One margin + padding pair                 |
| 4     | Cached build replayed stale Markdown                                   | `build` is never cached                   |
| 4     | Light-theme code comments at 4.5:1                                     | Remapped to `#4B535D` (7:1)               |
| 4     | Render-blocking CSS request                                            | Inline stylesheets                        |
| 5     | Empty band above the footer                                            | Removed the last-section padding          |
| 5     | Contact and Privacy filed under "Feeds"                                | Moved to "Site"                           |
| 5     | Contact lede repeated the first paragraph; no primary action           | New lede and an email button              |
| 6     | Copy rated the work ("reliable", "Scale-tested") instead of stating it | Plain, specific copy; DESIGN principle 6  |
| 6     | Stat strips, display-size headings, and slogans read as marketing      | Removed; H1 at step-4, sections at step-1 |
| 6     | A list's top hairline sat under a section rule (double line)           | Lists drop their top line under a rule    |
