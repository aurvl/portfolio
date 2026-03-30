# Aurel VEHI Portfolio

React + TypeScript + Vite portfolio for Aurel VEHI.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run dev` and `npm run build` both regenerate:

- `public/blog-index.json`
- `public/robots.txt`
- `public/sitemap.xml`
- `public/404.html`

## Structure

- `src/`: app code, routes, components, content loaders, i18n
- `src/content/`: markdown sources for blog posts and project windows
- `src/data/`: structured JSON catalogs for projects, skills, domains, and series
- `public/`: static assets, generated blog index, SEO files, social assets, downloads
- `scripts/`: content and SEO generation scripts
- `docs/`: content rules, architecture notes, migration notes

## Deployment notes

- Production builds default to the GitHub Pages project-site base path `/portfolio/`.
- Override deployment settings with `.env` values from `.env.example` if the site URL or base path changes.
- A GitHub Pages SPA fallback is generated to keep `/blog`, `/projects`, and `/series/*` routes working on refresh.

## Analytics

- The legacy site used Google Analytics 4 with measurement ID `G-3L7YJ0JHG5`.
- No Google Tag Manager container was found in the legacy codebase.
- Analytics is now loaded once globally and tracks SPA route changes.

## Content workflow

- Create a project skeleton with `npm run content:add-project -- --title-en "Project title"`.
- Create a blog post skeleton with `npm run content:add-post -- --title-en "Post title" --series ia-pas-a-pas`.
- Validate structured content with `npm run content:validate`.
- Source-of-truth content lives in `src/data/projects.json`, `src/content/project-windows/`, `src/content/posts/`, and `src/data/series.json`.
- Generated files such as `public/blog-index.json`, `public/sitemap.xml`, and `public/robots.txt` should not be edited manually.
- Run `npm run build` before deployment so generated indexes and SEO files stay in sync.

See [docs/CONTENT_WORKFLOW.md](docs/CONTENT_WORKFLOW.md), [docs/AI_CONTENT_OPERATIONS.md](docs/AI_CONTENT_OPERATIONS.md), and [docs/BLOG_POST.md](docs/BLOG_POST.md) for the detailed conventions.
