# Project status, local setup, and deployment runbook

This document is the operational source of truth for running and releasing `my-cv-web`. Run all commands from the Git repository directory:

```bash
cd /Users/kon/IdeaProjects/my-cv-web/git/my-cv-web
```

## Implementation status

| Area                | Status                | Evidence and remaining work                                                                                                                                                                                                                                  |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Foundation          | Complete              | Next.js, strict TypeScript, Tailwind, Prisma, formatting, linting, tests, and CI are configured.                                                                                                                                                             |
| Public CV           | Implemented           | Semantic responsive CV, metadata, sitemap, robots, social image, print styles, PDF, and DOCX are present. Final content and ATS review must be repeated after the owner approves the CV facts.                                                               |
| Admin and revisions | Implemented locally   | Google allowlist authorization, structured editing, autosave with optimistic locking, publish, revision snapshots, and restore are implemented. Production OAuth and database behavior require live credentials.                                             |
| Downloads           | Implemented           | Public/draft PDF and DOCX renderers and extraction-oriented tests exist. Final production downloads still need manual visual and selectable-text checks.                                                                                                     |
| Contact             | Partially complete    | Protected email and Telegram reveal actions exist. Form delivery currently uses Telegram only. The in-process rate limiter is useful locally but must be supplemented by a Vercel/provider edge rate limit because serverless instances do not share memory. |
| Release             | Owner action required | GitHub remote, Vercel project, managed PostgreSQL, Google OAuth, Telegram credentials, domain, and production acceptance tests remain.                                                                                                                       |
| Automated coverage  | Partial               | Unit, component, export, authorization, rate-limit, repository, and optional database integration tests exist. Browser end-to-end and automated Lighthouse/print visual gates are still future work.                                                         |

Do not mark the release complete until every item in `docs/RELEASE.md` has been checked on the final HTTPS hostname.

## Prerequisites

- Node.js 24 and npm
- Docker Desktop (recommended locally) or PostgreSQL 17
- A Google OAuth client for admin sign-in
- A Telegram bot and destination chat for contact-form delivery

The public page and public downloads can run without a database. The private admin editor requires PostgreSQL and Google OAuth.

## Local development: public site only

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. With no working database or OAuth configuration, use only the public page and downloads. Never put real secrets in `.env.example`.

## Local development: full application

1. Create the ignored local environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Generate a strong local authentication secret and place the output in `AUTH_SECRET`:

   ```bash
   openssl rand -base64 32
   ```

3. In Google Cloud Console, create an OAuth 2.0 Web application. Add:

   - Authorized JavaScript origin: `http://localhost:3000`
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

4. Fill `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `ADMIN_EMAIL` in `.env.local`. `ADMIN_EMAIL` must exactly match the verified Google account allowed to edit the CV.

5. To enable contact delivery, fill `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `PUBLIC_CONTACT_EMAIL`, and `PUBLIC_TELEGRAM_URL`.

6. Install dependencies, start PostgreSQL, and apply migrations:

   ```bash
   npm ci
   docker compose up -d db
   npm run db:deploy:local
   ```

7. Start the application:

   ```bash
   npm run dev
   ```

8. Open:

   - Public CV: `http://localhost:3000`
   - Admin editor: `http://localhost:3000/admin`
   - Prisma database UI: run `npm run db:studio:local`

Stop the local database with `docker compose stop db`. `docker compose down` removes containers but retains the named database volume. Do not use `docker compose down -v` unless intentionally deleting local CV data.

## Local verification

Run the full repository gate before pushing:

```bash
npm run check
```

Run the PostgreSQL integration test only against a dedicated disposable test database. The test deletes all rows from the CV tables:

```bash
docker compose exec db createdb -U mycv mycv_test
DATABASE_URL=postgresql://mycv:mycv_local@localhost:5432/mycv_test npm run db:deploy
DATABASE_URL=postgresql://mycv:mycv_local@localhost:5432/mycv_test RUN_DB_TESTS=true npm run test:integration
```

The `createdb` command reports that the database already exists on later runs; that is harmless. Never run the integration test with a development database containing work or with a production `DATABASE_URL`.

Before release, also manually verify narrow mobile, desktop, A4 print preview, keyboard navigation, visible focus, PDF/DOCX text selection and extraction, authorized admin access, unauthorized-account rejection, publish/restore, and contact delivery.

## Create and connect the GitHub repository

Create an empty public repository named `my-cv-web` under the intended GitHub account or organization. Do not initialize it with generated files. Then run:

```bash
git remote add origin git@github.com:OWNER/my-cv-web.git
git remote -v
git push -u origin main
```

Replace `OWNER`. Before the first push, inspect `git status`, `git diff --cached`, and the tracked-file list:

```bash
git ls-files
```

Confirm that `.env.local`, source CV files, databases, exports, `AGENTS.md`, `.agents/`, `.codex/`, `.junie/`, and IDE files are absent.

## Recommended production deployment: Vercel and managed PostgreSQL

1. Push `main` to GitHub and import `OWNER/my-cv-web` into Vercel.
2. Attach a managed PostgreSQL database (Neon through the Vercel Marketplace is the documented default).
3. Set these Production environment variables in Vercel:

   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `ADMIN_EMAIL`
   - `NEXTAUTH_URL=https://FINAL_HOST`
   - `NEXT_PUBLIC_SITE_URL=https://FINAL_HOST`
   - `ENABLE_PREVIEW_ADMIN=false`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `PUBLIC_CONTACT_EMAIL`
   - `PUBLIC_TELEGRAM_URL`

4. Apply production migrations from a trusted local checkout with the production `DATABASE_URL` supplied securely, or run the same command in a protected deployment job:

   ```bash
   npm ci
   npm run db:deploy
   ```

   Never paste the production URL into a committed file or shell script.

5. Deploy the application.
6. Add `https://FINAL_HOST/api/auth/callback/google` to the Google OAuth client.
7. Add an infrastructure-level rate limit for `/api/contact` and `/api/contact/reveal`.
8. Complete every live check in `docs/RELEASE.md`.

For preview deployments, do not expose production database or contact secrets. Admin access is denied in Vercel Preview unless `ENABLE_PREVIEW_ADMIN=true`; only enable it with disposable preview data and credentials.

## Domain cutover

After attaching the final domain:

1. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the final `https://` URL.
2. Add the final OAuth callback URL in Google Cloud Console.
3. Redeploy so canonical metadata, sitemap, and robots output use the domain.
4. Test sign-in, autosave, publish, restore, contact, PDF, and DOCX again on the final hostname.

## Rollback and recovery

- Application: promote the last known-good Vercel deployment.
- CV content: restore a prior revision through `/admin`; restoration creates a new draft and preserves history.
- Database schema: deploy a reviewed forward-fix migration. Never reset or delete the production database to roll back.
- Secrets: rotate a suspected credential in its provider, update Vercel, and redeploy.

## Known release blockers

The repository cannot complete these automatically because they require owner authority or factual approval:

- choose the GitHub owner and connect the remote;
- approve all public CV facts and private contact values;
- provision and fund hosting/database services;
- create Google and Telegram credentials;
- select and configure the domain;
- decide whether Telegram-only form delivery is sufficient or implement an email delivery provider;
- perform final production accessibility, performance, visual, ATS, and security acceptance checks.
