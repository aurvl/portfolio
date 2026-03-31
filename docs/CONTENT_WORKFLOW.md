# Content Workflow

This document explains how to create and validate portfolio content with the repository tooling.

## Source of truth

Use these files and folders as the editable content sources:

- `src/data/projects.json`
- `src/content/project-windows/`
- `src/content/posts/`
- `src/data/blog-resources.json`
- `src/data/series.json`
- `src/data/domain.json`

Do not edit generated files such as:

- `public/blog-index.json`
- `public/sitemap.xml`
- `public/robots.txt`

## Create a project

Minimal example:

```bash
npm run content:add-project -- --title-en "Customer Churn Monitor"
```

Recommended example:

```bash
npm run content:add-project -- \
  --title-en "Customer Churn Monitor" \
  --title-fr "Suivi du churn client" \
  --summary-en "Monitoring workflow for churn indicators and customer risk segmentation." \
  --summary-fr "Workflow de suivi des indicateurs de churn et segmentation du risque client." \
  --primary "https://github.com/aurvl/example" \
  --read-more "https://github.com/aurvl/example" \
  --github "https://github.com/aurvl/example" \
  --domain "Machine Learning" \
  --domain "Customer Analytics" \
  --tool "Python" \
  --tool "Scikit-Learn" \
  --keyword-en "churn" \
  --keyword-en "monitoring" \
  --keyword-fr "churn" \
  --keyword-fr "monitoring"
```

The script will:

- append a new entry to `src/data/projects.json`
- create `src/content/project-windows/<slug>.en.md`
- create `src/content/project-windows/<slug>.fr.md`
- default the cover path to `/assets/projects/images/<slug>-cover.<ext>`

Manual follow-up:

- replace all `TODO` placeholders
- add the cover asset under `public/assets/projects/images/`
- add new domain colors in `src/data/domain.json` if the script reports missing mappings

Useful flags:

- `--slug`
- `--date`
- `--status`
- `--technical-level`
- `--access public|private`
- `--featured`
- `--no-window`
- `--force`
- `--dry-run`

## Create a blog post

Minimal example:

```bash
npm run content:add-post -- --title-en "Why optimization needs a learning rate"
```

Series example:

```bash
npm run content:add-post -- \
  --title-en "Why optimization needs a learning rate" \
  --title-fr "Pourquoi l'optimisation a besoin d'un learning rate" \
  --series ia-pas-a-pas \
  --tag optimization \
  --tag ai
```

The script will:

- create `src/content/posts/<slug>.en.md`
- create `src/content/posts/<slug>.fr.md`
- apply the current frontmatter schema
- use the series cover when a matching `seriesSlug` is provided

Manual follow-up:

- replace all `TODO` placeholders
- adjust tags per language if needed
- confirm the cover asset under `public/assets/blog/images/`
- add an entry in `src/data/blog-resources.json` only when the article has optional code / repo / docs companion links

Useful flags:

- `--slug`
- `--date`
- `--series`
- `--tag`, `--tag-en`, `--tag-fr`
- `--cover`
- `--featured`
- `--languages en fr`
- `--force`
- `--dry-run`

## Validate content

Run:

```bash
npm run content:validate
```

The validator checks:

- `projects.json` ids, slugs, summaries, links, windows, and cover assets
- `series.json` slugs, localized fields, and cover assets
- `skills.json` ids, slugs, localized fields, and local icon references
- blog-post filename/frontmatter alignment, required fields, tags, cover paths, and headings
- `blog-resources.json` slug keys, allowed resource keys, and optional companion-link URLs
- project-window filename/frontmatter alignment and the required `Overview / Method / Value` structure
- obvious placeholder drift such as `TODO`

## Publish checklist

Before commit or push:

1. Run `npm run content:validate`
2. Run `npm run build`
3. Review the generated `public/blog-index.json` diff if blog content changed
