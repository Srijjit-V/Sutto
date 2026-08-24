import { BookOpen } from "lucide-react";
import type { ChapterLesson } from "@/lib/game/types";

/**
 * A short "slide"-style lesson shown before a chapter's challenge list —
 * the concept, a few explanatory bullets, and one worked example. Not a
 * hosted video (no video infra in this app); this is the practical
 * equivalent for a fully client-side, no-backend project.
 */
export function LessonCard({ lesson }: { lesson: ChapterLesson }) {
  return (
    <div className="clay-card p-5 mb-6 bg-[var(--secondary)]/10">
      <h2 className="font-heading font-extrabold text-lg flex items-center gap-2 mb-3">
        <BookOpen className="size-5 text-[var(--primary)]" aria-hidden />
        Lesson: {lesson.concept}
      </h2>
      <ul className="list-disc list-inside space-y-1 mb-4 text-sm">
        {lesson.points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
      <div className="rounded-[var(--radius-sm)] border-2 border-[var(--border)] bg-[var(--card)] p-3">
        <pre className="font-mono text-sm whitespace-pre-wrap">{lesson.example.sql}</pre>
        <p className="text-sm text-[var(--muted-foreground)] mt-2">{lesson.example.note}</p>
      </div>
    </div>
  );
}
