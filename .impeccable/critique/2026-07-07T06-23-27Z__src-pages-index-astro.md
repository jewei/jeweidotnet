---
target: homepage
total_score: 29
p0_count: 1
p1_count: 2
timestamp: 2026-07-07T06-23-27Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design-review subagent · B: detector-evidence subagent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Reading time computed but never shown on homepage cards |
| 2 | Match System / Real World | 3 | "Collections" nav label ambiguous; jewei.toString() opaque to recruiters |
| 3 | User Control and Freedom | 3 | No search |
| 4 | Consistency and Standards | 2 | Three tag-chip styles; clock icon next to date on grid cards |
| 5 | Error Prevention | 3 | n/a for static content |
| 6 | Recognition Rather Than Recall | 3 | Tags silently truncated at 2/3, no "+N" cue |
| 7 | Flexibility and Efficiency | 3 | RSS + dark mode; no search/pagination |
| 8 | Aesthetic and Minimalist Design | 4 | Cohesive; hero double-tagline is the only slack |
| 9 | Error Recovery | 3 | Empty state is a dead end |
| 10 | Help and Documentation | 2 | Nothing explains Home vs Blog (same 10 posts) |
| **Total** | | **29/40** | **Good** |

## Anti-Patterns Verdict

LLM: PASS. Detector: 0 findings (index.astro, PostCard.astro, BaseLayout.astro). Soft tells: Ghost-default tagline (index.astro:73), generic gradient-wash no-image fallback (PostCard.astro:53), decorative hover corner-blob (PostCard.astro:98). Browser overlays skipped: no browser automation.

## Priority Issues

- [P0] Ghost default tagline "Thoughts, stories and ideas." (index.astro:73) — violates "personal, not templated". Delete or rewrite in own voice. → clarify
- [P1] Card metadata AAA fail dark mode: dark:text-inverse-on-surface/60 on dates (PostCard.astro:81,115) = 6.33:1 measured; /70 = 8.20 passes. → polish
- [P1] "More Writing" heading breaks with 0 pinned posts (index.astro:136). Conditional heading. → harden
- [P2] Card grammar inconsistent: 3 tag-chip styles, calendar_month vs schedule icons, silent tag truncation. One chip style + one icon + "+N". → polish
- [P2] Mobile hero depth: flex-col-reverse avatar-first, ~2 viewports to first post. Shrink avatar on mobile. → adapt

## Persona Red Flags

- Jordan: "Collections" zero scent; CTA "Read the Blog" lands on near-identical page; jewei.toString() reads broken to non-devs.
- Riley: empty state no next action; unclamped titles; tagToSlug collisions (C++/C → /blog/c/, non-latin → "tag"); unbounded tag cloud.
- Casey: toggles in thumb dead zone; topic chips ~36-38px < 44px; count badge looks tappable; first content ~2 screens down.

## Minor Observations

- hover:-translate-y-1 on everything dilutes the lift
- Footer missing RSS link despite feed wired + "subscribe" a stated user job
- Sparkle right-1/3 can overlap CTA row at tablet widths
- Pinned is the only icon-bearing heading
- Avatar glow animates while off-screen

## Questions

1. What is the homepage for, if /blog/ exists? Curate (pinned + latest 3 + all-writing link)?
2. Where does the whimsy end? All delight above the fold; no closing beat.
3. AAA verified or aspired? Replace /60-/70 opacity arithmetic with a checked muted-token pair.
