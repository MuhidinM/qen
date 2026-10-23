---
'@qen/react': minor
---

Add `legend` to `<CalendarGrid>`. Set `legend={false}` to hide the legend and its filter checkboxes when your app filters `holidays` itself, for example with one filter shared by several views; the grid then follows `holidays` as it changes. The default (`true`) is unchanged.
