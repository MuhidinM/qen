# ADR-0016 · Website: Next.js App Router, static-first, on Vercel

**Status:** accepted · 2026-10-23

## Context

The website (M7, `apps/web`) needs a landing page, a converter, a full calendar that installs as a PWA and works offline, static holiday pages, and docs with live examples (R-WEB-01 to R-WEB-06). Every page has a Lighthouse budget of 90 (R-WEB-07) and must send a CSP and security headers (R-WEB-08). All calendar logic already runs in the browser through `@qen/core` and `@qen/react`, so the site needs no server-side data. PLAN.md names Next.js and "Vercel or similar"; the owner chose Vercel on 2026-10-23.

## Decision

- **Framework:** Next.js 16 with the App Router, in `apps/web`, consuming `@qen/core` and `@qen/react` from the workspace.
- **Rendering:** static-first. Pages are prerendered at build time (holiday pages through `generateStaticParams`); anything that depends on "today" or the visitor's settings renders on the client after a stable server shell, so there is no hydration mismatch. No API routes or server data in M7.
- **Hosting:** Vercel, with a preview deploy per PR and production deploys approved by the owner. Security headers and the CSP are set in `next.config`, so they travel with the code rather than living in the dashboard.
- **Styling:** `@qen/react/styles.css` plus site CSS that uses only the design-token variables (ADR-0015). No CSS framework.
- **Docs:** MDX through `@next/mdx`; live, editable examples through `react-live`.
- **Tests:** Playwright end-to-end with `@axe-core/playwright` on every route; Lighthouse CI with the R-WEB-07 budget. Both run in CI on every PR.
- **PWA:** a web app manifest and a service worker. The worker tooling (Serwist or a hand-written worker) is chosen in #137 for the installed bundler and recorded here as an amendment.

Alternatives considered:

- Astro: excellent for static content, but the calendar, converter and docs examples are React islands anyway, and PLAN.md names Next.js.
- Vite + React Router SPA: simpler, but no static generation for the holiday pages without extra tooling, which hurts search indexing.
- Cloudflare Pages or GitHub Pages: free and fast, but GitHub Pages cannot send custom headers (R-WEB-08) and neither gives Next.js its full feature set. Vercel is the runner-up's equal on price for this traffic.
- Sandpack for live examples: a full in-browser bundler, but it loads from CodeSandbox's servers and is much heavier; `react-live` compiles small snippets locally.

## Consequences

- The site depends on Vercel for previews and production; moving hosts later means re-creating the headers config elsewhere (it already lives in `next.config`, so mostly portable).
- `react-live` evaluates code in the page, so the docs routes may need a looser CSP (`unsafe-eval`) than the rest of the site. #140 records the exact exception here if it is needed.
- Because nothing runs on the server, the site works offline once cached and can be exported statically if the host ever changes.

## Amendment · 2026-10-23 · per-request rendering for a nonce-based CSP (#133)

Building #133 showed that a static page cannot carry a strict CSP: Next.js writes inline `<script>` tags (the React Server Components payload) into every page, and the experimental SRI option only hashes script files, so `script-src 'self'` blocked hydration. The end-to-end test that fails on any CSP violation caught it.

The owner chose the strict policy over static pages: `src/proxy.ts` sets `script-src 'self' 'nonce-…' 'strict-dynamic'` with a fresh nonce per request, and the root layout calls `connection()` so every page renders per request. The other option, `'unsafe-inline'` for scripts with static pages, was rejected as weaker against injected scripts.

Consequences: "static-first" above no longer holds for HTML. Pages are server-rendered on each visit (Lighthouse on the placeholder page still scores 99 for performance), holiday pages (#139) render on demand instead of through `generateStaticParams` at build time, and the PWA (#137) caches pages at runtime rather than precaching build output. Data and logic are unchanged: everything still runs from `@qen/core` with no server data.

## Amendment · 2026-10-23 · a hand-written service worker (#137)

The PWA worker is a plain script, `apps/web/public/sw.js`, rather than Serwist. Serwist's strength is precaching the build's output, but under the per-request rendering above there is no build-time list of pages, and it would add a bundler plugin to keep working with Turbopack. The hand-written worker is about 90 lines with no dependencies:

- **Install:** fetches `/`, `/convert`, `/calendar`, `/countdown`, `/age` and `/offline` (the client-side tools work without a connection), plus the static assets each page references.
- **Pages:** network-first. The cached copy is refreshed on each online visit, kept per path rather than per query string, and falls back to `/offline`.
- **Hashed assets** (`/_next/static`): cache-first.
- **Cached pages keep their own response headers.** A page served offline therefore carries the CSP and nonce it was rendered with, so it still hydrates; an e2e test checks this.
- **Updates:** the worker is registered as `/sw.js?v=<build>`. A new deploy installs and waits, and the page offers "Reload" rather than swapping silently.
- **Policy:** `/sw.js` is never HTTP-cached and is served under its own strict CSP (`default-src 'self'; script-src 'self'`), outside the page proxy.

Consequence: a shared `/convert?…` link opened offline shows the converter without the linked result, because that result is rendered on the server. Typing the date still works.
