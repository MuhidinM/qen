// R-WEB-07: Lighthouse at least 90 in every category on every route (mobile emulation, the stricter default).
// The offline page is the service worker's fallback and deliberately noindex, so SEO does not apply.
const routes = require('./e2e/routes.json');
const port = 3200;

const budget = {
  'categories:performance': ['error', { minScore: 0.9 }],
  'categories:accessibility': ['error', { minScore: 0.9 }],
  'categories:best-practices': ['error', { minScore: 0.9 }],
  'categories:seo': ['error', { minScore: 0.9 }],
};

module.exports = {
  ci: {
    collect: {
      startServerCommand: `pnpm exec next start -p ${port}`,
      startServerReadyPattern: 'Ready',
      url: routes.map((route) => `http://localhost:${port}${route}`),
      numberOfRuns: 3,
    },
    assert: {
      assertMatrix: [
        { matchingUrlPattern: '/offline$', assertions: { ...budget, 'categories:seo': 'off' } },
        { matchingUrlPattern: '^(?!.*/offline$).*', assertions: budget },
      ],
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
