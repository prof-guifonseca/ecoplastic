import { defineConfig, devices } from '@playwright/test';

const PORT = 3107;

// e2e roda contra o BUILD ESTATICO servido (serve out/), nao contra `next dev`.
// Isso elimina a flakiness de compilacao do Next 16 e testa os bytes publicados
// (ver docs/adr/0004-e2e-contra-build-estatico.md). Pre-requisito: `npm run build`.
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
    serviceWorkers: 'block'
  },
  webServer: {
    command: `npx serve out -l ${PORT} --no-port-switching`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ]
});
