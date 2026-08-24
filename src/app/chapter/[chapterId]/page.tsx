import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { getChapter } from "@/lib/game/chapters";
import { ChallengeList } from "@/components/ChallengeList";
import { LessonCard } from "@/components/LessonCard";

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
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-bold cursor-pointer">
          <ArrowLeft className="size-4" aria-hidden /> Back to map
        </Link>
        <h1 className="font-heading text-2xl font-extrabold mt-2 mb-1">{chapter.title}</h1>
        <p className="mb-6 text-[var(--muted-foreground)]">{chapter.description}</p>
        {chapter.lesson && <LessonCard lesson={chapter.lesson} />}
        <ChallengeList chapterId={chapter.id} />
      </main>
    </div>
  );
}
