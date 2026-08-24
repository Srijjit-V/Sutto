import type { Challenge } from "./types";
import type { QueryResult } from "@/lib/sql-engine/client";

export interface CheckOutcome {
  passed: boolean;
  reason?: string;
}

/** Loose equality so 3 and 3.0 (or "3" from a driver quirk) compare equal. */
function cellsEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-9;
  return String(a) === String(b);
}

function rowsEqual(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((cell, i) => cellsEqual(cell, b[i]));
}

export function checkResult(challenge: Challenge, result: QueryResult): CheckOutcome {
  if (result.columns.length !== challenge.expectedColumns.length) {
    return {
      passed: false,
      reason: `Expected ${challenge.expectedColumns.length} column(s), got ${result.columns.length}.`,
    };
  }

  if (result.rows.length !== challenge.expectedRows.length) {
    return {
      passed: false,
      reason: `Expected ${challenge.expectedRows.length} row(s), got ${result.rows.length}.`,
    };
  }

  if (challenge.orderMatters === false) {
    const normalize = (rows: unknown[][]) => rows.map((r) => JSON.stringify(r)).sort();
    const expected = normalize(challenge.expectedRows);
    const actual = normalize(result.rows);
    const passed = expected.every((row, i) => row === actual[i]);
    return passed ? { passed: true } : { passed: false, reason: "The rows don't match the expected set." };
  }

  for (let i = 0; i < challenge.expectedRows.length; i++) {
    if (!rowsEqual(result.rows[i], challenge.expectedRows[i])) {
      return { passed: false, reason: `Row ${i + 1} doesn't match what was expected.` };
    }
  }

  return { passed: true };
}
