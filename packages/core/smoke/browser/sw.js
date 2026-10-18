// A module service worker: imports the built files directly (workers have no import maps).
import * as core from './dist/index.js';
import { am } from './dist/locales/am.js';
import { ethiopianHijriOverrides } from './dist/overrides/ethiopia.js';
import { run } from './checks.js';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('message', (event) => {
  let result;
  try {
    result = run(core, am, ethiopianHijriOverrides);
  } catch (e) {
    result = `error: ${e?.message ?? e}`;
  }
  event.source.postMessage(result);
});
