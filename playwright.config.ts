import { defineConfig } from "@playwright/test";

// Runs against the production build: `npm run build` first.
export default defineConfig({
  testDir: "e2e",
  testMatch: "**/*.spec.ts",
  use: { baseURL: "http://127.0.0.1:3123" },
  webServer: { command: "npx next start -p 3123 --hostname 127.0.0.1", url: "http://127.0.0.1:3123", reuseExistingServer: false },
});
