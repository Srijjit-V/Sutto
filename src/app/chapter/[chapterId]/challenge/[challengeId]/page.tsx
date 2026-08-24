import { notFound } from "next/navigation";
import Link from "next/link";
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
        <Link href={`/chapter/${chapter.id}`} className="text-sm font-bold">
          ← Back to {chapter.title}
        </Link>
        <SqlPlayground key={challenge.id} chapter={chapter} challenge={challenge} />
      </main>
    </div>
  );
}
