# Project State — QueryQuest

## Purpose
A gamified, story-driven web app that teaches SQL through chapter-gated
challenges (real in-browser SQL via sql.js), spaced-repetition flashcards, a
cosmetic item shop, and an AI hint helper — chunky/colorful "Fall Guys but 2D"
visual style, deployed entirely on Vercel.

## Version
0.1.0

## Status
🟡 Initializing — scaffold complete, no game features implemented yet.

## Last completed
- Next.js + TypeScript + Tailwind scaffold created via `create-next-app`.
- Dependencies installed: sql.js, zustand, framer-motion, @upstash/redis,
  @upstash/ratelimit, @google/generative-ai, Vitest, Playwright.
- Folder structure created: `src/lib/sql-engine/`, `src/lib/ai/`,
  `src/lib/game/`, `src/components/`, `src/app/api/ai-hint/`, `tests/`, `e2e/`.
- README, CLAUDE.md, CHANGELOG, VERSION, `.project-memory/` populated.
- Architecture + security decisions recorded in `DECISIONS.md`.

## Active work
None yet — scaffold-only pass. Awaiting user go-ahead to implement features.

## Known issues
None.

## Next steps
1. Design the mascot (name, species, states) — Fall-Guys-2D chunky style.
2. Build the sql.js Web Worker wrapper with timeout/complexity caps.
3. Build `/api/ai-hint` (Gemini call + Upstash rate limiting).
4. Define chapter 1 content (SELECT basics) as the first vertical slice.
5. Build the SQL editor with the block-builder ⇄ text-editor toggle.
6. Set up Vercel project + environment variables for deployment.

## Last validation
`create-next-app` scaffold generated successfully; dependency installs
completed with 0 vulnerabilities. No app code written yet, so no functional
tests have been run.

## Updated
2026-08-24
