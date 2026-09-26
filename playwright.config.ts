import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: process.env.KINO_TEST_URL ?? "http://127.0.0.1:4311",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "pnpm --filter @react-kino/docs exec next dev --port 4311",
    url: "http://127.0.0.1:4311",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
