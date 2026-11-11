import { describe, expect, it } from "vitest";
import { checkResult } from "@/lib/game/checkResult";
import type { Challenge } from "@/lib/game/types";

const base: Challenge = {
  id: "t", title: "t", story: "", prompt: "", starterSql: "",
  expectedColumns: ["n", "v"], expectedRows: [["a", 49.6], ["b", 2]],
  xpReward: 0, coinReward: 0, hintFallback: "",
};

describe("checkResult", () => {
  it("accepts matching ordered rows and 3 vs 3.0", () => {
    expect(checkResult(base, { columns: ["n", "v"], rows: [["a", 49.6], ["b", 2.0]] }).passed).toBe(true);
  });
  it("rejects wrong column count, row count, and row order", () => {
    expect(checkResult(base, { columns: ["n"], rows: [] }).passed).toBe(false);
    expect(checkResult(base, { columns: ["n", "v"], rows: [["a", 49.6]] }).passed).toBe(false);
    expect(checkResult(base, { columns: ["n", "v"], rows: [["b", 2], ["a", 49.6]] }).passed).toBe(false);
  });
  it("tolerates float rounding noise in ordered mode", () => {
    expect(checkResult(base, { columns: ["n", "v"], rows: [["a", 49.599999999999994], ["b", 2]] }).passed).toBe(true);
  });
  it("tolerates float rounding noise in unordered mode too", () => {
    const c = { ...base, orderMatters: false };
    expect(checkResult(c, { columns: ["n", "v"], rows: [["b", 2], ["a", 49.599999999999994]] }).passed).toBe(true);
  });
  it("unordered mode still rejects different rows", () => {
    const c = { ...base, orderMatters: false };
    expect(checkResult(c, { columns: ["n", "v"], rows: [["b", 2], ["a", 50]] }).passed).toBe(false);
  });
});
