# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
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
