import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { gotoReady, routes } from './routes';

type Result = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'][number];

/**
 * Violations as readable strings, minus one reviewed exception (spec note N-034): a month-grid
 * day cell shows its number plus the other calendars' numbers ("1 11 29"), while its name
 * reads "Friday, 1 Meskerem 2019, 11 September 2026, 29 Rabi al-Awwal 1448". The cell's label,
 * its own day number, is in the name; the other numbers are supplementary content, so
 * label-content-name-mismatch on those cells is accepted. Anywhere else it still fails.
 */
function unexplained(v: Result): string[] {
  const nodes =
    v.id === 'label-content-name-mismatch'
      ? v.nodes.filter((n) => !n.html.includes('class="qen-calendar__day'))
      : v.nodes;
  return nodes.length > 0 ? [`${v.id}: ${v.help}`] : [];
}

// R-A11Y-01, R-A11Y-02: WCAG 2.2 AA in light and dark, at 320 px and desktop (projects).
for (const route of routes) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`${route} has no axe violations (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await gotoReady(page, route);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(violations.flatMap(unexplained)).toEqual([]);
    });
  }

  test(`${route} fits the viewport without horizontal scrolling`, async ({ page }) => {
    await gotoReady(page, route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

test('the skip link is the first tab stop and moves focus to the main content', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});
