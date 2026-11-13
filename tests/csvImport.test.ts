import { describe, expect, it } from "vitest";
import initSqlJs from "sql.js";
import { parseCsvToDataset, CsvImportError } from "@/lib/datasets/csvImport";

async function load(csv: string, name = "data.csv") {
  const ds = parseCsvToDataset(csv, name);
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  db.run(ds.seedSql);
  return { ds, db };
}

describe("parseCsvToDataset", () => {
  it("infers types and loads rows into real SQLite", async () => {
    const { ds, db } = await load("id,name,price\n1,Tea,2.5\n2,Cake,3");
    expect(ds.tables[0].columns.map((c) => c.type)).toEqual(["INTEGER", "TEXT", "REAL"]);
    expect(db.exec("SELECT COUNT(*) FROM data")[0].values[0][0]).toBe(2);
  });
  it("escapes quotes and keeps hostile text as data", async () => {
    const { db } = await load("name\n\"x'); DROP TABLE data; --\"");
    expect(db.exec("SELECT name FROM data")[0].values[0][0]).toBe("x'); DROP TABLE data; --");
  });
  it("loads headers that are SQL keywords", async () => {
    const { db } = await load("order,group,select\n1,2,3");
    expect(db.exec("SELECT COUNT(*) FROM data")[0].values[0][0]).toBe(1);
  });
  it("loads a file named like a SQL keyword", async () => {
    const { db } = await load("a\n1", "select.csv");
    expect(db.exec("SELECT COUNT(*) FROM \"select\"")[0].values[0][0]).toBe(1);
  });
  it("rejects too few rows, too many columns, and oversized text", () => {
    expect(() => parseCsvToDataset("a,b", "x.csv")).toThrow(CsvImportError);
    const wide = Array.from({ length: 41 }, (_, i) => `c${i}`).join(",");
    expect(() => parseCsvToDataset(`${wide}\n${wide}`, "x.csv")).toThrow(CsvImportError);
    expect(() => parseCsvToDataset("a\n" + "x".repeat(6_000_000), "x.csv")).toThrow(CsvImportError);
  });
});
