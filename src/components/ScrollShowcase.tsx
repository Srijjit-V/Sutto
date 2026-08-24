"use client";

import ScrollRevealImage from "@/components/ui/scroll-reveal-image";

const SHOWCASE_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0",
    alt: "Code on a laptop screen",
    height: "70vh",
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0",
    alt: "Close-up of a circuit board",
    height: "70vh",
  },
];

/** A brief scrolling "why SQL matters" section between the hero and the
 * chapter map — the one deliberately cinematic, higher-motion moment in
 * an otherwise low-animation app (see .project-memory/DECISIONS.md). */
export function ScrollShowcase() {
  return (
    <div className="flex flex-col gap-16 py-16">
      {SHOWCASE_IMAGES.map((img) => (
        <ScrollRevealImage
          key={img.src}
          src={img.src}
          alt={img.alt}
          height={img.height}
          fromWidth="70vw"
          toWidth="94vw"
          innerWidth="94vw"
          fromScale={1.4}
          toScale={1}
          fromRadius="8px"
          toRadius="var(--radius)"
        />
      ))}
    </div>
  );
}
