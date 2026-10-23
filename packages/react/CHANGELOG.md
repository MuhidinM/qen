# @qen/react

## 0.2.0

### Minor Changes

- 28d8733: Add `legend` to `<CalendarGrid>`. Set `legend={false}` to hide the legend and its filter checkboxes when your app filters `holidays` itself, for example with one filter shared by several views; the grid then follows `holidays` as it changes. The default (`true`) is unchanged.

## 0.1.1

### Patch Changes

- 5285bc1: Mark the bundle with `'use client'` so the components work in React Server Components frameworks such as the Next.js App Router. Before this, importing `@qen/react` from a server component failed to build.

## 0.1.0

### Minor Changes

- 0babdda: `<CalendarGrid>` can show other calendars' day numbers (`secondary`) and holidays (`holidays`) with shape-coded markers, a legend with category filters, and holiday names in each day's accessible name.
- 98d07df: Add `<CalendarGrid>`: a month grid in any calendar with the WAI-ARIA keyboard pattern, Sunday or Monday week start, locale names, Ge'ez numerals and right-to-left layout.
- acc2c0f: Add `<DatePicker>`: a labelled text field read with `parse()` (ambiguous input offers the candidates) and a calendar in a modal dialog with a focus trap.
- 39bece2: Add `<DateRangePicker>` (pick both ends on the grid, in either order, with a live summary) and `<EthiopianTimeInput>` (hour, minute and period in Ethiopian time, reported as clock time). `<CalendarGrid>` gains `selectedRange`.
- 8c04bb5: First component: `<DateText>` shows a date in any calendar and locale as a semantic `<time>` element with the Gregorian ISO `dateTime`, setting `lang` and `dir` (right-to-left for Arabic).
- 8bbe5d5: Add the design tokens (`tokens`, `tokensToCss`): the CLAUDE.md spacing and type scales, two weights, radii, five shadows, HSL palettes (10 greys, 10 blues, green, amber, red) and light/dark semantic colours checked for WCAG AA. `@qen/react/styles.css` now includes them as CSS variables; dark mode follows `prefers-color-scheme` or `data-theme`.
- 6936d0d: Add `<YearView>` (12 or 13 small months as buttons, with holiday counts) and `<AgendaView>` (holidays and observances in a range as a dated list, with an empty state).

### Patch Changes

- Updated dependencies [692eea1]
- Updated dependencies [efa6d3c]
  - @qen/core@1.0.0
