# Design system

**Direction: the engineer's notebook, typeset.** Warm paper, cool ink, one green signal. Sans for structure, serif for reading, mono for metadata. Quiet until you look closely; then every detail is deliberate.

Read this before you change any visual code. Change this file first when the system needs to change.

## Principles

1. **Reading is the product.** The article column is sacred: 40rem measure, serif, 1.72 line height. Nothing animates inside it.
2. **Structure through type and rules, not boxes.** Hairlines and a single strong rule (`1px solid var(--fg)`) above sections do the work. Cards only where content is a self-contained object (project covers, the author card).
3. **One accent, used as a signal.** Green marks state (active nav, progress bar, link underlines, the status dot, `()` in the wordmark). It never fills large areas.
4. **AAA contrast.** All text meets 7:1 in both themes. `tests/build/browser.test.ts` measures it.
5. **Personal, not templated.** The wordmark is code and posts carry catalogue numbers (`No. 012`). Keep these small signatures; do not add generic ones.
6. **Understate.** Copy states the work and its facts, not ratings of it: no stat counters, slogans, jokes in captions, or adjectives such as "reliable" or "sharp". Headings stay small; one primary button at most, and only where an action is the point of the page (résumé PDF, contact email).

## Tokens

All in `src/styles/tokens.css`. Components use tokens only: no raw colours, font stacks, or spacing in `px` or `rem`. Two exceptions: `em` offsets that scale with the text (prose rhythm, list indents, icon gaps), and `mm`/`pt` sizes inside `@media print`.

| Group   | Tokens                                                                                       | Notes                                               |
| ------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Surface | `--bg`, `--bg-raised`, `--bg-sunken`                                                         | Page, cards and footer, code and inline code        |
| Text    | `--fg` (15:1), `--fg-2` (9:1), `--fg-3` (7:1)                                                | Primary, secondary, metadata                        |
| Lines   | `--line`, `--line-strong`                                                                    | Hairlines, hover borders, underline rest state      |
| Accent  | `--accent` (text, 7:1), `--accent-mark` (decorative only), `--accent-wash` (selection, halo) |                                                     |
| Focus   | `--focus`                                                                                    | 2px outline, 3px offset, on every focusable element |
| Type    | `--sans` Geist, `--serif` Source Serif 4, `--mono` Geist Mono                                | Self-hosted through Astro's font API                |
| Scale   | `--step--2` … `--step-5`, `--step-prose`                                                     | Fluid with `clamp()`                                |
| Space   | `--space-1` (4px) … `--space-10` (128px), `--section`                                        | 4px base                                            |
| Layout  | `--page` 76rem, `--gutter`, `--measure` 40rem, `--rail` 12rem                                |                                                     |
| Shape   | `--radius-1` 4px, `--radius-2` 8px, `--radius-3` 12px                                        | Pills (999px) only for chips and the status badge   |
| Motion  | `--ease`, `--dur-1` 120ms, `--dur-2` 220ms                                                   |                                                     |
| Print   | `--print-bg`, `--print-fg`, `--print-fg-2`, `--print-line`                                   | Résumé print: black on white in every theme         |

Dark theme: same names, values under `prefers-color-scheme: dark` and `[data-theme='dark']`. The toggle stores an explicit choice; with no choice, the system decides.

## Type roles

| Role             | Style                                                                             |
| ---------------- | --------------------------------------------------------------------------------- |
| Display (H1)     | Geist 600, `--step-4` on every page, tracking −0.035em, leading `--leading-tight` |
| Section heading  | Geist 600, `--step-1`, under a 1px `--fg` rule (`.section-head` or `.part`)       |
| Prose            | Source Serif 4, `--step-prose`, leading 1.72; headings inside prose are Geist     |
| Lede / dek       | Source Serif 4, `--step-1`, `--fg-2`                                              |
| UI and summaries | Geist 400–500, `--step-0` / `--step--1`                                           |
| Labels and dates | Geist Mono, `--step--2`, uppercase labels with 0.06em tracking                    |

## Components

| Component                      | Where                    | Rules                                                                                                                                             |
| ------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Header`                       | every page               | Wordmark left, nav right, theme toggle. Below 44rem the nav becomes a second row. Active item: 2px `--accent-mark` underline. Not sticky.         |
| `Footer`                       | every page               | Wordmark and copyright, three link groups (four-row columns at 48rem+), colophon with the agent link.                                             |
| `PageHeader`                   | index and prose pages    | Optional mono label, display H1, serif lede, optional slot for one action.                                                                        |
| `.part`                        | home, about, collections | Section with a 1px `--fg` rule; at 64rem+ the heading (and one action link) sits in a `--rail` column and sticks.                                 |
| `ProjectList`                  | home                     | Text rows in the ledger grid: category, name, summary, stack. Whole row links to the write-up.                                                    |
| `PostList` (ledger)            | home, blog, topics, 404  | Row = number + date column, title, summary, topics. Whole row is the link target; topics stay separately clickable.                               |
| `ProjectCard`                  | projects                 | 16:10 cover, mono meta, name, summary, spec list, and links.                                                                                      |
| `TopicNav`                     | blog, topics             | Pill links with counts; current topic is inverted.                                                                                                |
| `.button` / `.button--primary` | anywhere                 | At most one primary button per view. 44px minimum height.                                                                                         |
| `.arrow-link`                  | secondary actions        | Underlined text with an arrow that moves 3px on hover. External links use the ↗ icon and `data-external`.                                         |
| Code frame                     | prose                    | Label bar (language or filename) with a Copy button that says "Copied". Tokens from GitHub high-contrast themes; light comments remapped for 7:1. |

## Layouts

- **Home:** intro (role label, name, two serif paragraphs, status line), then Projects and Writing as `.part` sections. At 64rem+ the small portrait sits in the rail beside the intro, so it lines up with the section headings below.
- **About:** the same intro grid, then Work, Tools, Writing, Outside work, and Contact as `.part` sections with prose bodies.
- **Article:** reading column centred; at 64rem+ the facts rail (entry, dates, topics) and contents list sit in the left margin and stick. Below 64rem the facts become a row under the byline. A 2px reading-progress bar uses CSS scroll timelines (no JS). Ends with the author card, older/newer pager, and related posts.
- **Index pages:** `PageHeader`, topic nav, ledger. The blog groups years with a sticky year label at 64rem+.
- **Résumé:** header over a 1px `--fg` rule, experience column and a profile/skills rail. Print is A4 black on white with web-only actions hidden.

## Motion

Small and purposeful: underline colour changes, a 3px arrow nudge, a 1.5% cover zoom on project hover, the home portrait lifting off a green card on hover (8px, −1.5°), theme icon rotate, and a 180ms cross-document view transition. `prefers-reduced-motion` turns all of it off. No scroll reveals, counters, or infinite animations.

## Breakpoints and checks

Content must work from 320px. Review at 320, 375, 768, 1024, 1440, and 1920 in both themes (`vp run shots`). Horizontal overflow is always a bug; the screenshot script and the browser tests both report it.
