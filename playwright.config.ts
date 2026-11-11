import { defineConfig } from "@playwright/test";

// Runs against the production build: `npm run build` first.
export default defineConfig({
  testDir: "e2e",
  testMatch: "**/*.spec.ts",
  use: { baseURL: "http://localhost:3123" },
  webServer: { command: "npx next start -p 3123", url: "http://localhost:3123", reuseExistingServer: !process.env.CI },
});
