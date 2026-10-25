# Store listing

Everything the Chrome Web Store and Firefox Add-ons ask for, ready to paste (#170). The upload itself is the owner's (#171).

- **Privacy policy:** https://qen-3.vercel.app/privacy (move to the custom domain when there is one, #163)
- **Homepage / support:** https://qen-3.vercel.app · https://github.com/MuhidinM/qen/issues
- **Package:** the `extension-zips` artifact of the CI run on `main`, or `pnpm --filter @qen/extension zip` → `.output/*-chrome.zip`, `*-firefox.zip`, `*-sources.zip`
- **Images:** `store/images/` (regenerate with `pnpm --filter @qen/extension store:screenshots`); the store icon is `public/icon/128.png`

## Name

Qen: Ethiopian, Hijri and Gregorian dates

## Summary

Chrome takes it from the manifest (132 characters at most); paste the same into Firefox's summary.

> Today in the Ethiopian, Hijri and Gregorian calendars, a converter, upcoming holidays, and dates converted on request.

## Description

> Qen (ቀን, "day") shows today's date in the Ethiopian, Gregorian and Hijri calendars, converts any date between them, and lists the holidays coming up.
>
> **Today, in three calendars.** Open the popup for today's Ethiopian, Gregorian and Hijri dates, the time in Ethiopian hours, and how many days are left until the next public holidays.
>
> **Convert any date.** Type or paste a date in any calendar, such as "1 Meskerem 2019", "7 January 2027" or "1 Ramadan 1448", and see it in the other two, with its holidays. When a date could mean more than one thing, Qen asks instead of guessing.
>
> **Convert a date on any page.** Select a date, then right-click → "Convert date with Qen" or press Alt+Shift+Q. A small card shows it in all three calendars. Qen reads the page only when you ask.
>
> **Google Calendar.** Each day in Google Calendar gets its Ethiopian and Hijri dates. Choose Ethiopian, Hijri, both or neither in the settings.
>
> **In your language.** Dates in Amharic, Afaan Oromoo, Tigrinya, Arabic (right to left) or English, with Ge'ez numerals if you like. Hijri dates follow Umm al-Qura with the dates confirmed in Ethiopia, or the arithmetic calendar if you prefer.
>
> **Private.** No account, no tracking, no network requests. Your settings stay in your browser.
>
> Qen is open source (MIT): https://github.com/MuhidinM/qen

## Category

- Chrome Web Store: Productivity → Tools
- Firefox Add-ons: Other (also tag: calendar, Ethiopian, Hijri, date converter)

## Screenshots (1280 × 800)

1. `1-today.png`: Today in three calendars
2. `2-convert.png`: Convert any date (dark theme)
3. `3-tooltip.png`: a selected date converted on a web page
4. `4-amharic.png`: in Amharic
5. **Owner, by hand:** Google Calendar with the overlay, from your own calendar in month view with no private events visible (a new browser profile with an empty calendar works). Capture it at 1280 × 800.

Chrome's small promo tile (440 × 280): `promo-small-440x280.png`.

## Chrome Web Store: privacy practices

**Single purpose**

> Show and convert dates between the Ethiopian, Gregorian and Hijri calendars: in the toolbar popup, for a date the user selects on a page, and next to the days in Google Calendar.

**Permission justifications**

| Permission                      | Justification                                                                                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storage`                       | Saves the user's settings (date language, numerals, calendars, Hijri method, Google Calendar overlay) so the popup, the converter and the overlay use them.     |
| `activeTab`                     | When the user chooses "Convert date with Qen" or presses the shortcut, reads the text they selected in that tab to convert it. No access to any page otherwise. |
| `scripting`                     | Injects the script that reads the selected text and shows the converted date, into the active tab only, and only after the user's request (with `activeTab`).   |
| `contextMenus`                  | Adds the "Convert date with Qen" item to the right-click menu when text is selected.                                                                            |
| `https://calendar.google.com/*` | Adds the Ethiopian and Hijri dates next to each day in Google Calendar. It reads only the dates of the days shown, not events.                                  |

**Remote code:** No, I am not using remote code. All code is in the package.

**Data usage:** collects none of the listed data types. Tick all three certifications: no selling or transfer to third parties, no use unrelated to the single purpose, no use for creditworthiness or lending.

## Firefox Add-ons

- The manifest declares `data_collection_permissions: { required: ["none"] }`, so the listing shows that no data is collected.
- **Source code:** upload `*-sources.zip` when asked (the build uses WXT and Vite). Build steps for reviewers:

  ```
  pnpm install --frozen-lockfile
  pnpm turbo run build --filter=@qen/extension
  # output: apps/extension/.output/firefox-mv3
  ```

  Node version: see `.nvmrc`. pnpm version: `packageManager` in the root `package.json`.

- **Notes to reviewer:** "Builds from the monorepo root as above. The date logic is the open-source @qen/core package from the same repository. No network requests, no remote code. The popup's two `innerHTML` lint warnings come from React DOM."
