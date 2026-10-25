import { readFileSync } from 'node:fs';
import type { BrowserContext, Page } from '@playwright/test';
import { expect, openPopup, test } from '../e2e/fixtures';

// Renders the listing images into store/images/: 1280 × 800 screenshots (both stores accept
// them) and Chrome's 440 × 280 small promo tile. Run: pnpm --filter @qen/extension store:screenshots
// The Google Calendar overlay is shot by hand on a real calendar (store/listing.md).

const out = (name: string) =>
  new URL(`./images/${name}`, import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
// Ethiopian New Year 2019, mid-morning in Addis Ababa.
const TIME = '2026-09-11T10:00:00+03:00';
const THEME = {
  light: { bg: 'hsl(214 100% 97%)', title: 'hsl(222 75% 22%)', text: 'hsl(212 25% 30%)' },
  dark: { bg: 'hsl(222 47% 13%)', title: 'hsl(210 40% 98%)', text: 'hsl(210 31% 80%)' },
};

/** The popup, enlarged for the listing, as a PNG. */
async function popupImage(page: Page, scheme: 'light' | 'dark') {
  await page.emulateMedia({ colorScheme: scheme });
  await page.setViewportSize({ width: 540, height: 900 });
  await page.evaluate(() => {
    document.body.style.zoom = '1.5';
  });
  return page.locator('body').screenshot();
}

/** A 1280 × 800 slide: a headline on the left, the image on the right. */
async function slide(
  context: BrowserContext,
  name: string,
  scheme: 'light' | 'dark',
  copy: { title: string; text: string },
  image: Buffer,
) {
  const t = THEME[scheme];
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.setContent(`<body style="margin:0;width:1280px;height:800px;box-sizing:border-box;
    display:grid;grid-template-columns:1fr auto;align-items:center;gap:64px;padding:0 96px;
    background:${t.bg};font-family:system-ui,'Segoe UI',Roboto,sans-serif">
    <div><h1 style="margin:0 0 24px;font-size:48px;line-height:1.15;font-weight:700;color:${t.title}">${copy.title}</h1>
    <p style="margin:0;font-size:24px;line-height:1.5;color:${t.text}">${copy.text}</p></div>
    <img alt="" style="display:block;max-height:720px;border-radius:12px;box-shadow:0 20px 40px hsla(0,0%,0%,0.25)"
      src="data:image/png;base64,${image.toString('base64')}"></body>`);
  await page.screenshot({ path: out(name) });
  await page.close();
}

test('popup: today', async ({ context, extensionId }) => {
  const page = await openPopup(context, extensionId, TIME);
  await expect(page.getByRole('tabpanel')).toContainText('Meskerem');
  await slide(
    context,
    '1-today.png',
    'light',
    {
      title: 'Today in three calendars',
      text: 'Ethiopian, Gregorian and Hijri dates, Ethiopian time and the next holidays, one click away.',
    },
    await popupImage(page, 'light'),
  );
});

test('popup: converter', async ({ context, extensionId }) => {
  const page = await openPopup(context, extensionId, TIME);
  await page.getByRole('tab', { name: 'Convert' }).click();
  const field = page.getByRole('textbox', { name: 'Date' });
  await field.fill('7 January 2027');
  await field.press('Enter');
  await expect(page.getByRole('list', { name: 'Holidays on this day' })).toBeVisible();
  await slide(
    context,
    '2-convert.png',
    'dark',
    {
      title: 'Convert any date',
      text: 'Type or paste a date in any calendar and see it in the other two, with its holidays.',
    },
    await popupImage(page, 'dark'),
  );
});

test.describe('selected text', () => {
  // 800 × 500 CSS pixels at 1.6 gives a 1280 × 800 image with the tooltip large enough to read.
  test.use({ scale: 1.6 });

  test('tooltip', async ({ context }) => {
    await context.route('http://qen.test/**', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: `<!doctype html><html lang="en"><body style="margin:0;background:#fff;color:hsl(212 35% 15%);
        font:20px/1.7 Georgia,serif"><main style="max-width:640px;margin:40px auto;padding:0 24px">
        <h1 style="font:700 32px/1.2 system-ui,sans-serif;margin:0 0 32px">Community calendar</h1>
        <p>The cultural evening is planned for <span id="d">8 April 2027</span>, in the main hall.
        Doors open at six, and families are welcome. Bring a dish to share if you can.</p>
        <p>Registration closes two weeks before. Volunteers are still needed for set-up.</p>
        </main></body></html>`,
      }),
    );
    const page = await context.newPage();
    await page.setViewportSize({ width: 800, height: 500 });
    await page.goto('http://qen.test/events');
    await page.evaluate(() => {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('d') as HTMLElement);
      getSelection()?.addRange(range);
    });
    const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    await worker.evaluate(async () => {
      type Api = { tabs: { query(q: { url: string }): Promise<{ id: number }[]> } };
      const { tabs } = (globalThis as unknown as { chrome: Api }).chrome;
      const [tab] = await tabs.query({ url: 'http://qen.test/*' });
      const run = (globalThis as unknown as { qenConvertInTab(id: number): Promise<void> })
        .qenConvertInTab;
      await run(tab?.id ?? -1);
    });
    await expect(page.getByRole('dialog', { name: 'Qen: converted date' })).toBeVisible();
    await page.screenshot({ path: out('3-tooltip.png') });
  });
});

test('popup: in Amharic', async ({ context, extensionId }) => {
  const page = await openPopup(context, extensionId, TIME);
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByLabel('Show dates in').selectOption('am');
  await page.getByRole('tab', { name: 'Today' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('መስከረም');
  await slide(
    context,
    '4-amharic.png',
    'light',
    {
      title: 'In your language',
      text: 'Dates in Amharic, Afaan Oromoo, Tigrinya, Arabic or English, with Ge’ez numerals if you like.',
    },
    await popupImage(page, 'light'),
  );
});

test('small promo tile', async ({ context }) => {
  const icon = readFileSync(new URL('../public/icon/128.png', import.meta.url));
  const page = await context.newPage();
  await page.setViewportSize({ width: 440, height: 280 });
  await page.setContent(`<body style="margin:0;width:440px;height:280px;display:grid;place-items:center;
    background:hsl(222 47% 13%);font-family:system-ui,'Segoe UI',Roboto,sans-serif;color:#fff;text-align:center">
    <div><img alt="" width="128" height="128" style="display:block;margin:0 auto"
      src="data:image/png;base64,${icon.toString('base64')}">
    <div style="font-size:36px;font-weight:700;line-height:1.2">Qen ቀን</div>
    <div style="font-size:18px;line-height:1.5">Ethiopian · Hijri · Gregorian</div></div></body>`);
  await page.screenshot({ path: out('promo-small-440x280.png') });
});
