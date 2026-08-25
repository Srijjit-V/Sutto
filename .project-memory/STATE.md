# Project State — QueryQuest

## Purpose
A gamified, story-driven web app that teaches SQL through 7 chapter-gated
chapters (real in-browser SQL via sql.js), each with its own themed dataset
and a lesson slide before the challenges. Plus a cosmetic item shop and an
Explore/Sandbox mode for free-form querying against sample datasets or your
own uploaded CSV. Claymorphism visual style (via `ui-ux-pro-max`), Baloo 2
/ Comic Neue fonts, mascot with idle blink/bob. Fully client-side — no
backend, no accounts, no AI helper.

## Version
0.1.0

## Status
🟢 All 7 chapters are complete and playable, each with real challenges, a
themed dataset, and a lesson intro. Explore mode has 5 datasets plus CSV
upload. Everything verified live in the browser and cross-checked against
real SQLite execution.

## Last completed
- **Chapters 4–7 built out** (previously placeholders):
  - Ch4 Aggregation & GROUP BY — Trading Co dataset (COUNT/SUM/HAVING).
  - Ch5 Subqueries & CTEs — new **Corner Library** dataset (books/authors/
    members/loans): NOT IN, subquery in HAVING, WITH clause, correlated
    subquery.
  - Ch6 Window Functions — new **Arcade Leaderboard** dataset (players/
    scores): RANK, ROW_NUMBER+PARTITION BY via a CTE, running totals, AVG
    OVER PARTITION BY.
  - Ch7 Boss ("The Case of the Big Spenders") — Trading Co again, combining
    joins + GROUP BY + subqueries + a CTE + RANK for the finale.
- **Lesson slide** added before every chapter's challenge list: the SQL
  concept, a few explanatory bullets, and one worked example. This is a
  presentation-slide-style intro, not a hosted video — there's no video
  infrastructure in this fully-static app, so a text/code slide was the
  practical equivalent; flagged this trade-off to the user directly.
- Both new datasets (Library, Leaderboard) also added to Explore mode's
  dataset picker, alongside the existing 3.
- **Rigorously verified all 24 challenges' expected values**: wrote a
  throwaway Node script that runs the real "answer key" query for every
  single challenge against actual sql.js/SQLite (not hand-computed guesses
  taken on faith), and diffed against `expectedRows` in chapters.ts. Found
  the floating-point rounding in a few SUM() results (e.g. 49.6 vs.
  49.599999999999994) is well within the existing 1e-9 comparison
  tolerance, so no bug there — but this is the kind of thing that could
  have silently broken a challenge if unchecked.
- Live-verified in the browser: Chapter 4 (HAVING), Chapter 5 (correlated
  subquery), Chapter 6 (AVG OVER PARTITION BY), and Chapter 7's hardest
  challenge (two-CTE query with RANK) — all pass with correct XP/coin
  updates and correct result tables. Chapter map shows all 7 chapters with
  correct lock states.

## Last completed (design/visual overhaul)
- Installed the `emil-design-eng` craft skill (`npx skills add
  emilkowalski/skill`) and applied it: custom cubic-bezier easing tokens,
  scale-based press feedback, origin-aware hover, staggered card entrance
  — all disabled under prefers-reduced-motion.
- Researched W3Schools' actual SQL-tutorial structure and restructured
  every chapter's lesson to match it: concept -> formal syntax box ->
  worked example (previously just concept + example).
- Removed the stock Unsplash scroll-image section from the landing page;
  replaced with an on-theme "How it works" 3-step section (icons + copy,
  no external images).
- Found and fixed a real, app-wide bug: `.clay-card`/`.clay-btn` were
  unlayered CSS, which under Tailwind v4's cascade-layers rules always
  outranks Tailwind utility classes regardless of source order — this was
  silently breaking every colored badge/icon-badge in the app (some
  invisibly, e.g. a white icon on a white background). Fixed by wrapping
  the custom classes in `@layer components`.
- Fixed a header overflow bug on narrow viewports (now wraps responsively)
  and added `@number-flow/react` animated counters for XP/coins/streak.
- Verified all of the above live in a real browser after each fix — not
  just via lint/build — including a full incorrect-then-correct challenge
  run-through after the CSS fix landed.

## Active work
None — this pass is complete.

## Known issues / simplifications (intentional)
- Answer checking (chapters only) uses exact expected-result-set matching.
- No block-coding editor toggle yet.
- Excel/.xlsx import isn't supported (see DECISIONS.md — unpatched
  security advisories in the standard library).
- Not deployed anywhere yet.
- No automated test suite yet (though the manual verification script used
  this session — `verify_challenges.cjs` in the scratchpad — could be
  adapted into real Vitest tests for `checkResult`/chapter content).

## Next steps
1. Set up deployment.
2. Turn the manual verification script into a real Vitest test file so
   future dataset/challenge edits can't silently break expected values.
3. Block-coding editor toggle.
4. Playwright e2e coverage for the full 7-chapter flow.

## Last validation
`npm run lint`, `npx tsc --noEmit` (via build), and `npm run build` all
pass clean. All 24 challenges' answer-key queries verified against real
sql.js execution via a Node script. 4 challenges (one per new chapter)
verified live end-to-end through the actual UI, plus a fresh-tab
zero-console-errors check.

## Updated
2026-08-24
