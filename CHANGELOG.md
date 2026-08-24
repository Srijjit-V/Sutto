# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial project scaffold: Next.js (App Router) + TypeScript + Tailwind CSS.
- Core dependencies installed: `sql.js`, `zustand`, `framer-motion`,
  `@upstash/redis`, `@upstash/ratelimit`, `@google/generative-ai`.
- Test tooling installed: Vitest + jsdom, Playwright.
- Project folder structure for the SQL engine, AI hint proxy, and game logic.
- Architecture decisions captured in `.project-memory/DECISIONS.md`.
- **Nibble**, the mascot (idle/happy/confused/celebrating/thinking states as
  simple SVG poses, low-animation per the Fall-Guys-2D design decision).
- Design tokens (chunky-card look, bright palette) in `globals.css`.
- Working sql.js Web Worker engine (`src/lib/sql-engine/`) with a hard
  query timeout (terminates + recreates the worker) and a single-statement
  guard.
- Zustand + localStorage progress store: XP, coins, streak, completed
  challenges, owned shop items.
- Chapter 1 ("Nibble's Snack Shop") with 4 real SELECT/WHERE/ORDER BY/
  DISTINCT challenges, seeded SQLite data, and an answer checker
  (`checkResult.ts`) supporting both ordered and unordered comparisons.
- Chapter map home page, per-chapter challenge list, and the SQL
  playground page (schema-backed editor, run button, pass/fail feedback,
  mascot reactions, results table).
- Cosmetic-only item shop page wired to the coin balance.
- `/api/ai-hint` route: Gemini free-tier call, Upstash-backed rate
  limiting (skipped gracefully if env vars aren't set), user input quoted
  as data in the prompt (never as instructions), graceful fallback to a
  challenge-specific hint if the AI call fails or isn't configured.
- Verified end-to-end in a real browser: correct queries pass and award
  XP/coins/streak, incorrect queries show the right rejection reason and
  a "confused" mascot.

### Fixed
- sql.js's `locateFile` was resolving the wasm asset path incorrectly
  inside the Web Worker (fetching a 404 HTML page instead of the `.wasm`
  binary); now always resolves to the single `public/sql-wasm.wasm` file.
