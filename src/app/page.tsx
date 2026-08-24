import { Header } from "@/components/Header";
import { ChapterMap } from "@/components/ChapterMap";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1 py-8">
        <ChapterMap />
      </main>
    </div>
  );
}
