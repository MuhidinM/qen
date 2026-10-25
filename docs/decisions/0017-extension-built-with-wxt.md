# ADR-0017 · Browser extension: WXT, Manifest V3, minimum permissions

**Status:** accepted · 2026-10-25

## Context

The browser extension (M8, `apps/extension`) needs a popup (today, converter, upcoming holidays, settings), select-to-convert, and an overlay on Google Calendar, published to the Chrome Web Store and Firefox Add-ons (R-EXT-01 to R-EXT-05). PLAN.md asks for the minimum permissions and no data leaving the browser except the Hijri override feed (R-EXT-04). The UI reuses `@qen/core` and `@qen/react`, so the build must bundle a React popup, a content script and a background service worker, for Chrome (Manifest V3) and Firefox (which still differs in places, such as the background script).

## Decision

- **Build tool: WXT** (Vite-based). One codebase produces the Chrome MV3 and Firefox builds; the manifest is generated from the entry points, with per-browser differences declared in one config; `wxt zip` produces the store uploads. Entry points are plain files (`entrypoints/popup`, `entrypoints/background.ts`, `entrypoints/*.content.ts`).
- **Permissions, by default:** `storage` (settings), `activeTab`, `contextMenus` and `scripting` (select-to-convert on request, N-035), and a host permission for `https://calendar.google.com/*` only (the overlay). No `<all_urls>`, no `tabs`, no remote code.
- **Select-to-convert is on request** (owner, N-035): select text, then the context menu item or a keyboard shortcut converts it in a tooltip, using `activeTab`. Automatic tooltips on every site are a later, opt-in optional permission. Tests can't click a native context menu or grant `activeTab`, so e2e runs an e2e build (`wxt build --mode e2e`, in `.output/*-e2e`) that adds only the test page's host (`http://qen.test/*`) and exposes the menu's handler to the service worker; store builds contain neither, and `e2e/manifest.spec.ts` checks the store builds.
- **Data:** settings in `chrome.storage.sync`; no analytics. Until the hosted feed exists (M9), the Hijri overrides are the ones bundled in `@qen/core`.
- **Tests:** unit tests with Vitest; end-to-end tests load the built extension into Chrome through Playwright's persistent context; the Google Calendar selectors are tested against saved HTML fixtures (N-023).

Alternatives considered:

- Vite with `@crxjs/vite-plugin`: good for Chrome, but its Firefox support is weaker and the manifest is hand-written.
- Plasmo: popular, but heavier and opinionated (its own messaging and storage layers) for an extension this small.
- Plain Vite with several entry points: no dependency, but we would hand-write manifest generation, per-browser builds and zipping.

## Consequences

- A WXT dependency in `apps/extension` only; the libraries are unaffected.
- The context menu needs a click or shortcut, which is less magical than an automatic tooltip, but the extension installs without the "read and change all your data on all websites" warning.
- Store submissions need developer accounts (Chrome charges a one-time fee); the owner creates and submits them.
