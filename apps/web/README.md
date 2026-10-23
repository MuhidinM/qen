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
pnpm --filter @qen/web exec playwright install chromium   # once
pnpm --filter @qen/web test:e2e     # end-to-end, axe (light/dark, 320 px/desktop), security headers
pnpm --filter @qen/web lighthouse   # at least 90 in every category on every route
```

Every route is listed in `e2e/routes.json`; adding a page means adding it there, so the accessibility, header and Lighthouse checks cover it.

## Security headers

- The Content-Security-Policy is built per request in `src/proxy.ts` with a fresh nonce; Next.js puts the nonce on its own scripts. Pages therefore render per request (the root layout calls `connection()`), not at build time. See the ADR-0016 amendment.
- The other headers (HSTS, `nosniff`, referrer and permissions policies, framing) are in `next.config.ts`.

## Deploy (Vercel)

One-time setup, done by the owner:

1. In Vercel, **Add New → Project** and import `MuhidinM/qen`.
2. Set **Root Directory** to `apps/web`. Vercel detects Next.js, pnpm and Turborepo; keep the default build and install commands.
3. Leave environment variables empty; the site needs none.

After that every PR gets a preview URL and `main` deploys to production. The custom domain is added at launch (#141).
