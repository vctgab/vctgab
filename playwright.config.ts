import { defineConfig, devices } from "@playwright/test"

const PORT = 3100
const CI = !!process.env.CI

/**
 * Novas tentativas só na máquina local e só quando pedidas por
 * `PW_RETRIES` (D-1002): nesta máquina o canal entre o Playwright e o
 * navegador às vezes entrega mensagens corrompidas (D-701). No CI, zero:
 * o que for instável tem de aparecer.
 */
const retries = CI ? 0 : Number(process.env.PW_RETRIES ?? 0)

const ENGINES = [
  { name: "chromium", device: devices["Desktop Chrome"] },
  { name: "webkit", device: devices["Desktop Safari"] },
  { name: "firefox", device: devices["Desktop Firefox"] },
] as const

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries,
  workers: 2,
  reporter: CI
    ? [["list"], ["html", { open: "never" }], ["github"]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    // E2E com axe nos três motores.
    ...ENGINES.map((e) => ({
      name: e.name,
      use: { ...e.device },
      testIgnore: /screenshots\.spec/,
    })),
    // Capturas de evidência (pnpm screenshots), uma por motor.
    ...ENGINES.map((e) => ({
      name: `capturas-${e.name}`,
      use: { ...e.device },
      testMatch: /screenshots\.spec/,
    })),
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}/sistema`,
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
})
