import { browser } from 'wxt/browser';

/** The context-menu item and keyboard command that convert the selected text (#168). */
export const MENU_ID = 'qen-convert-selection';
export const COMMAND = 'convert-selection';

/**
 * Shows the converted selection in a tab, by injecting the tooltip script. Runs only on the
 * user's request: activeTab grants access to that tab for this one gesture (N-035).
 * Pages the browser keeps extensions out of (the store, settings pages) are skipped quietly.
 */
export async function convertInTab(tabId: number, frameId?: number): Promise<void> {
  try {
    await browser.scripting.executeScript({
      target: { tabId, ...(frameId ? { frameIds: [frameId] } : {}) },
      files: ['/tooltip.js'],
    });
  } catch {
    // No access to this page; nothing to show.
  }
}
