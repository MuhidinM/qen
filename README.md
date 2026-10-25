# Qen (ቀን)

A multi-calendar toolkit for **Gregorian, Ethiopian, and Hijri** dates: conversion, arithmetic, formatting, holidays, and Hijri moon-sighting adjustment.

**Website:** [qen-3.vercel.app](https://qen-3.vercel.app): today in three calendars, a converter, a full calendar, holiday pages, countdowns and an age calculator. It installs as an app and works offline. **Docs** with live examples: [qen-3.vercel.app/docs](https://qen-3.vercel.app/docs).

See [PLAN.md](PLAN.md) for the product spec, [docs/](docs/README.md) for requirements, architecture and decisions, and the [roadmap board](https://github.com/users/MuhidinM/projects/3) for progress.

## Packages

| Package                                                  | Description                                                                                                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`@qen/core`](https://www.npmjs.com/package/@qen/core)   | Zero-dependency calendar engine: conversion, arithmetic, formatting, parsing, holidays, Ge'ez numerals, Ethiopian time ([source](packages/core)) |
| [`@qen/react`](https://www.npmjs.com/package/@qen/react) | Accessible React components and design tokens ([source](packages/react))                                                                         |
| [`apps/web`](apps/web)                                   | The website, built on both packages (not published)                                                                                              |
| [`apps/extension`](apps/extension)                       | Browser extension for Chrome and Firefox (in progress)                                                                                           |

## Development

Requires Node 22 or later and pnpm (run `corepack enable` once to get the pinned version).

```sh
git clone https://github.com/MuhidinM/qen.git
cd qen
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm typecheck
pnpm changeset
```

`pnpm install` sets up git hooks: each commit runs ESLint and Prettier on the staged files, and each push runs `pnpm typecheck` and `pnpm test`.

## License

[MIT](LICENSE)
