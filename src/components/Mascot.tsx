"use client";

/**
 * Nibble — QueryQuest's mascot. A chunky bean-shaped data critter, styled
 * per the ui-ux-pro-max "Claymorphism" recommendation.
 *
 * Each emotional state is a distinct pose (see BODY_COLOR/Eyes/Mouth below).
 * On top of that, "idle" adds two small continuous touches: a gentle bob
 * and a periodic blink — both skipped automatically under
 * prefers-reduced-motion (see globals.css).
 */

export type MascotState = "idle" | "happy" | "confused" | "celebrating" | "thinking";

const BODY_COLOR: Record<MascotState, string> = {
  idle: "var(--color-secondary)",
  happy: "var(--color-success)",
  confused: "var(--color-coin)",
  celebrating: "var(--color-accent)",
  thinking: "var(--color-secondary)",
};

function Eyes({ state, blinking }: { state: MascotState; blinking: boolean }) {
  const eyelidGroup = (children: React.ReactNode) =>
    blinking ? (
      <g className="mascot-eyelids">{children}</g>
    ) : (
      <>{children}</>
    );

  switch (state) {
    case "happy":
    case "celebrating":
      return (
        <>
          <path d="M35 45 Q40 38 45 45" stroke="#1e1b4b" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M55 45 Q60 38 65 45" stroke="#1e1b4b" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    case "confused":
      return (
        <>
          <circle cx="40" cy="45" r="4" fill="#1e1b4b" />
          <circle cx="62" cy="42" r="4" fill="#1e1b4b" />
        </>
      );
    case "thinking":
      return (
        <>
          <circle cx="40" cy="45" r="4" fill="#1e1b4b" />
          <circle cx="60" cy="45" r="4" fill="#1e1b4b" />
        </>
      );
    default:
      return eyelidGroup(
        <>
          <circle cx="40" cy="45" r="4.5" fill="#1e1b4b" />
          <circle cx="60" cy="45" r="4.5" fill="#1e1b4b" />
        </>
      );
  }
}

function Mouth({ state }: { state: MascotState }) {
  switch (state) {
    case "happy":
    case "celebrating":
      return <path d="M35 58 Q50 72 65 58" stroke="#1e1b4b" strokeWidth="3" fill="none" strokeLinecap="round" />;
    case "confused":
      return <path d="M38 62 Q50 55 62 62" stroke="#1e1b4b" strokeWidth="3" fill="none" strokeLinecap="round" />;
    case "thinking":
      return <circle cx="50" cy="60" r="3" fill="#1e1b4b" />;
    default:
      return <path d="M40 60 Q50 65 60 60" stroke="#1e1b4b" strokeWidth="3" fill="none" strokeLinecap="round" />;
  }
}

export function Mascot({
  state = "idle",
  size = 96,
  className = "",
}: {
  state?: MascotState;
  size?: number;
  className?: string;
}) {
  const isIdle = state === "idle";

  return (
    <div
      key={state}
      className={`inline-block animate-[mascot-pop_0.18s_ease-out] ${isIdle ? "mascot-idle-motion" : ""} ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Nibble the mascot, feeling ${state}`}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {/* bean-shaped chunky body */}
        <path
          d="M50 8 C72 8 88 26 88 50 C88 76 68 92 50 92 C28 92 12 74 12 50 C12 26 30 8 50 8 Z"
          fill={BODY_COLOR[state]}
          stroke="#1e1b4b"
          strokeWidth="4"
        />
        {state === "celebrating" && (
          <>
            <path d="M18 20 l4 8" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
            <path d="M82 20 l-4 8" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        <Eyes state={state} blinking={isIdle} />
        <Mouth state={state} />
        {/* cheeks for happy/celebrating */}
        {(state === "happy" || state === "celebrating") && (
          <>
            <circle cx="30" cy="55" r="5" fill="var(--color-accent)" opacity="0.5" />
            <circle cx="70" cy="55" r="5" fill="var(--color-accent)" opacity="0.5" />
          </>
        )}
      </svg>
    </div>
  );
}
