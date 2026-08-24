import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { getChapter, getChallenge } from "@/lib/game/chapters";
import { SqlPlayground } from "@/components/SqlPlayground";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ chapterId: string; challengeId: string }>;
}) {
  const { chapterId, challengeId } = await params;
  const chapter = getChapter(chapterId);
  const challenge = getChallenge(chapterId, challengeId);
  if (!chapter || !challenge) notFound();

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1 py-8 max-w-3xl mx-auto w-full px-6">
        <Link
          href={`/chapter/${chapter.id}`}
          className="inline-flex items-center gap-1 text-sm font-bold cursor-pointer"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to {chapter.title}
        </Link>
        <SqlPlayground key={challenge.id} chapter={chapter} challenge={challenge} />
      </main>
    </div>
  );
}
