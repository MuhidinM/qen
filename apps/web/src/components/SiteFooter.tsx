const links = [
  { label: 'GitHub', href: 'https://github.com/MuhidinM/qen' },
  { label: '@qen/core on npm', href: 'https://www.npmjs.com/package/@qen/core' },
  { label: '@qen/react on npm', href: 'https://www.npmjs.com/package/@qen/react' },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__note">Open source under the MIT license.</p>
        <ul className="site-footer__links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
