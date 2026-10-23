import { expect, type Page } from '@playwright/test';
import routeList from './routes.json' with { type: 'json' };

/** Every route the site serves (routes.json, shared with Lighthouse CI), so every check covers each page. */
export const routes: readonly string[] = routeList;

/**
 * Parts that depend on the visitor's clock render on the client and carry `aria-busy="true"`
 * until then; checks that inspect the page wait for them, so they see the real content.
 */
export async function gotoReady(page: Page, route: string): Promise<void> {
  await page.goto(route);
  await expect(page.locator('main [aria-busy="true"]')).toHaveCount(0);
}
