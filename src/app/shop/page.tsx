import { Header } from "@/components/Header";
import { Shop } from "@/components/Shop";

export default function ShopPage() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1 py-8">
        <Shop />
      </main>
    </div>
  );
}
