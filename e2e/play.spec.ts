import { test, expect, type Page } from "@playwright/test";

async function openExplorer(page: Page) {
  await page.goto("/explore");
  await page.getByRole("button", { name: /Snack Shop/ }).first().click();
}

test("a correct query passes and the page has no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/chapter/ch1-select-basics/challenge/ch1-q3");
  await page.locator("textarea").fill("SELECT name, price FROM snacks ORDER BY price DESC");
  await page.getByRole("button", { name: "Run query" }).click();
  await expect(page.getByText("Nice work! That's correct.")).toBeVisible();
  await expect(page.getByText("Recursive Ramen")).toBeVisible();
  expect(errors).toEqual([]);
});

test("a wrong query is rejected with a reason", async ({ page }) => {
  await page.goto("/chapter/ch1-select-basics/challenge/ch1-q3");
  await page.locator("textarea").fill("SELECT name, price FROM snacks ORDER BY price");
  await page.getByRole("button", { name: "Run query" }).click();
  await expect(page.getByText(/Row 1 doesn't match/)).toBeVisible();
});

test("a semicolon inside a string literal is allowed and a second statement is not", async ({ page }) => {
  await openExplorer(page);
  const box = page.locator("textarea").first();
  const run = page.getByRole("button", { name: "Run query" });
  await box.fill("SELECT 'a;b' AS x");
  await run.click();
  await expect(page.getByText("a;b")).toBeVisible();
  await box.fill("SELECT 1; SELECT 2");
  await run.click();
  await expect(page.getByText("Only a single SQL statement is allowed per run.")).toBeVisible();
});

test("a runaway query is stopped instead of freezing the tab", async ({ page }) => {
  await openExplorer(page);
  await page.locator("textarea").first().fill(
    "WITH RECURSIVE c(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM c) SELECT COUNT(*) FROM c",
  );
  await page.getByRole("button", { name: "Run query" }).click();
  await expect(page.getByText(/took too long/)).toBeVisible({ timeout: 8000 });
});

test("challenge mode is read-only: DROP TABLE is refused and the challenge still works", async ({ page }) => {
  await page.goto("/chapter/ch1-select-basics/challenge/ch1-q3");
  const box = page.locator("textarea");
  const run = page.getByRole("button", { name: "Run query" });
  await box.fill("DROP TABLE snacks");
  await run.click();
  await expect(page.getByText(/readonly|read-only|read only/i)).toBeVisible();
  await box.fill("SELECT name, price FROM snacks ORDER BY price DESC");
  await run.click();
  await expect(page.getByText("Nice work! That's correct.")).toBeVisible();
});
