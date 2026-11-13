# Audit

Audited 2026-11-11 by reading the source and running the app. Every item below was reproduced (a failing test or a failing command) before it was fixed. Status says what was done.

## Must fix

### 1. Challenge ch2-q4 could not be passed (fixed)
- **Problem:** the expected rows included "NULL Nougat", which has no letter "e". A correct query returned 5 rows, the answer key wanted 6.
- **Fix:** removed the row. `tests/challenges.test.ts` now runs an independent answer key for all 27 challenges against real SQLite and compares it with the stored expected rows.
- **If skipped:** a learner who writes the right query is told they are wrong and cannot finish Chapter 2, which locks every later chapter.

### 2. Next.js 16.3.2 had critical advisories (fixed)
- **Problem:** `npm audit` reported 1 critical and 2 high (Next.js remote code execution and cache advisories, plus `sharp` and `source-map-js`). Several only affect self-hosted servers, but they are in the production dependency tree.
- **Fix:** upgraded to Next.js 16.4.6 and ran `npm audit fix`. `npm audit --omit=dev` now reports 0, and CI fails on any high advisory.
- **If skipped:** a self-hosted deployment would be exposed to the published remote-code-execution issues.

## Should fix

### 3. The unordered answer check had no float tolerance (fixed)
- **Problem:** ordered mode accepted `49.599999999999994` for `49.6`, unordered mode compared JSON strings and rejected it. Any unordered challenge with a SUM or AVG could fail a correct answer.
- **Fix:** both modes now use the same cell comparison. Test: `tests/checkResult.test.ts`.
- **If skipped:** a correct answer is rejected after a data or engine change.

### 4. Valid queries with a semicolon in a string were rejected (fixed)
- **Problem:** the single-statement guard used `includes(";")`, so `WHERE name = 'a;b'` failed.
- **Fix:** `src/lib/sql-engine/guard.ts` scans the text and ignores semicolons inside strings, quoted names and comments. Tests: `tests/guard.test.ts`, plus a browser test.
- **If skipped:** confusing errors on valid SQL.

### 5. CSV import broke on SQL keywords and had no size cap (fixed)
- **Problem:** a header such as `order`, `group` or `select`, or a file named `select.csv`, produced a syntax error. The whole file was parsed before any size check.
- **Fix:** every table and column name is now double-quoted, and files over 5 MB are refused before parsing. Tests: `tests/csvImport.test.ts`.
- **If skipped:** common spreadsheet headers fail, and a huge file can freeze the tab.

### 6. Seven starter snippets already passed (fixed)
- **Problem:** pressing Run on ch1-q1, ch1-q4, ch2-q1, ch5-q1, ch5-q3, ch6-q1 and ch7-q2 passed without writing anything.
- **Fix:** each starter now stops where the learner has to finish it. A test fails if any starter passes unmodified.
- **If skipped:** free XP and coins, and no learning.

### 7. Challenge mode allowed writes (fixed, then hardened)
- **Problem:** `DROP TABLE snacks` removed the table until the page was reloaded. `INSERT ... RETURNING` could also fake a result.
- **First fix:** `PRAGMA query_only = ON` after seeding. An automated review then pointed out the learner could simply run `PRAGMA query_only = OFF`.
- **Final fix:** in read-only mode only `SELECT`, `WITH` and `VALUES` may start a statement (`guard.ts`), the pragma is re-asserted before every run, a missing or garbled flag means read-only (the Explore page opts in to writes explicitly), and worker start-up fails closed. Unterminated quotes and comments are refused. Browser tests: `PRAGMA`, `DROP` and `DELETE` are all refused with the app's own message and the challenge still passes; Explore still allows writes.
- **Limit:** this protects the sample data. It does not prove an answer was reached honestly, because progress is client-side (see [SECURITY.md](SECURITY.md)).

### 8. No security headers (fixed)
- **Fix:** `next.config.ts` sends a Content Security Policy, `nosniff`, a referrer policy and a permissions policy. Checked in a real browser that the SQL worker and WebAssembly still run.
- **Limit:** `script-src` keeps `'unsafe-inline'` because Next.js inlines its bootstrap scripts (item 13).

### 9. Home page said "4 challenges" (fixed)
- **Problem:** stale copy; the app has 27. The count is now computed from the chapter data and a browser test checks it.
- **If skipped:** the first screen undersells the product.

### 10. No tests and no CI (fixed)
- **Fix:** unit tests, browser tests, and `.github/workflows/ci.yml` (lint, types, tests, audit, build, browser tests).

## Nice to have (not done)

| # | What | Why it was left |
|---|---|---|
| 11 | Chapter pages are rendered on demand, not static, although the README said "static". Adding `generateStaticParams` would make them static. | The README now says what is true. |
| 12 | Progress saved in localStorage is not validated. A hand-edited bad value (for example `null` instead of a list) could crash the page. | Only the learner's own browser is affected. |
| 13 | `script-src 'unsafe-inline'`. A nonce-based policy would stop it but makes every page dynamic. | Trade-off, see [SECURITY.md](SECURITY.md). |
| 14 | `src/components/ui/scroll-reveal-image.tsx` is unused (the image section was removed). | Left in place; delete it if you agree. |
| 15 | 7 moderate advisories in dev tooling (`minimatch` inside the ESLint stack). | Not shipped to users; fix needs a breaking tooling upgrade. |
| 16 | `tsconfig.json` has uncommitted formatting changes that Next.js rewrites on each build. | Left as it was. |
| 17 | CI installs with `npm ci` (lifecycle scripts on). `--ignore-scripts` would be safer for fork pull requests, but I did not test that the build survives it. | Checkout no longer keeps credentials (`persist-credentials: false`). |

## Verdict

Fit to host as a static learning site after the fixes above: the one blocking content bug and the critical dependency advisory are gone, and the remaining items are minor.

## Not checked

Accessibility (screen readers, keyboard-only play), mobile layout, Safari and Firefox (only Chromium was run), performance on slow devices, whether the lessons teach well, and any deployed environment (it is not deployed).
