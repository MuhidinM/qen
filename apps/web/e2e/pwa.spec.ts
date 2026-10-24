import { expect, test, type Page } from '@playwright/test';

// R-WEB-03: the site installs as an app and keeps working offline once loaded (ADR-0009,
// ADR-0016 amendment: a hand-written service worker). Chromium only, like the projects.
test.use({ timezoneId: 'Africa/Addis_Ababa', locale: 'en-GB' });

/** Loads the page and waits until the service worker controls it. */
async function loadControlled(page: Page, url: string) {
  await page.goto(url);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) =>
        navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }),
      );
    }
  });
}

test('the site meets Chrome’s install criteria', async ({ page }) => {
  await loadControlled(page, '/');
  const cdp = await page.context().newCDPSession(page);
  const { installabilityErrors } = await cdp.send('Page.getInstallabilityErrors');
  // Playwright's browser contexts count as incognito, where Chrome never offers to install.
  expect(installabilityErrors.map((e) => e.errorId)).toEqual(['in-incognito']);

  const manifest = await (await page.request.get('/manifest.webmanifest')).json();
  expect(manifest).toMatchObject({ name: expect.stringContaining('Qen'), display: 'standalone' });
  const purposes = manifest.icons.map((i: { purpose?: string }) => i.purpose ?? 'any');
  expect(purposes).toContain('maskable');
  for (const icon of manifest.icons) {
    expect((await page.request.get(icon.src)).status(), icon.src).toBe(200);
  }
});

test('after one visit, the calendar and the converter work offline', async ({ page, context }) => {
  await loadControlled(page, '/');
  await context.setOffline(true);

  // The calendar: a page never opened online, served from what the worker cached at install.
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/calendar?view=month&calendar=ethiopian&year=2019&month=1');
  await expect(page.getByRole('grid', { name: 'Meskerem 2019' })).toBeVisible();
  await page.getByRole('button', { name: 'Next month' }).click();
  await expect(page.getByRole('grid', { name: 'Tikimt 2019' })).toBeVisible();

  // The converter hydrates under its cached page's own CSP nonce and converts typed text.
  await page.goto('/convert');
  const field = page.getByRole('textbox', { name: 'Date' });
  await field.fill('1 Meskerem 2019');
  await field.press('Enter');
  await expect(
    page.getByRole('region', { name: 'Result' }).getByRole('region', { name: 'Gregorian' }),
  ).toContainText('11 September 2026');

  expect(errors.filter((e) => /Content Security Policy/.test(e))).toEqual([]);
});

test('after one visit, the countdown and the age calculator work offline', async ({
  page,
  context,
}) => {
  await loadControlled(page, '/');
  await context.setOffline(true);

  await page.goto('/countdown');
  const date = page.getByRole('textbox', { name: 'Date' });
  await date.fill('1 Meskerem 2020');
  await date.press('Enter');
  await expect(page.getByRole('region', { name: 'Result' })).toContainText(/\d+ days/);

  await page.goto('/age');
  const birth = page.getByRole('textbox', { name: 'Birth date' });
  await birth.fill('1 January 2000');
  await birth.press('Enter');
  await expect(page.getByRole('region', { name: 'Result' })).toContainText(/\d+ years/);
});

test('an unknown page offline shows the offline page', async ({ page, context }) => {
  await loadControlled(page, '/');
  await context.setOffline(true);
  await page.goto('/holidays/fasika/2027');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('You’re offline');
  await expect(page.getByRole('link', { name: 'Calendar' }).first()).toBeVisible();
});

test('a new version waits for the visitor to reload instead of swapping silently', async ({
  page,
}) => {
  await loadControlled(page, '/');
  const before = await page.evaluate(() => navigator.serviceWorker.controller?.scriptURL);

  // Simulate a deploy: the same worker under the next build's URL.
  await page.evaluate(() => navigator.serviceWorker.register('/sw.js?v=next-build'));
  const prompt = page.getByRole('status').filter({ hasText: 'A new version of Qen is ready' });
  await expect(prompt).toBeVisible();
  // Still the old worker until the visitor chooses.
  expect(await page.evaluate(() => navigator.serviceWorker.controller?.scriptURL)).toBe(before);

  const reloaded = page.waitForEvent('load');
  await prompt.getByRole('button', { name: 'Reload' }).click();
  await reloaded;
  await expect
    .poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? ''))
    .toContain('v=next-build');
});

test('the worker is served fresh and with a strict policy', async ({ request }) => {
  const res = await request.get('/sw.js');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('javascript');
  expect(res.headers()['cache-control']).toContain('no-cache');
  expect(res.headers()['content-security-policy']).toBe("default-src 'self'; script-src 'self'");
});
