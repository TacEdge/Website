import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'

// The remote dev container pre-installs Chromium here; local machines fall
// back to Playwright's own browser download.
const chromiumPath = '/opt/pw-browsers/chromium'
const executablePath = existsSync(chromiumPath) ? chromiumPath : undefined

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4173',
    ...(executablePath
      ? { launchOptions: { executablePath, args: ['--no-sandbox'] } }
      : {}),
  },
  projects: [
    {
      // iPhone-sized viewport on Chromium (WebKit is not installed in the
      // remote container; Safari behaviour is checked manually on-device).
      name: 'iphone',
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
        defaultBrowserType: 'chromium',
      },
    },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
