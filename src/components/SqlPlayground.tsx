"use client";

import { useEffect, useRef, useState } from "react";
import type { Chapter, Challenge } from "@/lib/game/types";
import { SqlEngine, type QueryResult } from "@/lib/sql-engine/client";
import { checkResult } from "@/lib/game/checkResult";
import { useProgressStore } from "@/lib/game/store";
import { Mascot, type MascotState } from "./Mascot";
import { HintPanel } from "./HintPanel";

export function SqlPlayground({ chapter, challenge }: { chapter: Chapter; challenge: Challenge }) {
  const [sql, setSql] = useState(challenge.starterSql);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setErrorMsg] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
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
        setFeedback("Nice work! That's correct.");
        setMascotState("celebrating");
        completeChallenge(challenge.id, challenge.xpReward, challenge.coinReward);
      } else {
        setFeedback(outcome.reason ?? "Not quite — check your result against the prompt.");
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
      <div className="chunky-card p-5 flex items-start gap-4">
        <Mascot state={mascotState} size={72} />
        <div>
          <h1 className="text-xl font-black">{challenge.title}</h1>
          <p className="mt-1">{challenge.story}</p>
          <p className="mt-2 font-bold">{challenge.prompt}</p>
        </div>
      </div>

      <div className="chunky-card p-4">
        <label className="block text-sm font-bold mb-2" htmlFor="sql-editor">
          Your SQL
        </label>
        <textarea
          id="sql-editor"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          rows={5}
          spellCheck={false}
          className="w-full font-mono text-sm p-3 rounded-lg border-2 border-[var(--color-border)] bg-[var(--background)]"
        />
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={runQuery}
            disabled={running}
            className="chunky-btn px-5 py-2 bg-[var(--color-grass)] font-bold disabled:opacity-50"
          >
            {running ? "Running…" : "Run query"}
          </button>
          <button
            onClick={() => setShowHint((v) => !v)}
            className="chunky-btn px-4 py-2 bg-[var(--color-sky)] font-bold text-sm"
          >
            {showHint ? "Hide hint" : "Ask Nibble for a hint"}
          </button>
          {alreadyDone && <span className="text-sm font-bold">✅ Already solved</span>}
        </div>
      </div>

      {showHint && <HintPanel challenge={challenge} sql={sql} lastError={error} />}

      {feedback && (
        <div className={`chunky-card p-4 font-bold ${feedback.startsWith("Nice") ? "bg-[var(--color-grass)]" : "bg-[var(--color-sunny)]"}`}>
          {feedback}
        </div>
      )}

      {error && <div className="chunky-card p-4 bg-[var(--color-coral)] font-mono text-sm">{error}</div>}

      {result && (
        <div className="chunky-card p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {result.columns.map((col) => (
                  <th key={col} className="text-left border-b-2 border-[var(--color-border)] pb-1 pr-4">
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
