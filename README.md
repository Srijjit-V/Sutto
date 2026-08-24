# QueryQuest

A gamified way to learn SQL: work through story-driven, chapter-gated
challenges that run real SQL (via an in-browser SQLite engine) and earn
coins for a cosmetic item shop. Claymorphism visual style — chunky, soft,
toy-like, with a mascot ("Nibble") that blinks and bobs gently while idle
and reacts to your answers. Fully client-side, no backend, no accounts.

## Setup

```bash
npm install
```

No environment variables or API keys needed — the whole app runs
client-side.

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

Static — deployable to Vercel, Netlify, or any static/Node host that can
run `next build` / `next start`. No server-side routes, no secrets to
configure.

## Project structure

- `src/app/` — Next.js App Router pages.
- `src/lib/sql-engine/` — sql.js (SQLite/WASM) wrapper, run inside a Web Worker
  with a query timeout/complexity cap.
- `src/lib/game/` — chapter/challenge/shop content and game logic.
- `src/components/` — UI components (mascot, chapter map, SQL playground,
  shop) and `src/components/ui/` (shadcn-style primitives + the animated
  hero/scroll-reveal components on the landing page).
- `tests/` — unit tests. `e2e/` — Playwright end-to-end tests.
- `.project-memory/` — durable project memory (see `INDEX.md`, `STATE.md`,
  `DECISIONS.md`).

See `CLAUDE.md` for architecture details and working conventions.
