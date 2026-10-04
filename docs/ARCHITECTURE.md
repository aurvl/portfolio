# Architecture

The site is a Vite single-page app: React 19, TypeScript, Tailwind v4, framer-motion, react-i18next
(English and French) and react-router v7. It is deployed on GitHub Pages under the base path `/portfolio/`.

## Layout

- `src/pages`: route screens (`HomePage`, `ProjectsPage`, `PublicationsPage`, `BlogPage`, `BlogPostPage`, `SeriesPage`)
- `src/components/home-v2`: homepage sections (hero, method, doctoral research, publications, selected work,
  now building, where I can help, profile, blog posts, contact) and shared bits (`Reveal`, `StackMarquee`, `MethodGraph`)
- `src/components/layout`: `MainLayout`, `Navbar`, `Footer`, `CookieBanner`, `BackToTopButton`, `AnimatedLogo`
- `src/components/projects`, `src/components/blog`: catalogue cards, filters, project windows, post widgets
- `src/components/ui`: `MarkdownRenderer`, `LanguageSwitcher`, `ThemeToggle`, `FilterField`
- `src/data`: content (see below)
- `src/content`: markdown for blog posts and project windows
- `src/hooks`: `useHomeContent` (homepage text in the current language), `useSiteNav` (navbar sections and CTA), `useBlogIndex`
- `src/lib`: routing, i18n, content loaders and schemas, site metadata, consent, domain colours, tool icons
- `src/styles`: `globals.css`, `theme.css`, `responsive.css`, `markdown.css`, and the V2 sheets
  `home-v2.css`, `projects-v2.css`, `blog-v2.css`
- `public`: static assets, resumes (`assets/downloads/resume-en.pdf`, `resume-fr.pdf`) and generated crawl files

## Routes

| Path | Page |
| --- | --- |
| `/` | Homepage |
| `/projects` (`?project=<slug>` opens a project window) | Project catalogue: applied studies first, then other technical work |
| `/publications` | All publications (`/research` redirects here) |
| `/blog`, `/blog/:slug`, `/series/:seriesSlug` | Blog, post, series |

## Content model

| Content | Source | Notes |
| --- | --- | --- |
| Homepage text (EN) | `src/data/home.ts` | `HomeContent` type, every section's copy |
| Homepage text (FR) | `src/data/home.fr.ts` | Same shape as `home.ts` |
| Selected work | `src/data/selected-work.json` | First item is the flagship card |
| Publications | `src/data/publications.json` | Homepage section and `/publications` |
| Now building | `src/data/now-building.json` | "Updated" date comes from git (see Build) |
| Projects | `src/data/projects.json` + `src/content/project-windows/*.md` | Catalogue and project windows |
| Blog | `src/content/posts/*.md`, `series.json`, `blog-resources.json` | |
| Domain colours | `src/data/domain.json` | Badge colour per domain |
| Tools | `src/data/skills.json` | Icons for the stack marquee and the method graph (`toolSlugs` in `home.ts`) |

Field-level details: `docs/CONTENT_SCHEMA.md`. The homepage JSON files exist so the owner's Portfolio Manager
can edit them without touching TypeScript.

## Build

- `scripts/generate-blog-index.ts` writes `public/blog-index.json` (reading time included).
- `scripts/generate-seo.ts` writes `public/robots.txt`, `public/sitemap.xml`, `public/404.html` (SPA fallback)
  and the redirects that keep old portfolio URLs working.
- `vite.config.ts` defines `__NOW_BUILDING_UPDATED_AT__`: the date of the last commit touching
  `now-building.json`, or the file's modification time while it has local edits. CI checks out the full
  history (`fetch-depth: 0`) for this.
- Base path: `/portfolio/` in production, `/` in dev, overridable with `VITE_PUBLIC_BASE_PATH`.

## Runtime

- `BrowserRouter` uses `import.meta.env.BASE_URL`, so dev and production share the same code.
- `Seo` sets title, description, canonical and Open Graph tags per route.
- Theme: light/dark through `data-theme` on `<html>`. Language: react-i18next, `src/locales/en.json` and `fr.json`
  for UI strings, `home.ts` / `home.fr.ts` for homepage copy.
- Analytics: `CookieBanner` stores the visitor's choice (`src/lib/consent.ts`, localStorage). `AnalyticsTracker`
  loads GA4 and Microsoft Clarity only when consent is granted, in a production build, and never on
  `localhost`. Clarity receives the consent signal (`consentv2`).

## Deployment

`.github/workflows/deploy.yml` builds and publishes on every push to `master`. Repository variables:
`VITE_SITE_URL`, `VITE_PUBLIC_BASE_PATH`, `VITE_GA_MEASUREMENT_ID`, `VITE_CLARITY_PROJECT_ID`, `VITE_GITHUB_USERNAME`.
Google Search Console is verified through the HTML file in `public/`.
