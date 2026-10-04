# Aurel Vehi · Portfolio

Personal site of Aurel Vehi, applied economist and PhD researcher: from fragmented data to economic
intelligence. React 19, TypeScript, Vite, Tailwind v4, bilingual (EN/FR), deployed on GitHub Pages.

Live: https://aurvl.github.io/portfolio/

## Commands

```bash
npm install
npm run dev               # local site (regenerates the blog index and SEO files first)
npm run build             # production build in dist/
npm run lint
npm run content:validate  # checks projects, posts, series, skills and blog resources
npm run content:add-project -- --title-en "..."
npm run content:add-post -- --title-en "..."
```

## Documentation

- `AGENTS.md`: start here (rules and doc map for AI agents and contributors)
- `docs/ARCHITECTURE.md`: code layout, data flow, build and runtime
- `docs/DESIGN_SYSTEM.md`: V2 visual language
- `docs/CONTENT_SCHEMA.md`, `docs/CONTENT_RULES.md`, `docs/CONTENT_WORKFLOW.md`: content model and workflow
- `docs/BLOG_POST.md`, `docs/MARKDOWN_CONTENT_RULES.md`: writing posts and project windows
