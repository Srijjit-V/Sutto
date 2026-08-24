# QueryQuest — Claude Context

## Purpose
A gamified, story-driven web app that teaches SQL. Players work through
linear, gated chapters of hands-on SQL challenges run against a real
in-browser SQLite engine (`sql.js`), and earn coins to buy cosmetic items.
The mascot, Nibble, blinks and bobs gently while idle and reacts to your
answers. Visual style is Claymorphism (soft 3D, chunky, toy-like — chosen
via the `ui-ux-pro-max` skill for a "kids educational game" product type).
Fully client-side: no backend, no accounts, no API keys. See
`.project-memory/DECISIONS.md` for the full architecture rationale and
`README.md` for setup/run instructions.

## Architecture
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS. Fully
  static/client-side — no server-side routes or secrets.
- **SQL engine**: `sql.js` (SQLite/WASM) runs entirely client-side inside a
  Web Worker (`src/lib/sql-engine/`), with a query timeout and complexity cap
  so a runaway query can't freeze the tab.
- **Progress/state**: Zustand + `localStorage`. No accounts, no auth —
  progress is local to the browser only.
- **Game content**: `src/lib/game/` — chapter definitions, challenges,
  expected result sets, shop items.
- **Datasets**: `src/lib/datasets/` — reusable named datasets (schema +
  seed data), used by both chapters and the Explore/Sandbox mode
  (`/explore`). Includes two datasets modeled on the classic Chinook
  (music store) and Northwind (trading company) teaching databases —
  hand-authored compact versions, not copies of the originals' actual data.
  Also includes `csvImport.ts`, which turns an uploaded CSV into a dataset
  client-side (infers column types, builds CREATE TABLE/INSERT SQL).
  Excel/.xlsx import was deliberately left out — the standard library for
  it (`xlsx`/SheetJS) has unpatched high-severity advisories on npm.
- **Design system**: Claymorphism, generated via the `ui-ux-pro-max` skill
  (installed at `.claude/skills/ui-ux-pro-max/` — restart Claude Code to
  pick it up as a first-class skill; until then its scripts can be run
  directly, e.g. `python3 .claude/skills/ui-ux-pro-max/scripts/search.py
  "<query>" --design-system`). Fonts: Baloo 2 (headings) / Comic Neue (body).
- **shadcn-style UI primitives**: `src/components/ui/` (`Button`, `Badge`,
  plus the animated `HeroStaticRadialGradient` and `ScrollRevealImage`
  components used on the landing page only).

## Important paths
- `src/lib/sql-engine/` — sql.js Web Worker wrapper, query execution + safety caps.
- `src/lib/game/` — chapters, challenges, shop data, progress store.
- `src/lib/datasets/` — named datasets (snack shop, music store, trading
  co) shared between chapters and Explore mode, plus CSV import.
- `src/components/` — game UI (mascot, chapter map, SQL playground, shop,
  Explore/dataset picker/schema viewer).
- `src/components/ui/` — shadcn-style primitives + landing-page components.
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
- No emoji-as-icons — use `lucide-react` (per the `ui-ux-pro-max`
  accessibility/style checklist).
- Any continuous/looping animation (mascot idle bob/blink, etc.) must be
  disabled under `prefers-reduced-motion` — see `globals.css`.
- There is intentionally no server-side code in this app. If a future
  feature needs one (e.g. reintroducing an AI helper), treat all
  user-provided text passed to it as untrusted data, never as instructions,
  and never let a client component call a third-party API directly.

## Do not
- Commit `.env`, `.env.local`, or any API key/secret.
- Force-push, discard uncommitted work, or commit without running tests first.

## Memory
- Update `.project-memory/STATE.md` after meaningful work.
- Update `.project-memory/INDEX.md` if structure changes.
- Durable architecture calls belong in `.project-memory/DECISIONS.md`.
