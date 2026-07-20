# Product brief

## Goal

Create the canonical web presence and downloadable CV for a senior Java developer, senior full-stack developer, and senior software engineer seeking remote and onsite opportunities.

## Audiences

- Recruiters scanning experience and keywords quickly
- Hiring managers evaluating scope, impact, and technical depth
- Prospective clients assessing credibility and contact options

## Experience principles

- Evidence before decoration: outcomes, scale, ownership, and relevant technologies are prominent.
- Fast scanning: the first screen communicates identity, target roles, summary, and primary actions.
- Progressive detail: concise core content with optional detail where the web format benefits from it.
- One source of truth: web, preview, PDF, and DOCX use the same structured CV data.
- Safe publishing: edits are private until explicitly published.

## Initial scope

### Public

- English-only CV page
- SEO metadata, canonical URL, sitemap, robots policy, and social metadata
- PDF and DOCX downloads
- Contact actions for Telegram and email plus a contact form
- Responsive and print-friendly presentation
- Sections omitted automatically when empty

### Admin

- Google OAuth with a configured email allowlist and one administrator
- Structured section editor with reordering and visibility controls
- Debounced autosave to a private draft
- Live preview
- Explicit publish action
- Revision list, comparison metadata, and restoration
- Export of draft preview and published content

## CV content priorities

The template supports all schema sections, but the default emphasis is:

1. Header, target title, and contact channels
2. Professional summary
3. Core technical skills grouped by capability
4. Reverse-chronological professional experience with measurable achievements
5. Selected projects when they add evidence not already present in experience
6. Education and relevant certifications
7. Additional sections only when useful to the target opportunity

## Success criteria

- A recruiter can understand role, seniority, core stack, and recent impact within seconds.
- Text extraction preserves a logical top-to-bottom reading order.
- The admin can safely edit, preview, publish, and restore without direct database access.
- Public and downloadable outputs are consistent in facts and ordering.
- Lighthouse-oriented performance, accessibility, and SEO checks become release gates after scaffolding.

## Deferred

- Multiple tailored CV profiles
- Localization
- Analytics and cookie consent
- Multiple administrators and granular roles
- Custom domain selection, pending the name from the source CV
