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
pnpm --filter @qen/extension test:e2e          # builds the e2e variant and loads it into Chromium
pnpm --filter @qen/extension zip               # store uploads in .output/*.zip
```

The tests load the extension into Playwright's bundled Chromium (branded Chrome no longer loads unpacked extensions from the command line). If it won't start on your machine, point `CHROMIUM_PATH` at another Chromium build.

They use an e2e build (`.output/chrome-mv3-e2e`): the store build plus the test page's host `http://qen.test/*`, standing in for the `activeTab` grant a real click gives, and the context menu's handler exposed to the service worker so tests can call it.

## Permissions

`storage`, `activeTab`, `contextMenus`, `scripting`, and `https://calendar.google.com/*`, and nothing else (ADR-0017, R-EXT-04). `e2e/manifest.spec.ts` fails if a build asks for more. Firefox's manifest declares that the extension collects no data.

`web-ext lint` reports two warnings about `innerHTML` in the popup bundle: they come from React DOM's own code, not from the extension.

## Select-to-convert

Select a date on any page, then right-click → **Convert date with Qen**, or press `Alt+Shift+Q` (change it in the browser's extension shortcut settings). The extension reads the page only then, through `activeTab`, and shows the date in all three calendars in a tooltip. Ambiguous text such as `17/01/2019` lists every reading instead of guessing.

## Google Calendar

On `calendar.google.com` each day gets its Ethiopian and Hijri day numbers: beside the day number in month view, after the weekday name in week and day views. Hover a badge for the full dates. Choose Ethiopian, Hijri, both or off under **Settings → In Google Calendar, show**.

Google changes its markup without notice. Every selector the overlay uses is in `src/lib/gcal.ts`; when they stop matching, the overlay shows nothing and the page is untouched. The test fixtures in `src/lib/__fixtures__/` copy only that structure.

## Icons and store listing

The icons in `public/icon/` are rendered from the website's `apps/web/src/app/icon.svg` (`pnpm --filter @qen/extension icons`), so both products share one mark. Everything the stores ask for is in `store/`: the listing text, permission justifications and answers in `store/listing.md`, and the images in `store/images/` (`pnpm --filter @qen/extension store:screenshots`). The privacy policy is the website's `/privacy`.

`pnpm --filter @qen/extension zip` writes the Chrome and Firefox packages and, for Firefox's reviewers, a sources zip rooted at the monorepo that rebuilds the Firefox package exactly. It leaves out `notes/` and everything not needed to build.

## Releasing to the stores

The stores need a higher version for every upload. The version is `version` in `package.json` (WXT copies it into both manifests); Changesets doesn't manage it, because the extension isn't published to npm.

1. On a branch, bump `version` (patch for fixes, minor for features) and note what changed in the PR. Merge it when CI is green.
2. Download the `extension-zips` artifact from the CI run on `main` (or run `pnpm --filter @qen/extension zip`). It contains `qenextension-<version>-chrome.zip`, `-firefox.zip` and `-sources.zip`.
3. **Chrome Web Store** (developer dashboard): upload the Chrome zip. For a first upload, fill in the listing from `store/listing.md` and add the images in `store/images/`.
4. **Firefox Add-ons** (developer hub): upload the Firefox zip and, when asked, the sources zip with the build steps from `store/listing.md`.
5. When both are live, install each from its store and check the popup, select-to-convert and Google Calendar.

Uploads can be automated later (Chrome Web Store API, `web-ext sign`) once the owner adds store API keys as repository secrets.
