/**
 * Statement guard, run inside the worker before db.exec.
 *
 * - Exactly one statement: only semicolons outside string literals, quoted
 *   names and comments count, so `WHERE name = 'a;b'` is fine.
 * - Unterminated strings or block comments are refused rather than guessed at.
 * - In read-only mode (challenges) only SELECT, WITH and VALUES may start a
 *   statement, so PRAGMA, ATTACH, VACUUM and all writes are refused up front.
 *   The worker also keeps `PRAGMA query_only` on as a second layer.
 */
export type Prepared = { ok: true; sql: string } | { ok: false; message: string };

type Scan = { semicolons: number[]; unterminated: boolean };

function scan(sql: string): Scan {
  const semicolons: number[] = [];
  let i = 0;
  while (i < sql.length) {
    const ch = sql[i];
    const next = sql[i + 1];
    if (ch === "-" && next === "-") {
      const end = sql.indexOf("\n", i);
      i = end === -1 ? sql.length : end + 1;
    } else if (ch === "/" && next === "*") {
      const end = sql.indexOf("*/", i + 2);
      if (end === -1) return { semicolons, unterminated: true };
      i = end + 2;
    } else if (ch === "'" || ch === '"' || ch === "`" || ch === "[") {
      const close = ch === "[" ? "]" : ch;
      i++;
      let closed = false;
      while (i < sql.length) {
        if (sql[i] === close) {
          if (sql[i + 1] === close && ch !== "[") i += 2; // doubled quote is an escape
          else {
            closed = true;
            break;
          }
        } else i++;
      }
      if (!closed) return { semicolons, unterminated: true };
      i++;
    } else {
      if (ch === ";") semicolons.push(i);
      i++;
    }
  }
  return { semicolons, unterminated: false };
}

/** The first keyword, skipping whitespace and comments. */
function leadingKeyword(sql: string): string {
  let s = sql;
  for (;;) {
    s = s.trimStart();
    if (s.startsWith("--")) {
      const end = s.indexOf("\n");
      s = end === -1 ? "" : s.slice(end + 1);
    } else if (s.startsWith("/*")) {
      const end = s.indexOf("*/");
      s = end === -1 ? "" : s.slice(end + 2);
    } else break;
  }
  return (/^[A-Za-z]+/.exec(s)?.[0] ?? "").toUpperCase();
}

const READ_ONLY_START = new Set(["SELECT", "WITH", "VALUES"]);

export function prepareStatement(raw: string, options: { readOnly?: boolean } = {}): Prepared {
  let sql = raw.trim();
  // Drop trailing semicolons (and whitespace) so "SELECT 1;" is one statement.
  for (;;) {
    const { semicolons, unterminated } = scan(sql);
    if (unterminated) return { ok: false, message: "A quote or comment in your query is never closed." };
    const last = semicolons[semicolons.length - 1];
    if (last !== undefined && sql.slice(last + 1).trim() === "") sql = sql.slice(0, last).trim();
    else break;
  }
  if (sql === "") return { ok: false, message: "Type a SQL statement first." };
  if (scan(sql).semicolons.length > 0) {
    return { ok: false, message: "Only a single SQL statement is allowed per run." };
  }
  if (options.readOnly && !READ_ONLY_START.has(leadingKeyword(sql))) {
    return { ok: false, message: "Challenges are read-only: only SELECT queries are allowed here." };
  }
  return { ok: true, sql };
}
