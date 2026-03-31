# AI Content Operations

This document is the operating guide for AI agents that add or update portfolio content.

## Goal

Use the repository scripts and documented schemas. Do not improvise a parallel workflow.

## Mandatory sources to read first

Before editing content, read:

1. `docs/CONTENT_WORKFLOW.md`
2. `docs/CONTENT_RULES.md`
3. `docs/CONTENT_SCHEMA.md`
4. `docs/MARKDOWN_CONTENT_RULES.md`
5. `docs/BLOG_POST.md` when touching blog posts
6. `public/assets/projects/windows/README.md` when touching project-window content

## Source-of-truth files

Agents may edit:

- `src/data/projects.json`
- `src/content/project-windows/*.md`
- `src/content/posts/*.md`
- `src/data/blog-resources.json`
- `src/data/series.json`
- `src/data/domain.json`

Agents must not manually edit generated outputs:

- `public/blog-index.json`
- `public/sitemap.xml`
- `public/robots.txt`
- `public/404.html`

## Required workflow

For a new project:

1. Run `npm run content:add-project -- ...`
2. Fill the generated `projects.json` entry and project-window markdown files
3. Add or confirm the project cover asset
4. Run `npm run content:validate`
5. Run `npm run build`

For a new blog post:

1. Run `npm run content:add-post -- ...`
2. Fill the generated markdown files
3. Add an optional `src/data/blog-resources.json` entry only if the post has code / repo / docs companion links
4. Confirm the cover path and series slug if used
5. Run `npm run content:validate`
6. Run `npm run build`

## Non-negotiable invariants

- Do not change published project ids such as `PJ021`
- Do not change published slugs unless explicitly requested
- Keep project data bilingual in `content.en` and `content.fr`
- Keep project windows bilingual and named `<contentSlug>.en.md` / `<contentSlug>.fr.md`
- Keep blog posts named `<slug>.en.md` / `<slug>.fr.md`
- Keep optional blog companion links in `src/data/blog-resources.json`, not in blog frontmatter
- Keep project-window H1 headings exactly `Overview`, `Method`, and `Value`
- Do not add unsupported frontmatter keys
- Do not leave `TODO` placeholders in committed content
- Do not move content into a new folder layout

## Safe editing rules

- Prefer updating structured data over hardcoding values in React components
- If you add a new project domain, check whether `src/data/domain.json` needs a color mapping
- If you add `seriesSlug` to a post, it must already exist in `src/data/series.json`
- If you touch local asset references, verify the files exist under `public/`
- Keep summaries short and card-friendly
- Keep markdown concrete and portfolio-oriented, not generic marketing prose

## Commit readiness

An AI content task is not complete until:

1. `npm run content:validate` passes
2. `npm run build` passes
3. generated files are refreshed if blog content changed
4. no broken local asset paths remain
