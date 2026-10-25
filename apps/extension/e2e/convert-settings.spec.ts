import type { Page } from '@playwright/test';
import { expect, openPopup, test } from './fixtures';

// R-EXT-01: the popup's converter and settings. Settings live in storage.sync and apply to the
// whole popup; values computed with @qen/core, as on the website.
const row = (page: Page, name: string) =>
  page.getByRole('term').filter({ hasText: name }).locator('xpath=following-sibling::dd[1]');

test('the tabs follow the ARIA pattern', async ({ context, extensionId }) => {
  const page = await openPopup(context, extensionId);
  const today = page.getByRole('tab', { name: 'Today' });
  await expect(today).toHaveAttribute('aria-selected', 'true');
  await today.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Convert' })).toBeFocused();
  await expect(page.getByRole('tabpanel')).toHaveAccessibleName('Convert');
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('the converter reads typed text and shows all three calendars', async ({
  context,
  extensionId,
}) => {
  const page = await openPopup(context, extensionId);
  await page.getByRole('tab', { name: 'Convert' }).click();
  const field = page.getByRole('textbox', { name: 'Date' });
  await field.fill('1 Meskerem 2019');
  await field.press('Enter');
  await expect(row(page, 'Gregorian')).toContainText('Friday, 11 September 2026');
  await expect(row(page, 'Hijri')).toContainText('29 Rabi al-Awwal 1448');
  await expect(page.getByRole('list', { name: 'Holidays on this day' })).toContainText(
    'Enkutatash',
  );

  // Ambiguous text asks instead of guessing (ADR-0014).
  await field.fill('17/01/2019');
  await field.press('Enter');
  await expect(
    page.getByRole('group', { name: 'Which date did you mean?' }).getByRole('button'),
  ).toHaveCount(3);
});

test('settings persist and apply to the whole popup', async ({ context, extensionId }) => {
  const page = await openPopup(context, extensionId, '2026-10-23T12:00:00+03:00');
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('combobox', { name: 'Show dates in' }).selectOption('am');
  await page.getByRole('combobox', { name: 'Hijri dates' }).selectOption('tabular');
  await page.getByRole('checkbox', { name: /numerals/ }).check();
  await page.getByRole('combobox', { name: 'Convert from' }).selectOption('hijri');

  // A fresh popup, as after closing and reopening it.
  const again = await openPopup(context, extensionId, '2026-10-23T12:00:00+03:00');
  await expect(row(again, 'Ethiopian')).toContainText('ጥቅምት');
  await expect(row(again, 'Ethiopian')).toContainText('፲፫'); // 13, in Ge'ez numerals
  await again.getByRole('tab', { name: 'Convert' }).click();
  await expect(again.getByRole('radio', { name: 'Hijri' })).toBeChecked();
  await again.getByRole('tab', { name: 'Settings' }).click();
  await expect(again.getByRole('combobox', { name: 'Hijri dates' })).toHaveValue('tabular');
});
