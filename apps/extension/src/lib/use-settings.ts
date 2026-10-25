import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { loadSettings, sanitize, SETTINGS_KEY, type Settings } from './settings';

// Apart from settings.ts so the injected tooltip script doesn't bundle React.

/**
 * The settings, kept in sync with storage (so the popup, the tooltip and the overlay agree),
 * and a function to change some of them. Null until loaded.
 */
export function useSettings(): [Settings | null, (patch: Partial<Settings>) => void] {
  const [settings, setSettings] = useState<Settings | null>(null);
  useEffect(() => {
    let live = true;
    void loadSettings().then((s) => live && setSettings(s));
    const onChanged = (changes: Record<string, { newValue?: unknown }>, area: string) => {
      if (area === 'sync' && SETTINGS_KEY in changes)
        setSettings(sanitize(changes[SETTINGS_KEY]?.newValue));
    };
    browser.storage.onChanged.addListener(onChanged);
    return () => {
      live = false;
      browser.storage.onChanged.removeListener(onChanged);
    };
  }, []);
  const update = (patch: Partial<Settings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    void browser.storage.sync.set({ [SETTINGS_KEY]: next });
  };
  return [settings, update];
}
