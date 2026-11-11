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
