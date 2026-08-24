"use client";

import { useState } from "react";
import type { Challenge } from "@/lib/game/types";

export function HintPanel({
  challenge,
  sql,
  lastError,
}: {
  challenge: Challenge;
  sql: string;
  lastError: string | null;
}) {
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  async function askForHint() {
    setLoading(true);
    setRequested(true);
    try {
      const res = await fetch("/api/ai-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: challenge.prompt,
          userSql: sql,
          lastError,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHint(challenge.hintFallback);
      } else {
        setHint(data.hint ?? challenge.hintFallback);
      }
    } catch {
      setHint(challenge.hintFallback);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chunky-card p-4">
      {!requested ? (
        <button onClick={askForHint} className="chunky-btn px-4 py-2 bg-[var(--color-sunny)] font-bold text-sm">
          Get a hint from Nibble
        </button>
      ) : loading ? (
        <p className="text-sm italic">Nibble is thinking…</p>
      ) : (
        <p className="text-sm">💡 {hint}</p>
      )}
    </div>
  );
}
