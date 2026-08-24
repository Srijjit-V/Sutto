# sql-engine

sql.js (SQLite/WASM) running inside a Web Worker (`sql.worker.ts`). The
client wrapper (`client.ts`) enforces a hard query timeout by terminating
and recreating the worker if a query doesn't respond in time, since a
synchronous WASM computation can't be cooperatively cancelled.
