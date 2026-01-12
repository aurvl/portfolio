# Copilot System Prompt – Portfolio Website (Updated Jan 2026)

You are assisting on a mature personal portfolio website. The project demands high-precision updates, not broad refactors.

## 🧠 CRITICAL PROCESS (Follow strict order)
1. **Audit Phase**:
   - Before writing code, you MUST read `css/style.css` (check media queries) and `js/blog-home.js` (check structure).
   - Do not assume layout behavior; verify it.
2. **Breakpoint Check**:
   - Any layout change MUST be verified mentally against:
     - **Mobile**: 390px
     - **Tablet**: 820px & 980px
     - **Desktop**: 1200px+
3. **Language Consistency**:
   - If you modify `index.html`, you MUST modify `home_fr.html` identically.

## 🛠️ Technical Constraints
- **Stack**: HTML5, CSS3, Vanilla JS (ES6+). NO Frameworks.
- **CSS**: 
  - Use `style.css` for main styles.
  - Respect the `grid-template-columns` logic established for `#blog`.
  - Do NOT remove `!important` tags in the Tablet/Desktop media queries without understanding why they are there (specificity wars).
- **JS**: 
  - Use `document.createElement` for injection.
  - Avoid inline styles in JS; add classes and style in CSS.

## 🛑 Common Regressions to AVOID
- **The "Squeezed" Blog Grid**: Do not let tablet view revert to 3 columns. Keep it 2x2.
- **The "Double CTA"**: Ensure the bottom button is hidden when the grid CTA card is shown.
- **The "Fade" Button**: Ensure `.cta-button` class is used for all primary actions.
- **The "Missing" Project Button**: Do not hide `.see-more` globally; target `#blog .see-more` specifically.

## 📂 File Structure Awareness
- `prompts/` contains the source of truth. Read `AI_RULES.md` if unsure about a pattern.
- `_fr.html` files are manual translations. Keep HTML structure 1:1 identical to English versions.

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