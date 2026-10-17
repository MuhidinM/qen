# Qen (ቀን)

A multi-calendar toolkit for **Gregorian, Ethiopian, and Hijri** dates: conversion, arithmetic, formatting, holidays, and Hijri moon-sighting adjustment.

> Early development. Nothing is published yet. See [PLAN.md](PLAN.md) for the product spec, [docs/](docs/README.md) for requirements, architecture and decisions, and the [roadmap board](https://github.com/users/MuhidinM/projects/3) for progress.

## Packages

| Package                      | Description                        |
| ---------------------------- | ---------------------------------- |
| [`@qen/core`](packages/core) | Zero-dependency calendar engine    |
| `@qen/react` (planned)       | React components and design tokens |

## Development

```sh
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
