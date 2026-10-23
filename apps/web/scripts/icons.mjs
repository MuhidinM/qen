// Renders the install icons in public/ from src/app/icon.svg with the installed Chrome.
// Run after changing the icon: pnpm --filter @qen/web icons
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const svg = readFileSync(new URL('../src/app/icon.svg', import.meta.url), 'utf8');
const out = (name) =>
  new URL(`../public/${name}`, import.meta.url).pathname.replace(/^\/(\w:)/, '$1');

// "any": the glyph alone on a transparent square. "maskable": the glyph inside the central
// 80% safe zone on a full-bleed background, since launchers crop to circles and squircles.
const pages = [
  { name: 'icon-192.png', size: 192, html: `<body style="margin:0">${sized(svg, 192)}</body>` },
  { name: 'icon-512.png', size: 512, html: `<body style="margin:0">${sized(svg, 512)}</body>` },
  {
    name: 'icon-maskable-512.png',
    size: 512,
    html: `<body style="margin:0;width:512px;height:512px;display:grid;place-items:center;background:#ffffff">${sized(svg, 320)}</body>`,
  },
];

function sized(source, px) {
  return source.replace('<svg ', `<svg width="${px}" height="${px}" style="display:block" `);
}

const browser = await chromium.launch({ channel: 'chrome' });
for (const p of pages) {
  const page = await browser.newPage({ viewport: { width: p.size, height: p.size } });
  await page.setContent(p.html);
  await page.screenshot({ path: out(p.name), omitBackground: !p.name.includes('maskable') });
  console.log('wrote', p.name);
}
await browser.close();
