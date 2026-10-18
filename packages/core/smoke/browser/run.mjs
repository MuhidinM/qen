// Loads the built @qen/core in real browsers, on a page and in a module service worker.
// Usage (from packages/core, after a build): node smoke/browser/run.mjs [chromium firefox webkit]
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as playwright from 'playwright';

const here = fileURLToPath(new URL('.', import.meta.url));
const dist = fileURLToPath(new URL('../../dist/', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.map': 'application/json' };

// Serves this folder at / and the build at /dist/.
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = path.startsWith('/dist/')
    ? join(dist, path.slice('/dist/'.length))
    : join(here, path === '/' ? 'index.html' : path);
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': `${types[extname(file)] ?? 'text/plain'}; charset=utf-8`,
    });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}/`;

const names = process.argv.length > 2 ? process.argv.slice(2) : ['chromium', 'firefox', 'webkit'];
let failed = false;
for (const name of names) {
  const browser = await playwright[name].launch();
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(url);
    const result = await page.waitForFunction(() => globalThis.smoke, null, { timeout: 15_000 });
    const { page: onPage, worker } = await result.jsonValue();
    const version = browser.version();
    const ok = onPage === 'ok' && worker === 'ok' && errors.length === 0;
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${name} ${version}: page ${onPage}, service worker ${worker}`,
    );
    for (const e of errors) console.log(`     page error: ${e}`);
    if (!ok) failed = true;
  } finally {
    await browser.close();
  }
}
server.close();
process.exit(failed ? 1 : 0);
