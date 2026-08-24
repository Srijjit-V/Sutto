# Project Index — QueryQuest

## Entry points
- `src/app/layout.tsx` — root layout
- `src/app/page.tsx` — home page (chapter map / entry point, not yet built out)
- `src/app/api/ai-hint/route.ts` — AI hint serverless route (not yet built out)

## Key modules
- `src/lib/sql-engine/` — sql.js Web Worker wrapper, query timeout/complexity caps (not yet built out)
- `src/lib/ai/` — AI hint prompt construction, input sanitization (not yet built out)
- `src/lib/game/` — chapter/challenge/flashcard/shop content and logic (not yet built out)
- `src/components/` — UI components: mascot, chapter map, SQL editor + block builder, flashcard reviewer, shop (not yet built out)

## Tests
- `tests/` — Vitest unit tests, run with `npm run test`
- `e2e/` — Playwright end-to-end tests, run with `npm run test:e2e`

## Commands
- Run: `npm run dev`
- Test: `npm run test` / `npm run test:e2e`
- Build: `npm run build`
- Lint: `npm run lint`

## Generated / ignored
- `node_modules/` — dependencies
- `.next/` — build output
- `.vercel/` — Vercel deployment metadata
- `.env*` — secrets, never committed
