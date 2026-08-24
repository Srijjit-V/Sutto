import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { getChapter } from "@/lib/game/chapters";
import { ChallengeList } from "@/components/ChallengeList";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const chapter = getChapter(chapterId);
  if (!chapter) notFound();

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1 py-8 max-w-2xl mx-auto w-full px-6">
        <Link href="/" className="text-sm font-bold">
          ← Back to map
        </Link>
        <h1 className="text-2xl font-black mt-2 mb-1">{chapter.title}</h1>
        <p className="mb-6">{chapter.description}</p>
        <ChallengeList chapterId={chapter.id} />
      </main>
    </div>
  );
}
