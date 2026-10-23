---
'@qen/react': patch
---

Mark the bundle with `'use client'` so the components work in React Server Components frameworks such as the Next.js App Router. Before this, importing `@qen/react` from a server component failed to build.
