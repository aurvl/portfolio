# Agent guide

Entry point for AI agents working on this repository. Read this first, then only the docs your task needs.

## What this site is

The personal site of Aurel Vehi, applied economist and PhD researcher (ESTIA & University of Bordeaux).
Positioning: **from fragmented data to economic intelligence**. English and French, deployed on GitHub Pages
at `https://aurvl.github.io/portfolio/`.

The current version is the **V2 redesign** (Codex-like: sparse text, visual, intuitive). The V1 components
are deleted; ignore any older doc, commit or memory that describes them.

## Where to look

| Task | Read |
| --- | --- |
| Understand the code | `docs/ARCHITECTURE.md` |
| Change the look of a page | `docs/DESIGN_SYSTEM.md` |
| Edit homepage text or sections | `docs/CONTENT_SCHEMA.md` (Homepage), `docs/CONTENT_RULES.md` |
| Add or edit a project | `docs/CONTENT_WORKFLOW.md`, `docs/CONTENT_SCHEMA.md`, `public/assets/projects/windows/README.md` |
| Add or edit a blog post | `docs/CONTENT_WORKFLOW.md`, `docs/BLOG_POST.md`, `docs/MARKDOWN_CONTENT_RULES.md` |
| Content operations end to end | `docs/AI_CONTENT_OPERATIONS.md` |

## Editorial rules (non-negotiable)

- Every public claim must be defensible. Do not invent results, clients, partners, metrics or affiliations.
- Name only the institutions already on the site (ESTIA, University of Bordeaux). Do not add employers,
  partners, supervisors or logos without the owner's explicit approval.
- "Where I can help" is an invitation to discuss, not a service offer: no prices, no packages, no "hire me".
- Keep English and French in sync: every text change goes into both languages.
- Big titles have no trailing period.
- Private material (vision documents, PhD proposal, consulting notes, `.ai-memory/`) never enters this repo.
  The repository is public.

## Before you finish

1. `npm run lint`
2. `npm run content:validate`
3. `npm run build` (also regenerates the blog index, sitemap, robots, 404 and legacy redirects)
4. Check the page you touched in light and dark mode, desktop and mobile (about 390px wide).

Commit only the files you meant to change. Do not commit `dist/`, logs or local memory.

## Deployment

Pushing to `master` deploys through `.github/workflows/deploy.yml`. Work on a branch and merge by pull
request. Content edits made with the owner's Portfolio Manager tool land on `master` directly, limited to
`src/content`, `src/data`, `public/assets/blog` and `public/assets/projects`.
