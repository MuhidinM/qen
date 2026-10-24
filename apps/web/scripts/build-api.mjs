// Generates the docs' API reference (src/generated/api.json, not committed) from the built
// type declarations of @qen/core and @qen/react: every export with its signature, summary,
// parameters, return, throws and examples, straight from the TSDoc that core's CI already
// requires (an @example on every export). Runs before `next build`, `next dev` and the type check.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);

const PACKAGES = [
  {
    id: 'core',
    name: '@qen/core',
    entries: ['@qen/core', '@qen/core/locales/en', '@qen/core/overrides/ethiopia'],
  },
  { id: 'react', name: '@qen/react', entries: ['@qen/react'] },
];

const KIND = [
  [ts.SyntaxKind.FunctionDeclaration, 'function'],
  [ts.SyntaxKind.ClassDeclaration, 'class'],
  [ts.SyntaxKind.InterfaceDeclaration, 'interface'],
  [ts.SyntaxKind.TypeAliasDeclaration, 'type'],
  [ts.SyntaxKind.VariableDeclaration, 'variable'],
];

/** The .d.ts file a package specifier resolves to. */
const declarationFile = (specifier) => require.resolve(specifier).replace(/\.c?js$/, '.d.ts');

/**
 * The raw doc comment of a declaration, split into summary and tags. Read as text because
 * TypeScript parses `@throws {@link X}` as a type expression and loses the link.
 */
function docOf(node) {
  const target = ts.isVariableDeclaration(node) ? node.parent.parent : node;
  const blocks = ts.getJSDocCommentsAndTags(target).filter(ts.isJSDoc);
  const raw = blocks.at(-1)?.getText(target.getSourceFile()) ?? '';
  const text = raw
    .replace(/^\/\*\*\s?/, '')
    .replace(/\s*\*\/$/, '')
    .split('\n')
    .map((line) => line.replace(/^\s*\* ?/, ''))
    .join('\n');
  const [summary = '', ...rest] = text.split(/^(?=@\w)/m);
  const tags = rest.map((chunk) => {
    const m = /^@(\w+)\s*([\s\S]*)$/.exec(chunk);
    return { name: m?.[1] ?? '', text: (m?.[2] ?? '').trim() };
  });
  return { summary: summary.trim(), tags };
}

/** A declaration's text without its doc comment or `export declare`. */
function signature(node) {
  const text = node
    .getText(node.getSourceFile())
    .replace(/^export\s+/, '')
    .replace(/^declare\s+/, '');
  if (!ts.isVariableDeclaration(node)) return text;
  return `${node.parent.flags & ts.NodeFlags.Const ? 'const' : 'let'} ${text}`;
}

const stripFence = (code) =>
  code
    .replace(/^```\w*\n?/, '')
    .replace(/\n?```$/, '')
    .trim();

const model = {};
for (const pkg of PACKAGES) {
  const files = pkg.entries.map(declarationFile);
  const program = ts.createProgram(files, { skipLibCheck: true });
  const checker = program.getTypeChecker();
  const items = [];
  const seen = new Set();

  pkg.entries.forEach((entry, i) => {
    const moduleSymbol = checker.getSymbolAtLocation(program.getSourceFile(files[i]));
    for (let symbol of checker.getExportsOfModule(moduleSymbol)) {
      const name = symbol.getName();
      if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
      const declarations = symbol.getDeclarations() ?? [];
      const first = declarations[0];
      const kind = KIND.find(([k]) => first?.kind === k)?.[1];
      if (!first || !kind || seen.has(name)) continue;
      seen.add(name);
      const { summary, tags } = docOf(first);
      const tagged = (tagName) => tags.filter((t) => t.name === tagName).map((t) => t.text);
      items.push({
        name,
        entry,
        kind,
        summary,
        signatures: declarations.filter((d) => d.kind === first.kind).map(signature),
        params: tagged('param').map((text) => {
          const [paramName = '', ...words] = text.split(/\s+/);
          return { name: paramName, text: words.join(' ').replace(/^-\s*/, '') };
        }),
        returns: tagged('returns')[0] ?? null,
        throws: tagged('throws'),
        examples: tagged('example').map(stripFence),
        deprecated: tagged('deprecated').length > 0,
      });
    }
  });
  const order = KIND.map(([, k]) => k);
  items.sort(
    (a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || a.name.localeCompare(b.name),
  );
  model[pkg.id] = { name: pkg.name, items };
}

const out = new URL('../src/generated/', import.meta.url);
mkdirSync(out, { recursive: true });
writeFileSync(new URL('api.json', out), JSON.stringify(model, null, 1));
console.log(
  'api reference built:',
  Object.values(model)
    .map((p) => `${p.name} ${p.items.length}`)
    .join(', '),
);
