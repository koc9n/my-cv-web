# Release checklist

## Accounts and values required from the owner

- GitHub account authenticated through `gh`
- Vercel account connected to the GitHub repository
- Managed PostgreSQL database, recommended: Neon through Vercel Marketplace
- Google Cloud OAuth web client
- Telegram bot token and destination chat ID
- Purchased personal domain

Never send production secrets through chat or commit them. Enter them directly in Vercel project settings and a local ignored `.env.local` file.

## Suggested domain

At the 2026-07-20 RDAP check, `kostiantynmironchyk.com` and `kostiantynmironchyk.dev` returned no registration record. This is not a reservation or purchase guarantee. Prefer the `.com` for broad recruiter recognition; redirect the `.dev` variant if both are purchased.

## Production sequence

1. Create the public GitHub repository and push `main`.
2. Import the repository into Vercel.
3. Attach managed PostgreSQL and set `DATABASE_URL` for production only.
4. Set all values from `.env.example`. Keep `ENABLE_PREVIEW_ADMIN=false`.
5. Run `npm run db:deploy` against the production database.
6. Deploy and record the final Vercel URL.
7. Configure Google OAuth callback: `https://FINAL_HOST/api/auth/callback/google`.
8. Verify the authorized account can edit, autosave, export a draft, publish, and restore.
9. Verify an unauthorized Google account is rejected.
10. Submit the contact form and test direct email/Telegram reveal actions.
11. Attach the domain, set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to its HTTPS URL, then redeploy.
12. Validate canonical metadata, sitemap, robots, social card, security headers, PDF, and DOCX on the final host.

## Preview isolation

- Do not expose production `DATABASE_URL`, Google secrets, Telegram secrets, or contact destinations to Preview unless intentionally testing them.
- Admin sign-in is denied when `VERCEL_ENV=preview` unless `ENABLE_PREVIEW_ADMIN=true`.
- Use disposable preview credentials/data if preview admin testing is explicitly enabled.

## Rollback

- Roll back application code through Vercel deployment promotion.
- Restore CV content through the admin revision history.
- Database schema rollback requires an explicit reviewed migration; never reset production data.
