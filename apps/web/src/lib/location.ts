'use client';

import { useSyncExternalStore } from 'react';

/**
 * The address bar's query string as a synchronous store. Next's `useSearchParams` catches up
 * with `history.pushState` asynchronously, so a controlled input that reads it snaps back for
 * a moment after each click; reading `location.search` directly does not.
 */
const NAVIGATE = 'qen:navigate';

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  window.addEventListener(NAVIGATE, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(NAVIGATE, onChange);
  };
}

export function useSearch(serverSearch: string): URLSearchParams {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => serverSearch,
  );
  return new URLSearchParams(search);
}

/** Adds a history entry (so back/forward work) and tells `useSearch` readers at once. */
export function navigate(url: string): void {
  window.history.pushState(null, '', url);
  window.dispatchEvent(new Event(NAVIGATE));
}
