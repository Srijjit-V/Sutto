/// <reference lib="webworker" />

/**
 * sql.js runs inside this Web Worker so a runaway query (accidental cross
 * join, infinite recursion in a CTE, etc.) can be killed by terminating the
 * worker from the main thread, instead of freezing the whole tab.
 *
 * Protocol (all messages are structured-clonable objects):
 *  -> { type: "init", seedSql: string, readOnly?: boolean }
 *  <- { type: "ready" } | { type: "error", message: string }
 *  -> { type: "run", sql: string }
 *  <- { type: "result", columns: string[], rows: unknown[][] }
 *     | { type: "error", message: string }
 */

import initSqlJs, { type Database } from "sql.js";
import { prepareStatement } from "./guard";

let db: Database | null = null;
let readOnly = true;

type InMessage = { type: "init"; seedSql: string; readOnly?: boolean } | { type: "run"; sql: string };

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
      // Fail closed: build in a local, publish only after the seed and the
      // read-only pragma both succeeded. Anything but an explicit false is read-only.
      db = null;
      const next = new SQL.Database();
      try {
        next.run(msg.seedSql);
        readOnly = msg.readOnly !== false;
        if (readOnly) next.run("PRAGMA query_only = ON");
      } catch (err) {
        next.close();
        throw err;
      }
      db = next;
      post({ type: "ready" });
      return;
    }

    if (msg.type === "run") {
      if (!db) {
        post({ type: "error", message: "Database not initialized yet." });
        return;
      }
      const prepared = prepareStatement(msg.sql, { readOnly });
      if (!prepared.ok) {
        post({ type: "error", message: prepared.message });
        return;
      }

      // Defense in depth: re-assert the pragma before every statement.
      if (readOnly) db.run("PRAGMA query_only = ON");
      const results = db.exec(prepared.sql);
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
