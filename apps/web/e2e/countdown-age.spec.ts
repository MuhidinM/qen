import { expect, test, type Page } from '@playwright/test';

// R-WEB-06: countdowns and ages come from @qen/core (diff, age, addYears, holiday queries), so
// month-length edge cases follow its rules. "Today" is mocked; expected values were computed
// with @qen/core under the site's default Hijri dates (Umm al-Qura + Ethiopia's confirmations).
test.use({ timezoneId: 'Africa/Addis_Ababa', locale: 'en-GB' });

async function at(page: Page, isoTime: string, url: string) {
  await page.clock.install({ time: new Date(isoTime) });
  await page.goto(url);
}
const OCT_23 = '2026-10-23T12:00:00+03:00'; // 13 Tikimt 2019 EC, 12 Jumada al-Ula 1448 AH
const result = (page: Page) => page.getByRole('region', { name: 'Result' });

test.describe('countdown', () => {
  test('to the next Genna, from a shareable holiday link', async ({ page }) => {
    await at(page, OCT_23, '/countdown?holiday=genna');
    await expect(result(page)).toContainText('76 days');
    await expect(result(page)).toContainText('10 weeks and 6 days');
    await expect(result(page).getByRole('region', { name: 'Gregorian' })).toContainText(
      '7 January 2027',
    );
  });

  test('to a holiday chosen from the list, which updates the link', async ({ page }) => {
    await at(page, OCT_23, '/countdown');
    await page.getByRole('radio', { name: 'To a holiday' }).check();
    await page.getByRole('combobox', { name: 'Holiday' }).selectOption('fasika');
    await expect(result(page)).toContainText('191 days');
    await expect(page).toHaveURL(/\/countdown\?holiday=fasika$/);
  });

  test('to Ethiopian New Year 2020, which starts on 12 September after the leap year', async ({
    page,
  }) => {
    await at(page, OCT_23, '/countdown?calendar=ethiopian&date=2020-01-01');
    await expect(result(page)).toContainText('324 days');
    await expect(result(page).getByRole('region', { name: 'Gregorian' })).toContainText(
      '12 September 2027',
    );
  });

  test('a typed date counts down, and a past date counts up', async ({ page }) => {
    await at(page, OCT_23, '/countdown');
    const field = page.getByRole('textbox', { name: 'Date' });
    await field.fill('6 Pagume 2019');
    await field.press('Enter');
    await expect(result(page)).toContainText('323 days');
    await expect(page).toHaveURL(/calendar=ethiopian&date=2019-13-06/);

    await field.fill('1 January 2026');
    await field.press('Enter');
    await expect(result(page)).toContainText('295 days ago');
  });

  test('today is today', async ({ page }) => {
    await at(page, OCT_23, '/countdown?calendar=gregorian&date=2026-10-23');
    await expect(result(page)).toContainText('That’s today.');
  });
});

test.describe('age', () => {
  test('born on Pagume 6: in a year without it, the birthday is Pagume 5', async ({ page }) => {
    // 1 August 2026 is in 2018 EC, which is not a leap year.
    await at(page, '2026-08-01T12:00:00+03:00', '/age');
    await page.getByRole('radio', { name: 'Ethiopian' }).check();
    const field = page.getByRole('textbox', { name: 'Birth date' });
    await field.fill('6 Pagume 2011');
    await field.press('Enter');
    await expect(result(page)).toContainText('6 years, 11 months and 19 days');
    const birthday = page.getByRole('region', { name: 'Birthday this year' });
    await expect(birthday.getByRole('region', { name: 'Ethiopian' })).toContainText(
      '5 Pagume 2018',
    );
    await expect(birthday.getByRole('region', { name: 'Gregorian' })).toContainText(
      '10 September 2026',
    );
    await expect(birthday).toContainText('In 40 days.');
  });

  test('born on a Hijri 30th: in a 29-day month, the birthday is the 29th', async ({ page }) => {
    await at(page, OCT_23, '/age');
    await page.getByRole('radio', { name: 'Hijri' }).check();
    const field = page.getByRole('textbox', { name: 'Birth date' });
    await field.fill('30 Ramadan 1433');
    await field.press('Enter');
    await expect(result(page)).toContainText('14 years, 7 months and 12 days');
    const birthday = page.getByRole('region', { name: 'Birthday this year' });
    await expect(birthday.getByRole('region', { name: 'Hijri' })).toContainText('29 Ramadan 1448');
    await expect(birthday.getByRole('region', { name: 'Gregorian' })).toContainText('8 March 2027');
    await expect(birthday.getByRole('region', { name: 'Ethiopian' })).toContainText(
      '29 Yekatit 2019',
    );
  });

  test('a birth date in the future is explained, and the birth date stays out of the URL', async ({
    page,
  }) => {
    await at(page, OCT_23, '/age');
    const field = page.getByRole('textbox', { name: 'Birth date' });
    await field.fill('1 January 2030');
    await field.press('Enter');
    await expect(page.getByRole('main').getByRole('alert')).toContainText('after today');
    await expect(page).toHaveURL(/\/age$/);
  });
});

test('the site navigation leads to both pages', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: 'Countdown' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Countdown');
  await page.getByRole('navigation').getByRole('link', { name: 'Age' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Age calculator');
});
