# Architecture

## Runtime

Next.js App Router with TypeScript and Tailwind CSS. Server components fetch public content through `src/lib/data.ts`; client components handle language selection, Easy Mode, the checker, checklist interaction, OTP auth, and the AI conversation UI.

## Data

Supabase PostgreSQL migrations live in `supabase/migrations/`.

- Reference data: languages, states, districts, departments, categories.
- Service data: services, translations, reusable document types, service documents, and official sources.
- Week 4 state: eligibility rules/translations, user service cases, checklists, and checklist items.
- Week 6 governance: profiles with `is_admin`, audit logs, and minimal analytics events.

Display text belongs in translations or database records. Application code does not contain service or category records.

## Security

RLS is enabled on all application tables. Public roles can read only public-safe content. Authenticated users can read/write only their own cases and checklist rows. Admin content writes require `public.is_admin()` through both server-side checks and database policies. Admin saves create audit log records.

The admin form uses the normal authenticated Supabase session. No service-role key is shipped to the client.

## Request flow

1. The browser requests a route.
2. The server reads the language cookie/query parameter and fetches active database records.
3. Public routes render service data, official source status, and fallback-language warnings.
4. The AI route rate-limits requests, adds curated platform knowledge and matching published service records, and uses Gemini when `GEMINI_API_KEY` is configured; otherwise it uses the deterministic local provider.
5. AI responses are instructed to use grounded context only, and returned source URLs are restricted to verified URLs in that context. The assistant does not access private account data or live government application status.
6. User actions call server actions, which re-check the authenticated user before writes.
7. Admin actions validate input, write related records, and append an audit log.

## Analytics

The allowlisted events are `service_search`, `service_view`, `language_changed`, and `checklist_created`. Events contain only a path and small non-personal metadata. There is no analytics read policy for public roles.

## Operational boundaries

AI guidance is implemented through the `/ai` route and service-page assistant. Voice, OCR, family mode, multi-state rollout, additional launch languages, admin user management, automated production deployment, and a user feedback collection system are not yet included.
