# Content Schema

This portfolio stores structured content in JSON so future agents can edit it safely without reverse-engineering UI components.

## Projects

Location: `src/data/projects.json`

Each project uses one multilingual object:

```json
{
  "id": "PJ001",
  "slug": "sales-analytics-dashboard",
  "status": "completed",
  "date": "2026-03-16",
  "featured": true,
  "technicalLevel": 2,
  "cover": {
    "src": "/assets/projects/images/sales-analytics-dashboard-cover.png",
    "alt": {
      "en": "Sales analytics dashboard project cover",
      "fr": "Visuel du projet sales analytics dashboard"
    }
  },
  "links": {
    "primary": "https://...",
    "readMore": "https://...",
    "github": "https://...",
    "live": "https://..."
  },
  "taxonomy": {
    "domains": ["Business Intelligence", "Sales Analytics"],
    "tools": ["PostgreSQL", "SQL", "Power BI", "Data Modeling"],
    "keywords": {
      "en": ["dashboard", "kpi", "customers", "sales"],
      "fr": ["dashboard", "kpi", "clients", "ventes"]
    }
  },
  "content": {
    "en": {
      "title": "Sales Analytics Dashboard",
      "summary": "Card-friendly summary.",
      "description": "Long-form project description."
    },
    "fr": {
      "title": "Sales Analytics Dashboard",
      "summary": "Resume concis pour les cartes.",
      "description": "Description longue du projet."
    }
  }
}
```

### Shared project fields

Keep these language-agnostic:

- `id`
- `slug`
- `status`
- `date`
- `featured`
- `technicalLevel`
- `links`
- `taxonomy.domains`
- `taxonomy.tools`

`featured` is still required by the schema and the validator (at most one project may be `true`), but the
Hub no longer reads it: the lead project and the row are chosen in `src/data/featured.json`.

On `/projects`, a project is listed under "applied studies" when one of its `taxonomy.domains` is in
`APPLIED_DOMAINS` (`src/pages/ProjectsPage.tsx`); everything else goes under "other technical work".

### Localized project fields

Store these under `en` and `fr`:

- `cover.alt`
- `taxonomy.keywords`
- `content.title`
- `content.summary`
- `content.description`

## Project Windows

Location: `src/content/project-windows`

Each enabled project window is stored as two markdown files:

- `<contentSlug>.en.md`
- `<contentSlug>.fr.md`

Required frontmatter:

```md
---
slug: "sales-analytics-dashboard"
lang: "en"
title: "Sales Analytics Dashboard"
summary: "Short modal summary."
---
```

Required body structure:

- `# Overview`
- `# Method`
- `# Value`

The React parser currently extracts those exact H1 headings, so do not translate or rename them inside the markdown files.

## Blog Posts

Location: `src/content/posts`

Each post is a markdown file named `<slug>.<lang>.md`.

Required frontmatter:

```md
---
slug: "gradient-descent-intuition"
seriesSlug: "ia-pas-a-pas"
lang: "en"
title: "How a model actually adjusts itself"
summary: "Short card-friendly summary."
date: "2026-03-30"
tags:
  - "optimization"
  - "gradient-descent"
  - "ai"
cover: "/assets/blog/images/blog6.jpg"
featured: false
---
```

Notes:

- `seriesSlug` is optional
- `lang` must match the filename suffix
- `tags` must be a non-empty list
- `summary` should remain under 50 words
- the body must contain at least one H1 heading
- read time and heading extraction are generated from markdown by `scripts/generate-blog-index.ts`

## Blog Resources

Location: `src/data/blog-resources.json`

Optional companion links for blog post detail pages live in a separate slug-keyed JSON object:

```json
{
  "regression-multiple-aggregation": {
    "code": "https://colab.research.google.com/...",
    "repo": "https://github.com/aurvl/AI-Step-by-Step/tree/main/bp1-linear-regression"
  }
}
```

Rules:

- keys must match an existing blog post `slug`
- allowed resource keys are only `code`, `repo`, and `docs`
- omit missing resources instead of inventing placeholders
- do not move these links into blog frontmatter

## Domain Colors

Location: `src/data/domain.json`

This file maps project domains to the colour of the domain badge on project cards (catalogue and homepage
selected work).

Use it as the single source of truth for domain color clusters:

- Keep domains that belong to the same family on the same color
- Reuse the same color for related domains, instead of inventing a new color for each label
- Keep the current economics cluster color on `#8cb9e9`
- Use `#9e9d9d` as the default fallback color for any domain that is not listed yet

Example:

```json
{
  "__default": "#9e9d9d",
  "Economics": "#8cb9e9",
  "Econometrics": "#8cb9e9",
  "Deep Learning": "#d946ef",
  "Machine Learning": "#d946ef",
  "Data Visualization": "#67e8f9",
  "Exploratory Data Analysis": "#38bdf8"
}
```

When you add a new project:

- If the project domain already exists in `domain.json`, reuse its color
- If it belongs to an existing cluster, map it to the cluster color
- If it is a new cluster, add a new entry in `domain.json`
- If no explicit mapping exists, the UI should fall back to `#9e9d9d`

## Skills

Location: `src/data/skills.json`

Skills are grouped by category so UI tabs and future filters can be driven by data:

```json
{
  "categories": [
    {
      "id": "data",
      "label": {
        "en": "Data and modeling",
        "fr": "Data et modelisation"
      },
      "description": {
        "en": "Core languages, data manipulation, modeling, and ML tooling.",
        "fr": "Langages, manipulation de donnees, modelisation et outils ML."
      },
      "items": [
        {
          "id": "SK001",
          "slug": "python",
          "icon": {
            "src": "https://...",
            "alt": {
              "en": "Python logo",
              "fr": "Logo Python"
            }
          },
          "content": {
            "label": {
              "en": "Python",
              "fr": "Python"
            },
            "description": {
              "en": "Data cleaning, EDA, machine learning, and automation workflows.",
              "fr": "Nettoyage de donnees, EDA, machine learning et workflows d'automatisation."
            }
          },
          "tags": ["data", "ml", "automation"]
        }
      ]
    }
  ]
}
```

### Shared skill fields

- `id`
- `slug`
- `icon.src`
- `tags`

### Localized skill fields

- `icon.alt`
- `content.label`
- `content.description`
- `category.label`
- `category.description`

## Homepage

### Section text

Location: `src/data/home.ts` (English, `homeEn`, and the `HomeContent` type) and `src/data/home.fr.ts`
(French, `homeFr`, same shape). Each key is one section: `nav`, `blog`, `projectsPage` and `contact`. 
TypeScript enforces that both languages have the same keys.

### Profile, timeline and About texts

Location: `src/data/homepage.json`, `{ "en": {...}, "fr": {...} }`, same shape in both languages. Keys: `profile`,
`timeline`, `aboutSections`, `aboutLabels`, `themes`, `landingLabels`, `publicationsLabels`. The types and the
`homepage.getX(lang)` accessors are in `src/data/homepage.ts`; components read everything through `homepage`.
The Portfolio Manager does not edit this file (site text changes go through a normal site update).

### Featured choices

Location: `src/data/featured.json`. What the owner chooses to promote; everything else is automatic.

```json
{
  "hub": {
    "lead": "fmarketmonitor",
    "row": ["slug-1", "slug-2", "slug-3", "slug-4"],
    "series": "ia-pas-a-pas",
    "text": { "slug-1": { "en": { "title": "...", "summary": "..." }, "fr": { "title": "...", "summary": "..." } } }
  },
  "latest": ["progress", "paper", "recent"],
  "cards": { "paper": { "en": { "title": "...", "description": "..." }, "fr": { } } }
}
```

- `hub.lead` is the large project of the Hub; `hub.row` the row of four next to it, in order. Unknown slugs are ignored; if
  `lead` no longer exists the Hub falls back to the automatic choice (`featuredProjects.ts`).
- `hub.series` is the slug of the series shown on the Hub (falls back to the series flagged `featured` in `series.json`).
- `hub.text` and `cards` are optional display texts: they replace the title and summary on the Featured card only, never
  the project, post or paper itself. An empty or missing value keeps the original text.
- `latest` is the order of the three landing cards (`progress`, `paper`, `recent`); a card missing from the list goes last.

### Publications

Location: `src/data/publications.json`, an array shared by the homepage section and `/publications`.

```json
{
  "title": "Article title",
  "authorsBefore": "Hilmi, N., ",
  "me": "Vehi, L.A.D.V.",
  "authorsAfter": ", Treskova, M. et al.",
  "journal": "Communications Sustainability",
  "reference": "1, 114 (2026)",
  "url": "https://doi.org/...",
  "kind": { "en": "Peer-reviewed article", "fr": "Article évalué par les pairs" },
  "status": { "en": "Published · 2026", "fr": "Publié · 2026" }
}
```

`me` is highlighted between the co-authors; `authorsBefore` / `authorsAfter` carry the punctuation.
`status` must state the real stage (published, accepted, under review), in both languages.

### Latest things (homepage cards)

Three cards under the banner, composed by `src/hooks/useLatestThings.ts`:

1. **Project in progress**: the first item with `state: "progress"` in `src/data/latest-things.json`.
2. **Latest research paper**: the most recent item of `publications.json` (by `date`).
3. **Latest project or post**: the more recent of the newest `completed` project and the newest blog post.

Cards stay short on purpose (a short title and a few words), because they are small, especially on mobile.

`src/data/latest-things.json`, `{ "en": [...], "fr": [...] }`:

```json
{
  "state": "progress",
  "title": "FMarketMonitor",
  "detail": "Economic project in progress",
  "projectSlug": "fmarketmonitor",
  "date": "2026-11-24"
}
```

- `state`: `progress` (shown on the homepage), `prep` (in preparation) or `done`. Only the first `progress` item is shown.
- `title` and `detail`: a few words each. `projectSlug` (optional) points to a project of `projects.json`: its cover is the
  thumbnail and the card opens its project window. `date` (optional) falls back to the project date.
- `publications.json` items carry a `date` (`YYYY-MM` when the day is unknown, otherwise `YYYY-MM-DD`).

## Validation

- `home.ts` / `home.fr.ts` are checked by TypeScript at build time. `homepage.json`, `featured.json`,
  `publications.json` and `latest-things.json` are not checked by the Python validator (the Portfolio Manager checks them
  on save: EN/FR parity, slugs, states, dates): follow the shapes above, run `npm run build` and look at the page
- Script-level validation lives in `scripts/validate_content.py`

Run:

```bash
python scripts/validate_content.py
```
