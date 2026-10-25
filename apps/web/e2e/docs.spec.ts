import { expect, test, type Locator, type Page } from '@playwright/test';
import { DOCS_PAGES } from '../src/lib/docs';

// R-WEB-04: docs with live, editable examples. Examples run in a sandboxed iframe (opaque
// origin, its own CSP with 'unsafe-eval'); the docs pages keep the strict nonce policy.

const examples = (page: Page) => page.locator('[data-live-example]');
const output = (example: Locator) => example.frameLocator('iframe').getByLabel('Output');

/** Scrolls each (lazy) example into view and waits until it has run. */
async function runAll(page: Page) {
  const all = examples(page);
  const count = await all.count();
  for (let i = 0; i < count; i++) {
    await all.nth(i).scrollIntoViewIfNeeded();
    await expect(all.nth(i)).toHaveAttribute('data-status', /^(ok|error)$/, { timeout: 15_000 });
  }
  return count;
}

for (const { href, title } of DOCS_PAGES) {
  test(`every example on “${title}” runs without errors`, async ({ page }) => {
    // Frames are created as each example is scrolled to, so the API pages' ~40 examples load
    // one after another.
    test.slow();
    await page.goto(href);
    const count = await runAll(page);
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(examples(page).nth(i), `example ${i + 1}`).toHaveAttribute('data-status', 'ok');
    }
  });
}

test('examples show the values the core README asserts', async ({ page }) => {
  await page.goto('/docs');
  await runAll(page);
  await expect(output(examples(page).first())).toHaveText(
    "{ calendar: 'gregorian', year: 2026, month: 9, day: 27 }\n{ calendar: 'hijri', year: 1448, month: 4, day: 16 }",
  );

  await page.goto('/docs/formatting');
  await runAll(page);
  await expect(output(examples(page).first())).toContainText("'መስከረም ፲፯ ፳፻፲፱'");
});

test('editing an example re-runs it, errors are reported, and Reset restores it', async ({
  page,
}) => {
  await page.goto('/docs');
  await runAll(page);
  const example = examples(page).first();
  const editor = example.getByRole('textbox');

  await editor.fill("import { toGeezNumeral } from '@qen/core';\nshow(toGeezNumeral(2019));");
  await expect(output(example)).toHaveText("'፳፻፲፱'");

  await editor.fill('show(notDefined);');
  await expect(example).toHaveAttribute('data-status', 'error');
  await expect(example.getByRole('status')).toContainText('notDefined is not defined');

  await example.getByRole('button', { name: 'Reset' }).click();
  await expect(example).toHaveAttribute('data-status', 'ok');
});

test('React examples render components inside the sandbox', async ({ page }) => {
  await page.goto('/docs/react');
  await runAll(page);
  const frame = examples(page).nth(1).frameLocator('iframe');
  await expect(frame.getByRole('grid', { name: 'Meskerem 2019' })).toBeVisible();
});

test('the sandbox is isolated: no cookies, no access to the page', async ({ page }) => {
  await page.goto('/docs');
  await runAll(page);
  const example = examples(page).first();
  await example
    .getByRole('textbox')
    .fill(
      [
        'try { show(document.cookie); } catch (e) { show(e.name); }',
        'try { show(window.parent.location.href); } catch (e) { show(e.name); }',
      ].join('\n'),
    );
  await expect(output(example)).toHaveText("'SecurityError'\n'SecurityError'");
  await expect(example.locator('iframe')).toHaveAttribute('sandbox', 'allow-scripts');
});

test('when the result frame is blocked, the example says so instead of spinning', async ({
  page,
}) => {
  // As a content blocker or a browser policy would.
  await page.route('**/sandbox/**', (route) => route.abort('blockedbyclient'));
  await page.clock.install();
  await page.goto('/docs');
  const example = examples(page).first();
  await example.scrollIntoViewIfNeeded();
  // The visibility callback may land after a clock jump, so keep advancing until it reports.
  await expect(async () => {
    await page.clock.runFor(11_000);
    await expect(example).toHaveAttribute('data-status', 'error', { timeout: 500 });
  }).toPass();
  await expect(example.getByRole('status')).toContainText('did not load');
});

test('only the sandbox may evaluate code', async ({ request }) => {
  const sandbox = (await request.get('/sandbox/index.html')).headers();
  expect(sandbox['content-security-policy']).toContain("'unsafe-eval'");
  expect(sandbox['content-security-policy']).toContain("frame-ancestors 'self'");
  expect(sandbox['x-frame-options']).toBe('SAMEORIGIN');

  const docs = (await request.get('/docs')).headers();
  expect(docs['content-security-policy']).not.toContain('unsafe-eval');
  expect(docs['content-security-policy']).toContain("'nonce-");
});

test('the API reference has an entry per export, with signature, links and a live example', async ({
  page,
}) => {
  await page.goto('/docs/api/core');
  const entry = page.getByRole('region', { name: 'toGeezNumeral function', exact: true });
  await expect(entry).toContainText('function toGeezNumeral(n: number): string;');
  const example = entry.locator('[data-live-example]');
  await example.scrollIntoViewIfNeeded();
  await expect(example).toHaveAttribute('data-status', 'ok');
  await expect(output(example)).toContainText("'፳፻፲፱'");

  // {@link InvalidDateError} in date()'s "Throws" links to that entry.
  await page
    .getByRole('region', { name: 'date function', exact: true })
    .getByRole('link', { name: 'InvalidDateError' })
    .click();
  await expect(page).toHaveURL(/\/docs\/api\/core#InvalidDateError$/);

  // A React component's example renders it.
  await page.goto('/docs/api/react#YearView');
  const year = page
    .getByRole('region', { name: 'YearView function' })
    .locator('[data-live-example]');
  await year.scrollIntoViewIfNeeded();
  await expect(year.frameLocator('iframe').getByRole('heading', { name: '2019' })).toBeVisible();
});

test('example frames are only created as you scroll to them', async ({ page }) => {
  // Each sandboxed frame downloads and runs the sandbox on its own (no shared cache across
  // opaque origins), so a page must not create them all on load.
  await page.goto('/docs/api/core');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('[data-live-example] iframe')).toHaveCount(0);

  const example = page
    .getByRole('region', { name: 'toGeezNumeral function', exact: true })
    .locator('[data-live-example]');
  await example.scrollIntoViewIfNeeded();
  await expect(example.locator('iframe')).toHaveCount(1);
  await expect(example).toHaveAttribute('data-status', 'ok');
});

test('search finds guides and exports and goes to them', async ({ page }) => {
  await page.goto('/docs');
  const search = page.getByRole('searchbox', { name: 'Search the docs' });
  await search.fill('geez');
  const results = page.getByRole('list', { name: 'Search results' });
  await expect(results.getByRole('link', { name: /toGeezNumeral/ })).toBeVisible();
  await expect(
    results.getByRole('link', { name: /Ge’ez numerals and Ethiopian time/ }),
  ).toBeVisible();
  await results.getByRole('link', { name: /toGeezNumeral/ }).click();
  await expect(page).toHaveURL(/\/docs\/api\/core#toGeezNumeral$/);

  await search.fill('zzzz');
  await expect(page.getByText('No matches.')).toBeVisible();
});

test('code blocks can be copied', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs');
  await page.getByRole('button', { name: 'Copy' }).first().click();
  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'npm install @qen/core',
  );
});

test('the docs navigation lists every page and the header links the docs', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Docs' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Getting started');
  await expect(page.getByRole('navigation', { name: 'Docs' }).getByRole('link')).toHaveCount(
    DOCS_PAGES.length,
  );
});
