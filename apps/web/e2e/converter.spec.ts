import { expect, test, type Page } from '@playwright/test';

// R-WEB-02: convert between the three calendars by link, by typing or pasting (parse(),
// ADR-0014: ambiguous text asks, never guesses), and share the result. Expected dates are the
// PLAN.md anchors, or were computed with @qen/core; the Umm al-Qura ones match ICU.

const result = (page: Page, name: string) =>
  page.getByRole('region', { name: 'Result' }).getByRole('region', { name });
const field = (page: Page) => page.getByRole('textbox', { name: 'Date' });

test('Meskerem 1, 2019 EC is 11 September 2026 (anchor), from a shared link', async ({ page }) => {
  await page.goto('/convert?calendar=ethiopian&date=2019-01-01');
  await expect(result(page, 'Gregorian')).toContainText('11 September 2026');
  await expect(result(page, 'Gregorian')).toContainText('Friday');
  await expect(result(page, 'Ethiopian')).toContainText('1 Meskerem 2019');
  await expect(result(page, 'Hijri')).toContainText('29 Rabi al-Awwal 1448');
  await expect(page.getByRole('region', { name: 'Result' })).toContainText('Enkutatash');
});

test('Meskerem 1, 2016 EC is 12 September 2023, the year after a leap year (anchor)', async ({
  page,
}) => {
  await page.goto('/convert?calendar=ethiopian&date=2016-01-01');
  await expect(result(page, 'Gregorian')).toContainText('12 September 2023');
});

test('12 April 2026 is Fasika (anchor) and the day’s holidays are listed', async ({ page }) => {
  await page.goto('/convert?calendar=gregorian&date=2026-04-12');
  await expect(result(page, 'Ethiopian')).toContainText('4 Miyazia 2018');
  await expect(page.getByRole('list', { name: 'Holidays on this day' })).toContainText(
    'Fasika (Easter)',
  );
});

test('Islamic holidays show whether their date is confirmed or expected', async ({ page }) => {
  // Default Hijri dates include those confirmed in Ethiopia (owner's choice, 2026-10-23).
  await page.goto('/convert?calendar=hijri&date=1447-10-01');
  await expect(result(page, 'Gregorian')).toContainText('20 March 2026');
  const holidays = page.getByRole('list', { name: 'Holidays on this day' });
  await expect(holidays).toContainText(/Eid al-Fitr.*confirmed/);

  await page.goto('/convert?calendar=hijri&date=1448-10-01');
  await expect(result(page, 'Gregorian')).toContainText('9 March 2027');
  await expect(holidays).toContainText(/Eid al-Fitr.*expected/);
});

test('typed text is read and converted, and the address bar becomes a shareable link', async ({
  page,
}) => {
  await page.goto('/convert');
  await field(page).fill('1 Meskerem 2019');
  await field(page).press('Enter');
  await expect(result(page, 'Gregorian')).toContainText('11 September 2026');
  await expect(page).toHaveURL(/calendar=\w+&date=[\d-]+/);

  const shared = page.url();
  await page.goto('/convert');
  await page.goto(shared);
  await expect(result(page, 'Gregorian')).toContainText('11 September 2026');
});

test('ambiguous text asks which calendar was meant instead of guessing', async ({ page }) => {
  await page.goto('/convert');
  await field(page).fill('17/01/2019');
  await field(page).press('Enter');
  const choices = page.getByRole('group', { name: 'Which date did you mean?' });
  await expect(choices.getByRole('button')).toHaveCount(3);
  await expect(page.getByRole('region', { name: 'Result' })).toHaveCount(0);

  await choices.getByRole('button', { name: /Meskerem/ }).click();
  await expect(result(page, 'Gregorian')).toContainText('27 September 2026');
});

test('a date that does not exist is explained in plain words', async ({ page }) => {
  await page.goto('/convert');
  await field(page).fill('6 Pagume 2018');
  await field(page).press('Enter');
  await expect(page.getByText('Pagume 6 does not exist in 2018 EC')).toBeVisible();

  await page.goto('/convert?calendar=ethiopian&date=2018-13-06');
  await expect(page.getByRole('main').getByRole('alert')).toContainText(
    'Pagume 6 does not exist in 2018 EC',
  );
});

test('changing the input calendar keeps the same day', async ({ page }) => {
  await page.goto('/convert?calendar=gregorian&date=2026-09-11');
  await page.getByRole('radio', { name: 'Ethiopian' }).check();
  await expect(field(page)).toHaveValue('1 Meskerem 2019');
  await expect(page).toHaveURL(/calendar=ethiopian&date=2019-01-01/);
  await expect(result(page, 'Gregorian')).toContainText('11 September 2026');
});

test('the result and the link can be copied', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/convert?calendar=ethiopian&date=2019-01-01');

  await page.getByRole('button', { name: 'Copy result' }).click();
  await expect(page.getByRole('status')).toHaveText('Result copied.');
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toContain('11 September 2026');
  expect(text).toContain('1 Meskerem 2019');
  expect(text).toContain('29 Rabi al-Awwal 1448');

  await page.getByRole('button', { name: 'Copy link' }).click();
  await expect(page.getByRole('status')).toHaveText('Link copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
    /\/convert\?calendar=ethiopian&date=2019-01-01$/,
  );
});

test('the converter works by keyboard alone', async ({ page }) => {
  await page.goto('/convert');
  await field(page).focus();
  await page.keyboard.type('12 April 2026');
  await page.keyboard.press('Enter');
  await expect(result(page, 'Ethiopian')).toContainText('4 Miyazia 2018');

  // Open the calendar from the keyboard, move a day, choose it.
  await page.getByRole('button', { name: 'Choose date' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(result(page, 'Ethiopian')).toContainText('5 Miyazia 2018');
});

test('the site navigation leads to the converter', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: 'Converter' }).click();
  await expect(page).toHaveURL(/\/convert$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Date converter');
});
