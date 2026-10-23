import { defineConfig, devices } from '@playwright/test';

const port = 3100;

// End-to-end tests run against the production build (`next start`), the same server
// Lighthouse CI measures, so the security headers and the CSP nonce are checked as shipped.
export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: { baseURL: `http://localhost:${port}`, trace: 'retain-on-failure' },
  // The installed Google Chrome (GitHub's Ubuntu runners ship it), not a downloaded browser:
  // `playwright install --with-deps` hung twice on a slow apt mirror (#133).
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    {
      name: 'mobile-320',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 320, height: 640 },
      },
    },
  ],
  webServer: {
    command: `pnpm exec next start -p ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
