# Project State — QueryQuest

## Purpose
A gamified, story-driven web app that teaches SQL through chapter-gated
challenges (real in-browser SQL via sql.js), a cosmetic item shop, and an
Explore/Sandbox mode for free-form querying against real sample datasets or
your own uploaded CSV. Claymorphism visual style (via `ui-ux-pro-max`),
Baloo 2 / Comic Neue fonts, mascot with idle blink/bob. Fully client-side —
no backend, no accounts, no AI helper.

## Version
0.1.0

## Status
🟢 Three playable chapters, a working Explore/Sandbox mode with three
built-in datasets plus custom CSV upload, all verified live in the browser.

## Last completed
- **Explore/Sandbox mode** (`/explore`): pick a built-in dataset or upload
  your own CSV, browse its schema, and run any SQL freely — no
  challenge-checking. Verified live: ran a real multi-table JOIN + GROUP BY
  against the Music Store dataset (correct results), and uploaded a CSV via
  a simulated file input (correct type inference + queryable table).
- **Two new datasets**, hand-authored and modeled on the standard free
  Chinook (music store) and Northwind (trading co) teaching databases —
  researched first to confirm these are the genuine standard ones, then
  built compact original versions rather than embedding the real dumps.
- **CSV import**: client-side parsing (`papaparse`) into a dynamically
  typed SQL table — safe identifier sanitization, INTEGER/REAL/TEXT
  inference, row/column caps.
- **Excel/.xlsx import deliberately not built**: the standard library
  (`xlsx`/SheetJS) has two unpatched high-severity npm advisories. Flagged
  to the user directly in the Explore UI's copy, not silently skipped.
- **Chapter 2** (Filtering & Sorting): AND/OR/BETWEEN/LIKE challenges on
  the snack shop dataset.
- **Chapter 3** (Joins): JOIN challenges on the new Music Store dataset
  (artists → albums → tracks → invoices).
- Refactored the snack shop seed data into `src/lib/datasets/` so
  chapters and Explore mode share one source of truth.

## Active work
None — this pass is complete.

## Known issues / simplifications (intentional)
- Answer checking (chapters only) uses exact expected-result-set matching.
- No block-coding editor toggle yet; no flashcard section yet.
- Chapters 4–7 (Aggregation, Subqueries/CTEs, Window Functions, Boss) are
  still placeholder "Coming soon" entries.
- Excel/.xlsx import isn't supported — export to CSV first (see decision
  above; revisit if SheetJS ships a patched npm release).
- CSV import caps: 2MB file size, 5000 rows, 40 columns — plenty for a
  teaching dataset, but not a general-purpose data tool.
- Explore mode isn't tied to XP/progress — it's a separate, ungated space
  by design (matches the user's "mess around with it" framing).
- Not deployed anywhere yet.
- No automated test suite yet.

## Next steps
1. Chapters 4–7 content (Aggregation/GROUP BY, Subqueries/CTEs, Window
   Functions, Boss chapter — likely also using the Trading Co dataset).
2. Block-coding (Scratch-style) editor toggle.
3. Flashcard review section.
4. Decide on and set up deployment.
5. Playwright e2e coverage.

## Last validation
`npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass clean.
Manually verified live in the browser: Chapter 1 challenge (correct/
incorrect paths), Explore mode dataset switching + a real JOIN/GROUP BY
query against Music Store (correct aggregated results), and CSV upload
(simulated file input with a 3-row test CSV — correct type inference and
query results).

## Updated
2026-08-24
