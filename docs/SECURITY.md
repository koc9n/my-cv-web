# Security and privacy

## Public repository boundary

Never commit:

- Source CV files under `data/`
- Personal email, phone number, home address, or unredacted contact submissions
- OAuth client secrets, auth secrets, API tokens, or production environment files
- Local or production database files
- Generated exports containing private information unless explicitly approved

Keep `.env.example` limited to placeholder or local-development values; real credentials belong only in ignored local environment files and the hosting provider's encrypted settings.

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

The 2026-07-20 dependency refresh reports zero known vulnerabilities. Next.js 16.2.10 pins an older PostCSS and NextAuth 4.24.14 pins an older UUID, so `package.json` explicitly overrides those transitive packages with tested patched versions until their upstream releases update them.

Major-version compatibility was tested rather than forced:

- ESLint 10 is not yet supported by the React/import/accessibility plugins bundled with the current Next.js ESLint configuration.
- TypeScript 7 is not yet supported by the bundled TypeScript ESLint parser.
- Prisma 7 changes client generation and database-driver architecture; migrate it separately with database integration and deployment validation rather than treating it as a routine security bump.
- Node type definitions stay on the Node 24 line to match the declared runtime.

Re-run `npm audit`, the PostgreSQL integration test, and the complete `npm run check` gate during every dependency refresh. Never apply `npm audit fix --force` when it proposes framework downgrades.
