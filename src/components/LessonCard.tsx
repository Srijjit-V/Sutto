import { BookOpen, Code2, Lightbulb } from "lucide-react";
import type { ChapterLesson } from "@/lib/game/types";

/**
 * A short "slide"-style lesson shown before a chapter's challenge list.
 * Structure borrows the proven W3Schools SQL-tutorial pattern (concept
 * explanation -> formal syntax box -> worked example) but wraps it in
 * QueryQuest's own story/character framing rather than being sterile.
 * Not a hosted video (no video infra in this fully client-side app) — see
 * .project-memory/DECISIONS.md for that tradeoff.
 */
export function LessonCard({ lesson }: { lesson: ChapterLesson }) {
  return (
    <div className="clay-card rise-in p-5 mb-6 bg-[var(--secondary)]/10">
      <h2 className="font-heading font-extrabold text-lg flex items-center gap-2 mb-3">
        <BookOpen className="size-5 text-[var(--primary)]" aria-hidden />
        Lesson: {lesson.concept}
      </h2>
      <ul className="list-disc list-inside space-y-1 mb-4 text-sm">
        {lesson.points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius-sm)] border-2 border-[var(--border)] bg-[var(--muted)] p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--muted-foreground)] mb-2">
            <Code2 className="size-3.5" aria-hidden /> Syntax
          </p>
          <pre className="font-mono text-sm whitespace-pre-wrap break-words">{lesson.syntax}</pre>
        </div>

        <div className="rounded-[var(--radius-sm)] border-2 border-[var(--border)] bg-[var(--card)] p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--muted-foreground)] mb-2">
            <Lightbulb className="size-3.5" aria-hidden /> Example
          </p>
          <pre className="font-mono text-sm whitespace-pre-wrap break-words">{lesson.example.sql}</pre>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">{lesson.example.note}</p>
        </div>
      </div>
    </div>
  );
}
