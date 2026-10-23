'use client';

import { useSyncExternalStore } from 'react';

/**
 * The clock, read on each new minute and when the tab becomes visible again. The server
 * snapshot is null: the server can't know the visitor's time zone (and so their Ethiopian or
 * Hijri day), so date-dependent parts render a stable placeholder there and fill in on the
 * client, with no hydration mismatch.
 */
function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    timer = setTimeout(
      () => {
        onChange();
        schedule();
      },
      60_000 - (Date.now() % 60_000),
    );
  };
  schedule();
  document.addEventListener('visibilitychange', onChange);
  return () => {
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', onChange);
  };
}
const minuteNow = () => Math.floor(Date.now() / 60_000) * 60_000;
const noClockOnServer = () => null;

/** The current minute as a timestamp, or null while rendering on the server. */
export function useMinuteClock(): number | null {
  return useSyncExternalStore(subscribe, minuteNow, noClockOnServer);
}
