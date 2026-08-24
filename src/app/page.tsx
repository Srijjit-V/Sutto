import { Header } from "@/components/Header";
import { ChapterMap } from "@/components/ChapterMap";
import { LandingHero } from "@/components/LandingHero";
import { ScrollShowcase } from "@/components/ScrollShowcase";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <LandingHero />
        <ScrollShowcase />
        <ChapterMap />
      </main>
    </div>
  );
}
