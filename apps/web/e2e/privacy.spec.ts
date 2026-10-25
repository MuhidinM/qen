import { expect, test } from '@playwright/test';

// R-EXT-04: the privacy policy the extension stores link to, reachable from every page.
test('the privacy page is linked from the footer and explains each extension permission', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy');
  const permissions = page.getByRole('table').getByRole('row');
  await expect(permissions).toHaveCount(5);
  for (const name of ['Storage', 'Active tab, scripting', 'Context menus', 'calendar.google.com']) {
    await expect(page.getByRole('cell', { name, exact: true })).toBeVisible();
  }
});
