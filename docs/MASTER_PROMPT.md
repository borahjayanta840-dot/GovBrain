# MyGovBrain / GovGuide AI — Project Audit and Build-from-Scratch Master Prompt

## Audit snapshot

This repository is a citizen-facing Indian public-services guidance product. The source code brands the product **GovGuide AI** (while the repository is MyGovBrain); it is an independent guide, not a government authority. The stated initial focus is an Assam pilot, with a state-scoped service catalog and Hindi/English language support.

### What is in the repository

- **Application:** Next.js App Router, React, TypeScript, Tailwind CSS v4, Framer Motion, Lucide icons, Zod, Vitest and Testing Library. Current declared framework versions include Next.js 16.3.6 and React 19.2.8. TypeScript strict mode is enabled and `@/*` maps to `src/*`.
- **Shared shell and design:** responsive navigation, mobile menu, language selector, easy-reading mode, auth navigation, footer, skip link, keyboard focus treatment, reduced-motion support, teal/green palette, light neutral surfaces, soft shadows, rounded cards, modest entrance/reveal motion and page-level metadata.
- **Home page:** hero and search, service categories and popular services, nearby CSC promotion, AI assistant promotion, application tracking and document-vault promotions, jobs, “why/how” content, social/newsletter areas, app promotion and closing CTA.
- **Public catalog:** `/services` search and category filters; `/services/[state]/[slug]` service details, official references, eligibility, documents/checklist and help-finding affordances. Catalog records and translations are queried from Supabase.
- **Guidance and access:** AI assistant at `/ai`, email OTP/magic-link auth surfaces, supported language preference via query/cookie, and easy mode.
- **Citizen account areas:** `/dashboard`, `/my-services`, `/tracker`, `/vault` and `/notifications`.
- **Discovery and opportunities:** `/csc`, `/csc/[centerId]`, `/jobs`, `/scholarships` and `/schemes`.
- **Partner/admin surfaces:** center registration at `/register-agent`, service editor at `/admin`, and supporting About, Help, Contact, Partner, Privacy and Terms pages.
- **Backend/API surfaces:** route handlers for AI, services, CSCs, jobs, scholarships, applications, documents/signed URLs, notifications, profile, admin analytics and lead workflows (create, update, assign, note).
- **Data and security foundation:** Supabase SSR clients, PostgreSQL migrations, multilingual reference/catalog data, eligibility/checklist/user-case structures, profile/admin roles, audit and privacy-conscious analytics records, CSC listings, application/document/notification/saved-item structures, job/scholarship tables, and a mini CSC lead connector. RLS, role checks, private storage and signed document URLs are intended controls.
- **Tests:** focused Vitest coverage exists for schemas, auth UI, AI components/journey/local provider, rate limits, platform security, API behavior and CSC registration/search/actions/links.

### Important implementation reality for a fresh build

Treat the repository as a **product and behavior reference**, not as proof that every screen is production-backed:

1. The primary government-service catalog, service translations, source metadata, admin content editor and checklist/user-service data access are Supabase-oriented.
2. The AI route has a Gemini provider plus a local fallback, structured response schemas, service-record grounding and rate-limit support. Secrets belong on the server. Its use must be transparent and must never invent official policy or sources.
3. The center search page/detail currently use presentation preview records; center registration submits hidden/unverified listings for review. Backend center APIs and database query helpers also exist, so connect the UI to those rather than treating the preview data as authoritative.
4. Jobs and scholarships pages currently display hard-coded example listings and preview metrics, although corresponding catalog APIs/data structures exist. Build live search/filter/detail states against the real API/database; make demos explicit and never present sample listings or counts as live facts.
5. The tracker uses hard-coded demo applications for signed-in users, despite application APIs/schema existing. The vault uses demo document rows and inert-looking UI controls, despite upload/list/delete/signed-URL API capability and private storage design. A new implementation must wire those controls to the backend and clearly represent upload/security status.
6. The dashboard currently shows static count examples. Build counts/activity from the current user’s records, with empty/loading/error states and strict owner isolation.
7. The architecture/README documents lag the code: they describe AI as not yet included, while an AI route and UI exist; their scope exclusions also do not reflect the newer backend/API and product routes. Use actual source features as the recreation baseline and keep future docs synchronized.
8. The existing product is an information and assistance platform: it does not itself issue government services or accept official payments. Preserve clear official-source links and independent-platform disclaimers.

Do not read, repeat, or copy local secret values. Use only environment-variable names and safe placeholders in any new documentation or configuration.

---

## Copy-ready master prompt

> **Role:** Act as a senior product designer, full-stack engineer and application architect. Build a polished, accessible, responsive citizen-services guidance website from scratch, inspired by the product brief below. Start with a fresh implementation and original code; do not assume access to this repository’s source or reuse its implementation verbatim.
>
> **Product:** Create **MyGovBrain / GovGuide AI**, an independent Indian government-services information and assistance platform. Help residents discover public services, understand eligibility and document requirements, find verified in-person assistance, prepare application checklists, and manage their own service activity. Initially focus the catalog on Assam, while making state expansion possible. Clearly state throughout the experience that the product is not a government authority, does not issue official approvals, and does not collect government fees.
>
> ### 1. Product principles
>
> - Make complex public-service processes understandable to first-time applicants, rural users, low-bandwidth/mobile users and people with limited digital literacy.
> - Treat the official source as the authority. Show the source title, link, verification/update status and last-checked date where available. Never fabricate eligibility, fees, deadlines, contact details, application status or government affiliation.
> - Keep the main catalog useful without signing in. Require authentication only for personal saved data and account workflows.
> - Prefer clear language, predictable navigation, visible progress and helpful empty/error states over decorative complexity.
> - Keep all personal data private by default. Do not request Aadhaar/PAN/bank/password details in the AI assistant. Do not log document contents, secrets, auth tokens or unnecessary personal data.
> - Clearly label preview/example data. Never mix mock metrics/listings with live content without an unmistakable demo label.
>
> ### 2. User groups and roles
>
> Support anonymous visitors, citizens, CSC operators, administrators and super administrators. Enforce role checks in server-side handlers and database policies; hiding a button is not authorization. Citizens can access only their own saved services, checklists, applications, uploaded documents and notifications. CSC operators can access only the leads/applications assigned to their center and permitted center records. Admins manage approved catalog content and review center submissions. Super-admin-only actions must be separately guarded and audited.
>
> ### 3. Site map and required pages
>
> Build a shared responsive shell with brand, primary navigation, language selector, easy-reading toggle, authentication state, mobile navigation, skip-to-content link, and a footer with quick links, legal links, language links, independence disclaimer and official-source reminder.
>
> Implement these route groups:
>
> - `/` — home page with clear value proposition and search; category shortcuts; popular services; nearby CSC help; AI guidance; tracking/checklist/document features; jobs and scholarships; how-it-works/trust content; app/newsletter/CTA sections.
> - `/services` — searchable and filterable published service catalog, state/category filters, useful no-results and data-error states, result count, pagination or incremental loading.
> - `/services/[state]/[slug]` — localized service details with summary, state/category/department, explicit eligibility, required/optional documents, how-to steps, fees and processing time only when verified, official sources and source status, fallback-translation notice, interactive checklist, eligibility questions/results, save action and nearby center discovery.
> - `/ai` — conversational service assistant, suggested questions, multi-turn UI, clear limitations, references to catalog records and official sources, clarification flow, loading/error/rate-limit states and a privacy disclaimer.
> - `/csc` and `/csc/[centerId]` — verified center search/detail with location or PIN search, offered services, contact actions, opening information, directions, status, and explicit verification indicators. Only published/verified records appear publicly.
> - `/register-agent` — validated center listing form; submission is private/unpublished pending admin review; explain exactly which submitted fields can become public.
> - `/auth` and auth callback/error states — secure email OTP or magic-link sign-in, confirmation/resend, return-path handling, accessible validation and errors. Validate redirect destinations to prevent open redirects.
> - `/dashboard` — real personal counts, recent activity and quick actions from authenticated records; no invented default stats.
> - `/my-services` — saved services and per-service checklist/eligibility progress, private to the signed-in citizen.
> - `/tracker` — real submitted applications, reference IDs, current status, timestamped status history/timeline, filters/search and receipt download only when an actual receipt exists.
> - `/vault` — private document list, upload, metadata/category, view/download via short-lived signed URL, delete confirmation, size/type validation, empty/error/progress states and privacy information. Never use public object URLs.
> - `/notifications` — authenticated list, unread/read state and notification preferences/status where supported.
> - `/jobs` and `/scholarships` — live searchable/filterable opportunities, eligibility, location/education level, verified deadlines, official application link, save action and expired/closing-soon labels based on real dates.
> - `/schemes` — searchable public scheme discovery, clearly sourced and state-scoped.
> - `/admin` — server-guarded content workspace for services/translations/documents/sources/eligibility rules and review queues. Validate all data, maintain audit history, and never expose a service-role key to the browser.
> - `/about`, `/help`, `/contact`, `/partner`, `/privacy`, `/terms` — coherent support, contact and policy surfaces; do not use placeholder legal claims.
>
> ### 4. Key journeys
>
> 1. **Discover a service:** visitor searches by natural language or name → filters by state/category → opens service → sees useful localized guidance, eligible documents and official links → can proceed to the official portal or find in-person help.
> 2. **Prepare:** visitor answers applicable eligibility questions → sees an explanation with caveat/source → checks off documents → signs in only to save progress → resumes later.
> 3. **Ask AI:** visitor asks a question → assistant identifies intent/service/state or asks for clarification → answers from published database context → includes only verified official URLs → offers next action. If relevant source data is missing or uncertain, say so and link to the catalog/official authority rather than guessing.
> 4. **Find help:** visitor searches by city/district/PIN and service → sees only verified centers offering that service → calls/messages or visits a detail page. Track contact interactions only as minimal, privacy-conscious analytics.
> 5. **Apply and follow up:** citizen creates an assistance/application request → receives reference ID → sees status history and notifications → authorized operator/admin updates the workflow with actor/time/remarks.
> 6. **Manage documents:** citizen uploads supported file → server validates ownership, type and size → stores under a private user-owned path → stores metadata separately → signs short-lived view/download URL only after owner check → allows deletion with consistent metadata and object cleanup.
> 7. **Register a center:** operator submits validated details and services → record remains unpublished → admin reviews/approves/rejects → approved, verified record becomes searchable.
>
> ### 5. Premium visual system and experience direction
>
> **Creative concept — “Civic clarity, made premium.”** Design a confident digital service concierge: as polished as a leading financial or travel product, but warmer, more human and easier to understand. The experience should feel dependable, calm and contemporary—not like a government portal, template marketplace, dashboard kit or AI-generated landing page. Make trustworthy information the visual centerpiece. Do not use government seals, Ashoka emblems, official-looking badges or visual language that implies government ownership or endorsement.
>
> **Art direction**
>
> - Use a refined palette anchored by deep evergreen/teal, warm ivory and soft mineral neutrals. Add a restrained saffron/amber accent for highlights and gentle, accessible semantic colors for success, warning and error. Keep primary copy near-black green for comfortable reading. Define colors as reusable design tokens and check contrast in actual component states.
> - Pair a confident editorial display face for large headings with a highly legible sans-serif for body text, forms and data. Use a practical system-font fallback. Keep type scale, line length and line height consistent; prioritize readability over stylistic novelty.
> - Establish generous whitespace, a disciplined spacing scale, precise alignment, quiet borders, layered but subtle shadows, and consistent corner radii. Use a small number of surface treatments rather than putting every element in a floating card.
> - Use gradients only as restrained accents. Prefer custom, coherent illustrations or simple abstract civic motifs over generic stock photography, fake app screenshots, random blobs or excessive glassmorphism. Any imagery must be relevant, optimized and respectful.
> - Use Lucide-style line icons consistently. Pair icons with text for navigation and important actions; do not rely on icon-only controls without accessible names.
>
> **Shared application chrome**
>
> - Build a slim trust/utility strip for the independent-platform message and support/about links, followed by a sticky, polished primary navigation with clear active state, logo/wordmark, Services, How it works, Centers/Help and Opportunities destinations, language control, easy-mode toggle and a prominent sign-in or account action.
> - On scroll, reduce visual height or elevation gracefully and show a subtle reading-progress indicator only if it helps orientation. Ensure the header never obscures anchored content or keyboard focus.
> - Mobile navigation should open as an accessible sheet/drawer with a clear close control, focus management, Escape handling, scroll containment and an obvious primary action. Never rely on hover.
> - Footer should repeat the brand, plain-language independence and source disclaimers, useful route groups, legal/support links, available languages and copyright without becoming visually dense.
>
> **Homepage composition**
>
> 1. Open with an editorial hero: a short trust-oriented eyebrow, a concrete benefit-led headline, concise supporting copy, one dominant service-search field and a clear secondary action to browse services. Use a distinctive but restrained visual accent/illustration; keep the search immediately usable on small screens.
> 2. Follow with quick-start category tiles and a compact “popular services” area that uses real catalog records and clear state/category context.
> 3. Place a high-utility “Find help nearby” section with location/PIN entry and verified-center reassurance; make AI guidance a helpful secondary route, not the only way to find information.
> 4. Introduce the citizen journey—check eligibility, prepare documents, get help, track progress—in a concise, scannable sequence. Show tracking/vault benefits without claiming capabilities that are not connected.
> 5. Surface current jobs and scholarships only when live and sourced; otherwise show an explicit empty state rather than invented statistics or fake listings.
> 6. Close with trust/how-it-works, support/community content and a single clear call to action. Avoid repeating the same CTA or feature card in every section.
>
> **Page and component craft**
>
> - Each page needs one clear H1, a short plain-language introduction, a focused primary action, a predictable content rhythm and helpful breadcrumb/back navigation where appropriate.
> - Design service detail pages like clear, actionable guides: an at-a-glance summary; a visually distinct source/verification panel; eligibility and document sections; numbered application steps; checklist/progress; and related verified help. On mobile, consider a compact sticky action bar only if it does not cover content or controls.
> - Use purposeful cards only where they group independent items. Create reusable patterns for service, center and opportunity cards, status chips, source citations, form fields, alerts, empty states, skeletons, pagination, dialogs and toasts. Establish clear visual differences between primary, secondary, destructive and text actions.
> - Use restrained density: generous section spacing on marketing pages and compact, aligned data presentation in account/admin areas. Tables should transform into readable stacked rows/cards on narrow screens instead of forcing page-wide horizontal scrolling.
> - Make every control communicate its affordance and state. Include hover, focus-visible, pressed, disabled, loading, success and error states. Avoid dead buttons, fake links, placeholder controls and ambiguous icon buttons.
> - Use inline field-level validation, concise recovery-oriented error copy, confirmation for destructive actions, and non-blocking toast/status messages for completed actions. Preserve entered form values when a recoverable error occurs.
> - Include deliberate loading, empty, partial-data and failure designs. Use skeletons only when they reflect the final layout; never let a loading placeholder imply a successful result.
>
> **Responsive behavior**
>
> - Design mobile-first from compact widths through tablet and wide desktop. Use a centered responsive content grid with a comfortable maximum reading width and fluid gutters.
> - Keep search and primary actions easy to reach, forms short and chunked, labels persistent, and touch targets at least 44 by 44 CSS pixels. Avoid tiny muted text, hover-only disclosures and side-by-side controls that collapse into cramped layouts.
> - At desktop sizes, use whitespace and carefully bounded columns rather than stretching paragraphs edge to edge. On small screens, stack content in a meaningful reading order and preserve all key context.
> - Test long translated strings, zoom/reflow, portrait and landscape layouts, and keyboard-only use—not just a single happy-path viewport.
>
> **Motion and feedback**
>
> - Use motion sparingly to signal cause and effect: short opacity/position transitions, gentle card feedback and clear menu/dialog transitions. Keep durations consistent and avoid scroll-jacking, parallax, autoplay, decorative looping animation or transitions that delay use.
> - Respect `prefers-reduced-motion` throughout; essential information and state changes must remain clear with animation disabled.
>
> **Accessibility and trust are part of the premium finish**
>
> - Target WCAG 2.2 AA: semantic landmarks/headings, skip link, logical tab order, visible high-contrast focus, keyboard-operable menus/dialogs, associated labels, field instructions, announced validation/status updates, sufficient contrast, non-color status cues and screen-reader-friendly progress/timelines.
> - Keep text selectable and resizable; support browser zoom and reflow. Use descriptive link text and accessible names for controls. Avoid excessive ARIA where native HTML semantics suffice.
> - Explain source freshness and fallback translations close to the relevant content. Distinguish verified facts, user-entered information and AI-generated guidance visually and in wording.
>
> The final result should feel bespoke and production-ready: a consistent tokenized design system, careful content hierarchy, polished responsive states and restrained, meaningful motion. Do not equate “premium” with tiny text, low contrast, excessive whitespace that hides functionality, ornamental animation, gradients everywhere or feature claims unsupported by working behavior.
>
> ### 6. Technical architecture
>
> Use the current stable versions of Next.js App Router, React, TypeScript strict mode and Tailwind CSS. Prefer server rendering for public catalog/content and server-side data access; use client components only where interaction/state requires them. Organize by routes, shared components, feature modules, domain types, server data access and validation schemas. Maintain a clear server/client boundary.
>
> Use Supabase (PostgreSQL, Auth, private Storage) for durable data and identity. Use migrations for schema, constraints, indexes, triggers and RLS. Use the authenticated SSR session for user operations. Keep privileged/service-role credentials strictly server-only. Validate all API/server-action input with Zod (or equivalent) and validate provider output before using it. Return stable error shapes/codes and avoid leaking database/provider internals.
>
> Build provider-backed AI behind a server-side adapter (Gemini may be configured through `GEMINI_API_KEY`) plus a deterministic/local fallback that can answer only from verified database records. Do not send secrets to the client. Apply per-IP/user rate limits before expensive work; use a distributed store such as Upstash Redis in multi-instance production. Enforce request limits and bounded conversation history.
>
> Keep environment configuration in `.env.example` with safe placeholders only. Expected variable names may include `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Never commit local env files or real credentials.
>
> ### 7. Core data model
>
> Design normalized, state-aware and translation-aware schemas for:
>
> - languages; states/districts; departments; service categories;
> - services and localized service translations; reusable document types and service-document relations; official sources with status/verification metadata;
> - eligibility rules and localized question/option labels;
> - profiles and role assignments;
> - citizen saved services, eligibility cases and checklists/items;
> - centers, center-service relations, verification/review fields and contact events;
> - applications, reference numbers, status history and assigned center;
> - document metadata and private storage object path;
> - notifications and saved jobs/scholarships;
> - jobs, scholarships and scheme records with state, eligibility, deadline, status and official URL;
> - CSC service leads, assignment, notes and append-only status history;
> - admin audit logs and minimal allowlisted analytics events.
>
> Use foreign keys, unique constraints, timestamps, appropriate indexes, safe enums/status constraints, and transaction/RPC boundaries for multi-record operations. Keep translation/content values in rows, not duplicated UI strings. Public read policies must expose only published services/opportunities and verified centers. User-owned policies must scope every row to `auth.uid()`. Admin write policies must be enforced in PostgreSQL as well as server handlers.
>
> ### 8. API and security expectations
>
> Provide typed, paginated and filterable endpoints (or equivalent server data functions) for public services, centers, jobs and scholarships; authenticated endpoints for profile, applications, documents, notifications, saved services and leads; plus admin-only content/review/analytics endpoints.
>
> Security requirements:
>
> - RLS enabled for every user/application table; test both allowed and denied cases.
> - Authenticate from server-verified Supabase user data, never from a client-supplied user ID/role.
> - Apply least privilege, ownership checks, role checks, rate limits and payload limits.
> - Sanitize search/filter construction; use parameterized database APIs.
> - Private storage with owner-scoped paths, MIME allowlist, file-size ceiling (10 MB), random object names and short-expiry signed URLs.
> - Avoid returning private contact/identity/document fields on public endpoints.
> - Add audit entries for privileged content edits and consequential status/document access.
> - Minimize analytics to an allowlist and non-identifying metadata; do not create an unauthenticated analytics read surface.
> - Use safe redirects, CSRF-aware auth/session patterns, secure cookie defaults, defensive error handling and appropriate HTTP status codes.
> - Do not silently fabricate success or fall back to fake live data when persistence/provider access fails.
>
> ### 9. Localization and content quality
>
> Support English and Hindi initially, with a structure that allows additional Indian languages without code changes. Store content translations in the database, remember user preference through a validated query/cookie mechanism, and display a clear fallback-language notice if the requested translation is absent. Localize navigation, form labels, errors, status labels and dates—not only service content. Use plain language and avoid claiming an AI answer is official.
>
> ### 10. Quality, testing and delivery
>
> Work incrementally: inspect requirements, scaffold, build shared design primitives, implement schema/RLS, public catalog, auth/personal data, AI, center workflows, opportunity modules, admin, then polish and validate. Keep all navigation destinations real and all interactive controls functional.
>
> Add tests for:
>
> - schema validation, search/filter/pagination and translation fallback;
> - eligibility/checklist behavior and official source rendering;
> - auth return paths and role/ownership rules;
> - API success, validation, unauthenticated/forbidden, rate-limit and backend-failure paths;
> - document file validation, owner checks, signed URL expiration and cleanup;
> - center verification and registration review lifecycle;
> - AI grounding, provider failure fallback, clarification and no fabricated sources;
> - responsive/accessibility-critical interactions and empty/loading/error states.
>
> Before declaring completion, run lint, typecheck, targeted tests and production build. Confirm that there are no dead buttons/links, no fake live counts/listings, no client-exposed secrets, and no route that returns another user’s records. Document setup, migration/deploy steps, environment variable names and any deliberately deferred features.
>
> **Definition of done:** a responsive, accessible and coherent civic-services website with working end-to-end discovery, service detail/checklists, secure sign-in, personal dashboard, real application tracking, private document management, verified center directory/registration review, sourced AI guidance, jobs/scholarships/schemes, admin governance, tests, migrations, safe configuration and clear independent-platform disclaimers.
