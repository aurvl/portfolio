# Agent guide

Entry point for AI agents working on this repository. Read this first, then only the docs your task needs.
This is the only agent file tracked in the repo: tool-specific files (`CLAUDE.md`, `.claude/`) are local and ignored.

## What this site is

The personal site of Aurel Vehi, applied economist and PhD researcher (ESTIA & University of Bordeaux).
Positioning: **from fragmented data to economic intelligence**. English and French, deployed on GitHub Pages
at `https://aurvl.github.io/portfolio/`.

Stack: React 19, TypeScript (strict), Vite, Tailwind CSS v4, framer-motion, react-router, i18next.

The current design is **v3** (editorial, sparse, photo-led), built on the branch `redesign/researcher-friendly`.
The V1 and V2 components are deleted: ignore any older doc, commit or memory that describes them. While the
redesign is open, personal content (profile, timeline, latest things, publications texts) is typed placeholder
text in `src/data/placeholders.ts`; it must be replaced by real content before the branch is merged.

## Where to look

| Task | Read |
| --- | --- |
| Understand the code, routes, build | `docs/ARCHITECTURE.md` |
| Change the look of a page, tokens, dark mode, accessibility rules | `docs/DESIGN_SYSTEM.md` |
| Visual specification and progress of the redesign | `design/BRIEF.md`, `design/PLAN.md` (redesign branch only) |
| Edit homepage text or sections | `docs/CONTENT_SCHEMA.md` (Homepage), `docs/CONTENT_RULES.md` |
| Add or edit a project | `docs/CONTENT_WORKFLOW.md`, `docs/CONTENT_SCHEMA.md`, `public/assets/projects/windows/README.md` |
| Add or edit a blog post | `docs/CONTENT_WORKFLOW.md`, `docs/BLOG_POST.md`, `docs/MARKDOWN_CONTENT_RULES.md` |
| Content operations end to end | `docs/AI_CONTENT_OPERATIONS.md` |

## Working rules

- Keep the plumbing (routes, i18n, theme, blog and series, SEO, scripts); change the presentation.
- Tailwind v4 only: tokens live in `@theme` (`src/styles/v3/tokens.css`). Never create a `tailwind.config.js` or use
  v3 syntax. No arbitrary values (`bg-[#...]`, `p-[37px]`) when a token exists; create the token instead.
- Reuse existing components and hooks before creating new ones. No new dependency without asking the owner.
- Semantic HTML and accessibility: one `<h1>` per page, `alt` on images, labels on buttons and fields, visible focus,
  WCAG AA contrast in light and dark mode, `prefers-reduced-motion` respected.
- Animate with framer-motion. Do not change the page and scene transitions unless the task is about them.
- The data JSON files (`src/data/*.json`) and `scripts/*.py` are read by the owner's Portfolio Manager. Do not
  rename, move or reshape them without telling the owner.
- Work one step at a time. During the redesign, update `design/PLAN.md` at the end of each step.
- Do not commit unless asked, and never push without the owner's approval.

## Code style

The owner is not a developer and must be able to read the code.

1. **Readability first.** Explicit class and variable names (no `.x1`, `.wrap2`). No dead code, no duplicated CSS:
   factor into `@theme` tokens or a shared class.
2. **Vertical layout.** CSS: one property per line. No inline `style={{...}}` in JSX unless the value is truly
   dynamic. Beyond 4 or 5 classes, split `className` over several lines with `cn()`, grouped by role (layout,
   spacing, type, colour, states, responsive). A component with complex styling gets a named class in
   `src/styles/v3/` instead of a long utility string.
3. **Comments in French**, none for the obvious (colour, border, padding). A comment is required the first time a
   complex technique appears in a file: `grid-template-areas`, `clamp()`, `position: sticky`, `z-index` and stacking
   contexts, `backdrop-filter`, `mask`, `scroll-snap`, `color-mix()`, `@keyframes`, transforms, container queries,
   advanced selectors, dark variants; in React: `layoutId` and framer-motion animations, `IntersectionObserver`,
   custom hooks. It explains why and what it does visually, in one or two simple lines. Each new component starts
   with one or two lines on its role and the screen where it appears.
4. **CSS property order:** position, display and layout, size, spacing, typography, colour and background, borders
   and shadows, animation.

## Editorial rules (non-negotiable)

- Every public claim must be defensible. Do not invent results, clients, partners, metrics or affiliations.
- Name only the institutions already on the site (ESTIA, University of Bordeaux). Do not add employers,
  partners, supervisors or logos without the owner's explicit approval.
- "Where I can help" is an invitation to discuss, not a service offer: no prices, no packages, no "hire me".
- Keep English and French in sync: every text change goes into both languages.
- Big titles have no trailing period.
- Private material (vision documents, PhD proposal, consulting notes, `.ai-memory/`) never enters this repo.
  The repository is public.

## Saving context

Never read `design/*.svg`, `dist/`, `node_modules/`, `*.log` or `package-lock.json`. Read targeted files rather than
exploring all of `src/`; use only the reference images from `design/screens/` that the current step needs.

## Before you finish

1. `npm run lint`
2. `npm run content:validate`
3. `npm run build` (also regenerates the blog index, sitemap, robots, 404, the legacy redirects and one static
   `index.html` per sitemap route)
4. Check the page you touched in light and dark mode, desktop and mobile (about 390px wide), and tab through it.

Commit only the files you meant to change. Do not commit `dist/`, logs or local memory.

## Deployment

Pushing to `master` deploys through `.github/workflows/deploy.yml`. Work on a branch and merge by pull
request. Content edits made with the owner's Portfolio Manager tool land on `master` directly, limited to
`src/content`, `src/data`, `public/assets/blog` and `public/assets/projects`.

GitHub Pages answers 404 on a path with no file, so every route in the sitemap gets a real
`dist/<route>/index.html` at build time (`scripts/generate-seo.ts --pages`). A new public route must be added to the
sitemap list in that script.
