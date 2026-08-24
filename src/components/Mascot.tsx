"use client";

/**
 * Nibble — QueryQuest's mascot. A chunky bean-shaped data critter.
 *
 * Deliberately low-animation (see .project-memory/DECISIONS.md): each state
 * is a distinct static pose, not a looping/idle animation. The only motion
 * is a brief transition when the state changes, handled by the parent via
 * `key`-based remount + a short CSS transition on mount.
 */

export type MascotState = "idle" | "happy" | "confused" | "celebrating" | "thinking";

const BODY_COLOR: Record<MascotState, string> = {
  idle: "var(--color-sky)",
  happy: "var(--color-grass)",
  confused: "var(--color-sunny)",
  celebrating: "var(--color-coral)",
  thinking: "var(--color-sky)",
};

function Eyes({ state }: { state: MascotState }) {
  switch (state) {
    case "happy":
    case "celebrating":
      // Closed, curved happy eyes
      return (
        <>
          <path d="M35 45 Q40 38 45 45" stroke="#2b2140" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M55 45 Q60 38 65 45" stroke="#2b2140" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    case "confused":
      return (
        <>
          <circle cx="40" cy="45" r="4" fill="#2b2140" />
          <circle cx="62" cy="42" r="4" fill="#2b2140" />
        </>
      );
    case "thinking":
      return (
        <>
          <circle cx="40" cy="45" r="4" fill="#2b2140" />
          <circle cx="60" cy="45" r="4" fill="#2b2140" />
        </>
      );
    default:
      return (
        <>
          <circle cx="40" cy="45" r="4.5" fill="#2b2140" />
          <circle cx="60" cy="45" r="4.5" fill="#2b2140" />
        </>
      );
  }
}

function Mouth({ state }: { state: MascotState }) {
  switch (state) {
    case "happy":
    case "celebrating":
      return <path d="M35 58 Q50 72 65 58" stroke="#2b2140" strokeWidth="3" fill="none" strokeLinecap="round" />;
    case "confused":
      return <path d="M38 62 Q50 55 62 62" stroke="#2b2140" strokeWidth="3" fill="none" strokeLinecap="round" />;
    case "thinking":
      return <circle cx="50" cy="60" r="3" fill="#2b2140" />;
    default:
      return <path d="M40 60 Q50 65 60 60" stroke="#2b2140" strokeWidth="3" fill="none" strokeLinecap="round" />;
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
  return (
    <div
      key={state}
      className={`inline-block animate-[mascot-pop_0.18s_ease-out] ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Nibble the mascot, feeling ${state}`}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {/* bean-shaped chunky body */}
        <path
          d="M50 8 C72 8 88 26 88 50 C88 76 68 92 50 92 C28 92 12 74 12 50 C12 26 30 8 50 8 Z"
          fill={BODY_COLOR[state]}
          stroke="#2b2140"
          strokeWidth="4"
        />
        {state === "celebrating" && (
          <>
            <path d="M18 20 l4 8" stroke="#2b2140" strokeWidth="3" strokeLinecap="round" />
            <path d="M82 20 l-4 8" stroke="#2b2140" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        <Eyes state={state} />
        <Mouth state={state} />
        {/* cheeks for happy/celebrating */}
        {(state === "happy" || state === "celebrating") && (
          <>
            <circle cx="30" cy="55" r="5" fill="var(--color-coral)" opacity="0.5" />
            <circle cx="70" cy="55" r="5" fill="var(--color-coral)" opacity="0.5" />
          </>
        )}
      </svg>
    </div>
  );
}
