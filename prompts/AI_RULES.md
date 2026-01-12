# AI Assistant Rules & Project Guardrails

You are assisting on a static portfolio website context. The project has reached a mature state with specific, validated layout rules that **MUST NOT** be broken.

## 🛑 NON-NEGOTIABLE GUARDRAILS (DO NOT BREAK)

### 1. Responsive Breakpoints Rules
The project uses specific ranges that are now locked. Do not guess breakpoints; use these:
- **Mobile**: `<= 749px` (Stacking layout, 1 column)
- **Tablet**: `750px` to `1050px` (Specific 2-column grids)
- **Desktop**: `>= 1051px` (Full 3-column layouts)
- **Large Desktop**: `>= 1200px` (Max widths apply)

### 2. Homepage Blog Section Rules
The `index.html` and `home_fr.html` blog section has a complex responsive logic implemented in `style.css` + `js/blog-home.js`.
- **Desktop (>= 1051px)**:
  - Display exactly **3 blog cards** in 1 row.
  - The "See more" orange button must be **centered below** the grid.
  - **NO** 4th placeholder card allowed in the grid.
- **Tablet (750px - 1050px)**:
  - Display exactly **4 cards** in a 2x2 grid.
  - The 4th card is a special "CTA Card" injected via JS but **controlled via CSS**.
  - The "See more" orange button below the grid must be **HIDDEN** to avoid duplication.
- **Mobile (<= 749px)**:
  - Standard stacking (1 column).
  - Orange button visible below.

### 3. UI Component Constraints
- **CTA Buttons** (`.cta-button`):
  - Do NOT change their position in the DOM (they live outside the grid).
  - Do NOT create new button styles; reuse `.cta-button` which unifies "Projects" and "Blog" buttons.
  - Style: Orange background (`#fb5607`), White text, Blue hover (`#0067B1`).
- **Cards**:
  - All cards (`.blog-card`, `.cta-card`) must share `border-radius: 15px` and hover effects.

### 4. Code Hygiene
- **CSS**: Prefer specific media queries over overwriting base styles. Check for conflicting `display: flex` vs `display: grid` rules before applying changes.
- **JS**: JavaScript is ONLY for data injection (JSON -> HTML). Do **not** use JS for layout changes (window resize listeners) -> use CSS Media Queries.

## ⛔ THINGS TO STOP DOING
- **STOP** trying to center the CTA button by moving it inside the grid on desktop. It lives outside.
- **STOP** adding "placeholder" cards on desktop.
- **STOP** guessing margins. Use the global container widths defined in `style.css`.
- **STOP** modifying the "Projects" section button when fixing the "Blog" section. They are separate but share a class.

## Workflow Requirements
1. **Analyze First**: Run `grep` or `read_file` to see existing media queries.
2. **Respect Language**: Changes to `index.html` usually need mirroring in `home_fr.html`.
3. **Verify Breakpoints**: If asked to fix a layout bug, check `750px`, `980px`, and `1051px` explicitly.
