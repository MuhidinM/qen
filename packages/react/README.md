# @qen/react

Accessible React components for Gregorian, Ethiopian and Hijri dates, built on [`@qen/core`](../core). Five locales (English, Amharic, Afaan Oromo, Tigrinya, Arabic), Ge'ez numerals and right-to-left layout.

> Early development: not yet published. Components arrive through M6 (see the [roadmap](https://github.com/users/MuhidinM/projects/3)).

## Install

```sh
npm install @qen/react @qen/core react react-dom
```

```tsx
import '@qen/react/styles.css';
import { DateText } from '@qen/react';
import { date } from '@qen/core';
import { am } from '@qen/core/locales/am';

<DateText date={date('ethiopian', 2019, 1, 17)} locale={am} numerals="geez" />;
// <time dateTime="2026-09-27" lang="am">፲፯ መስከረም ፳፻፲፱ ዓ.ም.</time>
```

## Development

```sh
pnpm --filter @qen/react stories   # Ladle component explorer
pnpm --filter @qen/react test
```

## License

MIT
