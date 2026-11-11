/**
 * Single-statement guard, run inside the worker before db.exec.
 *
 * A plain `includes(";")` check wrongly rejects `WHERE name = 'a;b'`, so this
 * scans the text and only counts semicolons that are outside string literals,
 * quoted identifiers and comments.
 */
export type Prepared = { ok: true; sql: string } | { ok: false; message: string };

function lastTopLevelSemicolons(sql: string): number[] {
  const found: number[] = [];
  let i = 0;
  while (i < sql.length) {
    const ch = sql[i];
    const next = sql[i + 1];
    if (ch === "-" && next === "-") {
      const end = sql.indexOf("\n", i);
      i = end === -1 ? sql.length : end + 1;
    } else if (ch === "/" && next === "*") {
      const end = sql.indexOf("*/", i + 2);
      i = end === -1 ? sql.length : end + 2;
    } else if (ch === "'" || ch === '"' || ch === "`" || ch === "[") {
      const close = ch === "[" ? "]" : ch;
      i++;
      while (i < sql.length) {
        if (sql[i] === close) {
          if (sql[i + 1] === close && ch !== "[") i += 2; // doubled quote is an escape
          else break;
        } else i++;
      }
      i++;
    } else {
      if (ch === ";") found.push(i);
      i++;
    }
  }
  return found;
}

export function prepareStatement(raw: string): Prepared {
  let sql = raw.trim();
  // Drop trailing semicolons (and whitespace) so "SELECT 1;" is one statement.
  for (;;) {
    const semis = lastTopLevelSemicolons(sql);
    const last = semis[semis.length - 1];
    if (last !== undefined && sql.slice(last + 1).trim() === "") sql = sql.slice(0, last).trim();
    else break;
  }
  if (sql === "") return { ok: false, message: "Type a SQL statement first." };
  if (lastTopLevelSemicolons(sql).length > 0) {
    return { ok: false, message: "Only a single SQL statement is allowed per run." };
  }
  return { ok: true, sql };
}
