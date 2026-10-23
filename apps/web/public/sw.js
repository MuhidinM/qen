// Qen service worker (R-WEB-03; ADR-0016 amendment: hand-written, no build plugin).
//
// Pages render per request (nonce CSP), so there is no build-time list of pages to precache.
// Instead, at install it fetches the main pages and the static assets they reference; while
// online, pages are network-first (the cache is refreshed on each visit) and hashed assets are
// cache-first. A cached page keeps its own response headers, so its CSP nonce still matches
// its own scripts when served offline.
//
// Registered as /sw.js?v=<build>: every deploy is a new version, which waits until the page
// asks it to take over (the visitor clicks Reload).

const VERSION = new URL(self.location.href).searchParams.get('v') ?? 'dev';
const PAGES = `qen-pages-${VERSION}`;
const ASSETS = `qen-assets-${VERSION}`;
const SHELL = ['/', '/convert', '/calendar', '/offline'];
const OFFLINE = '/offline';

/** Static asset URLs referenced by a page's HTML (scripts, styles, fonts, icons). */
function assetUrls(html) {
  const urls = new Set();
  for (const match of html.matchAll(/(?:src|href)="(\/(?:_next\/static|icon)[^"]*)"/g)) {
    urls.add(match[1].replaceAll('&amp;', '&'));
  }
  return [...urls];
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGES);
      const assets = await caches.open(ASSETS);
      for (const path of SHELL) {
        const response = await fetch(path, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Precache failed for ${path}: ${response.status}`);
        await pages.put(path, response.clone());
        await assets.addAll(assetUrls(await response.text()));
      }
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith('qen-') && key !== PAGES && key !== ASSETS) await caches.delete(key);
      }
      // The first worker takes control at once, so offline works after a single visit.
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

async function networkFirstPage(request) {
  const url = new URL(request.url);
  const pages = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    // Keep the latest copy of each page, but not one per query string.
    if (response.ok && url.search === '') await pages.put(url.pathname, response.clone());
    return response;
  } catch {
    // Offline: the page as last seen (its shell reads the query string on the client).
    return (await pages.match(url.pathname)) ?? (await pages.match(OFFLINE)) ?? Response.error();
  }
}

async function cacheFirstAsset(request) {
  const assets = await caches.open(ASSETS);
  const cached = await assets.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await assets.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstPage(request));
  } else if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icon')) {
    event.respondWith(cacheFirstAsset(request));
  }
});
