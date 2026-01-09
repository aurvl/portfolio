# Project Roadmap – Portfolio Website

Tech stack:
- HTML / CSS / Vanilla JavaScript
- Static site (GitHub Pages)
- No backend
- JSON as data source

General rules:
- Do NOT introduce frameworks (React, Vue, etc.)
- Do NOT break existing pages
- Keep SEO files (robots.txt, sitemap.xml)
- Prefer small, incremental changes
- Always preserve responsive behavior (mobile/tablet)

---

## Task 0 – Setup & audit
Goal:
- Understand current structure
- Identify layout constraints and global containers

---

## Task 1 – Fix large screen layout bug
Problem:
- On large desktop screens, layout does not fill available width
- Large empty space appears on the right

Expected outcome:
- Layout is full-width on large screens (24–27")
- No empty unused space

Files involved:
- index.html
- styles/*.css

---

## Task 2 – Update site title & navbar
Goal:
- Replace "Aurel Personal Portfolio" with new branding
- Prepare navbar for Blog page

---

## Task 3 – Theme switch (dark/light)
Goal:
- Improve existing theme toggle
- Replace emoji with proper UI component
- Persist theme with localStorage

Constraints:
- No SVG icons
- Prefer font-based icons or CSS toggle

---

## Task 4 – Footer responsive fix
Goal:
- Center footer content on small screens
- Improve spacing and alignment

---

## Task 5 – Skills refactor
Changes:
- Add PyTorch, MongoDB, Cypher
- Remove TensorFlow, Jupyter, MySQL

---

## Task 6 – Experience correction (CSM / ECOSEAS)
Changes:
- Replace title "Research Assistant"
- Use "Econometrician – Illegal Fishing (IUU)"
- Rewrite description accordingly

---

## Task 7 – Blog system (JSON-based)
Goal:
- Create blog.html
- Load articles from posts.json
- Create post.html (slug-based)
- Connect homepage "Articles" section to JSON

---

## Task 8 – Blog admin page
Goal:
- Create blog-admin.html
- Generate post objects for posts.json

---

## Task 9 – Newsletter (optional)
Goal:
- Add newsletter UI
- External service integration or placeholder

---

## Task 10 – Global glassmorphism polish
Goal:
- Apply consistent glassmorphism style
- Preserve readability in dark/light modes