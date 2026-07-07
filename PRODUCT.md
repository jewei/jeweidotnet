# Product

## Register

brand

## Users

Three overlapping audiences, in priority order:

1. **Fellow developers** — readers arriving via search, RSS, or shared links to technical posts on software engineering, PHP, tooling, and system design. Context: reading long-form technical content, often on mobile or in a spare moment. Job: learn something useful, enjoy the read, maybe subscribe or return.
2. **Recruiters and prospective clients** — evaluating Jewei professionally via the resume page and overall site quality. Job: quickly assess credibility, skills, and taste.
3. **Jewei himself** — the site doubles as a personal archive of thinking (blog, curated collections). Writing for the archive keeps the voice honest and personal.

## Product Purpose

jewei.net is a personal developer blog and portfolio. It exists to publish technical writing, showcase craft, and serve as a professional front door. Success looks like: posts that are genuinely pleasant to read end-to-end, a site whose polish itself demonstrates engineering and design competence, and a resume/professional surface that converts evaluators.

## Brand Personality

**Cute but Premium.** Playful-Minimal: the clarity and restraint of high-end interfaces combined with the charm of indie-creative portfolios. Warm, whimsical, approachable — doodles, sparkles, soft-tinted surfaces — but never at the expense of technical authority or reading comfort. The site should feel unmistakably one person's, not a platform theme.

## Anti-references

- **Corporate SaaS landing pages**: hero-metric templates, gradient text, identical icon-card grids, marketing-speak, generic purple-gradient startup aesthetic.
- **Brutalist dev-blogs**: monospace-everything, terminal cosplay, harsh pure black/white, deliberately hostile density.
- Anything that reads as an anonymous platform default (stock Medium/Substack look).

## Design Principles

1. **Reading is the product.** Long-form legibility beats decoration; whimsy lives in the margins, never in the text column.
2. **Polish is the portfolio.** Every detail (motion, spacing, code blocks, OG images) is itself evidence of competence — ship nothing that undercuts that.
3. **Whimsy with restraint.** Doodles, stickers, and blobs are seasoning, applied deliberately in a few places, not scaffolding repeated on every section.
4. **Personal, not templated.** If an element could appear on any developer blog unchanged, rework it until it couldn't.
5. **Fast and quiet.** Static output, self-hosted fonts, Lighthouse-clean; performance is part of the brand promise.

## Accessibility & Inclusion

Target **WCAG AAA**: 7:1 contrast for body text, 4.5:1 for large text. Every animation has a `prefers-reduced-motion` alternative. Full keyboard navigability, visible focus states, semantic HTML throughout. Color never sole carrier of meaning (tag chips, links, feedback states all have non-color cues). AAA is a hard constraint on the playful palette — verify tinted surfaces and colored text against it before shipping.
