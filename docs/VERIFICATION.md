# Verification

Run on 2026-11-12, macOS, Node 24, Chromium via Playwright.

## Results

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | clean |
| Types | `npx tsc --noEmit` | clean |
| Unit tests | `npm test` | **109 passed**, 6 files |
| Browser tests | `npx playwright test` (against `next build` + `next start`) | **8 passed** |
| Production dependencies | `npm audit --omit=dev` | 0 vulnerabilities |
| All dependencies | `npm audit` | 7 moderate, all in the ESLint toolchain (dev only) |
| Build | `npm run build` | succeeds |

## What the tests cover

- **Every challenge, against real SQLite.** `tests/answers.ts` holds an independent answer key for all 27 challenges. Each one is run in sql.js and must pass `checkResult`; a wrong query must fail; no starter may pass unmodified. This found a challenge that could not be passed (see [AUDIT.md](AUDIT.md) item 1).
- **Answer checking:** ordered and unordered modes, float rounding noise, wrong column or row counts.
- **SQL guard:** one statement only, semicolons inside strings and comments, unterminated quotes, read-only allowlist (`PRAGMA`, writes, DDL refused).
- **CSV import:** type inference, hostile text kept as data, SQL-keyword headers and file names, size and shape limits.
- **Progress and unlocking:** XP and coins awarded once, streak rules, shop purchases, chapter gating.
- **Supply chain:** the committed `public/sql-wasm.wasm` is byte-identical to the installed sql.js build.
- **In a real browser:** a correct query passes with no console errors; a wrong one is rejected with a reason; a semicolon inside a string works and a second statement is refused; a runaway recursive query is stopped; challenge mode refuses `PRAGMA`, `DROP` and `DELETE` but still passes afterwards; Explore still allows writes; no request leaves the site's own origin; the home page shows the real challenge count.

## Not verified

- Safari, Firefox and any phone browser. Only Chromium ran. The phone screenshot is a 390 px Chromium viewport, not a device.
- Accessibility: no screen reader or keyboard-only pass, and no automated accessibility audit.
- Performance on slow devices, and the 3-second query limit on slow hardware.
- Whether the lessons teach well. No learner has been observed using it.
- Any deployed environment: the app has not been deployed, so headers such as HSTS were set but not seen over HTTPS.
- The GitHub Actions workflow has not run yet. It runs the same commands as above, but on Linux.
- The CSP keeps `'unsafe-inline'` for scripts (see [SECURITY.md](SECURITY.md)).
