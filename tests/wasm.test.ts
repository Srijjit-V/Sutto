import { expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const sha = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

it("the committed public/sql-wasm.wasm is byte-identical to the installed sql.js build", () => {
  expect(sha("public/sql-wasm.wasm")).toBe(sha("node_modules/sql.js/dist/sql-wasm.wasm"));
});
