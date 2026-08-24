"use client";

import { Database, Trophy, Zap } from "lucide-react";
import {
  HeroStaticRadialGradient,
  type HeroStaticRadialGradientTechItem,
} from "@/components/ui/hero-static-radial-gradient";

const techStack: HeroStaticRadialGradientTechItem[] = [
  { name: "Real SQLite", icon: Database },
  { name: "4 challenges", icon: Trophy },
  { name: "Instant feedback", icon: Zap },
];

export function LandingHero() {
  return (
    <HeroStaticRadialGradient
      srTitle="QueryQuest — Learn SQL the fun way"
      title="QueryQuest"
      subtitle="Learn SQL the fun way"
      description="Learn SQL through real, story-driven challenges — powered by sql.js running right in your browser. No signup, no setup, just SQL."
      ctaProps={{ label: "Start Chapter 1 →", href: "/chapter/ch1-select-basics" }}
      techStack={techStack}
      containerClassName="pt-16 sm:pt-20 lg:pt-12"
      desktopShaderProps={{
        colors: ["#4f46e5", "#ea580c", "#818cf8"],
      }}
      mobileShaderProps={{
        colors: ["#4f46e5", "#ea580c", "#818cf8"],
      }}
    />
  );
}
