"use client";

import { useEffect, useRef, useState } from "react";
import { Play, CheckCircle2, XCircle } from "lucide-react";
import type { Chapter, Challenge } from "@/lib/game/types";
import { SqlEngine, type QueryResult } from "@/lib/sql-engine/client";
import { checkResult } from "@/lib/game/checkResult";
import { useProgressStore } from "@/lib/game/store";
import { Mascot, type MascotState } from "./Mascot";

export function SqlPlayground({ chapter, challenge }: { chapter: Chapter; challenge: Challenge }) {
  const [sql, setSql] = useState(challenge.starterSql);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setErrorMsg] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ passed: boolean; text: string } | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [running, setRunning] = useState(false);
  const engineRef = useRef<SqlEngine | null>(null);
  const completeChallenge = useProgressStore((s) => s.completeChallenge);
  const alreadyDone = useProgressStore((s) => s.isChallengeComplete(challenge.id));

  // This component is remounted (via a `key={challenge.id}` on the parent)
  // whenever the player navigates to a different challenge, so all state
  // above is naturally reset without an effect.
  useEffect(() => {
    engineRef.current = new SqlEngine(chapter.seedSql);
    return () => engineRef.current?.dispose();
  }, [chapter.seedSql]);

  async function runQuery() {
    if (!engineRef.current) return;
    setRunning(true);
    setErrorMsg(null);
    setFeedback(null);
    setMascotState("thinking");
    try {
      const res = await engineRef.current.run(sql);
      setResult(res);
      const outcome = checkResult(challenge, res);
      if (outcome.passed) {
        setFeedback({ passed: true, text: "Nice work! That's correct." });
        setMascotState("celebrating");
        completeChallenge(challenge.id, challenge.xpReward, challenge.coinReward);
      } else {
        setFeedback({ passed: false, text: outcome.reason ?? "Not quite — check your result against the prompt." });
        setMascotState("confused");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setMascotState("confused");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-5">
      <div className="clay-card p-5 flex items-start gap-4 bg-[var(--secondary)]/10">
        <Mascot state={mascotState} size={72} />
        <div>
          <h1 className="font-heading text-xl font-extrabold">{challenge.title}</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">{challenge.story}</p>
          <p className="mt-2 font-bold">{challenge.prompt}</p>
        </div>
      </div>

      <div className="clay-card p-4">
        <label className="block text-sm font-bold mb-2" htmlFor="sql-editor">
          Your SQL
        </label>
        <textarea
          id="sql-editor"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          rows={5}
          spellCheck={false}
          className="w-full font-mono text-sm p-3 rounded-[var(--radius-sm)] border-2 border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={runQuery}
            disabled={running}
            className="clay-btn flex items-center gap-2 px-5 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="size-4" aria-hidden />
            {running ? "Running…" : "Run query"}
          </button>
          {alreadyDone && (
            <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--success)]">
              <CheckCircle2 className="size-4" aria-hidden /> Already solved
            </span>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`clay-card p-4 font-bold flex items-center gap-2 ${
            feedback.passed ? "bg-[var(--success)]/15" : "bg-[var(--coin)]/15"
          }`}
        >
          {feedback.passed ? (
            <CheckCircle2 className="size-5 text-[var(--success)] shrink-0" aria-hidden />
          ) : (
            <XCircle className="size-5 text-[var(--destructive)] shrink-0" aria-hidden />
          )}
          {feedback.text}
        </div>
      )}

      {error && (
        <div className="clay-card p-4 bg-[var(--destructive)]/10 font-mono text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {result && (
        <div className="clay-card p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {result.columns.map((col) => (
                  <th key={col} className="text-left border-b-2 border-[var(--border)] pb-1 pr-4">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="pr-4 py-1">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
