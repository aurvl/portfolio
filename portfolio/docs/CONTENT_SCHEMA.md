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

### Localized project fields

Store these under `en` and `fr`:

- `cover.alt`
- `taxonomy.keywords`
- `content.title`
- `content.summary`
- `content.description`

## Domain Colors

Location: `src/data/domain.json`

This file maps project domains to the text color used on project cards and featured project cards.

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

## Validation

- Type-level schemas live in `src/lib/content-schema.ts`
- Script-level validation lives in `scripts/validate_content.py`

Run:

```bash
python scripts/validate_content.py
```
