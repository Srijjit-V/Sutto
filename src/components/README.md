# components

Mascot ("Nibble" — idle blink + bob, respects prefers-reduced-motion),
header/nav, chapter map, challenge list, the SQL playground (editor + run
+ results), and the shop. Claymorphism visual style (see
`.project-memory/DECISIONS.md`) — chosen via the `ui-ux-pro-max` skill.

`LandingHero.tsx` / `ScrollShowcase.tsx` are the home-page-only sections
built on the integrated animated components in `ui/`.

`ui/` holds shadcn-style primitives (`button.tsx`, `badge.tsx`) plus two
integrated third-party-style components: `hero-static-radial-gradient.tsx`
(animated shader hero) and `scroll-reveal-image.tsx` (framer-motion
scroll-driven zoom/reveal).
