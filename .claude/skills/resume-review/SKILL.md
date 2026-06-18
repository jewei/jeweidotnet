---
name: resume-review
description: >-
  Review and improve a software engineer's résumé against the r/EngineeringResumes
  wiki standards. Use when reviewing, critiquing, editing, or formatting the résumé
  page (src/pages/resume.astro, src/data/resume.ts) or the downloadable PDF, when
  checking bullet points, action verbs, section order, skills, or dates, or when the
  user asks to make their resume stronger or more recruiter-/ATS-friendly.
---

# Résumé Review — jewei.net

Review the résumé against the **r/EngineeringResumes** community standards, adapted
for a **senior software engineer with 10+ years of experience** (the site owner is a
senior Laravel/PHP IC with 15+ years). The goal is a résumé that is **easy to skim in
30 seconds**, parses cleanly through an ATS, and proves capability through concrete,
quantified, technical bullets — not job descriptions.

## What you are reviewing

This repo holds the résumé in three coupled places. A review usually touches all of them.

| Artifact | Path | Notes |
|---|---|---|
| Structured data | `src/data/resume.ts` | Source of truth: summary, strengths, experience, skills, education |
| Web page | `src/pages/resume.astro` | Renders the data; can be slightly richer than print |
| Downloadable PDF | `public/content/files/2026/06/jewei-resume-{year}.pdf` | The artifact recruiters actually read — apply the wiki rules **strictly** here |
| PDF link | `resumePdfUrl` in `src/data/resume.ts` | Keep in sync with the PDF filename |

**Web vs. PDF:** the wiki rules below were written for a one/two-page printed résumé.
The web page may relax layout rules (it scrolls, has links, dark mode), but **content
rules — bullet quality, action verbs, quantified impact, no banned words, section order —
apply to both.** When the user says "my resume," confirm whether they mean the page, the
PDF, or both.

## When to use

- The user asks to review, critique, or "tear apart" the résumé
- Editing bullets, the summary, skills, experience, or education
- Checking formatting, dates, section order, or ATS-friendliness
- Producing or updating the downloadable PDF

## Review workflow

1. **Read the source data first** — `src/data/resume.ts`. This is where almost every
   content fix lands. Then skim `src/pages/resume.astro` for how it renders.
2. **Run the checklist** in `references/checklist.md` top to bottom. Flag every miss with
   the file + line, the rule, and a concrete rewrite — not just "improve this."
3. **Score the bullets hardest.** Bullets are where most résumés win or lose. Apply
   `references/bullet-points.md`: every bullet starts with a strong past-tense action
   verb, follows XYZ/STAR/CAR, quantifies impact, and contains no banned/weak verbs or
   filler adjectives. This is the highest-leverage pass — do it carefully.
4. **Check section order and senior conventions** via `references/sections.md`. For this
   user (10+ YoE): summary allowed, Experience first, Education last, no GPA, ≤2 pages.
5. **Report findings** grouped by severity: blocking content issues → formatting/polish →
   nice-to-haves. Give before/after rewrites. Then offer to apply them to `resume.ts`.
6. **If editing the PDF**, the rules apply strictly (single column, fonts, margins, en
   dashes, right-aligned dates). The web page follows the same content but its own layout.

## The rules that matter most (everything else is in the references)

Skim these here; the exhaustive lists live in the reference files. Read the relevant
reference file before doing that part of the review — don't work from memory.

- **Skimmable & ATS-parsable.** Single column, no icons/images/graphics, modern font
  (Calibri, Charter, Arial), black ≥10.5pt, ≥0.4in margins, real bullet points not
  paragraphs. Don't justify text. Clear section separation.
- **One page per decade.** This user (15+ YoE) may use up to 2 pages — but only if every
  line earns its place. Trim older roles to a line or two.
- **Bullets, not duties.** "Your résumé is not your job description." Each bullet = one
  technical accomplishment with context and a measurable result. See
  `references/bullet-points.md`.
- **Strong action verbs only.** Led, architected, built, designed, reduced, optimized,
  refactored. Never: utilized, worked on, helped, assisted, responsible for, leveraged.
  Full lists in `references/bullet-points.md`.
- **Quantify.** Move metrics toward the start of the bullet. "Integrated 10+ payment
  providers across Asia" beats "Integrated payment providers."
- **Section order (senior IC):** Summary (≤2 sentences) → Experience → Skills → Education.
  Education at the bottom, no GPA, no high school. See `references/sections.md`.
- **Skills = real, interviewable tech only.** Comma-separated, ≤3 lines, no soft skills,
  no "Expert in," no Git host names (use "Git" not "GitHub"). See `references/sections.md`.
- **Dates:** en dash with spaces (`2018 – 2023`), `Present` not `Current`, right-aligned,
  full years. See `references/checklist.md`.
- **Contact:** one Gmail/Outlook address in plain text, no labels, no physical address,
  no phone unless wanted, no masked links. See `references/checklist.md`.
- **No bias triggers:** no age, gender, marital status, nationality, photo, religion.

## Reference files

Read the one relevant to the current pass before reviewing that section:

- `references/checklist.md` — the full pass/fail checklist: general rules, formatting,
  accessibility, dates, contact info, grammar. Run this end to end.
- `references/bullet-points.md` — bullet objectives, XYZ/STAR/CAR, the good/bad/banned
  action-verb lists, and worked rewrites. The most important file.
- `references/sections.md` — per-section rules: Work Experience, Education, Skills,
  Projects, Portfolios, plus the senior-engineer (10+ YoE) and career-changer playbooks.

## Senior-engineer specifics (applies to this user)

- Include a brief summary (≤2 sentences). Current `resume.ts` summary is 2 paragraphs —
  consider tightening for the PDF.
- Mention **influence**, not just impact: mentoring, standards, architecture decisions,
  subject-matter ownership — but always tied to a result.
- Make the **earliest roles terse** (one or two lines). The 2009–2013 Joomla roles need
  far less space than the recent Laravel work.
- Education moves to the bottom; drop GPA and dates-as-range (graduation year only).
- Keep separate résumés if ever applying to **management vs. IC** roles.

## Do not

- Fabricate metrics, employers, or accomplishments. If a bullet lacks a number, ask the
  user for the real figure or rewrite around the concrete technical work instead.
- Add buzzwords, soft skills, photos, icons, or a references section.
- Let any bullet read as a job duty rather than an accomplishment.
- Edit the PDF and the data out of sync — `resume.ts` is the source of truth; regenerate
  the PDF from it (or flag the drift) rather than patching one side only.
