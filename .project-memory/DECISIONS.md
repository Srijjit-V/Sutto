# Technical Decisions — QueryQuest

## Decision: Deploy entirely on Vercel, not GitHub Pages
**Date:** 2026-08-24
**Status:** active
**Decision:** Host the whole app — static frontend and a single serverless
`/api/ai-hint` function — on Vercel.
**Reason:** The app needs somewhere to hold the Gemini API key server-side and
enforce real rate limiting. GitHub Pages only serves static files and can't do
either. Vercel supports both in one deploy.
**Alternatives considered:** GitHub Pages + a separate Cloudflare Worker for
the AI proxy (two deploys to manage, no real benefit over just using Vercel
for everything).
**Consequences:** One Vercel project, one set of environment variables to
manage. No separate static host.

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
**Status:** active
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
**Status:** active
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
