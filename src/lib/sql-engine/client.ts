"use client";

/**
 * Client-side wrapper around the sql.js Web Worker (see sql.worker.ts).
 *
 * Safety model: sql.js executes synchronously inside the worker, so a
 * runaway query cannot be "cancelled" cooperatively. Instead, if a query
 * doesn't respond within QUERY_TIMEOUT_MS, we terminate() the worker
 * outright and spin up a fresh one (re-seeded) for the next query. This is
 * the standard pattern for hard-limiting synchronous WASM work.
 */

export type QueryResult = { columns: string[]; rows: unknown[][] };

const QUERY_TIMEOUT_MS = 3000;
const MAX_QUERY_LENGTH = 2000;

export class SqlEngine {
  private worker: Worker | null = null;
  private seedSql: string;
  private ready: Promise<void> | null = null;

  constructor(seedSql: string) {
    this.seedSql = seedSql;
  }

  private spawnWorker(): Promise<void> {
    const worker = new Worker(new URL("./sql.worker.ts", import.meta.url));
    this.worker = worker;

    return new Promise((resolve, reject) => {
      const onMessage = (event: MessageEvent) => {
        if (event.data?.type === "ready") {
          worker.removeEventListener("message", onMessage);
          resolve();
        } else if (event.data?.type === "error") {
          worker.removeEventListener("message", onMessage);
          reject(new Error(event.data.message));
        }
      };
      worker.addEventListener("message", onMessage);
      worker.addEventListener("error", (e) => reject(e.error ?? new Error("Worker failed to start")));
      worker.postMessage({ type: "init", seedSql: this.seedSql });
    });
  }

  private async ensureReady(): Promise<void> {
    if (!this.worker) {
      this.ready = this.spawnWorker();
    }
    await this.ready;
  }

  async run(sql: string): Promise<QueryResult> {
    if (sql.length > MAX_QUERY_LENGTH) {
      throw new Error(`Query is too long (max ${MAX_QUERY_LENGTH} characters).`);
    }

    await this.ensureReady();
    const worker = this.worker!;

    return new Promise<QueryResult>((resolve, reject) => {
      const timeout = setTimeout(() => {
        worker.removeEventListener("message", onMessage);
        worker.terminate();
        this.worker = null;
        this.ready = null;
        reject(
          new Error(
            "Query took too long to run and was stopped. Check for a missing JOIN condition or an unbounded query."
          )
        );
      }, QUERY_TIMEOUT_MS);

      const onMessage = (event: MessageEvent) => {
        if (event.data?.type === "result") {
          clearTimeout(timeout);
          worker.removeEventListener("message", onMessage);
          resolve({ columns: event.data.columns, rows: event.data.rows });
        } else if (event.data?.type === "error") {
          clearTimeout(timeout);
          worker.removeEventListener("message", onMessage);
          reject(new Error(event.data.message));
        }
      };
      worker.addEventListener("message", onMessage);
      worker.postMessage({ type: "run", sql });
    });
  }

  dispose() {
    this.worker?.terminate();
    this.worker = null;
    this.ready = null;
  }
}
