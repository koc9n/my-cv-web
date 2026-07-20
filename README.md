# my-cv-web

An ATS-conscious CV website for Kostiantyn Mironchyk, with a polished public profile, PDF/DOCX downloads, and a private Google-authenticated editor with autosave, publishing, and revision restoration.

## Stack

- Next.js 16, React 19, and strict TypeScript
- Tailwind CSS plus a custom print design
- PostgreSQL and Prisma
- Auth.js/NextAuth with Google OAuth and a one-email allowlist
- React PDF and `docx` for selectable-text exports
- Vitest and GitHub Actions

## Local setup

1. Install Node.js 24 and either PostgreSQL or Docker Desktop.
2. Copy `.env.example` to `.env.local` and fill the values.
3. Install dependencies with `npm ci`.
4. With Docker, start PostgreSQL using `docker compose up -d db`.
5. Apply the database migration with `npm run db:deploy`.
6. Start with `npm run dev` and open `http://localhost:3000`.

Without `DATABASE_URL`, the public page and downloads use the bundled initial CV, but admin editing requires PostgreSQL.

## Google OAuth

Create a Google OAuth web client and configure these callback URLs:

- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://YOUR_DOMAIN/api/auth/callback/google`

Set `ADMIN_EMAIL` to the single verified Google email permitted to access `/admin`. Google authentication does not bypass this server-side allowlist.

## Contact delivery

Create a Telegram bot and configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. The form uses validation and a honeypot; production infrastructure should also rate-limit `/api/contact` at the edge.

## Commands

```bash
npm run dev
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
npm run check
```

## Deployment

The recommended target is Vercel plus managed PostgreSQL. Configure all values from `.env.example`, run `npx prisma migrate deploy` against production, set `NEXT_PUBLIC_SITE_URL`, and update the Google callback URL. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

Use [`docs/PROJECT-RUNBOOK.md`](docs/PROJECT-RUNBOOK.md) for the current implementation status and exact local, GitHub, Vercel, domain, verification, and rollback steps.

Follow the owner-action sequence in [`docs/RELEASE.md`](docs/RELEASE.md) for repository publication, credentials, OAuth, domain, verification, and rollback.

## Private source material

The original CV under `data/`, local databases, generated exports, and environment files are ignored. Never force-add them to the public repository.
