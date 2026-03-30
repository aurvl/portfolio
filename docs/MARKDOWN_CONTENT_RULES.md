# Markdown Content Rules

This document defines the markdown conventions used across the portfolio.

These rules apply to:
- blog posts
- project windows
- future project detail pages

The goal is to keep content:
- readable
- structured
- agent-friendly
- reusable across the site

---

## 1. Supported standard markdown

The renderer supports standard Markdown and GitHub Flavored Markdown (GFM), including:

- headings
- paragraphs
- links
- images
- blockquotes
- bullet lists
- numbered lists
- tables
- fenced code blocks

---

## 2. Code blocks

Use fenced code blocks with an explicit language whenever possible.

Example:

```python
import pandas as pd
print("hello")
```

This helps the renderer apply the portfolio code-cell styling:

* rounded code shell
* top tab-style header
* copy button on the right
* line numbers
* lightweight inline syntax coloring for common languages

### Optional code block title

You may add a short label with `title="..."` or `label="..."`.

Example:

````md
```ts title="TypeScript SDK"
import { OpenRouter } from '@openrouter/sdk'
```
````

This title is used in the code-cell header instead of the raw language name.

### Multi-language code groups

The renderer also supports a lightweight tabbed code group using a markdown directive.

Syntax:

````md
:::codegroup
```ts title="TypeScript SDK"
import { OpenRouter } from '@openrouter/sdk'
```

```ts title="TypeScript (fetch)"
const response = await fetch('/api/chat')
```

```python title="Python"
from openai import OpenAI
```
:::
````

Rules:

* `:::codegroup` should contain only fenced code blocks
* each block should declare its language
* each block may define a short `title="..."` label
* if no title is provided, the language label is used

This feature is intentionally minimal:

* no report button
* no heavy math or syntax engine
* no extra markdown nesting inside the group
* the goal is a clean tabbed presentation, not a full docs platform component system
* code groups are foldable directly from their header

### Inline code

Use backticks for inline code fragments.

Example:

```md
Le champ `salary_in_usd` sert de cible.
```

Inline code is rendered with a monospace treatment based on `JetBrains Mono`.
Use it for:

* identifiers
* file names
* variables
* short code tokens

Avoid using inline code for ordinary prose or for emphasis.

### Inline color

You can color short inline fragments with one of five explicit markers:

```md
Le résultat est {red}critique{/red}, {blue}stable{/blue}, {green}validé{/green}, {yellow}à surveiller{/yellow} ou {purple}expérimental{/purple}.
```

Supported colors:

* `{red}...{/red}`
* `{blue}...{/blue}`
* `{green}...{/green}`
* `{yellow}...{/yellow}`
* `{purple}...{/purple}`

Rules:

* use this only for short inline emphasis
* do not use it for whole paragraphs
* do not mix it with code spans
* keep the usage intentional and sparse

The renderer applies a lightweight color span, not a semantic callout block.

### Inline math

You can write lightweight inline math with `$...$`.

Example:

```md
Le signal suit une logique de type $x_t = x_{t-1} + \epsilon_t$.
```

Supported inline math is intentionally minimal:

* superscripts: `$x^t$` and `$x^{2x}$`
* subscripts: `$x_t$`
* fractions: `$\frac{a}{b}$`
* simple operators and symbols: `+`, `-`, `*`, `:`

Rendering uses a serif treatment based on `PT Serif`.
This is a light inline syntax, not a full LaTeX engine.

---

## 3. Tables

Use standard GFM tables.

Example:

```md
| Tool | Role | Status |
|------|------|--------|
| PostgreSQL | storage | active |
| Power BI | reporting | active |
```

Tables will be rendered with rounded corners and portfolio styling.

---

## 4. Images

Use standard markdown image syntax.

Example:

```md
![Dashboard preview](/assets/projects/images/sales-analytics-dashboard-cover.png)
```

Guidelines:

* always provide meaningful alt text
* use project-specific images when possible
* keep image filenames explicit and clean

---

## 5. Links

Use standard markdown links.

Example:

```md
[Open GitHub repository](https://github.com/...)
```

Links should be descriptive and meaningful.

Avoid vague text such as:

* "click here"
* "link"
* "open"

Prefer:

* "Open GitHub repository"
* "Read full article"
* "Watch demo"

For project windows specifically:

* do not add a dedicated `Links` section in markdown
* do not duplicate project access metadata already stored in `projects.json`
* only use inline links when they are necessary inside the explanation itself

---

## 6. Blockquotes / citations

Use standard markdown blockquotes.

Example:

```md
> This project was designed to provide actionable outputs, not only visual polish.
```

Use blockquotes for:

* emphasis
* notes
* quoted statements
* important remarks

Do not overuse them.

---

## 7. Standard bullet lists

Normal lists may use:

* `-`
* `*`

Examples:

```md
- First point
- Second point

* Alternative point
* Another point
```

---

## 8. Custom semantic bullets

The renderer supports two custom semantic bullet styles inside markdown lists.

### Done / validated bullet

Use:

```md
- [v] Validated point
```

Meaning:

* completed
* good practice
* approved approach
* positive signal

### Avoid / no bullet

Use:

```md
- [!] Point to avoid
```

Meaning:

* wrong practice
* limitation
* bad assumption
* caution

Examples:

```md
- [v] Dataset cleaned before feature engineering
- [v] Outputs documented and reproducible

- [!] Avoid leaking future data into training
- [!] Do not interpret noise as stable signal
```

Important:

* `[v]` and `[!]` are custom portfolio conventions
* they are not plain standard markdown semantics
* agents must use them intentionally

---

## 9. Colored content panels

The renderer supports custom content panels using markdown directives.

Syntax:

```md
:::panel{tone="blue" title="Panel title"}
Panel body content
:::
```

Supported tones:

* `blue`
* `green`
* `red`

Examples:

```md
:::panel{tone="blue" title="Some examples"}
This section explains a concrete illustration.
:::

:::panel{tone="green" title="What worked well"}
The final workflow remained interpretable and reproducible.
:::

:::panel{tone="red" title="What to avoid"}
Do not compare scores without checking scale compatibility first.
:::
```

Panel rules:

* use a short title
* keep content focused
* use panels only when they add structure
* do not abuse them in every section

---

## 10. Writing style rules

### Keep content concrete

Use real project details:

* tools
* workflow
* outputs
* constraints
* choices
* trade-offs

### Avoid fluff

Do not write vague or inflated marketing text.

### Prefer clarity

Use short paragraphs and explicit headings.

### Keep hierarchy clean

Do not skip heading levels randomly.

For project windows specifically:

* `Overview`, `Method`, and `Value` must use `#`
* sub-sections under them must start at `##`
* deeper levels then continue normally with `###`, `####`, etc.

Example:

```md
# Overview

## Context and objectives
...

# Method

## Workflow
...

# Value

## Skills demonstrated
...
```

### Make content useful

Each section should help the reader understand:

* what the project does
* how it works
* why it matters

---

## 11. Agent instructions

When an AI agent writes markdown content for this portfolio:

1. Follow this markdown specification strictly
2. Use standard markdown whenever possible
3. Use custom conventions only when relevant
4. Do not invent unsupported claims
5. Keep text clear, specific, and portfolio-oriented
6. Use semantic bullets `[v]` and `[!]` correctly
7. Use `panel` blocks only when they improve readability
8. Always provide meaningful alt text for images
9. Prefer maintainable, predictable formatting over creative formatting tricks

---

## 12. Design principle

This markdown system is designed to be:

* shared across blogs and projects
* structured enough for AI agents
* flexible enough for richer storytelling
* stable enough for long-term maintenance
