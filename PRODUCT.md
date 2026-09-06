# Product

## Register

brand

## Users

Three overlapping audiences, in priority order:

1. **Engineering peers** — developers and technical leaders who want to inspect Jewei's work or read practical writing about software engineering, PHP, tooling, AI-assisted work, and system design. Job: find useful work, understand how Jewei thinks, and return to the writing.
2. **Recruiters and prospective clients** — evaluating Jewei professionally via the resume page and overall site quality. Job: quickly assess credibility, skills, and taste.
3. **Jewei himself** — the site doubles as a personal archive of thinking (blog, curated collections). Writing for the archive keeps the voice honest and personal.

## Product Purpose

jewei.net is a personal developer blog and portfolio. It exists to publish technical writing, showcase craft, and serve as a professional front door. Success looks like: posts that are genuinely pleasant to read end-to-end, a site whose polish itself demonstrates engineering and design competence, and a resume/professional surface that converts evaluators.

## Brand Personality

**Quiet technical editorial.** Minimal, precise, personal, and confident. The site uses publication typography, useful technical detail, and small moments of developer humour. It avoids decorative UI and lets the work and writing carry the page. The result must feel like one engineer's long-kept website, not a platform theme.

## Anti-references

- **Corporate SaaS landing pages**: hero-metric templates, gradient text, identical icon-card grids, marketing language, and generic startup styling.
- **Brutalist dev-blogs**: monospace-everything, terminal cosplay, harsh pure black/white, deliberately hostile density.
- Anything that reads as an anonymous platform default (stock Medium/Substack look).

## Design Principles

1. **Reading is the product.** Long-form legibility beats decoration; whimsy lives in the margins, never in the text column.
2. **Polish is the portfolio.** Every detail (motion, spacing, code blocks, OG images) is itself evidence of competence — ship nothing that undercuts that.
3. **Personality with restraint.** Developer references and humour can appear in small details. They must not become the page structure.
4. **Personal, not templated.** If an element could appear on any developer blog unchanged, rework it until it couldn't.
5. **Fast and quiet.** Static output, self-hosted fonts, Lighthouse-clean; performance is part of the brand promise.

## Accessibility & Inclusion

Target **WCAG AAA**: 7:1 contrast for body text, 4.5:1 for large text. Every animation has a `prefers-reduced-motion` alternative. Full keyboard navigability, visible focus states, semantic HTML throughout. Color never sole carrier of meaning (tag chips, links, feedback states all have non-color cues). AAA is a hard constraint on the playful palette — verify tinted surfaces and colored text against it before shipping.
