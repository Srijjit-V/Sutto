import { describe, expect, it, beforeAll } from "vitest";
import initSqlJs, { type SqlJsStatic } from "sql.js";
import { chapters } from "@/lib/game/chapters";
import { checkResult } from "@/lib/game/checkResult";
import { answers } from "./answers";

let SQL: SqlJsStatic;
beforeAll(async () => {
  SQL = await initSqlJs();
});

const all = chapters.flatMap((ch) => ch.challenges.map((c) => ({ ch, c })));

function run(seedSql: string, sql: string) {
  const db = new SQL.Database();
  try {
    db.run(seedSql);
    const r = db.exec(sql);
    return r.length ? { columns: r[0].columns, rows: r[0].values as unknown[][] } : { columns: [], rows: [] };
  } finally {
    db.close();
  }
}

describe("challenge content", () => {
  it("has an answer key for every challenge and no stray keys", () => {
    expect(Object.keys(answers).sort()).toEqual(all.map((x) => x.c.id).sort());
  });

  it("has unique challenge ids and unique chapter orders", () => {
    const ids = all.map((x) => x.c.id);
    expect(new Set(ids).size).toBe(ids.length);
    const orders = chapters.map((c) => c.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it.each(all.map((x) => [x.c.id, x] as const))("%s: expected rows match the column count", (_id, { c }) => {
    for (const row of c.expectedRows) expect(row.length).toBe(c.expectedColumns.length);
  });

  it.each(all.map((x) => [x.c.id, x] as const))("%s: answer key passes against real SQLite", (id, { ch, c }) => {
    const result = run(ch.seedSql, answers[id]);
    expect(checkResult(c, result)).toEqual({ passed: true });
  });

  it.each(all.map((x) => [x.c.id, x] as const))("%s: a wrong query does not pass", (_id, { ch, c }) => {
    const wrong = run(ch.seedSql, "SELECT 1 AS wrong");
    expect(checkResult(c, wrong).passed).toBe(false);
  });
});

describe("starter code", () => {
  it("does not hand out a passing answer unmodified (reports which ones do)", () => {
    const passing: string[] = [];
    for (const { ch, c } of all) {
      try {
        if (checkResult(c, run(ch.seedSql, c.starterSql)).passed) passing.push(c.id);
      } catch {
        /* an unfinished starter is expected to fail to run */
      }
    }
    expect(passing).toEqual([]);
  });
});
