# QueryQuest — Claude Context

## Purpose
A gamified, story-driven web app that teaches SQL. Players work through
linear, gated chapters of hands-on SQL challenges (run against a real
in-browser SQLite engine via `sql.js`), review with spaced-repetition
flashcards, earn coins to buy cosmetic items, and can ask a mascot character
for AI-generated hints. Visual style is "Fall Guys but 2D" — chunky, colorful,
low-animation. See `.project-memory/DECISIONS.md` for the full architecture
rationale and `README.md` for setup/run instructions.

## Architecture
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS, deployed on
  Vercel.
- **SQL engine**: `sql.js` (SQLite/WASM) runs entirely client-side inside a
  Web Worker (`src/lib/sql-engine/`), with a query timeout and complexity cap
  so a runaway query can't freeze the tab. There is no server-side database.
- **AI hint helper**: the ONLY server-side piece. A single serverless route,
  `src/app/api/ai-hint/`, calls Google Gemini's free tier. The Gemini API key
  lives only in a Vercel environment variable — it must never be read from
  client code or shipped in the browser bundle. This route is rate-limited
  via Upstash Redis (`@upstash/ratelimit`), token-bucket per session-id + per-IP.
  User query/error text is always treated as quoted data in the AI prompt,
  never as instructions (prompt-injection guard), and is length-capped.
- **Progress/state**: Zustand + `localStorage`. No accounts, no auth, in v1 —
  progress is local to the browser only.
- **Game content**: `src/lib/game/` — chapter definitions, challenges, expected
  result sets, flashcard decks, shop items.
- **Design system**: generated via the `ui-ux-pro-max-skill` Claude Code skill,
  audited with the `impeccable` skill/plugin (installed).

## Important paths
- `src/app/api/ai-hint/` — the one serverful route; holds the Gemini key + rate limiter.
- `src/lib/sql-engine/` — sql.js Web Worker wrapper, query execution + safety caps.
- `src/lib/ai/` — prompt construction for the AI hint helper (input sanitization lives here).
- `src/lib/game/` — chapters, challenges, flashcards, shop data.
- `src/components/` — UI components (mascot, chapter map, editor, shop, etc.).
- `tests/` — Vitest unit tests.
- `e2e/` — Playwright end-to-end tests (game-flow: solve a challenge, see XP update).

## Commands
- Setup: `npm install`
- Run: `npm run dev`
- Test (unit): `npm run test`
- Test (e2e): `npm run test:e2e`
- Lint: `npm run lint`
- Build: `npm run build`

## Conventions
- TypeScript strict mode; no `any` without a comment justifying it.
- All AI-related code stays inside `src/app/api/ai-hint/` and `src/lib/ai/` —
  never call the Gemini API from client components.
- Any new user-facing text that could end up in an AI prompt must be treated
  as untrusted data (quote it, don't concatenate it into instructions).

## Do not
- Commit `.env`, `.env.local`, or any API key/secret.
- Call the Gemini API (or any AI provider) directly from client-side code —
  always go through `/api/ai-hint`.
- Add a second server route without also adding rate limiting to it.
- Force-push, discard uncommitted work, or commit without running tests first.

## Memory
- Update `.project-memory/STATE.md` after meaningful work.
- Update `.project-memory/INDEX.md` if structure changes.
- Durable architecture calls belong in `.project-memory/DECISIONS.md`.
