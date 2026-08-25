import { BookOpen, Terminal, PartyPopper } from "lucide-react";

const STEPS = [
  {
    icon: BookOpen,
    title: "Read the lesson",
    body: "Every chapter opens with a quick slide: the concept, the syntax, one worked example.",
  },
  {
    icon: Terminal,
    title: "Write real SQL",
    body: "Run it against a real SQLite database, right in your browser — actual query results, actual errors.",
  },
  {
    icon: PartyPopper,
    title: "Level up",
    body: "Get it right, earn XP and coins, and Nibble celebrates with you. Get it wrong, try again.",
  },
];

/** A brief "how it works" section between the hero and the chapter map —
 * built entirely from the app's own design system (icons + copy), no
 * external images. */
export function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-14 grid gap-5 sm:grid-cols-3">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        return (
          <div
            key={step.title}
            className="clay-card rise-in p-5 flex flex-col items-start gap-3"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="clay-card p-2.5 bg-[var(--primary)]">
              <Icon className="size-5 text-[var(--primary-foreground)]" aria-hidden />
            </div>
            <h3 className="font-heading font-extrabold">{step.title}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">{step.body}</p>
          </div>
        );
      })}
    </div>
  );
}
