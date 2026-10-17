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
console.log(`ESM ok on ${runtime}: [${Object.keys(core).join(', ')}]`);
