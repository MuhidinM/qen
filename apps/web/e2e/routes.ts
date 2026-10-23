import routeList from './routes.json' with { type: 'json' };

/** Every route the site serves (routes.json, shared with Lighthouse CI), so every check covers each page. */
export const routes: readonly string[] = routeList;
