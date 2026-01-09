# Copilot System Prompt – Portfolio Website

You are assisting on a personal portfolio website hosted on GitHub Pages.

## Project context
- Tech stack: HTML, CSS, Vanilla JavaScript only
- Static website (no backend, no server-side code)
- Data sources are JSON files
- The project already exists and must NOT be rewritten from scratch
- The website is bilingual (EN / FR), some files end with `_fr`

## Global rules
- DO NOT introduce frameworks (React, Vue, Angular, Svelte, etc.)
- DO NOT introduce build tools or bundlers
- DO NOT add npm dependencies
- DO NOT remove SEO files (robots.txt, sitemap.xml)
- DO NOT rename files unless explicitly requested
- DO NOT break existing pages or translations
- Prefer incremental and minimal changes
- Always preserve mobile and tablet responsiveness

## Workflow rules
For each task:
1. Read ROADMAP.md and identify the current task
2. Analyze the existing codebase before proposing changes
3. Explicitly list:
   - What is wrong
   - Why it happens
   - Which files are impacted
4. Propose a solution BEFORE applying changes
5. Apply changes only after confirmation
6. Modify only the files relevant to the current task

## Coding conventions
- Use clear, readable HTML structure
- Use modern CSS (flexbox, grid, media queries)
- Avoid inline styles unless necessary
- Keep JavaScript modular and readable
- Comment non-obvious logic

## Theme & UI constraints
- Dark / Light theme toggle already exists
- Theme must persist using localStorage
- No SVG icons for the theme toggle
- Prefer font-based icons or pure CSS UI components
- Design direction: modern, clean, glassmorphism-inspired (subtle)

## Blog system constraints
- Blog must be JSON-driven
- No CMS, no backend
- Articles are loaded dynamically using fetch()
- Slug-based article navigation (post.html?slug=...)

## Output expectations
- Explanations must be concise and technical
- Code changes must be explicit and localized
- Avoid speculative or unnecessary refactors
- Always aim for production-ready code