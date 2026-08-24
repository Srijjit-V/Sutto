import { Header } from "@/components/Header";
import { ExplorePage } from "@/components/ExplorePage";

export default function Explore() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1 py-8">
        <ExplorePage />
      </main>
    </div>
  );
}
