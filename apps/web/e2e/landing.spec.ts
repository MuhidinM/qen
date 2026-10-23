import { expect, test, type Page } from '@playwright/test';

// R-WEB-01: the hero shows today in all three calendars, follows each calendar's day boundary
// (ADR-0012) in the visitor's time zone, and keeps up as time passes. Expected dates were
// computed with @qen/core and the Hijri one cross-checked with ICU (islamic-umalqura).
test.use({ timezoneId: 'Africa/Addis_Ababa', locale: 'en-GB' });

const card = (page: Page, name: string) => page.getByRole('region', { name });

async function openAt(page: Page, isoTime: string) {
  await page.clock.install({ time: new Date(isoTime) });
  await page.goto('/');
}

test('just before Ethiopian dawn it is still the old Ethiopian day', async ({ page }) => {
  await openAt(page, '2026-09-11T05:59:00+03:00');
  await expect(card(page, 'Gregorian')).toContainText('11 September 2026');
  await expect(card(page, 'Ethiopian')).toContainText('5 Pagume 2018');
  await expect(card(page, 'Ethiopian')).toContainText('11:59 at night');
  await expect(card(page, 'Hijri')).toContainText('29 Rabi al-Awwal 1448');
});

test('at 06:00 the Ethiopian New Year begins, and the hero updates on its own', async ({
  page,
}) => {
  await openAt(page, '2026-09-11T05:59:30+03:00');
  await expect(card(page, 'Ethiopian')).toContainText('5 Pagume 2018');
  await page.clock.runFor(60_000);
  await expect(card(page, 'Ethiopian')).toContainText('1 Meskerem 2019');
  await expect(card(page, 'Ethiopian')).toContainText('12:00 in the morning');
});

test('the Hijri day changes at sunset (18:00 without a location)', async ({ page }) => {
  await openAt(page, '2026-09-11T17:59:00+03:00');
  await expect(card(page, 'Hijri')).toContainText('29 Rabi al-Awwal 1448');
  await page.clock.runFor(60_000);
  await expect(card(page, 'Hijri')).toContainText('1 Rabi al-Thani 1448');
  await expect(card(page, 'Gregorian')).toContainText('11 September 2026');
});

test('the Gregorian day changes at midnight', async ({ page }) => {
  await openAt(page, '2026-09-10T23:59:00+03:00');
  await expect(card(page, 'Gregorian')).toContainText('10 September 2026');
  await page.clock.runFor(60_000);
  await expect(card(page, 'Gregorian')).toContainText('11 September 2026');
  await expect(card(page, 'Ethiopian')).toContainText('5 Pagume 2018');
});

test('dates follow the chosen language, with Arabic right to left, and the choice persists', async ({
  page,
}) => {
  await openAt(page, '2026-09-11T09:00:00+03:00');
  const language = page.getByRole('combobox', { name: 'Show dates in' });

  await language.selectOption('am');
  await expect(card(page, 'Ethiopian')).toContainText('መስከረም');

  await language.selectOption('ar');
  await expect(card(page, 'Hijri').locator('time')).toHaveAttribute('dir', 'rtl');
  await expect(card(page, 'Hijri').locator('time')).toHaveAttribute('lang', 'ar');

  await page.reload();
  await expect(language).toHaveValue('ar');
  await expect(card(page, 'Hijri').locator('time')).toHaveAttribute('dir', 'rtl');
});

test('Ge’ez numerals can be switched on', async ({ page }) => {
  await openAt(page, '2026-09-11T09:00:00+03:00');
  await page.getByRole('checkbox', { name: 'Ge’ez numerals' }).check();
  await expect(card(page, 'Ethiopian').locator('time').first()).toContainText('፩');
});

test('the theme can be set to dark or light and survives a reload', async ({ page }) => {
  await page.goto('/');
  const theme = page.getByRole('combobox', { name: 'Theme' });
  await expect(theme).toHaveValue('system');

  await theme.selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await theme.selectOption('system');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
});

test('the layout has one main landmark, a banner, a footer and a level-one heading', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toHaveCount(1);
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('contentinfo')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/MuhidinM/qen',
  );
});
