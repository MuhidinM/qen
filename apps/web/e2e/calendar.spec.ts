import { expect, test, type Page } from '@playwright/test';

// R-WEB-03: the full calendar with month, year and agenda views; the view and month live in
// the URL (links, back/forward), settings live in cookies (survive a reload). Expected labels
// were computed with @qen/core.
test.use({ timezoneId: 'Africa/Addis_Ababa', locale: 'en-GB' });

const meskerem2019 = '/calendar?view=month&calendar=ethiopian&year=2019&month=1';
const day = (page: Page, label: string | RegExp) => page.getByRole('gridcell', { name: label });

test('a link opens that month, with other calendars and holidays in the day cells', async ({
  page,
}) => {
  await page.goto(meskerem2019);
  await expect(page.getByRole('grid', { name: 'Meskerem 2019' })).toBeVisible();
  const first = day(page, /^Friday, 1 Meskerem 2019,/);
  await expect(first).toHaveAccessibleName(/11 September 2026/);
  await expect(first).toHaveAccessibleName(/1 Rabi al-Thani 1448|29 Rabi al-Awwal 1448/);
  await expect(first).toHaveAccessibleName(/Enkutatash/);
});

test('without a link it opens on today’s month in the remembered calendar', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-11T09:00:00+03:00') });
  await page.goto('/calendar');
  await expect(page.getByRole('grid', { name: 'Meskerem 2019' })).toBeVisible();
  await expect(day(page, /^Friday, 1 Meskerem 2019,/)).toHaveAttribute('aria-current', 'date');
});

test('months change with the buttons and the keyboard, and back/forward follow', async ({
  page,
}) => {
  await page.goto(meskerem2019);
  await page.getByRole('button', { name: 'Next month' }).click();
  await expect(page.getByRole('grid', { name: 'Tikimt 2019' })).toBeVisible();
  await expect(page).toHaveURL(/year=2019&month=2/);

  await page.goBack();
  await expect(page.getByRole('grid', { name: 'Meskerem 2019' })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole('grid', { name: 'Tikimt 2019' })).toBeVisible();

  await day(page, /^\w+, 1 Tikimt 2019,/).click();
  await page.keyboard.press('PageDown');
  await expect(page.getByRole('grid', { name: 'Hidar 2019' })).toBeVisible();
  await expect(page).toHaveURL(/month=3/);
});

test('the year view opens a month, and the agenda lists that month’s holidays', async ({
  page,
}) => {
  await page.goto(meskerem2019);
  await page.getByRole('radio', { name: 'Year' }).check();
  await expect(page).toHaveURL(/view=year/);
  await page.getByRole('button', { name: /^Tikimt/ }).click();
  await expect(page).toHaveURL(/view=month&calendar=ethiopian&year=2019&month=2/);
  await expect(page.getByRole('grid', { name: 'Tikimt 2019' })).toBeVisible();

  await page.goto('/calendar?view=agenda&calendar=ethiopian&year=2019&month=1');
  await expect(page.getByRole('heading', { name: 'Meskerem 2019' })).toBeVisible();
  const agenda = page.getByRole('list', { name: 'Holidays and observances' });
  await expect(agenda).toContainText('Enkutatash');
  await expect(agenda).toContainText('Meskel');
  await page.getByRole('button', { name: 'Next month' }).click();
  await expect(page).toHaveURL(/view=agenda&calendar=ethiopian&year=2019&month=2/);
  await expect(page.getByRole('heading', { name: 'Tikimt 2019' })).toBeVisible();
});

test('switching the calendar keeps the same days in view', async ({ page }) => {
  await page.goto(meskerem2019);
  await page.getByRole('radio', { name: 'Gregorian' }).check();
  await expect(page.getByRole('grid', { name: 'September 2026' })).toBeVisible();
  await expect(page).toHaveURL(/calendar=gregorian&year=2026&month=9/);
});

test('holiday filters, other calendars and the Hijri method are remembered', async ({ page }) => {
  await page.goto(meskerem2019);
  const second = () => day(page, /^Saturday, 2 Meskerem 2019/);
  await expect(second()).toHaveAccessibleName(/1 Rabi al-Thani 1448/);

  await page.getByRole('checkbox', { name: 'Public' }).uncheck();
  await expect(day(page, /^Friday, 1 Meskerem 2019,/)).not.toHaveAccessibleName(/Enkutatash/);

  await page.getByRole('combobox', { name: 'Hijri dates' }).selectOption('tabular');
  await expect(second()).toHaveAccessibleName(/29 Rabi al-Awwal 1448/);

  await page.getByRole('checkbox', { name: 'Show other calendars in each day' }).uncheck();
  await expect(second()).not.toHaveAccessibleName(/12 September 2026/);

  await page.reload();
  await expect(page.getByRole('checkbox', { name: 'Public' })).not.toBeChecked();
  await expect(page.getByRole('combobox', { name: 'Hijri dates' })).toHaveValue('tabular');
  await expect(
    page.getByRole('checkbox', { name: 'Show other calendars in each day' }),
  ).not.toBeChecked();
  await expect(day(page, /^Friday, 1 Meskerem 2019/)).not.toHaveAccessibleName(/Enkutatash/);
});

test('the site navigation leads to the calendar', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: 'Calendar' }).click();
  await expect(page).toHaveURL(/\/calendar$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Calendar');
});
