import { chromium, test as base, type BrowserContext } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const extensionPath = fileURLToPath(new URL('../.output/chrome-mv3-e2e', import.meta.url));

/** A Chromium profile with the built extension loaded, and the extension's id. */
export const test = base.extend<{ context: BrowserContext; extensionId: string }>({
  // eslint-disable-next-line no-empty-pattern -- Playwright fixtures take their deps first
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext('', {
      // CHROMIUM_PATH overrides the bundled Chromium, for machines where it won't start
      // (e.g. Chrome for Testing 156 on some Windows Insider builds).
      ...(process.env.CHROMIUM_PATH
        ? { executablePath: process.env.CHROMIUM_PATH }
        : { channel: 'chromium' }),
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
      // Dates follow each calendar's day boundary in local time; tests run in Addis Ababa's.
      timezoneId: 'Africa/Addis_Ababa',
      locale: 'en-GB',
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    await use(new URL(worker.url()).host);
  },
});

export const expect = test.expect;

/** Opens the popup page, optionally with the clock fixed at `time`. */
export async function openPopup(context: BrowserContext, extensionId: string, time?: string) {
  const page = await context.newPage();
  if (time) await page.clock.install({ time: new Date(time) });
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  return page;
}
