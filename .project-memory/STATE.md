# Project State — QueryQuest

## Purpose
A gamified, story-driven web app that teaches SQL through chapter-gated
challenges (real in-browser SQL via sql.js) and a cosmetic item shop.
Claymorphism visual style (chosen via the `ui-ux-pro-max` skill), Baloo 2 /
Comic Neue fonts, mascot with idle blink/bob. Fully client-side — no
backend, no accounts, no AI helper (removed per user request).

## Version
0.1.0

## Status
🟢 Playable vertical slice — Chapter 1 fully working, redesigned visual
system applied end-to-end, verified with zero console errors on a fresh
page load.

## Last completed
- Installed and actually used the `ui-ux-pro-max` skill
  (`.claude/skills/ui-ux-pro-max/`) — ran its design-system search for a
  "kids educational game" product type and applied the result: Claymorphism
  style, Baloo 2/Comic Neue fonts, indigo/orange palette, light-mode only.
- Replaced all emoji-as-icons with `lucide-react`; added `cursor-pointer`
  to clickable elements — both per the skill's checklist.
- Mascot ("Nibble"): idle blink + gentle bob, disabled under
  `prefers-reduced-motion`.
- Removed the AI hint feature entirely (route, lib, component, deps) per
  user request — app is 100% client-side now.
- Redesigned the SQL playground/challenge UI with the new clay-card style.
- Found and fixed a real bug via manual testing: a Zustand-persist SSR
  hydration mismatch (fixed with `skipHydration` + explicit post-mount
  rehydrate). Verified fixed with a completely fresh tab + cleared
  localStorage (zero console errors, vs. a real hydration error before).
- shadcn infra + animated hero (`HeroStaticRadialGradient`) + scroll-reveal
  showcase (`ScrollRevealImage`) on the landing page (from a prior pass).

## Active work
None — this pass is complete. Next session should pick up from "Next steps"
below.

## Known issues / simplifications (intentional, for v1)
- Answer checking uses an exact expected-result-set match (order-
  insensitive for DISTINCT/GROUP BY-style queries) rather than semantic SQL
  comparison.
- No block-coding (Scratch-style) editor toggle yet — text editor only.
- No flashcard section yet.
- Chapters 2–7 are placeholder "Coming soon" entries with no content.
- Brief flash of 0 XP/coins/streak on first paint before the progress
  store rehydrates from localStorage (a few ms, standard tradeoff of the
  `skipHydration` fix — see DECISIONS.md).
- Not deployed anywhere yet (Vercel connector issue from an earlier
  session is still unresolved, though moot now that there's no server-side
  route requiring Vercel specifically — GitHub Pages is viable again).
- No automated test suite yet (Vitest/Playwright installed, no test files).

## Next steps
1. Build Chapter 2 (Filtering & Sorting) content.
2. Build the Scratch-style block-coding editor toggle.
3. Build the flashcard review section.
4. Decide on and set up actual deployment (GitHub Pages is viable again
   now that the app is fully static; or retry Vercel).
5. Add Playwright e2e coverage for the challenge flow.

## Last validation
`npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass clean.
Manually verified in the browser across two passes:
1. Full redesign render (hero, mascot, challenge UI) at desktop width.
2. A completely fresh tab with `localStorage.clear()` first, confirming
   zero console errors (previously masked a real hydration bug behind
   stale accumulated console history from earlier in the session).
Both the correct-answer and already-solved states were re-verified after
the redesign; XP/coins/streak update correctly.

## Updated
2026-08-24
