// Renders the extension's icons in public/icon/ from the website's icon (apps/web/src/app/icon.svg),
// so both products share one mark. WXT adds them to the manifest. Run after changing the icon:
// pnpm --filter @qen/extension icons
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const svg = readFileSync(new URL('../../web/src/app/icon.svg', import.meta.url), 'utf8');
const out = (name) =>
  new URL(`../public/icon/${name}`, import.meta.url).pathname.replace(/^\/(\w:)/, '$1');

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
// The 128 px icon is the store icon too: Chrome asks for 96 px of artwork in 16 px of padding.
for (const [size, art] of [
  [16, 16],
  [32, 32],
  [48, 48],
  [96, 96],
  [128, 96],
]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  const sized = svg.replace('<svg ', `<svg width="${art}" height="${art}" style="display:block" `);
  await page.setContent(
    `<body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center">${sized}</body>`,
  );
  await page.screenshot({ path: out(`${size}.png`), omitBackground: true });
  console.log('wrote', `icon/${size}.png`);
}
await browser.close();
