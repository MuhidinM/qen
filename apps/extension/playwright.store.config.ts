import { defineConfig } from '@playwright/test';

// Store screenshots (pnpm store:screenshots), kept out of the e2e suite: they write files into
// store/images/ for the Chrome Web Store and Firefox Add-ons listings (#170).
export default defineConfig({
  testDir: 'store',
  workers: 1,
  reporter: 'list',
});
