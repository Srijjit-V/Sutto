/// <reference lib="webworker" />

/**
 * sql.js runs inside this Web Worker so a runaway query (accidental cross
 * join, infinite recursion in a CTE, etc.) can be killed by terminating the
 * worker from the main thread, instead of freezing the whole tab.
 *
 * Protocol (all messages are structured-clonable objects):
 *  -> { type: "init", seedSql: string }
 *  <- { type: "ready" } | { type: "error", message: string }
 *  -> { type: "run", sql: string }
 *  <- { type: "result", columns: string[], rows: unknown[][] }
 *     | { type: "error", message: string }
 */

import initSqlJs, { type Database } from "sql.js";

let db: Database | null = null;

type InMessage = { type: "init"; seedSql: string } | { type: "run"; sql: string };

type OutMessage =
  | { type: "ready" }
  | { type: "result"; columns: string[]; rows: unknown[][] }
  | { type: "error"; message: string };

function post(msg: OutMessage) {
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(msg);
}

self.onmessage = async (event: MessageEvent<InMessage>) => {
  const msg = event.data;

  try {
    if (msg.type === "init") {
      const SQL = await initSqlJs({
        // We only ship one wasm file, copied to public/ at build time —
        // always resolve to it regardless of what path sql.js requests.
        locateFile: () => "/sql-wasm.wasm",
      });
      db = new SQL.Database();
      db.run(msg.seedSql);
      post({ type: "ready" });
      return;
    }

    if (msg.type === "run") {
      if (!db) {
        post({ type: "error", message: "Database not initialized yet." });
        return;
      }
      // Basic complexity guard: reject multi-statement queries (anything
      // after the first non-trailing semicolon) so one message can't chain
      // an unbounded number of statements.
      const trimmed = msg.sql.trim().replace(/;\s*$/, "");
      if (trimmed.includes(";")) {
        post({
          type: "error",
          message: "Only a single SQL statement is allowed per run.",
        });
        return;
      }

      const results = db.exec(trimmed);
      if (results.length === 0) {
        post({ type: "result", columns: [], rows: [] });
        return;
      }
      const { columns, values } = results[0];
      post({ type: "result", columns, rows: values });
    }
  } catch (err) {
    post({ type: "error", message: err instanceof Error ? err.message : String(err) });
  }
};
