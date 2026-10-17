#!/bin/sh
# Packs @qen/core, installs the tarball in a throwaway project, and imports it
# by package name in each runtime given: node, deno, bun.
# Usage: sh smoke/run.sh node deno bun   (run from packages/core after a build)
set -eu

here=$(cd "$(dirname "$0")" && pwd)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

(cd "$here/.." && pnpm pack --pack-destination "$tmp" >/dev/null)
cp "$here/smoke.mjs" "$here/smoke.cjs" "$tmp/"
cd "$tmp"
printf '{ "name": "qen-smoke", "private": true }\n' > package.json
npm install --no-audit --no-fund --silent ./qen-core-*.tgz

for runtime in "$@"; do
  case "$runtime" in
    node) node smoke.mjs && node smoke.cjs ;;
    deno) deno run --allow-read --allow-env smoke.mjs ;;
    bun) bun smoke.mjs && bun smoke.cjs ;;
    *) echo "unknown runtime: $runtime" >&2; exit 2 ;;
  esac
done
