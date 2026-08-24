# Technical Decisions — QueryQuest

## Decision: Presentation-slide-style lesson intro, not a hosted video
**Date:** 2026-08-24
**Status:** active
**Decision:** Every chapter now shows a lesson card (concept name, a few
explanatory bullets, one worked SQL example) before its challenge list. The
user asked for "a video or explanation... or presentation slide" before
each chapter — this app has no video hosting/playback infrastructure (and
adding one, e.g. embedding third-party video, would be a large scope
increase and a new external dependency for a fully static app), so the
presentation-slide option — one the user explicitly offered as an
alternative — was built instead.
**Reason:** Delivers the actual pedagogical goal (explain the concept
before the challenges) without a disproportionate infrastructure lift or
external dependency, and stays consistent with "fully client-side, no
backend" from earlier decisions.
**Alternatives considered:** Embedding a third-party video host (rejected —
no content exists to embed, and it would require picking/trusting an
external service); recording original narrated video (out of scope for a
code-generation session).
**Consequences:** If real instructional video is wanted later, the lesson
data model (`ChapterLesson`) can be extended with an optional video URL
without restructuring anything.

## Decision: Hand-author compact Chinook/Northwind-style datasets, don't embed the real dumps
**Date:** 2026-08-24
**Status:** active
**Decision:** Added an Explore/Sandbox mode (`/explore`) with real,
well-known multi-table sample datasets — one modeled on Chinook (digital
music store) and one on Northwind (trading company), the two standard
free/public-domain SQL teaching databases. Rather than fetching and
embedding the actual published data dumps (which run to hundreds of KB of
INSERT statements per dataset), each is a small hand-authored dataset that
follows the same table names, columns, and relationships, with fresh
sample rows.
**Reason:** Keeps bundle size sane (full Chinook is ~15k rows), sidesteps
any ambiguity about reproducing external file content wholesale, and is
still a faithful, genuinely useful stand-in for learning joins/aggregation
against real-shaped relational data — verified by researching that these
are in fact the two standard free sample databases before building them.
**Alternatives considered:** Fetching real Chinook_Sqlite.sqlite/Northwind
SQLite dumps from GitHub and embedding them directly (rejected — much
larger bundle, and reproducing a large external file verbatim is worth
avoiding even when the license is permissive).
**Consequences:** Datasets are clearly labeled "-style" in their display
names so it's honest about being inspired-by rather than the genuine
article; a future pass could swap in the real dumps if bundle size stops
mattering (e.g. lazy-loaded on dataset selection).

## Decision: CSV import yes, Excel/.xlsx import no (for now)
**Date:** 2026-08-24
**Status:** active
**Decision:** Explore mode lets users upload their own CSV file, parsed
client-side (via `papaparse`) into a dynamically-typed SQL table. Excel
(.xlsx) import was not implemented.
**Reason:** The standard library for parsing .xlsx client-side (`xlsx`,
i.e. SheetJS) has two unpatched high-severity npm advisories (prototype
pollution, ReDoS) with no fixed version published to npm. Given this
project has otherwise been careful about dependency security throughout
(see the AI-hint decisions above), installing a known-vulnerable package
silently wasn't the right call.
**Alternatives considered:** Installing `xlsx` anyway on the reasoning that
it only parses a locally-selected file, not untrusted network input
(considered, but rejected — a malicious .xlsx a user is tricked into
opening is exactly the scenario these advisories describe, and the
CSV-only path already covers "bring your own spreadsheet" for the common
case of exporting from Excel/Sheets/Numbers).
**Consequences:** Users with .xlsx files need to export to CSV first (one
extra step, called out directly in the Explore UI's upload copy). Revisit
if SheetJS ships a patched release to npm, or if a vetted alternative
parser appears.

## Decision: Deploy entirely on Vercel, not GitHub Pages
**Date:** 2026-08-24
**Status:** superseded by "Remove the AI hint helper" below
**Decision:** Host the whole app — static frontend and a single serverless
`/api/ai-hint` function — on Vercel.
**Reason:** The app needs somewhere to hold the Gemini API key server-side and
enforce real rate limiting. GitHub Pages only serves static files and can't do
either. Vercel supports both in one deploy.
**Alternatives considered:** GitHub Pages + a separate Cloudflare Worker for
the AI proxy (two deploys to manage, no real benefit over just using Vercel
for everything).
**Consequences:** Now that there's no server-side route at all, the app is
back to being deployable as plain static output — GitHub Pages is viable
again if desired, though Vercel still works fine too.

## Decision: sql.js (SQLite via WASM) run in a Web Worker
**Date:** 2026-08-24
**Status:** active
**Decision:** All SQL challenges execute against real SQLite databases running
client-side via `sql.js`, inside a Web Worker with a query timeout and a
complexity/row cap.
**Reason:** Real query execution (vs. pattern-matching expected answers) lets
players explore data and see real error messages, which is core to the
learning experience. Running it in a worker with caps prevents a runaway
query (accidental cross join, infinite recursion in a CTE, etc.) from
freezing the UI thread.
**Alternatives considered:** Fake/simulated query checker (rejected — much
less educational, doesn't feel like "real" SQL).
**Consequences:** No server-side database is needed for challenge content;
all schema/seed data ships as static assets loaded into sql.js.

## Decision: No accounts/auth in v1; progress is localStorage-only
**Date:** 2026-08-24
**Status:** active
**Decision:** XP, coins, streaks, chapter progress, and flashcard scheduling
are all stored in the browser's `localStorage`. No sign-in flow in v1.
**Reason:** Keeps v1 scope small and fully client-side; most classic
auth-related vulnerabilities simply don't apply yet.
**Alternatives considered:** Optional Supabase-backed cloud sync (deferred —
can be added later without needing to redesign the local data model, as long
as the local store stays the source of truth and sync is additive).
**Consequences:** Progress is lost if a user clears browser data or switches
devices, until a future cloud-sync feature ships.

## Decision: AI hint helper — Gemini free tier, proxied server-side, rate-limited
**Date:** 2026-08-24
**Status:** reversed 2026-08-24 (see "Remove the AI hint helper" below)
**Decision:** The only server-side logic in the app is `/api/ai-hint`, which
calls Google Gemini's free tier (`gemini-2.0-flash` or current free-tier
equivalent). The API key lives only in a Vercel environment variable. The
route is rate-limited via Upstash Redis (`@upstash/ratelimit`), token-bucket
per session-id + per-IP. User query/error text is always treated as quoted
data in the prompt, never as instructions, and is length-capped.
**Reason:** Directly addresses the two most common vibe-coding security
failures researched for this project: exposed API keys in client bundles, and
missing/fake rate limiting that resets on every serverless cold start.
**Alternatives considered:** Groq free tier (viable fallback if Gemini's free
tier changes); client-side BYO-key model (rejected — worse UX, and the user
chose the Vercel-proxy approach explicitly).
**Consequences:** Adds one external dependency (Upstash) beyond Vercel +
Gemini, but keeps the free tier real cost at $0 for expected usage levels.

## Decision: Remove the AI hint helper
**Date:** 2026-08-24
**Status:** active
**Decision:** Deleted `/api/ai-hint`, `src/lib/ai/`, and the `HintPanel`
component entirely, along with the `@google/generative-ai`, `@upstash/redis`,
and `@upstash/ratelimit` dependencies. The app is now 100% client-side again.
**Reason:** Explicit user request ("take out the ai").
**Alternatives considered:** Keeping the route but disabling it in the UI
(rejected — the user asked for it gone, and dead server code with unused
security controls is worse than no server code at all).
**Consequences:** No more server-side surface area at all, so the earlier
Vercel-vs-GitHub-Pages hosting question is reopened (see that decision above)
and every security control that existed only for this feature (rate
limiting, prompt-injection guarding, key handling) is now moot — there's
nothing server-side left to secure.

## Decision: Chapter-gated linear progression + cosmetic-only item shop
**Date:** 2026-08-24
**Status:** active
**Decision:** Chapters unlock linearly (finish a chapter's challenges + its
flashcard review set to unlock the next). The item shop only sells cosmetics
(mascot outfits, themes, profile flair) bought with earned coins — no
gameplay-affecting purchases.
**Reason:** Keeps the core economy simple to build and balance for v1; avoids
pay-to-win-style design questions entirely since there's no real-money
purchase path in v1 either.
**Alternatives considered:** Non-linear/open chapter access (rejected for v1
— linear gating matches the "Duolingo path" model the user wants);
consumable/gameplay-affecting shop items like hint tokens or streak freezes
(deferred, adds economy-balancing complexity not needed for v1).
**Consequences:** Shop implementation stays simple (a static catalog + owned-
items list in localStorage); no economy tuning needed yet.

## Decision: Low-animation "Fall Guys but 2D" visual direction
**Date:** 2026-08-24
**Status:** superseded by "Claymorphism via ui-ux-pro-max" below
**Decision:** Chunky, colorful, toy-like shapes and mascot design, but a
deliberately low animation budget — mostly static UI with simple fades/
slides, and only a couple of real celebration animations (level-up, chapter
clear). No idle-loop animation or elaborate Framer Motion choreography.
**Reason:** Explicit user preference after an earlier, more animation-heavy
direction was scaled back ("less animation now").
**Alternatives considered:** Fuller Framer Motion treatment with idle mascot
animation (this was the original plan; superseded by this decision).
**Consequences:** Framer Motion is still a dependency but used sparingly;
most UI state changes should be plain CSS transitions.

## Decision: Claymorphism visual system via the `ui-ux-pro-max` skill
**Date:** 2026-08-24
**Status:** active
**Decision:** Installed the `ui-ux-pro-max` Claude Code skill
(`.claude/skills/ui-ux-pro-max/`) and ran its design-system search for a
"kids educational game" product type. Adopted its recommendation:
Claymorphism style (soft 3D, chunky, thick borders, double shadows, 16-24px
radius), Baloo 2 / Comic Neue fonts, and its indigo/orange color palette —
replacing the earlier hand-picked "Fall Guys 2D" palette. Also applied its
checklist items we were violating: replaced all emoji-as-icons with
`lucide-react`, added `cursor-pointer` to clickable elements, and made the
mascot's continuous idle animation (blink + bob, added per user request)
respect `prefers-reduced-motion`.
**Reason:** The user explicitly asked for the previously-installed
`ui-ux-pro-max` skill to actually be used, not just referenced/saved as a
memory. It produced a concrete, sourced design system rather than an
arbitrary one.
**Alternatives considered:** Continuing with the hand-rolled palette
(rejected — the point was to actually use the skill's output).
**Consequences:** Dark mode was dropped (the skill's data flags it as
"conditional/avoid" for this product type and style) — the app is
light-mode only now, which also matches the "very basic UI" request.

## Decision: Zustand persist — `skipHydration` + explicit rehydrate on mount
**Date:** 2026-08-24
**Status:** active
**Decision:** The progress store's `persist` middleware now sets
`skipHydration: true`; `Header` calls `hydrateProgressStore()` in a
`useEffect` on mount instead of relying on automatic hydration.
**Reason:** Found via manual browser testing (a fresh-tab/cleared-
localStorage check, done specifically to rule out stale console-log
history) — with automatic hydration, the client's first render already
reflects localStorage while the server-rendered HTML always shows the
zero-state default, which is a genuine React hydration-mismatch error, not
a cosmetic one. This is a well-known zustand-persist + SSR interaction, not
specific to this app.
**Alternatives considered:** Ignoring the warning (rejected — it's a real
correctness issue, and mismatches like this can cause visible flicker or
incorrect DOM state in edge cases); wrapping every persisted-value read in
a "mounted" check at each call site (rejected — more scattered than fixing
it once at the store level).
**Consequences:** There's a brief instant on first load where the header
shows 0 XP/coins/streak before flipping to the real persisted values (once
`hydrateProgressStore()` runs) — acceptable for this app's scale.
