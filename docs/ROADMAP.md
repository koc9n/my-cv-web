# Roadmap

## Phase 0 — Foundation

Status: implemented locally.

- Add the private source CV under `data/`
- Review/import content and resolve placeholders without inventing facts
- Choose the production persistence option
- Scaffold Next.js, TypeScript, Tailwind CSS, linting, formatting, and tests
- Add environment-variable contract and local setup

## Phase 1 — Public CV

Status: implemented and export text order verified.

- Implement the canonical CV schema and seed/import flow
- Build the semantic minimal-creative template
- Add responsive and print styles
- Add metadata, sitemap, robots configuration, and social preview
- Validate plain-text and ATS extraction order

## Phase 2 — Admin and versions

Status: core authenticated editing, autosave, publish, and restoration implemented; production OAuth/database verification requires credentials.

- Add Google OAuth and email allowlist
- Build structured editing, reordering, visibility, validation, and live preview
- Add debounced autosave with optimistic concurrency
- Implement revisions, publish, and restore
- Add authorization and lifecycle tests

## Phase 3 — Downloads and contact

Status: PDF/DOCX and Telegram-backed contact flow implemented; provider credentials are required for live delivery.

- Implement PDF generation and extraction tests
- Implement DOCX generation and extraction tests
- Add protected contact actions
- Add the contact form, rate limiting, and email/Telegram delivery

## Phase 4 — Release

Status: code and CI preparation complete; hosting, domain, OAuth, and production secrets require owner-controlled accounts.

- Configure hosting, database, OAuth, and preview isolation
- Run accessibility, performance, SEO, security, responsive, and print checks
- Select and configure the personal domain
- Publish the initial CV

## Later candidates

- Analytics with a privacy decision and cookie assessment
- Multiple tailored CV variants
- Localization
- Additional administrator roles
