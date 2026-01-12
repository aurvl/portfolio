# Project Roadmap – Portfolio Website (Updated Jan 2026)

**Status Overview**: 
- Core Features: ✅ Stable
- Responsive Layouts: ✅ Validated (Mobile/Tablet/Desktop)
- Blog System: ✅ JSON-driven & Active
- UI Polish: 🟡 Ongoing Refinements

---

## ✅ COMPLETED TASKS

### Phase 1: Core Structure & Branding
- [x] Initial HTML/CSS Setup with no frameworks.
- [x] Navbar & Footer logic.
- [x] Multilingual support (index.html / home_fr.html).

### Phase 2: Theme & UI
- [x] **Theme Switch**: Light/Dark mode with `localStorage` persistence.
- [x] **Glassmorphism**: Applied to cards and navbar.
- [x] **Mobile Menu**: Burger menu refactor, positioned correctly outside the flow.

### Phase 3: Blog System
- [x] **JSON Architecture**: Articles load from `data/posts.json`.
- [x] **Dynamic Injection**: `js/blog-home.js` fills the homepage grid.
- [x] **Slug Navigation**: `pages/post.html?id=...` handles distinct articles.

### Phase 4: Recent Stability Fixes (Critical)
- [x] **Tablet Layout Fix (Blog)**: Implemented strict 2x2 grid for `750px-1050px` range.
- [x] **Smart CTA Behavior**: 
  - Desktop: 3 cards + Button below.
  - Tablet: 4 cards (CTA component) + Button hidden.
  - Mobile: Stacked + Button below.
- [x] **Visual Consistency**: Unified `.cta-button` style across "Projects" and "Blog" sections.

---

## 🟡 CURRENT / ONGOING TASKS

### Phase 5: Deep Testing & Polish
- [ ] **Explore Projects Page**: Verify responsive behavior matches the homepage quality.
- [ ] **Blog Listing Page (`pages/blog.html`)**: Ensure grid layouts behave like the homepage (2 columns on tablet).
- [ ] **Performance**: Check image loading strategies (lazy loading?).
- [ ] **SEO**: Audit `sitemap.xml` and meta tags for new blog pages.

---

## 🧪 FUTURE / IDEAS (Not Priority)
- [ ] **Newsletter**: Placeholder exists, backend integration needed (Formspree or similar).
- [ ] **Admin Dashboard**: `blog-admin.html` exists but is basic. Could be enhanced.
- [ ] **Search**: Client-side search for blog articles using JS filter on JSON.

---

## 🔴 DEPRECATED / REMOVED
- Frameworks (React, Vue) -> Strictly forbidden.
- Complex Build Tools (Webpack, Vite) -> Keep it simple static.