import { defineConfig, devices } from "@playwright/test"

const PORT = 3100

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Até 2 novas tentativas e 2 workers: nesta máquina, o canal entre o
  // Playwright e o Chromium às vezes entrega mensagens corrompidas (D-701).
  // O relatório marca como "flaky" o que só passa na repetição.
  retries: 2,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /screenshots.spec/,
    },
    {
      name: "capturas",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /screenshots.spec/,
    },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}/sistema`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
