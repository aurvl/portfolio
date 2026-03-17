# INSTRUCTIONS.md

## Purpose

This repository is a personal portfolio website and professional showcase. The model should help improve the portfolio as a coherent product, not as a collection of isolated files.

The priority is to produce clean, credible, recruiter-friendly, and technically consistent work.

## Main goals

The model should optimize for:

- clarity of positioning
- quality of project presentation
- frontend consistency
- responsiveness
- maintainability
- professional credibility
- simplicity over unnecessary complexity

## Working rules

### 1. Reuse existing patterns first

Before changing layouts, inspect the current codebase and identify:

- existing containers
- spacing systems
- typography hierarchy
- grids
- card patterns
- section wrappers

Always reuse existing patterns before creating new ones.

Do not introduce a new margin, width, or section structure if an equivalent already exists.

### 2. Avoid off-frame modifications

Only change what is necessary for the requested task.

Do not silently redesign nearby sections.
Do not refactor unrelated files unless it is required to make the requested change work.
Do not change visual identity unless explicitly requested.

### 3. Preserve section alignment consistency

A known failure mode is breaking visual consistency between sections.

Be especially careful that sections such as Blog, Projects, About, Hero, and Contact use the same layout logic when they are supposed to belong to the same visual system.

Before finalizing any layout change, compare it mentally against adjacent sections.

### 4. Keep code simple

Prefer:

- small functions
- explicit names
- readable HTML structure
- light JavaScript
- simple CSS rules
- minimal dependencies

Avoid:

- oversized components
- deep abstraction for trivial UI
- unnecessary animation
- dependency bloat
- premature optimization

### 5. Make portfolio content strong

When writing portfolio text, optimize for:

- clear role statement
- concise explanations
- business or research context
- concrete outcomes
- credibility
- readability

Project descriptions should usually answer:

- what problem was addressed
- what was built
- how it worked
- why it mattered

### 6. Audit with rigor

When asked to review the portfolio, do not give generic praise.

Evaluate:

- first impression
- UX
- information architecture
- project storytelling
- visual consistency
- conversion and credibility
- technical quality

Always prioritize feedback into critical, high-impact, and optional improvements.

### 7. Respect the stack

Unless asked otherwise, assume the portfolio may use HTML, CSS, JavaScript, React, or related frontend tooling.

Do not migrate the stack unless explicitly requested.

### 8. Default deliverable style

When implementing changes:

- explain assumptions briefly
- provide direct, runnable code
- mention which existing pattern is being reused
- keep solutions easy to modify later

When auditing:

- be direct
- be specific
- be useful
- avoid vague compliments

## Preferred output behavior

### For coding tasks

- inspect current code first
- identify reusable layout patterns
- implement the smallest good solution
- preserve responsiveness
- avoid style drift

### For audit tasks

- provide a structured review
- prioritize issues
- explain why each issue matters
- suggest the smallest meaningful next step

## Red flags to avoid

- inventing a new spacing system
- making Blog use different margins from Projects without reason
- replacing simple HTML/CSS with heavy abstractions
- describing projects in vague terms
- adding flashy UI that weakens credibility
- giving soft feedback when the portfolio has clear weaknesses

## Final check before answering

Ask internally:

- Did I reuse existing patterns?
- Did I stay within scope?
- Is the result simpler and clearer?
- Would this improve the portfolio for a recruiter or user?
