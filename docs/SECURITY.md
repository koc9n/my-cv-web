# Security and privacy

## Public repository boundary

Never commit:

- Source CV files under `data/`
- Personal email, phone number, home address, or unredacted contact submissions
- OAuth client secrets, auth secrets, API tokens, or production environment files
- Local or production database files
- Generated exports containing private information unless explicitly approved

Provide `.env.example` later with placeholder names only.

## Admin access

- Google OAuth identity must have a verified email.
- The email must match the server-side allowlist.
- One administrator is supported initially.
- Protect every mutation and private read on the server; hiding UI is not authorization.
- Use secure, HTTP-only, same-site cookies and production HTTPS.

## Editing and publishing

- Validate and sanitize structured rich text.
- Use optimistic concurrency for autosave.
- Record audit metadata for publish and restore operations.
- Do not delete historical versions during restore.
- Require an explicit confirmation for publishing and destructive version cleanup.

## Contact protection

- Keep destination email and Telegram identifiers in environment configuration.
- Prefer a server-mediated reveal/contact flow and human-readable labels.
- Rate-limit form submissions by privacy-conscious signals.
- Add honeypot and timing checks; introduce CAPTCHA only if needed.
- Avoid claiming that client-side obfuscation prevents scraping; it only raises the cost for simple bots.
- Define submission retention before storing message bodies. The default should deliver and retain the minimum operational metadata.

## Baseline controls

- Security headers and a restrictive content security policy
- CSRF-safe framework patterns for mutations
- Request-size limits and schema validation
- Dependency and secret scanning in CI
- No sensitive values in logs or client bundles

## Dependency audit note

The 2026-07-20 baseline audit reported no critical advisories. It reported framework/transitive advisories involving Next.js/PostCSS, NextAuth/UUID, and Prisma's CLI dependency. Available automated fixes proposed incompatible downgrades, so they were not applied blindly. Re-run `npm audit` during each dependency update and upgrade to patched compatible releases when available. Prisma CLI is development tooling; production exposure must still be reassessed after deployment packaging.
