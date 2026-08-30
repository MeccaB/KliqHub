# My Two Cents

A Next.js App Router foundation for a nationwide, community-powered business review platform.

## Included
- Responsive business discovery, profile, review, search, and workflow scaffold
- PWA manifest and service worker
- Typed domain model in `db/schema.ts` for users, businesses, reviews, votes, moderation, and owner responses
- Clear seams for Auth.js, a Neon Marketplace Postgres database, Vercel Blob uploads, server-side pagination, and rate limiting

## Production wiring next
1. Provision **Neon via the Vercel Marketplace**. Vercel Postgres is no longer first-party; it was migrated to Neon in December 2024.
2. Add `DATABASE_URL`, `AUTH_SECRET`, Google/Apple provider credentials, and Blob credentials in Vercel environment variables.
3. Replace `lib/sample-data.ts` reads with Drizzle queries and protect write routes with Auth.js sessions and rate limits.
4. Add a PWA icon set before release.

## Supabase setup
1. Create a Supabase project and run `supabase/migrations/001_my_two_cents.sql` in its SQL editor.
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel. The service role key must never be exposed to the browser.
3. Configure Google and Apple in Supabase Auth, then add their redirect URL for your Vercel domain.

The app uses Supabase Auth email/password immediately; OAuth provider buttons can be added after those provider settings are active.
