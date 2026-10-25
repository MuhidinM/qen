# @qen/extension

The Qen browser extension for Chrome and Firefox: today in three calendars, a converter, upcoming holidays, select-to-convert on request, and Ethiopian and Hijri dates in Google Calendar. Built with WXT (ADR-0017). Not published to npm.

## Develop

```sh
pnpm install
pnpm --filter @qen/extension dev        # opens a browser with the extension loaded
```

## Build and check

```sh
pnpm turbo run build --filter=@qen/extension   # .output/chrome-mv3 and .output/firefox-mv3
pnpm --filter @qen/extension lint:firefox      # Mozilla's add-on linter
pnpm --filter @qen/extension test:e2e          # loads the built extension into Chromium
pnpm --filter @qen/extension zip               # store uploads in .output/*.zip
```

The tests load the extension into Playwright's bundled Chromium (branded Chrome no longer loads unpacked extensions from the command line). If it won't start on your machine, point `CHROMIUM_PATH` at another Chromium build.

## Permissions

`storage`, `activeTab`, `contextMenus`, `scripting`, and `https://calendar.google.com/*`, and nothing else (ADR-0017, R-EXT-04). `e2e/manifest.spec.ts` fails if a build asks for more. Firefox's manifest declares that the extension collects no data.

`web-ext lint` reports two warnings about `innerHTML` in the popup bundle: they come from React DOM's own code, not from the extension.
