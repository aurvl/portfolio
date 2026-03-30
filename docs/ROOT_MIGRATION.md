# Root Migration Notes

Date: 2026-03-30

## What changed

- The React + Vite app was promoted to become the main project at repository root.
- The old static site was removed from the main root flow and is no longer kept in the active repository structure.
- Legacy resume files were preserved under `public/assets/downloads/`.
- Legacy analytics was migrated as GA4. No GTM container was found.
- SEO foundations were added around route metadata, canonical tags, Open Graph tags, robots, sitemap, and a GitHub Pages SPA fallback.

## Legacy preservation strategy

- Files still useful for the live app were moved into the new app structure.
- Obsolete static pages, scripts, and source assets were removed instead of being left mixed into the active root.
- Broken legacy links to old `pages/post.html` routes were normalized to the new `/projects?project=...` route.

## Manual follow-up

- Register the site in Google Search Console.
- Submit the generated sitemap URL.
- If the deployment URL changes, update `.env` from `.env.example` and rebuild.
