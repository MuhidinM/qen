import { annotate, clear } from '@/lib/gcal';
import { loadSettings, sanitize, SETTINGS_KEY, type Settings } from '@/lib/settings';
import './style.css';

// Google Calendar overlay (R-EXT-03): Ethiopian and Hijri days under Google's day numbers.
// Google re-renders on every navigation, so a MutationObserver re-runs annotate(), which
// only touches badges that are missing or out of date. Any failure leaves the page as it was.
export default defineContentScript({
  matches: ['https://calendar.google.com/*'],
  runAt: 'document_idle',
  async main(ctx) {
    let settings: Settings = await loadSettings();
    let queued = false;
    const run = () => {
      queued = false;
      try {
        annotate(document, settings);
      } catch {
        // Google changed something we rely on; show nothing rather than break the page.
      }
    };
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(run);
    };

    const observer = new MutationObserver(queue);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-datekey'],
    });
    const onChanged = (changes: Record<string, { newValue?: unknown }>, area: string) => {
      if (area !== 'sync' || !(SETTINGS_KEY in changes)) return;
      settings = sanitize(changes[SETTINGS_KEY]?.newValue);
      clear(document);
      queue();
    };
    browser.storage.onChanged.addListener(onChanged);
    ctx.onInvalidated(() => {
      observer.disconnect();
      browser.storage.onChanged.removeListener(onChanged);
      clear(document);
    });
    queue();
  },
});
