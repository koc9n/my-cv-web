# Architecture

## System shape

Use one Next.js application for the public UI, admin UI, backend operations, authentication callbacks, and export endpoints. A separate Node.js service is unnecessary for the initial scale.

```text
Browser
  -> Next.js public pages
  -> Next.js admin pages -> Auth.js -> Google OAuth
                         -> application services -> persistence
                         -> PDF/DOCX renderers
```

## Modules

- `app/(public)`: published CV, contact, metadata, and downloads
- `app/admin`: authenticated editor, preview, versions, and publishing
- `domain/cv`: framework-independent schema, validation, ordering, and transformations
- `server/auth`: Google OAuth, allowlist enforcement, and session checks
- `server/cv`: draft, revision, publish, and restore use cases
- `server/contact`: validation, abuse prevention, and delivery adapters
- `renderers`: web view models plus PDF and DOCX generation
- `db`: persistence schema, migrations, and repositories

The exact directory names may change during scaffolding, but these boundaries should remain.

## Content lifecycle

1. The admin edits a mutable draft.
2. Debounced autosave sends a revision token with each write.
3. The server rejects stale writes to prevent accidental overwrite.
4. Autosaves update the draft; meaningful snapshots are created at controlled intervals and before publish/restore.
5. Publish atomically copies a validated snapshot to the published version.
6. Public pages and normal downloads read only the published snapshot.
7. Restore creates a new draft from an old revision rather than destroying history.

## Data modeling

Use structured JSON for the CV document, validated by a versioned runtime schema, with relational metadata for drafts, publications, and revisions. This keeps optional/reorderable sections flexible without losing transactional version control.

Core records:

- `Cv`: stable identity and pointers to current draft/published versions
- `CvVersion`: immutable content snapshot, schema version, author, reason, and timestamp
- `Draft`: mutable content, optimistic-lock version, and update timestamp
- `ContactSubmission`: optional retained metadata; message handling must follow the privacy policy

## Authentication and authorization

Auth.js handles Google OAuth. Authentication alone is insufficient: the verified Google email must exactly match an environment-configured allowlist. Every admin page, server action, and mutation endpoint performs server-side authorization.

## Export strategy

- HTML/web is the primary semantic layout.
- PDF should be generated from a dedicated print stylesheet or server-side browser rendering so it closely resembles the website while preserving selectable text.
- DOCX uses a dedicated semantic renderer because HTML-to-DOCX fidelity is unreliable. It must preserve the same content and visual language, not pixel identity.
- Export artifacts should be generated on demand initially and may be cached by published version ID later.

## Contact delivery

The public UI exposes deliberate contact actions without placing raw private values in static source. A server endpoint resolves protected contact destinations from environment variables. The form validates input, rate-limits submissions, includes a honeypot, and delivers through configurable email and Telegram adapters. CAPTCHA is added only if abuse warrants it.

## Quality strategy

- Unit tests: schema, transformations, revision rules, authorization, and export view models
- Integration tests: persistence and authenticated mutations
- End-to-end tests: login boundary, edit/autosave/publish/restore, public display, and downloads
- Visual checks: desktop, mobile, print, and generated PDF
- Extraction check: parse generated PDF/DOCX and compare critical text/order against the canonical model
