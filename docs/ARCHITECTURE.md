## Overview

The portfolio is a Vite SPA built with React and TypeScript.

### Main layers

- `src/pages`: route-level screens
- `src/components`: UI, layout, home, blog, projects, and skills components
- `src/content`: markdown content rendered inside the app
- `src/data`: typed JSON catalogs used by the UI
- `src/lib`: routing, i18n helpers, content loaders, site metadata, and SEO helpers
- `public`: static assets and generated crawl/index files

### Content model

- Blog post markdown lives in `src/content/posts/*.en.md` and `*.fr.md`.
- Project window markdown lives in `src/content/project-windows/*.en.md` and `*.fr.md`.
- Structured metadata stays in JSON so agents can update catalogs without rewriting UI code.

### Build-time generation

- `scripts/generate-blog-index.ts` creates `public/blog-index.json` from blog markdown frontmatter.
- `scripts/generate-seo.ts` creates `public/robots.txt`, `public/sitemap.xml`, and `public/404.html`.

### Runtime concerns

- `BrowserRouter` uses `import.meta.env.BASE_URL` so local dev and GitHub Pages production builds can share the same code.
- `Seo` updates document metadata per route.
- `AnalyticsTracker` loads GA4 once and tracks SPA navigation.
