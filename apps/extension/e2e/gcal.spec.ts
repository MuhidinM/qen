import { readFileSync } from 'node:fs';
import type { BrowserContext } from '@playwright/test';
import { expect, test } from './fixtures';

// Google Calendar is served from hand-written fixtures with the same structure (no network,
// no account): src/lib/__fixtures__/gcal-*.html.
const fixture = (name: string) =>
  readFileSync(new URL(`../src/lib/__fixtures__/gcal-${name}.html`, import.meta.url), 'utf8');

async function calendar(context: BrowserContext, view: 'month' | 'week') {
  await context.route('https://calendar.google.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: fixture(view) }),
  );
  const page = await context.newPage();
  await page.goto(`https://calendar.google.com/calendar/u/0/r/${view}/2026/10/25`);
  return page;
}

const badge = (key: number) => `[data-datekey="${key}"] + .qen-gcal`;

test('adds Ethiopian and Hijri days to the month view', async ({ context }) => {
  const page = await calendar(context, 'month');
  await expect(page.locator('.qen-gcal')).toHaveCount(35);
  await expect(page.locator(badge(29017))).toHaveText(/^15 · \d+$/);
  await expect(page.locator(badge(29017))).toHaveAttribute(
    'title',
    /^Ethiopian: 15 Tikimt 2019 EC · Hijri: /,
  );
  // The badge is smaller than Google's day number, so the day number stays primary.
  await expect(page.locator(badge(29017))).toHaveCSS('font-size', '12px');
});

test('follows Google re-rendering the page, as when switching to the week view', async ({
  context,
}) => {
  const page = await calendar(context, 'month');
  await expect(page.locator('.qen-gcal')).toHaveCount(35);
  // Google swaps the grid without a page load.
  const week = fixture('week');
  await page.evaluate((html) => {
    document.body.innerHTML = new DOMParser().parseFromString(html, 'text/html').body.innerHTML;
  }, week);
  await expect(page.locator('.qen-gcal')).toHaveCount(7);
  await expect(page.locator('[role="columnheader"] .qen-gcal').first()).toHaveText(
    /^15 Tikimt · \d+ \S/,
  );
});

test('applies the overlay setting from the popup straight away', async ({
  context,
  extensionId,
}) => {
  const page = await calendar(context, 'month');
  await expect(page.locator('.qen-gcal')).toHaveCount(35);

  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await popup.getByRole('tab', { name: 'Settings' }).click();
  await popup.getByLabel('In Google Calendar, show').selectOption('ethiopian');
  await expect(page.locator(badge(29017))).toHaveText('15');

  await popup.getByLabel('Show dates in').selectOption('am');
  await expect(page.locator(badge(29017))).toHaveText('15');
  await expect(page.locator(badge(29017))).toHaveAttribute('lang', 'am');

  await popup.getByLabel('In Google Calendar, show').selectOption('off');
  await expect(page.locator('.qen-gcal')).toHaveCount(0);
});

test('leaves other pages alone', async ({ context }) => {
  await context.route('https://example.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: fixture('month') }),
  );
  const page = await context.newPage();
  await page.goto('https://example.com/calendar');
  await expect(page.locator('h2[data-datekey]').first()).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page.locator('.qen-gcal')).toHaveCount(0);
});
