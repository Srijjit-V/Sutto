# sql-engine

sql.js (SQLite/WASM) wrapper. Runs inside a Web Worker with a query timeout
and complexity/row-count cap so a runaway query can't freeze the main thread.
Not yet implemented — see .project-memory/STATE.md for next steps.
