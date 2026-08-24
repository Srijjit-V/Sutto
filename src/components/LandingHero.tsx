"use client";

import { Database, Sparkles, Trophy } from "lucide-react";
import {
  HeroStaticRadialGradient,
  type HeroStaticRadialGradientTechItem,
} from "@/components/ui/hero-static-radial-gradient";

const techStack: HeroStaticRadialGradientTechItem[] = [
  { name: "Real SQLite", icon: Database },
  { name: "AI hints", icon: Sparkles },
  { name: "4 challenges", icon: Trophy },
];

export function LandingHero() {
  return (
    <HeroStaticRadialGradient
      srTitle="QueryQuest — Learn SQL the fun way"
      title="QueryQuest"
      subtitle="Learn SQL the fun way"
      ctaProps={{ label: "Start Chapter 1 →", href: "/chapter/ch1-select-basics" }}
      techStack={techStack}
      containerClassName="pt-16 sm:pt-20 lg:pt-12"
    />
  );
}
