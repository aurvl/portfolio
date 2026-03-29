# Content Rules

These rules exist so future agents can add or update content without breaking the portfolio.

## Project rules

1. `id` must stay stable once created.
2. `slug` must stay stable once published.
3. Only one project can have `"featured": true`.
4. Every featured project must have:
   - `links.primary`
   - `links.readMore`
   - `cover.src`
5. `content.en.summary` and `content.fr.summary` must stay card-friendly.
6. Project summaries must not exceed 50 words.
7. `taxonomy.tools` must stay language-agnostic.
8. `taxonomy.keywords` can be translated, but they should stay short and UI-friendly.
9. Do not add vague fields such as `link1`, `link2`, `month`, `year`, or numeric ordering fields.
10. If a project later gets a markdown page, keep `id`, `slug`, `links`, and `content` consistent with that page.

## Link semantics

- `primary`: the main destination for the project card
- `readMore`: the destination used by the featured project CTA
- `github`: repository URL when available
- `live`: deployed demo, article, or external showcase when available

## Image naming

Project covers live in `public/assets/projects/images`.

Naming pattern:

- `<project-slug>-cover.png`
- `<project-slug>-cover.jpg`
- `<project-slug>-cover.webp`

Do not introduce names like `p12.png`, `illust.png`, or `final-final-cover.jpg`.

## Skill rules

1. Skills must be stored under a category in `src/data/skills.json`.
2. Category `id` and skill `id` must be unique and stable.
3. Skill labels and descriptions must exist in both English and French.
4. `tags` should stay short, reusable, and filter-friendly.
5. Do not hardcode tool lists in React components when the skill already exists in `skills.json`.

## What agents may edit

Agents may safely edit:

- project `content`
- project `links`
- project `taxonomy`
- project `cover`
- skill categories
- skill labels and descriptions
- skill icons and tags

Agents must preserve:

- existing stable `id` values
- existing stable `slug` values
- the single-featured-project rule
- image naming conventions
- multilingual field shape
