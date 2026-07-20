# Deployment and persistence

## Constraint

The owner prefers a file-oriented database to avoid operating a separate database service. Local SQLite is ideal for development, but Vercel Functions provide a read-only filesystem with temporary `/tmp` scratch space, so a SQLite file stored beside the application is not durable on Vercel.

## Recommendation

Start with Vercel for the Next.js application and a managed, low-operations database integrated into the deployment. Prefer a serverless PostgreSQL provider available through the Vercel marketplace when prioritizing Prisma compatibility and straightforward migrations. This is the lowest-risk production path for authentication, revisions, and concurrent autosave.

For local development, use SQLite only if the repository layer and migration tooling can maintain production parity; otherwise use a local PostgreSQL container.

## File-like alternative

If SQLite semantics are a firm preference, evaluate a hosted libSQL/SQLite-compatible service. This preserves much of the SQLite model but is still a remotely hosted database. Confirm current Prisma adapter maturity, backup behavior, regional latency, and free-tier limits before choosing it.

## Single-host alternative

Railway, Render, or Fly.io can run the Next.js Node server with SQLite on a persistent volume. This avoids a separate database service but introduces volume backups, single-region constraints, scaling limitations, and more operational responsibility. It is reasonable for a personal site but less portable than Vercel plus managed PostgreSQL.

## Decision gate

Before application scaffolding locks the ORM schema, choose between:

1. **Recommended:** Vercel + managed serverless PostgreSQL + Prisma.
2. **SQLite preference:** single Node host + persistent volume + SQLite, after validating backup and restore.
3. **SQLite semantics:** Vercel + hosted libSQL-compatible database, after adapter validation.

## Other deployment concerns

- Google OAuth callback URLs must cover local, preview, and production environments.
- Preview deployments must not expose production drafts or accept production contact traffic by default.
- The selected production hostname is `koc9n.dev`; keep the current Vercel alias until the domain is purchased and attached.
- Production secrets live only in the hosting platform's encrypted environment configuration.

## Research references

- Vercel runtime filesystem: https://vercel.com/docs/functions/runtimes#file-system-support
- Railway persistent volumes: https://docs.railway.com/reference/volumes
- Cloudflare D1 illustrates a managed serverless database with SQLite semantics: https://developers.cloudflare.com/d1/
