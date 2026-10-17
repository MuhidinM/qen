// Requires the installed package by name through its CJS entry.
const core = require('@qen/core');

const runtime = typeof Bun !== 'undefined' ? `Bun ${Bun.version}` : `Node ${process.version}`;

if (typeof core !== 'object' || core === null) throw new Error('CJS require of @qen/core failed');
console.log(`CJS ok on ${runtime}: [${Object.keys(core).join(', ')}]`);
