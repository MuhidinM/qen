// Imports the installed package by name through its ESM entry.
// Extend with real calls as the public API grows.
import * as core from '@qen/core';

const runtime =
  typeof Deno !== 'undefined'
    ? `Deno ${Deno.version.deno}`
    : typeof Bun !== 'undefined'
      ? `Bun ${Bun.version}`
      : `Node ${process.version}`;

if (typeof core !== 'object' || core === null) throw new Error('ESM import of @qen/core failed');
if (core.date('ethiopian', 2019, 1, 17).day !== 17)
  throw new Error('date() returned a wrong value');
const meskerem1 = core.convert(core.date('ethiopian', 2019, 1, 1), 'gregorian');
if (meskerem1.year !== 2026 || meskerem1.month !== 9 || meskerem1.day !== 11) {
  throw new Error(`convert() returned ${JSON.stringify(meskerem1)}`);
}
try {
  core.date('ethiopian', 2018, 13, 6);
  throw new Error('date() accepted Pagume 6, 2018 EC');
} catch (e) {
  if (!(e instanceof core.InvalidDateError)) throw e;
}
console.log(`ESM ok on ${runtime}: [${Object.keys(core).join(', ')}]`);
