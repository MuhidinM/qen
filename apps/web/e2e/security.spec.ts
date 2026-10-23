import { expect, test } from '@playwright/test';
import { routes } from './routes';

// R-WEB-08: every route sends the security headers, and the CSP blocks nothing the site needs.
for (const route of routes) {
  test(`${route} sends the security headers`, async ({ request }) => {
    const headers = (await request.get(route)).headers();
    const csp = headers['content-security-policy'] ?? '';
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain('unsafe-eval');
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
    expect(csp).toMatch(/script-src 'self' 'nonce-[A-Za-z0-9+/=]+' 'strict-dynamic'/);
    expect(headers['strict-transport-security']).toContain('max-age=');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
    expect(headers['x-powered-by']).toBeUndefined();
  });

  test(`${route} loads and hydrates without CSP violations or console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(route, { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);
  });
}

test('each request gets a fresh CSP nonce', async ({ request }) => {
  const nonce = async () =>
    /'nonce-([^']+)'/.exec(
      (await request.get('/')).headers()['content-security-policy'] ?? '',
    )?.[1];
  const [first, second] = [await nonce(), await nonce()];
  expect(first).toBeTruthy();
  expect(first).not.toBe(second);
});
