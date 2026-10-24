import { expect, test, type Page } from '@playwright/test';

// R-WEB-05: a page per holiday per year (N-031: 2020–2040), with dates from @qen/core under the
// site's default Hijri dates. Expected values were computed with @qen/core; Genna follows
// N-016 (28 Tahsas in years after an Ethiopian leap year).
const card = (page: Page, name: string, nth = 0) => page.getByRole('region', { name }).nth(nth);

test('Fasika 2027 is on 2 May (24 Miyazia 2019 EC), calculated with Bahire Hasab', async ({
  page,
}) => {
  await page.goto('/holidays/fasika/2027');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Fasika (Easter) 2027');
  await expect(card(page, 'Gregorian')).toContainText('2 May 2027');
  await expect(card(page, 'Ethiopian')).toContainText('24 Miyazia 2019');
  await expect(page.getByRole('main')).toContainText('Bahire Hasab');
  await expect(page.getByRole('main')).toContainText('ፋሲካ');
});

test('Genna is 28 Tahsas after an Ethiopian leap year and 29 Tahsas otherwise', async ({
  page,
}) => {
  await page.goto('/holidays/genna/2024');
  await expect(card(page, 'Gregorian')).toContainText('7 January 2024');
  await expect(card(page, 'Ethiopian')).toContainText('28 Tahsas 2016');
  await page.getByRole('link', { name: 'Genna (Ethiopian Christmas) 2025' }).click();
  await expect(page).toHaveURL(/\/holidays\/genna\/2025$/);
  await expect(card(page, 'Ethiopian')).toContainText('29 Tahsas 2017');
});

test('a confirmed Eid names its source; a future one says it is expected', async ({ page }) => {
  await page.goto('/holidays/eid-al-fitr/2026');
  await expect(card(page, 'Gregorian')).toContainText('20 March 2026');
  await expect(page.getByRole('main')).toContainText('Confirmed');
  await expect(page.getByRole('main')).toContainText('Ethiopian News Agency');

  await page.goto('/holidays/eid-al-fitr/2027');
  await expect(card(page, 'Gregorian')).toContainText('9 March 2027');
  await expect(page.getByRole('main')).toContainText('Expected date');
});

test('a holiday that falls twice in a year shows both dates', async ({ page }) => {
  await page.goto('/holidays/eid-al-fitr/2033');
  await expect(card(page, 'Gregorian', 0)).toContainText('3 January 2033');
  await expect(card(page, 'Gregorian', 1)).toContainText('23 December 2033');
});

test('each page has its title, description, canonical link and Event data', async ({ page }) => {
  await page.goto('/holidays/meskel/2027');
  await expect(page).toHaveTitle(/^Meskel .* 2027: Tuesday, 28 September 2027 · Qen$/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /17 Meskerem 2020 EC/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/holidays\/meskel\/2027$/,
  );
  const data = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}',
  );
  expect(data).toMatchObject({ '@type': 'Event', startDate: '2027-09-28' });
});

test('the year index lists every holiday of the year in date order, with links', async ({
  page,
}) => {
  await page.goto('/holidays/2027');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Holidays in 2027');
  const rows = page.getByRole('table').getByRole('row');
  // 28 holidays, Isra and Mi'raj twice in 2027, plus the header row.
  await expect(rows).toHaveCount(30);
  await page.getByRole('link', { name: 'Fasika (Easter)' }).click();
  await expect(page).toHaveURL(/\/holidays\/fasika\/2027$/);
});

test('years outside 2020–2040 and unknown holidays are not found', async ({ request }) => {
  expect((await request.get('/holidays/fasika/2019')).status()).toBe(404);
  expect((await request.get('/holidays/not-a-holiday/2027')).status()).toBe(404);
  expect((await request.get('/holidays/2041')).status()).toBe(404);
});

test('the sitemap lists every holiday page, and robots points to it', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const holidayPages = sitemap.match(/\/holidays\/[a-z-]+\/\d{4}</g) ?? [];
  expect(holidayPages).toHaveLength(588);
  expect(sitemap).toContain('/holidays/2040<');
  expect(sitemap).toContain('/convert<');
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
});
