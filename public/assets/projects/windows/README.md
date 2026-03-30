# Project Windows Specification

This document defines how project window markdown files must be written and maintained.

A **project window** is the modal-style detailed view opened from a project card when the user clicks **"Voir plus" / "Read more"** on the projects page.

This system is designed to:
- keep users on the portfolio longer
- provide more project context before they open external resources
- improve storytelling, credibility, and conversion
- let future AI agents create and maintain project detail content safely

---

## 1. Core principle

Project cards and project windows have different roles.

### Project card
A project card is a short preview used on the projects page or homepage.  
It should remain concise.

### Project window
A project window is a richer intermediate layer.  
It gives enough context for the visitor to understand:
- why the project matters
- how it was built
- what it demonstrates

A project window does **not** replace a full case study page.  
It is a structured and focused modal content block.

---

## 2. Source of truth

Each project has two content layers:

### A. `projects.json`
Used for:
- project metadata
- card display
- image references
- links
- tags
- featured logic
- multilingual short content

### B. project window markdown files
Used for:
- richer explanatory content shown inside the modal window

The markdown file must not duplicate unnecessary metadata already managed by `projects.json`.

Links and access mode stay in `projects.json`.

---

## 3. File location and naming

Each project window must be stored as a markdown file in a dedicated content directory.

Recommended structure:

```txt
portfolio/src/content/project-windows/
  sales-analytics-dashboard.en.md
  sales-analytics-dashboard.fr.md
  fear-greed-index-estimator.en.md
  fear-greed-index-estimator.fr.md
```

Naming rules:

* file name must match the project `slug`
* language suffix must be explicit: `.en.md` or `.fr.md`

Examples:

* `sales-analytics-dashboard.en.md`
* `sales-analytics-dashboard.fr.md`

---

## 4. Language rule

Each project window should exist in English and French when possible.

If both languages are available:

* `slug.en.md`
* `slug.fr.md`

If only one language exists temporarily:

* keep the available language
* do not invent a fake translation
* mark the missing translation clearly in internal notes if needed

---

## 5. What the React modal handles

The React component is responsible for:

* opening and closing the window
* overlay and modal shell
* close button
* tabs navigation
* scroll handling
* responsive layout
* rendering markdown content

Therefore, markdown files must **not** contain:

* close buttons
* modal containers
* arbitrary JSX UI wrappers
* duplicated shell layout code

The markdown file only provides structured content.

---

## 6. Required modal structure

Each project window must follow the same conceptual structure.

### Modal header

Displayed by the UI layer using project metadata:

* title
* tags
* technical level
* cover image

### Tabs

The modal content is organized around:

* Overview
* Method
* Value

Equivalent French labels may be used in UI:

* Vue d'ensemble
* Méthode
* Apport

If the UI displays project links or CTAs, it should read them from `projects.json`, not from markdown sections.

---

## 7. Required content sections

Each markdown file must include content for the following sections.

### Overview

Use this section to explain:

* context
* objectives
* why the project matters
* key problem addressed

### Method

Use this section to explain:

* assumptions
* architecture
* workflow
* methodology
* technologies used
* major technical choices

### Value

Use this section to explain:

* skills demonstrated
* outputs produced
* practical usefulness
* business/research/technical value
* why this project is meaningful in a portfolio

---

## 8. Recommended markdown structure

Each project window markdown file should follow this pattern:

```md
---
slug: "sales-analytics-dashboard"
lang: "en"
title: "Sales Analytics Dashboard"
summary: "Short optional summary for modal context."
---

## Overview

### Context and objectives
...

### Why it matters
...

## Method

### Initial assumptions
...

### Architecture
...

### Workflow
...

### Technologies used
...

## Value

### Skills demonstrated
...

### Outputs
...

### Impact or usefulness
...
```

---

## 9. Writing rules

### Rule 1 - Be concrete

Do not write generic or inflated text.  
Use specific project signals:

* data used
* workflow
* outputs
* technologies
* constraints
* real project value

### Rule 2 - No unnecessary fluff

The text must sound professional, not promotional or exaggerated.

### Rule 3 - Explain what the project proves

Each project window should help answer:

* what did this project require?
* what does it demonstrate?
* why should someone care?

### Rule 4 - Keep section logic clear

Do not mix:

* context
* implementation
* portfolio value
* metadata already handled by `projects.json`

### Rule 5 - Avoid repetition

Do not repeat the homepage card summary word for word unless necessary.

### Rule 6 - Readability first

Prefer short paragraphs, explicit section titles, and clean hierarchy.

---

## 10. Link source of truth

Project links and access mode are managed in `projects.json`.

Project window markdown files should therefore:

* not contain a dedicated `Links` section
* not duplicate the public/restricted resource inventory
* stay focused on explanatory content inside `Overview`, `Method`, and `Value`

If the UI needs to display links, it should read them from project metadata.

---

## 11. Agent instructions

When an AI agent creates or updates a project window:

1. Read the corresponding project entry in `projects.json`
2. Use the project `slug` as the markdown filename
3. Read all useful public project resources if available:

   * GitHub repo
   * live demo
   * article
   * documentation
   * README
4. Extract factual and meaningful information only
5. Write a structured markdown window following this spec
6. Do not add a dedicated `Links` section in markdown
7. Do not invent technical claims unsupported by the project resources
8. Do not add UI shell code inside markdown
9. Keep tone professional, concrete, and portfolio-oriented
10. Respect language of the target file (`en` or `fr`)
11. If some information is missing, stay concise rather than hallucinating

---

## 12. Minimum quality checklist

Before considering a project window complete, verify:

* The filename matches the project slug
* The language suffix is correct
* The markdown has all required sections
* The content is specific to the project
* The text explains both technical method and portfolio value
* The markdown does not duplicate link metadata managed in `projects.json`
* No modal UI code is embedded in the markdown
* No unsupported claims were invented

---

## 13. Relationship with future project pages

These project windows are intermediate portfolio layers.  
Later, some projects may also have:

* a full markdown case study
* a full project detail page
* external resources

The project window content should therefore remain:

* focused
* structured
* informative
* lighter than a full long-form case study
