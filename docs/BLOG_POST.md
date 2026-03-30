# Blog Post Specification

This document defines the blog-post contract used by the portfolio app and the content scripts.

## File location

Blog posts live in `src/content/posts`.

Naming pattern:

- `<slug>.en.md`
- `<slug>.fr.md`

Example:

- `gradient-descent-intuition.en.md`
- `gradient-descent-intuition.fr.md`

## Frontmatter schema

Each post must use this frontmatter shape:

```md
---
slug: "gradient-descent-intuition"
seriesSlug: "ia-pas-a-pas"
lang: "en"
title: "How a model actually adjusts itself"
summary: "A short card-friendly summary."
date: "2026-03-30"
tags:
  - "optimization"
  - "gradient-descent"
  - "ai"
cover: "/assets/blog/images/blog6.jpg"
featured: false
---
```

Rules:

- `slug` must stay stable once published
- `lang` must be `en` or `fr`
- `seriesSlug` is optional, but if present it must exist in `src/data/series.json`
- `summary` must stay concise and should not exceed 50 words
- `tags` must contain at least one value
- `cover` must point to a valid asset under `public/` or to a valid absolute URL
- `featured` must be `true` or `false`

Do not add legacy keys such as `message`, `code-links`, or ad-hoc metadata fields.

## Body structure

The body must follow the shared markdown rules in `docs/MARKDOWN_CONTENT_RULES.md`.

Minimum requirements:

- at least one `#` heading
- concrete paragraphs, not placeholder text
- meaningful headings and tag choices
- no unsupported custom syntax

The scaffolding script starts from this structure:

- `# Introduction`
- `## Key idea` / `## Idee cle`
- `## Example or intuition` / `## Exemple ou intuition`
- `## Why it matters` / `## Pourquoi c'est utile`

You may adapt the subheadings, but keep the article readable and structured.

## Read time and indexing

Reading time is generated automatically from the markdown body by `scripts/generate-blog-index.ts`.

Do not edit `public/blog-index.json` manually.
Run:

```bash
npm run build
```

or

```bash
npm run dev
```

to regenerate the blog index.
