import { describe, expect, it } from "vitest";
import { prepareStatement } from "@/lib/sql-engine/guard";

describe("prepareStatement", () => {
  it("accepts one statement and strips a trailing semicolon", () => {
    expect(prepareStatement("SELECT 1;  ")).toEqual({ ok: true, sql: "SELECT 1" });
  });
  it("rejects two statements", () => {
    expect(prepareStatement("SELECT 1; SELECT 2").ok).toBe(false);
    expect(prepareStatement("SELECT 1; DROP TABLE snacks;").ok).toBe(false);
  });
  it("allows a semicolon inside a string literal", () => {
    expect(prepareStatement("SELECT * FROM snacks WHERE name = 'a;b'").ok).toBe(true);
    expect(prepareStatement("SELECT 'it''s; fine'").ok).toBe(true);
  });
  it("allows a semicolon inside a comment", () => {
    expect(prepareStatement("SELECT 1 -- note; here\n").ok).toBe(true);
    expect(prepareStatement("SELECT /* a; b */ 1").ok).toBe(true);
  });
  it("still rejects a second statement hidden after a string", () => {
    expect(prepareStatement("SELECT 'x'; DROP TABLE snacks").ok).toBe(false);
  });
  it("rejects empty input", () => {
    expect(prepareStatement("  ;  ").ok).toBe(false);
  });
});

describe("prepareStatement in read-only mode", () => {
  const ro = (s: string) => prepareStatement(s, { readOnly: true });
  it("allows SELECT, WITH and VALUES, with leading comments", () => {
    expect(ro("SELECT 1").ok).toBe(true);
    expect(ro("  -- note\n/* x */ with a as (select 1) select * from a").ok).toBe(true);
    expect(ro("VALUES (1)").ok).toBe(true);
  });
  it("refuses PRAGMA, writes, DDL, ATTACH and VACUUM", () => {
    for (const s of ["PRAGMA query_only = OFF", "DROP TABLE snacks", "DELETE FROM snacks", "INSERT INTO snacks VALUES (1)",
      "UPDATE snacks SET price = 0", "CREATE TABLE t(a)", "ATTACH 'x' AS y", "VACUUM", "REPLACE INTO snacks VALUES (1)"]) {
      expect(ro(s).ok, s).toBe(false);
    }
  });
  it("does not refuse writes when read-only is off (Explore mode)", () => {
    expect(prepareStatement("DELETE FROM snacks", { readOnly: false }).ok).toBe(true);
  });
});

describe("prepareStatement with unterminated input", () => {
  it("rejects an unterminated string or block comment", () => {
    expect(prepareStatement("SELECT 'abc; DROP TABLE x").ok).toBe(false);
    expect(prepareStatement("SELECT 1 /* never closed; DROP TABLE x").ok).toBe(false);
  });
});
