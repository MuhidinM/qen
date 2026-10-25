import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { COMMANDS, HOST_PERMISSIONS, PERMISSIONS } from '../wxt.config';

// R-EXT-04, ADR-0017: the built manifests ask for exactly the minimum permissions, nothing more.
for (const target of ['chrome-mv3', 'firefox-mv3']) {
  test(`the ${target} manifest asks only for the agreed permissions`, () => {
    const manifest = JSON.parse(
      readFileSync(new URL(`../.output/${target}/manifest.json`, import.meta.url), 'utf8'),
    );
    expect(manifest.manifest_version).toBe(3);
    expect([...manifest.permissions].sort()).toEqual([...PERMISSIONS].sort());
    expect(manifest.host_permissions).toEqual(HOST_PERMISSIONS);
    expect(manifest.optional_permissions ?? []).toEqual([]);
    expect(manifest.content_security_policy).toBeUndefined(); // the browsers' strict default
    expect(manifest.commands).toEqual(COMMANDS); // select-to-convert's shortcut (#168)
  });
}

test('Firefox declares that the extension collects no data', () => {
  const manifest = JSON.parse(
    readFileSync(new URL('../.output/firefox-mv3/manifest.json', import.meta.url), 'utf8'),
  );
  expect(manifest.browser_specific_settings.gecko.data_collection_permissions).toEqual({
    required: ['none'],
  });
});
