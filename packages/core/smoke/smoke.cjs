// Requires the installed package by name through its CJS entry.
const core = require('@qen/core');

const runtime = typeof Bun !== 'undefined' ? `Bun ${Bun.version}` : `Node ${process.version}`;

if (typeof core !== 'object' || core === null) throw new Error('CJS require of @qen/core failed');
if (core.date('ethiopian', 2019, 1, 17).day !== 17)
  throw new Error('date() returned a wrong value');
console.log(`CJS ok on ${runtime}: [${Object.keys(core).join(', ')}]`);
