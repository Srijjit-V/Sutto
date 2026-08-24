# Project State — QueryQuest

## Purpose
A gamified, story-driven web app that teaches SQL through chapter-gated
challenges (real in-browser SQL via sql.js), spaced-repetition flashcards, a
cosmetic item shop, and an AI hint helper — chunky/colorful "Fall Guys but 2D"
visual style, deployed entirely on Vercel.

## Version
0.1.0

## Status
🟢 Playable vertical slice — Chapter 1 is fully working end-to-end, plus a
polished landing page (hero + scroll showcase) so the first impression
isn't just plain cards.

## Last completed
- shadcn-style infra: `components.json`, `src/lib/utils.ts`, semantic color
  tokens layered onto the existing palette; `Badge`/`Button` primitives.
- Animated shader hero (`HeroStaticRadialGradient`, `@paper-design/shaders-react`)
  and scroll-reveal image section (`ScrollRevealImage`, framer-motion) on
  the home page — the one deliberately higher-motion section of the app.
- Mascot ("Nibble") with 5 states, low-animation per design decision.
- Design tokens / chunky-card visual style in `globals.css`.
- sql.js Web Worker engine with hard query timeout + single-statement guard.
- Zustand + localStorage progress store (XP, coins, streak, completed
  challenges, owned shop items).
- Chapter 1 ("Nibble's Snack Shop"): 4 challenges covering SELECT, WHERE,
  ORDER BY, DISTINCT, with a real answer checker.
- Chapter map, challenge list, and SQL playground pages.
- Cosmetic item shop page.
- `/api/ai-hint` route (Gemini + Upstash rate limiting + prompt-injection
  guard), with graceful fallback when unconfigured.
- Verified in a real browser: correct/incorrect query paths both work,
  XP/coins/streak persist, mascot reacts correctly to each outcome.
- Fixed a real bug found during verification: sql.js's wasm file wasn't
  loading inside the Web Worker (wrong locateFile resolution).

## Active work
None — this pass is complete. Next session should pick up from "Next steps"
below.

## Known issues / simplifications (intentional, for v1)
- Answer checking uses an exact expected-result-set match (with an
  order-insensitive mode for DISTINCT/GROUP BY-style queries) rather than
  semantic SQL comparison — a correct-but-differently-written query that
  produces different column names or ordering may be marked incorrect.
- The block-coding (Scratch-style) editor toggle is not built yet — only
  the plain text SQL editor exists so far.
- Flashcard section is not built yet.
- `/api/ai-hint` has not been tested against a real Gemini/Upstash key yet
  (works correctly in its "unconfigured" fallback path, verified in-browser).
- Chapters 2–7 are placeholder "Coming soon" entries with no content.
- Deployment to Vercel is still unresolved — see below.

## Next steps
1. Build the flashcard review section (spaced repetition).
2. Build the Scratch-style block-coding editor toggle.
3. Write Chapter 2 (Filtering & Sorting) content.
4. Get a real Gemini API key + Upstash Redis credentials and test
   `/api/ai-hint` end-to-end (currently only verified in its fallback path).
5. Resolve the Vercel deployment permission issue (the connector used in
   this session could create one deployment but then got 403'd on
   redeploys/reads — likely a role/permission setting on the user's Vercel
   team, needs checking in the Vercel dashboard directly) and get the
   GitHub → Vercel auto-deploy link working.
6. Consider adding Playwright e2e coverage for the challenge flow now that
   it exists and works.

## Last validation
`npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass clean.
Manually verified in a real browser (Chapter 1, challenges 2 and 3): correct
query → XP/coins/streak update + celebrating mascot; incorrect query →
correct rejection reason + confused mascot. No automated test suite yet
(Vitest/Playwright are installed but no test files written).

## Updated
2026-08-24
