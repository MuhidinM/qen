import { expect, openPopup, test } from './fixtures';

// R-EXT-01: today in three calendars (each with its day boundary, ADR-0012) and the next
// holidays. Expected values were computed with @qen/core, as for the website.
const row = (page: import('@playwright/test').Page, name: string) =>
  page.getByRole('term').filter({ hasText: name }).locator('xpath=following-sibling::dd[1]');

test('before Ethiopian dawn it is still the old Ethiopian day', async ({
  context,
  extensionId,
}) => {
  const page = await openPopup(context, extensionId, '2026-09-11T05:59:00+03:00');
  await expect(row(page, 'Gregorian')).toContainText('Friday, 11 September 2026');
  await expect(row(page, 'Ethiopian')).toContainText('5 Pagume 2018');
  await expect(row(page, 'Ethiopian')).toContainText('11:59 at night');
  await expect(row(page, 'Hijri')).toContainText('29 Rabi al-Awwal 1448');
});

test('at 06:00 the Ethiopian New Year begins, and the popup updates', async ({
  context,
  extensionId,
}) => {
  const page = await openPopup(context, extensionId, '2026-09-11T05:59:30+03:00');
  // Let the popup load its settings and start its minute timer before moving the clock.
  await expect(row(page, 'Ethiopian')).toContainText('5 Pagume 2018');
  await page.clock.runFor(60_000);
  await expect(row(page, 'Ethiopian')).toContainText('1 Meskerem 2019');
  await expect(page.getByRole('list').first()).toContainText(/Enkutatash.*today/);
});

test('coming up lists the next public holidays with how far away they are', async ({
  context,
  extensionId,
}) => {
  const page = await openPopup(context, extensionId, '2026-10-23T12:00:00+03:00');
  const items = page.getByRole('region', { name: 'Coming up' }).getByRole('listitem');
  await expect(items.first()).toContainText('Genna');
  await expect(items.first()).toContainText('7 Jan · in 76 days');
  await expect(items.nth(1)).toContainText('19 Jan · in 88 days');
});
