# Project Index — QueryQuest

## Entry points
- `src/app/layout.tsx` — root layout (Baloo 2 / Comic Neue fonts, metadata)
- `src/app/page.tsx` — home page (hero + scroll showcase + chapter map)
- `src/app/chapter/[chapterId]/page.tsx` — challenge list for a chapter
- `src/app/chapter/[chapterId]/challenge/[challengeId]/page.tsx` — the SQL playground
- `src/app/shop/page.tsx` — cosmetic item shop
- `src/app/explore/page.tsx` — Explore/Sandbox mode (dataset picker + free-form SQL)

There is no server-side route in this app — it's fully static/client-side.

## Key modules
- `src/lib/sql-engine/sql.worker.ts` — sql.js running inside a Web Worker
- `src/lib/sql-engine/client.ts` — worker wrapper: query timeout + recreation
- `src/lib/game/types.ts` — Chapter/Challenge types
- `src/lib/game/chapters.ts` — chapter/challenge content (Chapters 1–3 are
  real: SELECT basics, filtering/sorting, joins; 4–7 are placeholders)
- `src/lib/game/checkResult.ts` — answer checker (ordered + unordered modes)
- `src/lib/game/unlock.ts` — chapter unlock/complete logic
- `src/lib/game/store.ts` — Zustand + localStorage progress store
- `src/lib/game/shopItems.ts` — cosmetic shop catalog
- `src/lib/datasets/types.ts` — shared `Dataset` type (name, description, seed SQL, table/column list)
- `src/lib/datasets/snackShop.ts`, `musicStore.ts`, `tradingCo.ts` — built-in datasets
  (the latter two modeled on Chinook/Northwind — see DECISIONS.md)
- `src/lib/datasets/index.ts` — `builtInDatasets` registry
- `src/lib/datasets/csvImport.ts` — parses an uploaded CSV into a Dataset (type inference, safe SQL identifiers)

## Components
- `src/components/Mascot.tsx` — Nibble: 5 states, idle blink + bob (respects prefers-reduced-motion)
- `src/components/Header.tsx` — nav + XP/coins/streak
- `src/components/ChapterMap.tsx`, `ChallengeList.tsx` — navigation
- `src/components/SqlPlayground.tsx` — editor, run, results, mascot reaction (challenge mode)
- `src/components/ExplorePage.tsx`, `DatasetPicker.tsx`, `SqlExplorer.tsx`,
  `SchemaViewer.tsx` — Explore/Sandbox mode (free-form, no checking)
- `src/components/Shop.tsx` — shop UI
- `src/components/LandingHero.tsx`, `ScrollShowcase.tsx` — home page hero/scroll sections
- `src/components/ui/` — shadcn-style primitives (`button.tsx`, `badge.tsx`) and the
  two integrated animated components (`hero-static-radial-gradient.tsx`,
  `scroll-reveal-image.tsx`)

## Design system
- `.claude/skills/ui-ux-pro-max/` — installed skill; run its scripts directly
  (e.g. `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>"
  --design-system`) until a Claude Code restart picks it up as a first-class
  skill. Current palette/fonts (Claymorphism, Baloo 2/Comic Neue) came from
  this skill — see `.project-memory/DECISIONS.md`.

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
- `public/sql-wasm.wasm` — copied from `node_modules/sql.js/dist/` (binary, committed since it's a small fixed asset the app needs at runtime)
