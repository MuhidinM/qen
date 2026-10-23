# @qen/web

The Qen website: converter, calendar, holiday pages and docs, built on `@qen/core` and `@qen/react` with Next.js (ADR-0016). Not published to npm.

## Develop

```sh
pnpm install
pnpm --filter @qen/web dev          # http://localhost:3000
```

## Check

```sh
pnpm turbo run build --filter=@qen/web
pnpm --filter @qen/web test:e2e     # end-to-end, axe (light/dark, 320 px/desktop), security headers
pnpm --filter @qen/web lighthouse   # at least 90 in every category on every route
```

The tests and Lighthouse use your installed Google Chrome.

Every route is listed in `e2e/routes.json`; adding a page means adding it there, so the accessibility, header and Lighthouse checks cover it.

## Install and offline

- `public/sw.js` is the service worker (ADR-0016 amendment). It runs in production builds only, registered as `/sw.js?v=<build>`, so each deploy is a new version that waits for the visitor's Reload.
- Icons in `public/` are rendered from `src/app/icon.svg`. Run `pnpm --filter @qen/web icons` after changing it.
- `/offline` is the fallback for pages not cached yet. It is `noindex`, so Lighthouse's SEO check is off for it alone.

## Security headers

- The Content-Security-Policy is built per request in `src/proxy.ts` with a fresh nonce; Next.js puts the nonce on its own scripts. Pages therefore render per request (the root layout calls `connection()`), not at build time. See the ADR-0016 amendment.
- The other headers (HSTS, `nosniff`, referrer and permissions policies, framing) are in `next.config.ts`.

## Deploy (Vercel)

Linked on 2026-10-23 as project `web` (team `muhidin-misbahs-projects`). Production: https://qen-3.vercel.app until the custom domain (#141).

One-time setup, done by the owner:

1. In Vercel, **Add New → Project** and import `MuhidinM/qen`.
2. Set **Root Directory** to `apps/web`. Vercel detects Next.js, pnpm and Turborepo; keep the default build and install commands.
3. Leave environment variables empty; the site needs none.

After that every PR gets a preview URL and `main` deploys to production. The custom domain is added at launch (#141).
