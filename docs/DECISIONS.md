# Decision log

## Accepted

### 2026-07-20 — Full-stack Next.js application

Use Next.js with React and TypeScript for both frontend and backend capabilities. Do not create a separate backend service initially.

### 2026-07-20 — One CV with immutable version history

Support one canonical CV. Maintain a private mutable draft, immutable revisions, and one published snapshot. Restoration creates a new draft.

### 2026-07-20 — English-only initial release

The schema can remain localization-friendly, but the initial editor, website, metadata, and exports are English only.

### 2026-07-20 — Structured content and optional sections

Store CV content as a validated structured document. Support the broad section catalog in `CV-SCHEMA.md`; omit empty sections automatically and allow visibility/order controls.

### 2026-07-20 — Google OAuth with one-admin allowlist

Use Google sign-in and authorize only the configured verified email address. No public registration.

### 2026-07-20 — Shared content, format-specific renderers

Web, PDF, and DOCX share facts, section ordering, and visual language. Pixel-identical output is not required; semantic integrity and ATS extraction take priority.

### 2026-07-20 — Public repository with private data excluded

Initialize a public GitHub repository, but ignore source CV files, database files, contact data, exports, and secrets.

### 2026-07-20 — Test-to-production branch promotion

Use `test` as the persistent integration branch and Vercel Preview environment. Use `main` as the protected release branch and the only Vercel Production Branch. Feature branches merge into `test`; production releases are reviewed pull requests from `test` to `main` after preview verification.

## Proposed, awaiting implementation validation

### Persistence and hosting

Preferred default is Vercel plus managed serverless PostgreSQL and Prisma. The owner's file-database preference is documented in `DEPLOYMENT.md`; a persistent-volume SQLite deployment remains an alternative.

### Contact delivery

Use environment-configured email and Telegram delivery adapters with rate limiting and bot friction. Final providers and retention policy remain open.

## Waiting for source CV

- Public name, personal brand, and domain candidates
- Exact target-role headline and summary
- Contact channels and which details may appear in exports
- Section ordering based on actual experience
- Keywords and achievements that can be supported without invention
- Whether a profile photo is appropriate
