# Project Index — QueryQuest

## Entry points
- `src/app/layout.tsx` — root layout (fonts, metadata)
- `src/app/page.tsx` — home page (chapter map)
- `src/app/chapter/[chapterId]/page.tsx` — challenge list for a chapter
- `src/app/chapter/[chapterId]/challenge/[challengeId]/page.tsx` — the SQL playground
- `src/app/shop/page.tsx` — cosmetic item shop
- `src/app/api/ai-hint/route.ts` — AI hint serverless route (Gemini + rate limiting)

## Key modules
- `src/lib/sql-engine/sql.worker.ts` — sql.js running inside a Web Worker
- `src/lib/sql-engine/client.ts` — worker wrapper: query timeout + recreation
- `src/lib/ai/buildPrompt.ts` — AI hint prompt construction + input quoting
- `src/lib/game/types.ts` — Chapter/Challenge types
- `src/lib/game/chapters.ts` — chapter/challenge content (Chapter 1 is real; 2–7 are placeholders)
- `src/lib/game/checkResult.ts` — answer checker (ordered + unordered modes)
- `src/lib/game/unlock.ts` — chapter unlock/complete logic
- `src/lib/game/store.ts` — Zustand + localStorage progress store
- `src/lib/game/shopItems.ts` — cosmetic shop catalog

## Components
- `src/components/Mascot.tsx` — Nibble, 5 states
- `src/components/Header.tsx` — nav + XP/coins/streak
- `src/components/ChapterMap.tsx`, `ChallengeList.tsx` — navigation
- `src/components/SqlPlayground.tsx` — editor, run, results, mascot reaction
- `src/components/HintPanel.tsx` — calls `/api/ai-hint`
- `src/components/Shop.tsx` — shop UI

## Tests
- `tests/` — Vitest unit tests, run with `npm run test` (none written yet)
- `e2e/` — Playwright end-to-end tests, run with `npm run test:e2e` (none written yet)

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
- `public/sql-wasm.wasm` — copied from `node_modules/sql.js/dist/` (binary, committed since it's a small fixed asset the app needs at runtime)
