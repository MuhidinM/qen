import { defineConfig } from '@playwright/test';

// Extension tests load the built extension (.output/chrome-mv3) into Playwright's bundled
// Chromium: branded Google Chrome no longer accepts --load-extension (Chrome 137+).
export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: { trace: 'retain-on-failure' },
});
