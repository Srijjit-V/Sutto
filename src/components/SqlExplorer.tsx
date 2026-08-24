"use client";

import { useEffect, useRef, useState } from "react";
import { Play, ArrowLeft } from "lucide-react";
import { SqlEngine, type QueryResult } from "@/lib/sql-engine/client";
import type { Dataset } from "@/lib/datasets/types";
import { SchemaViewer } from "./SchemaViewer";

export function SqlExplorer({ dataset, onBack }: { dataset: Dataset; onBack: () => void }) {
  const firstTable = dataset.tables[0]?.name ?? "table";
  const [sql, setSql] = useState(`SELECT * FROM ${firstTable} LIMIT 20;`);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const engineRef = useRef<SqlEngine | null>(null);

  useEffect(() => {
    engineRef.current = new SqlEngine(dataset.seedSql);
    return () => engineRef.current?.dispose();
  }, [dataset.seedSql]);

  async function runQuery() {
    if (!engineRef.current) return;
    setRunning(true);
    setError(null);
    try {
      const res = await engineRef.current.run(sql);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm font-bold cursor-pointer self-start"
      >
        <ArrowLeft className="size-4" aria-hidden /> Choose a different dataset
      </button>

      <div>
        <h1 className="font-heading text-2xl font-extrabold">{dataset.name}</h1>
        <p className="text-[var(--muted-foreground)]">{dataset.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
        <SchemaViewer dataset={dataset} />

        <div className="flex flex-col gap-4">
          <div className="clay-card p-4">
            <label className="block text-sm font-bold mb-2" htmlFor="explore-sql">
              SQL
            </label>
            <textarea
              id="explore-sql"
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              rows={5}
              spellCheck={false}
              className="w-full font-mono text-sm p-3 rounded-[var(--radius-sm)] border-2 border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
            <button
              onClick={runQuery}
              disabled={running}
              className="clay-btn mt-3 flex items-center gap-2 px-5 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="size-4" aria-hidden />
              {running ? "Running…" : "Run query"}
            </button>
          </div>

          {error && (
            <div className="clay-card p-4 bg-[var(--destructive)]/10 font-mono text-sm text-[var(--destructive)]">
              {error}
            </div>
          )}

          {result && (
            <div className="clay-card p-4 overflow-x-auto">
              {result.columns.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  Query ran successfully — no rows returned.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {result.columns.map((col, i) => (
                        <th key={i} className="text-left border-b-2 border-[var(--border)] pb-1 pr-4">
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
                            {cell === null ? <span className="opacity-40">NULL</span> : String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
