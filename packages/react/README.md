# @qen/react

Accessible React components for Gregorian, Ethiopian and Hijri dates, built on [`@qen/core`](https://www.npmjs.com/package/@qen/core). Five locales (English, Amharic, Afaan Oromo, Tigrinya, Arabic), Ge'ez numerals and right-to-left layout.

## Install

```sh
npm install @qen/react @qen/core react react-dom
```

Import the stylesheet once; it holds the design tokens as CSS variables and the component styles.

```tsx
import '@qen/react/styles.css';
import { CalendarGrid } from '@qen/react';
import { am } from '@qen/core/locales/am';

<CalendarGrid calendar="ethiopian" locale={am} numerals="geez" onChange={(d) => console.log(d)} />;
```

## Components

| Component            | What it does                                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `DateText`           | A date in any calendar as a `<time>` element with the Gregorian ISO date in `dateTime`.                          |
| `CalendarGrid`       | A month in any calendar (13 months for Ethiopian), WAI-ARIA grid keyboard pattern, other calendars and holidays. |
| `DatePicker`         | Text field read with `parse()` (asks when the calendar is ambiguous) plus the grid in a modal dialog.            |
| `DateRangePicker`    | Two ends on the grid, in either order, read back in a live status line.                                          |
| `EthiopianTimeInput` | Hour, minute and period in Ethiopian time, reported as international clock time.                                 |
| `YearView`           | 12 or 13 small months as buttons, with holiday counts.                                                           |
| `AgendaView`         | Holidays and observances in a range as a dated list, with an empty state.                                        |

Every component takes a `locale` from `@qen/core/locales/*`, which also sets `lang` and `dir`. UI strings (button labels, "expected") are English by default and can be replaced through `labels`.

## Theming

Light and dark themes follow `prefers-color-scheme`; set `data-theme="light"` or `"dark"` on `<html>` to force one. Override any `--qen-*` variable to theme the components, for example:

```css
:root {
  --qen-color-accent: hsl(150 60% 35%);
}
```

The tokens are also exported as `tokens` and `tokensToCss()`.

## Accessibility

Keyboard use and screen-reader names are tested for every component, with axe run in the tests. The grid follows the WAI-ARIA date grid pattern: one tab stop, arrows (reversed right to left), Home/End, PageUp/PageDown for months and Shift for years. Holidays are marked by shape and named in words, never by colour alone.

## Development

```sh
pnpm --filter @qen/react stories   # Ladle component explorer
pnpm --filter @qen/react test
```

## License

MIT
