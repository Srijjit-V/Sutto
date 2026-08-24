# QueryQuest

A gamified way to learn SQL: work through story-driven, chapter-gated
challenges that run real SQL (via an in-browser SQLite engine), review with
spaced-repetition flashcards, earn coins for a cosmetic item shop, and get
AI-generated hints from a mascot character when you're stuck. Chunky, colorful,
"Fall Guys but 2D" visual style — deliberately low on animation.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in your own keys — see below
```

Required environment variables (server-side only, set in `.env.local` for dev
and in Vercel's dashboard for production — never commit these):
- `GEMINI_API_KEY` — a free Google AI Studio API key, used only by `/api/ai-hint`.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — free-tier Upstash
  Redis credentials, used only for rate limiting `/api/ai-hint`.

## Usage

```bash
npm run dev
```

Then open http://localhost:3000.

## Development

```bash
npm run test       # unit tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright)
npm run lint       # ESLint
npm run build      # production build
```

## Deployment

Deployed on Vercel. The whole app — static frontend and the single
`/api/ai-hint` serverless function — lives in one Vercel project. Set the
environment variables above in the Vercel project settings before deploying.

## Project structure

- `src/app/` — Next.js App Router pages, including `api/ai-hint/` (the one
  server-side route: proxies the AI helper, holds the API key, enforces rate
  limiting).
- `src/lib/sql-engine/` — sql.js (SQLite/WASM) wrapper, run inside a Web Worker
  with a query timeout/complexity cap.
- `src/lib/ai/` — prompt construction for the AI hint helper; treats user
  input as untrusted data.
- `src/lib/game/` — chapter/challenge/flashcard/shop content and game logic.
- `src/components/` — UI components (mascot, chapter map, SQL editor + block
  builder toggle, flashcard reviewer, shop).
- `tests/` — unit tests. `e2e/` — Playwright end-to-end tests.
- `.project-memory/` — durable project memory (see `INDEX.md`, `STATE.md`,
  `DECISIONS.md`).

See `CLAUDE.md` for architecture details and working conventions.
