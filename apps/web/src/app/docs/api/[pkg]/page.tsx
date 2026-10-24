import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CodeBlock } from '@/components/CodeBlock';
import { DocText, inline } from '@/components/DocText';
import { LiveExample } from '@/components/LiveExample';
import { API, API_PACKAGES, KIND_TITLES, type ApiItem, type ApiPackage } from '@/lib/api';
import { runnableExample } from '@/lib/example-code';

type Params = Promise<{ pkg: string }>;

function load(pkg: string): ApiPackage {
  const found = API_PACKAGES.find((p) => p === pkg);
  if (!found) notFound();
  return found;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const pkg = load((await params).pkg);
  const { name, items } = API[pkg];
  return {
    title: `${name} API reference`,
    description: `Every export of ${name}: ${items.length} functions, components and types, with signatures and live examples.`,
    alternates: { canonical: `/docs/api/${pkg}` },
  };
}

/** Functions, classes and values have something to show when run; types only type-check. */
const LIVE: ReadonlySet<ApiItem['kind']> = new Set(['function', 'class', 'variable']);

export default async function ApiPage({ params }: { params: Params }) {
  const pkg = load((await params).pkg);
  const { name, items } = API[pkg];
  const kinds = (Object.keys(KIND_TITLES) as ApiItem['kind'][]).filter((k) =>
    items.some((i) => i.kind === k),
  );

  return (
    <>
      <h1>{name} API reference</h1>
      <p className="lead">
        Every export, generated from the package’s type declarations and doc comments. Examples are
        live: the library is already in scope, and <code>show()</code> prints a value.
      </p>

      <nav aria-label="On this page" className="api-toc">
        {kinds.map((kind) => (
          <section key={kind}>
            <h2 className="api-toc__title">{KIND_TITLES[kind]}</h2>
            <ul>
              {items
                .filter((i) => i.kind === kind)
                .map((i) => (
                  <li key={i.name}>
                    <a href={`#${i.name}`}>{i.name}</a>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </nav>

      {items.map((item) => (
        <section
          key={item.name}
          id={item.name}
          className="api-item"
          aria-labelledby={`${item.name}-title`}
        >
          <h2 id={`${item.name}-title`} className="api-item__title">
            <code>{item.name}</code> <span className="badge">{item.kind}</span>
          </h2>
          {item.entry !== name && (
            <p className="api-item__entry">
              Import from <code>{item.entry}</code>
            </p>
          )}
          {item.deprecated && <p className="notice">Deprecated.</p>}
          <DocText text={item.summary} />
          <CodeBlock>
            <code>{item.signatures.join('\n')}</code>
          </CodeBlock>
          {item.throws.length > 0 && (
            <>
              <h3 className="api-item__subtitle">Throws</h3>
              <ul>
                {item.throws.map((t, i) => (
                  <li key={i}>{inline(t)}</li>
                ))}
              </ul>
            </>
          )}
          {item.examples.map((example, i) =>
            LIVE.has(item.kind) ? (
              <LiveExample
                key={i}
                title={`${item.name} example`}
                code={runnableExample(example)}
                globals
              />
            ) : (
              <CodeBlock key={i}>
                <code>{example}</code>
              </CodeBlock>
            ),
          )}
        </section>
      ))}
    </>
  );
}
