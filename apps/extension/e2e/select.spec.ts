import AxeBuilder from '@axe-core/playwright';
import type { BrowserContext, Page } from '@playwright/test';
import { expect, test } from './fixtures';

// A page with the strictest CSP: no styles, scripts or anything else of its own. The tooltip
// must still show and be styled (R-EXT-02).
const PAGE = 'http://qen.test/article';
const HTML = `<!doctype html><html lang="en"><head><title>Strict page</title></head><body>
<p id="date">The meeting is on 12 April 2026 at noon.</p>
<p id="ambiguous">Due 17/01/2019, please.</p>
<p id="none">Nothing to see here.</p>
<label>Notes <input id="field" value="Born 1 Meskerem 2019 in Addis"></label>
</body></html>`;

async function strictPage(context: BrowserContext) {
  await context.route(`${PAGE}*`, (route) =>
    route.fulfill({
      contentType: 'text/html',
      headers: { 'content-security-policy': "default-src 'none'" },
      body: HTML,
    }),
  );
  const page = await context.newPage();
  const violations: string[] = [];
  page.on(
    'console',
    (m) => m.text().includes('Content Security Policy') && violations.push(m.text()),
  );
  await page.goto(PAGE);
  return { page, violations };
}

/** Selects `text` inside the element with `id`, as a reader would with the mouse. */
async function select(page: Page, id: string, text: string) {
  await page.evaluate(
    ([id, text]) => {
      const node = document.getElementById(id)?.firstChild;
      const selection = getSelection();
      if (!node?.textContent || !selection) throw new Error(`#${id} has no text`);
      const start = node.textContent.indexOf(text);
      const range = document.createRange();
      range.setStart(node, start);
      range.setEnd(node, start + text.length);
      selection.removeAllRanges();
      selection.addRange(range);
    },
    [id, text] as const,
  );
}

/** What the context menu and the shortcut do: the background's handler, for the test page's tab. */
async function convert(context: BrowserContext) {
  const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
  await worker.evaluate(async (url) => {
    type Api = { tabs: { query(q: { url: string }): Promise<{ id: number }[]> } };
    const { tabs } = (globalThis as unknown as { chrome: Api }).chrome;
    const [tab] = await tabs.query({ url });
    const run = (globalThis as unknown as { qenConvertInTab(id: number): Promise<void> })
      .qenConvertInTab;
    if (!tab) throw new Error(`no tab at ${url}`);
    await run(tab.id);
  }, `${PAGE}*`);
}

const tooltip = (page: Page) => page.getByRole('dialog', { name: 'Qen: converted date' });

test('converts a selected date in all three calendars, on a page with a strict CSP', async ({
  context,
}) => {
  const { page, violations } = await strictPage(context);
  await select(page, 'date', '12 April 2026');
  await convert(context);

  await expect(tooltip(page)).toContainText('Sunday, 12 April 2026 AD');
  await expect(tooltip(page)).toContainText('Sunday, 4 Miyazia 2018 EC');
  await expect(tooltip(page)).toContainText('AH');
  await expect(tooltip(page)).toBeFocused();
  // Styled despite default-src 'none': constructable stylesheets aren't subject to the page's CSP.
  await expect(tooltip(page)).toHaveCSS('position', 'fixed');
  expect(violations).toEqual([]);

  const axe = await new AxeBuilder({ page }).include('#qen-tooltip-host').analyze();
  expect(axe.violations).toEqual([]);

  await page.keyboard.press('Escape');
  await expect(tooltip(page)).toHaveCount(0);
});

test('lists every reading of ambiguous text, and says when nothing is a date', async ({
  context,
}) => {
  const { page } = await strictPage(context);
  await select(page, 'ambiguous', '17/01/2019');
  await convert(context);
  await expect(tooltip(page)).toContainText('This could be any of:');
  await expect(tooltip(page).getByRole('listitem')).toHaveCount(3);
  await tooltip(page).getByRole('button', { name: 'Close' }).click();
  await expect(tooltip(page)).toHaveCount(0);

  await select(page, 'none', 'Nothing to see');
  await convert(context);
  await expect(tooltip(page)).toContainText('couldn’t read a date');
});

test('reads a date selected inside a form field, in the language chosen in settings', async ({
  context,
  extensionId,
}) => {
  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await popup.getByRole('tab', { name: 'Settings' }).click();
  await popup.getByLabel('Show dates in').selectOption('ar');
  await popup.close();

  const { page } = await strictPage(context);
  await page.locator('#field').focus();
  await page.evaluate(() => {
    const field = document.getElementById('field') as HTMLInputElement;
    const start = field.value.indexOf('1 Meskerem 2019');
    field.setSelectionRange(start, start + '1 Meskerem 2019'.length);
  });
  await convert(context);
  const dates = page.locator('#qen-tooltip-host .qen-tooltip__dates');
  await expect(dates).toHaveAttribute('dir', 'rtl');
  await expect(dates).toHaveAttribute('lang', 'ar');
  await page.keyboard.press('Escape');
  await expect(page.locator('#field')).toBeFocused();
});

test('does nothing when no text is selected', async ({ context }) => {
  const { page } = await strictPage(context);
  await convert(context);
  await expect(page.locator('#qen-tooltip-host')).toHaveCount(0);
});

test('sits just below the selection on a page that zooms itself with CSS (#178)', async ({
  context,
}) => {
  const { page } = await strictPage(context);
  // The strict CSP blocks <style>, so zoom through the CSSOM, as a page's own script would.
  await page.evaluate(() => {
    document.documentElement.style.zoom = '1.6';
  });
  await select(page, 'date', '12 April 2026');
  await convert(context);
  await expect(tooltip(page)).toBeVisible();
  const [selection, box, width] = await page.evaluate(() => {
    const dialog = document
      .getElementById('qen-tooltip-host')
      ?.shadowRoot?.querySelector('[role="dialog"]');
    return [
      getSelection()?.getRangeAt(0).getBoundingClientRect().toJSON(),
      dialog?.getBoundingClientRect().toJSON(),
      innerWidth,
    ] as const;
  });
  expect(box.top - selection.bottom).toBeGreaterThanOrEqual(0);
  expect(box.top - selection.bottom).toBeLessThan(24);
  expect(Math.abs(box.left - selection.left)).toBeLessThan(24);
  expect(box.right).toBeLessThanOrEqual(width);
});
