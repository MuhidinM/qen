import { defineConfig, devices } from '@playwright/test';

const port = 3100;

// End-to-end tests run against the production build (`next start`), the same server
// Lighthouse CI measures, so security headers and SRI are checked as shipped.
export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: { baseURL: `http://localhost:${port}`, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile-320',
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 640 } },
    },
  ],
  webServer: {
    command: `pnpm exec next start -p ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
