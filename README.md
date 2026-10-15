# MyGovBrain AI

Database-driven government-services guidance for the Assam pilot.

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and set the Supabase project URL and publishable key.
4. To enable Gemini responses, set `GEMINI_API_KEY` in `.env.local` (and optionally `GEMINI_MODEL` to select a supported Gemini model). Keep the key server-side; do not use a `NEXT_PUBLIC_` variable.
5. Start the app with `npm run dev`.

`.env.local` is ignored. Never commit Supabase keys. Production uses the same two variables configured in the deployment environment.

## Database migrations

Migrations are versioned under `supabase/migrations/` and run against the linked project with:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

The database uses UUID foreign keys, public-read RLS for published content, user-owned RLS for checklists/cases, and admin-only RLS for content editing. Supabase Authentication should have email OTP enabled; phone OTP can be enabled in the dashboard when required.

## Admin service editing

1. Create or sign in to an account through `/auth`.
2. Promote the account to admin through a controlled SQL operation by a trusted project owner:

```sql
update public.profiles set is_admin = true where id = 'AUTH_USER_UUID';
```

3. Open `/admin`.
4. Select an existing service or create one.
5. Fill both English and Hindi translations, documents, official source, explicit service/source statuses, and eligibility rules JSON.
6. Save and verify the public service page. Every save is recorded in `audit_logs`.

The form validates URLs and status values server-side. It never uses a service-role key in the browser and cannot bypass RLS.

## AI assistant grounding

The `/ai` assistant uses curated facts about this platform plus matching published service records from Supabase. Gemini answers are instructed not to guess missing government requirements, fees, deadlines, or official links; source links returned to the browser must match a verified source in the supplied context. If Gemini is not configured or is unavailable, the local provider returns only available context and cannot provide free-form answers. Keep service translations and official-source verification current in the database for useful service guidance. The assistant cannot see private account records or live government application status.

## Automatic official-source updates

The home page and `/updates` page show snapshots from verified government source pages linked to published services. Vercel runs the checker once daily. The first successful check publishes a clearly marked initial snapshot; later checks publish only when page content changes. Each item includes the original source link; a page change is not treated as verified evidence that a service rule or deadline changed.

To enable monitoring in production:

1. Apply the Supabase migration with `supabase db push`.
2. Set `SUPABASE_SERVICE_ROLE_KEY` and a long random `CRON_SECRET` in the Vercel project environment. The service-role key is used only by the scheduled server endpoint and must never be exposed to the browser.
3. Ensure each source to monitor is marked `verified` and belongs to a published service. Only HTTPS `.gov.in` and `.nic.in` source domains are fetched; redirects and non-text responses are rejected.
4. Deploy the project with the included `vercel.json` cron configuration. The first run records a baseline; subsequent runs publish changes.

Add new official portals by adding their source links through the service editor and verifying them. The checker does not scrape third-party sites or infer the meaning of page changes.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Scope not yet built

- Semantic search
- Voice interaction
- Document upload, OCR, or verification
- Family mode
- Multi-state expansion
- Additional launch languages
- Admin user-management UI
- Production deployment automation and user outreach

See [ARCHITECTURE.md](ARCHITECTURE.md) for the current system map.
