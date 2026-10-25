import { COMMAND, MENU_ID, convertInTab } from '@/lib/convert-selection';

// The background service worker: select-to-convert's context menu and keyboard command.
export default defineBackground(() => {
  // Created on install and on every browser start: Chrome keeps menus between restarts, but
  // not every browser does for event pages. removeAll() first so there's never a duplicate.
  const createMenu = async () => {
    await browser.contextMenus.removeAll();
    browser.contextMenus.create({
      id: MENU_ID,
      title: 'Convert date with Qen',
      contexts: ['selection'],
    });
  };
  browser.runtime.onInstalled.addListener(() => void createMenu());
  browser.runtime.onStartup.addListener(() => void createMenu());
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === MENU_ID && tab?.id !== undefined)
      void convertInTab(tab.id, info.frameId);
  });
  browser.commands.onCommand.addListener((command, tab) => {
    if (command === COMMAND && tab?.id !== undefined) void convertInTab(tab.id);
  });
  // e2e builds only: tests can't click a native context menu, so they call the same handler.
  if (import.meta.env.MODE === 'e2e') Object.assign(globalThis, { qenConvertInTab: convertInTab });
});
