import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test('the popup opens and has no accessibility violations', async ({ context, extensionId }) => {
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Qen');
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  }
  expect(errors).toEqual([]);
});
