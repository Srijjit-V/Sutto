# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed (visual/correctness overhaul)
- **Cascade-layers bug**: custom component classes (`.clay-card`, `.clay-btn`)
  were plain/unlayered CSS, which under Tailwind v4's cascade-layers model
  always outranks Tailwind *utility* classes regardless of source order or
  specificity. This silently broke every colored badge and icon-badge in
  the app (XP/coins/streak pills, the "How it works" step icons) — they
  rendered with the wrong background, in one case making a white icon
  invisible on a white background. Fixed by wrapping the custom classes in
  `@layer components`.
- Header overflowed and clipped content (XP/coins/streak/Explore/Shop) on
  narrower viewports — now wraps responsively, hides secondary labels
  below `sm`, and uses animated `NumberFlow` counters.
- Lesson syntax-box text could overflow its container on narrow screens
  (an unbroken token like `COUNT(*)|SUM(...)|AVG(...)`) — fixed with
  `break-words`.

### Changed (design pass)
- Applied the **ui-ux-pro-max** design system output more thoroughly and
  added the **emil-design-eng** craft skill (`npx skills add
  emilkowalski/skill`): custom cubic-bezier easing tokens (the default CSS
  `ease-out` is too weak), press feedback via `scale(0.97)` (never from/to
  `scale(0)`), origin-aware hover/lift on interactive cards, staggered
  entrance animation for card lists — all skipped under
  `prefers-reduced-motion`.
- Added `@number-flow/react` for animated XP/coin/streak counters (per the
  `pick-ui-library` skill's explicit recommendation for this exact use case).
- **Removed the stock Unsplash image scroll section** from the landing
  page; replaced with `HowItWorks`, a 3-step section built entirely from
  the app's own design system (icons + copy, no external images).
- **Lesson cards now follow the W3Schools SQL-tutorial structure**
  (researched directly): concept explanation → formal placeholder-notation
  **syntax box** → worked **example** — added a `syntax` field to every
  chapter's lesson, shown in a distinct box from the worked example.
- Added a subtle dot-grid background texture (no image asset) for visual
  distinction from a flat default look.


### Added
- **Chapters 4–7**, completing the full 7-chapter arc: Aggregation &
  GROUP BY (Trading Co), Subqueries & CTEs (new Corner Library dataset),
  Window Functions (new Arcade Leaderboard dataset), and a Boss chapter
  combining everything.
- **Per-chapter lesson slide**: a short concept explanation + worked
  example shown before every chapter's challenge list.
- **Explore/Sandbox mode** (`/explore`): choose from built-in datasets or
  upload a CSV, browse the schema, and run any SQL freely with no
  challenge-checking attached.
- Two new datasets modeled on the classic, free Chinook (music store) and
  Northwind (trading company) teaching databases — hand-authored compact
  versions with the same table shapes/relationships, not copies of the
  real data dumps (kept bundle size sane, avoided reproducing large
  external files).
- CSV import: client-side parsing (`papaparse`) into a dynamically-typed
  SQL table, with sanitized identifiers and INTEGER/REAL/TEXT inference.
- Chapter 2 (Filtering & Sorting) and Chapter 3 (Joins) — real content
  with real challenges, not placeholders.
- Refactored the snack shop seed data into `src/lib/datasets/`, shared by
  both Chapter 1 and Explore mode.

### Verification
- Wrote a throwaway Node script running every challenge's real answer-key
  query against actual sql.js/SQLite and diffed the output against
  `expectedRows` in `chapters.ts` — not hand-computed values taken on
  faith. Confirmed all 24 challenges are correct (a few floating-point
  rounding differences in SUM() results are within the existing tolerance).

### Not added (on purpose)
- Excel/.xlsx import — the standard client-side parser (`xlsx`/SheetJS)
  has two unpatched high-severity npm advisories (prototype pollution,
  ReDoS) with no fixed version on npm. Flagged directly in the Explore
  upload UI; CSV export from Excel/Sheets covers the common case.

- shadcn-style project structure: `components.json`, `src/lib/utils.ts`
  (`cn()`), and shadcn semantic color tokens (primary/secondary/destructive/
  accent/ring/etc.) mapped onto the existing Fall-Guys-2D palette.
- `Badge` and `Button` primitives in `src/components/ui/`.
- `HeroStaticRadialGradient` (animated shader hero, via
  `@paper-design/shaders-react`) and `ScrollRevealImage` (framer-motion
  scroll-driven zoom/reveal) components in `src/components/ui/`.
- Home page redesign: an animated gradient hero (`LandingHero`) with a
  "Start Chapter 1" CTA and tech badges (lucide-react icons), a short
  cinematic scroll-reveal showcase section (`ScrollShowcase`), then the
  existing chapter map below. This is the one deliberately higher-motion
  section of the app — everything past the hero stays low-animation per
  the existing design decision.
- `next.config.ts`: allow `images.unsplash.com` for `next/image`.
- Installed the `ui-ux-pro-max` Claude Code skill and used its
  design-system search for a "kids educational game" product type. Applied
  its recommendation across the app: **Claymorphism** style (soft 3D,
  thick borders, double shadows), **Baloo 2 / Comic Neue** fonts, and a new
  indigo/orange color palette (replacing the earlier hand-picked one).
  Light mode only (the skill flags dark mode as best avoided for this
  product type).
- Replaced every emoji-as-icon (✨🪙🔥🔒✅▶️💡) with `lucide-react` icons,
  per the skill's style checklist.
- Mascot ("Nibble"): added a continuous idle blink and gentle bob, both
  automatically disabled under `prefers-reduced-motion`.
- Added `cursor-pointer` to all clickable elements (checklist item).

### Removed
- The AI hint helper, entirely: `/api/ai-hint`, `src/lib/ai/`,
  `HintPanel`, and the `@google/generative-ai`/`@upstash/redis`/
  `@upstash/ratelimit` dependencies. The app is fully client-side again —
  no server routes, no API keys, no rate limiting to reason about.

### Fixed
- A real SSR hydration-mismatch bug in the Zustand progress store
  (localStorage-persisted state rendered differently on server vs. first
  client paint). Fixed via `skipHydration` + an explicit post-mount
  rehydrate call. Found via manual fresh-tab browser testing, not by
  reading the build/lint output.
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
