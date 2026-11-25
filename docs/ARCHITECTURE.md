# Architecture

The site is a Vite single-page app: React 19, TypeScript (strict), Tailwind v4, framer-motion, react-i18next
(English and French) and react-router v7. It is deployed on GitHub Pages under the base path `/portfolio/`.
The visual design is **v3** (editorial, sparse, photo-led); see `docs/DESIGN_SYSTEM.md`.

## Layout

- `src/pages`: route screens (`HomePage`, `ProjectsPage`, `PublicationsPage`, `SeriesIndexPage`, `SeriesPage`,
  `BlogPostPage`). They are lazy-loaded through `src/app/pages.tsx`, which also preloads a page on link hover.
- `src/components/home-v3`: the homepage screens: `LandingHero`, `LatestThings`, `AboutSection` (with `Timeline`,
  `JourneyCard`, `NextDoors`), `PublicationsSection`, `ContactSection`.
- `src/components/hub-v3`: the Projects and posts hub (`/projects`): `HubHeader`, `FeaturedHub` (`FeaturedLead`,
  `FeaturedStory`, `FeaturedCover`), `SearchPanel`, `BlogLatest`. `featuredProjects.ts` picks the featured projects.
- `src/components/layout`: `MainLayout` (skip link, navbar, `<main id="main-content">`, footer), `MorphNavbar`
  (homepage), `Navbar` (other pages), `CompactMenu` (mobile and tablet), `Footer`, `CookieBanner`, `BackToTopButton`.
- `src/components/projects`: `ProjectCard`, `ProjectGrid` and the project window (`ProjectWindow*`).
- `src/components/blog`: article pieces (`PostContent`, `PostRow`, `BlogBanner`, search, subscribe form,
  `BlogPostResources`) and the interactive widgets (`widgets/`).
- `src/components/ui`: `Button`, `MarkdownRenderer`, `BambooPhoto`, `Avatar`, `SocialIcons`, `UtilityPill`
  (language and theme), `FilterField`, `Collapsible`.
- `src/components/routing`: `PageTransitions` (page-to-page View Transitions) and `ScrollManager`.
- `src/hooks`: `useHomeContent` (text in the current language), `useSiteNav` (navbar sections), `useNavbarModel`,
  `useCompactMenu`, `useBambooScene` (desktop scene), `useBambooMobile` (touch scene), `useBlogIndex`, `useMediaQuery`.
- `src/lib`: i18n, site metadata (`site.ts`), consent, post and project-window loaders, the transition engines
  (`pageTransition.ts`, `navigateToSection.ts`, `jumpToSection.ts`, `morphPlayer.ts`).
- `src/data`: content (see below). `src/content`: markdown for posts and project windows.
- `src/styles`: see `docs/DESIGN_SYSTEM.md`.
- `public`: static assets, resumes (`assets/downloads/`) and the generated crawl files.
- `scripts`: build scripts (TypeScript) and the content tools used by the owner's Portfolio Manager (Python).

## Routes

| Path | Page |
| --- | --- |
| `/` | Homepage: landing, About, Research (publications), Contact |
| `/projects` | Hub: featured projects, search, latest posts, project grid (`?project=<slug>` opens a project window) |
| `/publications` | Publications list (`/research` redirects here) |
| `/series`, `/series/:seriesSlug` | Series index and a series page |
| `/blog/:slug` | An article |
| `/blog` | Redirects to `/projects#blog` |

## Homepage scenes

The homepage is four screens (landing, About, Research, Contact) linked by one photo of bamboo.

- **Desktop** (`min-width: 1024px`, hover and fine pointer): a sticky frame (`scene.css`). The page scrolls normally;
  `useBambooScene` reads the scroll distance and derives a progress from 0 to 3 that drives the photo shape, the
  navbar and the content opacity.
- **Touch and small screens**: normal sections (`touch-scene.css`); landing to About is a triggered transition played
  by `useBambooMobile` and `morphPlayer.ts`.
- The "Learn more" button travels into the navbar (`MorphNavbar`). Under `prefers-reduced-motion` it only fades.
- Keyboard: an element that receives focus outside the window is scrolled into view (`HomePage.tsx`).

Between pages, `navigateToPage()` (`lib/pageTransition.ts`) runs a native View Transition: zoom in when going deeper
(home to hub to article), zoom out when coming back. Code that navigates by script must call it instead of `navigate`.

## Content model

| Content | Source | Notes |
| --- | --- | --- |
| Homepage text (profile, timeline, About texts, labels, themes) | `src/data/homepage.json` + `src/data/homepage.ts` | JSON `{ en, fr }` edited by hand or by the Manager; `homepage.ts` holds the types and `homepage.getX(lang)` |
| Navigation, contact form, Projects hub labels (EN / FR) | `src/data/home.ts`, `src/data/home.fr.ts` | `HomeContent` type, same shape in both languages |
| Featured choices (Hub order, landing cards, display texts) | `src/data/featured.json` | Edited by the Portfolio Manager (Featured page) |
| UI strings | `src/locales/en.json`, `fr.json` | react-i18next |
| Publications | `src/data/publications.json` | Edited by the Portfolio Manager |
| Latest things (project in progress) | `src/data/latest-things.json` | Edited by the Portfolio Manager |
| Projects | `src/data/projects.json` + `src/content/project-windows/*.md` | Hub and project windows |
| Blog | `src/content/posts/*.md`, `series.json`, `blog-resources.json` | |
| Domain colours | `src/data/domain.json` | Used by the content scripts |
| Tools | `src/data/skills.json` | Used by the content scripts |
| Homepage "Latest things" cards | `src/data/latest-things.json` (project in progress), `publications.json` (latest paper), `projects.json` and the blog index (latest project or post) | See `src/hooks/useLatestThings.ts` |

Field-level details: `docs/CONTENT_SCHEMA.md`. The JSON files exist so the Portfolio Manager can edit them without
touching TypeScript.

## Build

`npm run build` runs, in order:

1. `scripts/generate-blog-index.ts` writes `public/blog-index.json` (reading time included).
2. `scripts/generate-seo.ts` writes `public/robots.txt`, `public/sitemap.xml`, `public/404.html` (SPA fallback),
   `public/blog/index.html` (redirect to the hub) and the redirects that keep old portfolio URLs working.
3. `tsc -b` then `vite build`.
4. `scripts/generate-seo.ts --pages` writes a real `dist/<route>/index.html` for every sitemap route, with its own
   title, description, canonical and Open Graph tags, then checks that each sitemap URL has a file. GitHub Pages
   would otherwise answer 404 on deep URLs. `404.html` stays for pages that do not exist.

Sitemap URLs, the static canonical and the runtime canonical (`Seo.tsx`, `buildCanonicalPath`) all end with `/`.
Base path: `/portfolio/` in production, `/` in dev, overridable with `VITE_PUBLIC_BASE_PATH`.

## Runtime

- `BrowserRouter` uses `import.meta.env.BASE_URL`, so dev and production share the same code.
- `Seo` sets title, description, canonical and Open Graph tags per route.
- Theme: light and dark through `data-theme` on `<html>`. Language: react-i18next.
- Accessibility: a skip link in `MainLayout`; one `<h1>` per page (Markdown headings start at `<h2>`); focus rings on
  every interactive element; `prefers-reduced-motion` turns smooth scrolling and the scene animations off.
- Analytics: `CookieBanner` stores the visitor's choice (`src/lib/consent.ts`, localStorage). `AnalyticsTracker`
  loads GA4 and Microsoft Clarity only when consent is granted, in a production build, and never on `localhost`.
  Clarity receives the consent signal (`consentv2`).

## Deployment

`.github/workflows/deploy.yml` builds and publishes on every push to `master`. Repository variables:
`VITE_SITE_URL`, `VITE_PUBLIC_BASE_PATH`, `VITE_GA_MEASUREMENT_ID`, `VITE_CLARITY_PROJECT_ID`, `VITE_GITHUB_USERNAME`.
Google Search Console is verified through the HTML file in `public/`.
