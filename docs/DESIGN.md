# Design system

**Direction: the workbench.** A concrete bench with off-white plates screwed to it, one signal orange, and a wide heavy face for anything loud. Each plate holds one job and has a numbered bar on top. The reading column stays calm: serif text on a plain plate.

Read this before you change any visual code. Change this file first when the system needs to change.

## Principles

1. **Reading is the product.** The article column is sacred: 40rem measure, serif, 1.72 line height. Nothing animates inside it.
2. **Content sits on plates.** The bench (the page background, with fine grain) stays empty. Every block of content is a `.plate` or a `.part`: an off-white panel with a hairline edge, a soft shadow, and a screw head in each corner. Plates stack with `--section` between them.
3. **One signal, used boldly but rarely.** Signal orange fills the page-opening plate of index pages and articles, the current tab, the bar chips, primary buttons, and hover keys. Text on it is always `--on-signal` ink. It never colours body text.
4. **AAA contrast.** All text meets 7:1 on the surface it sits on, in both themes: the bench, a plate, or the signal. `tests/build/browser.test.ts` measures against the nearest opaque background.
5. **Ink edges for things you press.** Buttons, stickers, and the lit chips have a 1px ink edge and a hard offset shadow (`--shadow-hard`). Pressing a button pushes it into the plate.
6. **Personal, not templated.** The wordmark is code, posts carry catalogue numbers (`No. 012`), plates are numbered (`01`, `02`), and the home portrait looks back at you. Keep these small signatures; do not add generic ones.
7. **Understate the copy.** The chrome is loud; the words are not. Copy states the work and its facts: no stat counters, slogans, or ratings of the work. Counts in a bar (`4 of 9`, `12 posts`) are facts, not stats.

## Tokens

All in `src/styles/tokens.css`. Components use tokens only: no raw colours, font stacks, or spacing in `px` or `rem`. Exceptions: `em` offsets that scale with the text (prose rhythm, list indents, icon gaps), small drawing geometry (screw rings, dots, the theme knob), and `mm`/`pt` sizes inside `@media print`.

| Group    | Tokens                                                                                           | Notes                                                                    |
| -------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Surface  | `--bg`, `--bg-raised`, `--bg-sunken`, `--bg-paper`                                               | Bench, plates, code wells and switch tracks, a lifted print              |
| Grain    | `--grain`                                                                                        | SVG noise tile on the bench; dark specks in light, light specks in dark  |
| Text     | `--fg` (14:1), `--fg-2` (9:1), `--fg-3` (7:1)                                                    | Primary, secondary, metadata; checked on the bench and on plates         |
| Lines    | `--line`, `--line-strong`, `--screw`                                                             | Hairlines, outlines and leaders, screw heads                             |
| Signal   | `--signal`, `--on-signal` (7:1 on `--signal`)                                                    | Orange fills and the ink on them                                         |
| Accent   | `--accent` (orange text, 7:1), `--accent-mark` (decorative only), `--accent-wash` (selection)    | `--accent-mark` is for underlines, dots, and bullets. Never text.        |
| Edges    | `--edge`, `--shadow-hard`, `--shadow`, `--shadow-lift`                                           | Ink edge and hard shadow for pressables; soft shadows for plates, prints |
| Focus    | `--focus`                                                                                        | 2px outline, 3px offset. Ink in light, paper in dark; ink on the signal  |
| Type     | `--display` Zalando Sans Expanded, `--sans` Geist, `--serif` Source Serif 4, `--mono` Geist Mono | Self-hosted through Astro's font API                                     |
| Scale    | `--step--3` … `--step-5`, `--step-prose`                                                         | Fluid with `clamp()`                                                     |
| Space    | `--space-1` (4px) … `--space-10` (128px), `--section`, `--plate-pad`, `--bar`                    | `--section` is the gap between plates; `--bar` is 44px                   |
| Layout   | `--page` 64rem, `--gutter`, `--measure` 40rem, `--rail` 11rem                                    |                                                                          |
| Shape    | `--radius-1` 3px … `--radius-4` 14px                                                             | Plates use `--radius-2`; pills (999px) only for the theme switch         |
| Motion   | `--ease`, `--dur-1` 120ms, `--dur-2` 220ms; `--ease-out`, `--ease-spring`, `--dur-3`, `--dur-4`  | The second set is for the home page's entrance                           |
| Portrait | `--eye-lit`, `--eye-mid`, `--eye-shade`                                                          | The painted sclera under the moving irises. Same in both themes          |
| Print    | `--print-bg`, `--print-fg`, `--print-fg-2`, `--print-line`                                       | Résumé print: black on white in every theme                              |

Dark theme: same names, values under `prefers-color-scheme: dark` and `[data-theme='dark']`. The toggle stores an explicit choice; with no choice, the system decides. The signal and its ink are the same in both themes.

## Type roles

| Role            | Style                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| Display (H1)    | Zalando Sans Expanded 800, `--step-4`, tracking −0.045em, leading 1.04. Home: sized to its column (cqi) |
| Plate bar title | Zalando Sans Expanded 700, `--step--3`, uppercase, 0.1em tracking                                       |
| Labels and tabs | Zalando Sans Expanded 600–700, `--step--3`, uppercase (`.label`, header tabs, buttons, chips)           |
| Titles in lists | Zalando Sans Expanded 700–800, `--step-1` (ledger titles, project names, pager)                         |
| Prose           | Source Serif 4, `--step-prose`, leading 1.72. H2 in the display face; H3 and H4 in Geist                |
| Lede / UI text  | Geist 400–500, `--step-0` / `--step-1`                                                                  |
| Metadata        | Geist Mono, `--step--3` / `--step--2` (dates, catalogue numbers, stacks, the bar chip)                  |

## Components

| Component                      | Where                                         | Rules                                                                                                                                                                             |
| ------------------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Header`                       | every page                                    | A slim toolbar plate: avatar and wordmark, segmented tabs, theme switch. The current tab is lit (signal). Below 44rem the tabs take a second row in four equal cells. Not sticky. |
| `Footer`                       | every page                                    | A plate with an `Index` bar (the § chip and the copyright), the wordmark, three link groups (four-row columns at 48rem+), and the colophon.                                       |
| `PageHeader`                   | index and prose pages                         | A signal plate: optional label, display H1, lede, optional slot for one action. On it the primary button inverts (ink with orange text).                                          |
| `.plate`, `.plate--signal`     | anywhere                                      | The panel primitive and its orange variant. A plate whose first child is a `.bar` keeps only its bottom screws.                                                                   |
| `.part`                        | home, about, collections, blog, articles, 404 | A numbered plate: `.part__head` is a bar (signal chip with a CSS counter, uppercase title, dotted leader, optional meta and action); `.part__body` has the plate padding.         |
| `.bar`                         | footer                                        | The same bar outside `.part`; the chip shows `data-no`.                                                                                                                           |
| `ProjectList`                  | home                                          | A grid of bays (two per row from 40rem) split by hairlines: category and status, the cover, name, summary, stack, and a round arrow key. The whole bay links to the write-up.     |
| `PostList` (ledger)            | home, blog, topics, 404                       | Row = ink `No.` tag and date, title in the display face, summary, topics, and a round arrow key. The whole row is the link target; topics stay separately clickable.              |
| `ProjectCard`                  | projects                                      | One plate per project: 16:10 cover, label meta, display name, summary, spec list, and links.                                                                                      |
| `TopicNav`                     | blog, topics                                  | Square chips with counts; the current topic is lit like a pressed key.                                                                                                            |
| `.button` / `.button--primary` | anywhere                                      | Ink edge, hard shadow, uppercase display label, 44px minimum height. At most one primary (signal) per view.                                                                       |
| `.arrow-link`                  | secondary actions                             | Underlined text with an arrow that moves 3px on hover. External links use the ↗ icon and `data-external`. In a bar it is uppercase.                                               |
| Code frame                     | prose                                         | Label bar (language or filename) with a Copy button that says "Copied". Tokens from GitHub high-contrast themes; light comments remapped for 7:1.                                 |

## Layouts

- **Home:** the intro plate (H1 with the name on a signal swipe, two paragraphs, Email and Résumé buttons), and beside it the portrait: a round print on a signal disc, with the status as a tilted sticker and a caption with the role, the city, and its live time. Below 40rem the portrait sits above the copy and the sticker moves to the shoulder. Then Projects and Writing as numbered plates.
- **About:** a signal plate with the tilted portrait and the lede, then Work, Tools, Writing, Outside work, and Contact as numbered plates with prose bodies.
- **Article:** one plate. Its head is a signal band (crumbs, title, dek, byline). Below it, at 64rem+, the facts rail (entry, dates, topics) and the contents list stick in a left column beside the 40rem reading column; below 64rem the facts become a row under the head. The contents list marks the section in view with CSS scroll markers (`:target-current`, no JS; Chrome and Edge) and a signal tick. A 3px signal reading-progress bar uses CSS scroll timelines. The author card is an ink-edged sticker. "Keep reading" (pager and related posts) is a numbered plate after the article.
- **Index pages:** a signal `PageHeader`, then topic chips, then the ledger on plates. The blog has one numbered plate per year.
- **Prose pages:** a signal `PageHeader`, then the body on a plate.
- **Résumé:** a sheet on a plate: header over a 1px `--fg` rule, experience column and a profile/skills rail. Print drops the plate and the chrome: A4, black on white.

## Motion

Small and purposeful: underline colour and thickness changes, a 3px arrow nudge, arrow keys that light up, buttons that lift on hover and press in on click, a 3% cover zoom on project hover, the theme knob sliding with a spring, a 180ms cross-document view transition, and the theme toggle revealing the new theme in a circle (a same-document view transition). Hover lifts and zooms only run with `(hover: hover)`. `prefers-reduced-motion` turns all of it off.

The home page is the one exception to "quiet". It has an entrance and a few live details:

- **Entrance (CSS):** the header wordmark types itself with a caret, the nav fades in, each H1 line rises out of its own mask, the signal swipe draws under the name, then the text and buttons rise, the disc grows, the print rises, and the sticker slaps on.
- **Scroll reveals:** plate leaders draw from the left, and rows, bays, and footer columns rise as they enter the viewport (`data-reveal` in `base.css`, observed by `public/site.js`). `public/theme.js` adds `.js` before first paint, so content waits hidden instead of flashing. Only pages that pass `reveal` use them.
- **Live details:** the status dot pulses, and the clock's colon blinks. The clock shows the time in `site.timeZone` and stays hidden without JavaScript.
- **The eyes:** the portrait's irises follow the pointer. An inline SVG over the print, in the portrait's own pixel coordinates (1254 × 1254), clips each eye to its lid opening, paints a sclera from the `--eye-*` tokens, and draws the iris from the portrait itself (`site.js` sets each `<image>` to the `<img>`'s `currentSrc`, so it comes from the cache). `site.js` sets `--x` and `--y` (−1 to 1) toward the pointer; CSS moves each iris up to 9 portrait pixels sideways and 3.5 up or down. Without JavaScript, or with reduced motion, the overlay stays hidden and the painted eyes show. **If `src/assets/jewei.jpg` changes, measure the eyes again** (the paths and circles in `src/pages/index.astro`).

Other pages: no scroll reveals, counters, or infinite animations.

## Breakpoints and checks

Content must work from 320px. Review at 320, 375, 768, 1024, 1440, and 1920 in both themes (`vp run shots`). Horizontal overflow is always a bug; the screenshot script and the browser tests both report it.
