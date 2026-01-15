
# FINAL QA AUDIT REPORT — Portfolio + Blog (Static GitHub Pages)

Date: 2026-01-14  
Production base URL (assumed): https://aurvl.github.io/portfolio/  
Posts routing (assumed): `pages/post.html?id=...`  
Scope audited: root pages + blog pages + CSS/JS/data + SEO files.

---

## A) Critical bugs (must fix before deploy)

### A1 — Post page hard dependency on CDN `marked` (blank page risk)
- Severity: Critical
- Affected pages/files: [pages/post.html](pages/post.html), [js/post.js](js/post.js)
- Root cause hypothesis: The post renderer calls `marked.parse(...)` (Markdown rendering) without guarding against `marked` being unavailable. If `https://cdn.jsdelivr.net/npm/marked/marked.min.js` fails to load (adblock, CDN outage, captive portal), `marked` is undefined and the script will throw, leaving the post in a broken “Loading post…” state.
- Recommended fix (high-level): Add a runtime guard in `post.js` (and/or a small fallback renderer) so the page still renders at least plain text / minimal HTML when `marked` is unavailable; optionally self-host a pinned copy of marked under `assets/`.
- How to verify:
	1) Open a post URL like `pages/post.html?id=house-price-pred`.
	2) Simulate CDN failure (block `cdn.jsdelivr.net` in devtools or via an extension).
	3) Confirm the page still displays title/meta/excerpt/content (even with degraded formatting) and no uncaught exceptions.

### A2 — Explore Projects: project title links can be empty but still open a new tab
- Severity: High
- Affected pages/files: [explore-projects.html](explore-projects.html), [explore-projects_fr.html](explore-projects_fr.html), [js/app-expl.js](js/app-expl.js), [data/projects.json](data/projects.json), [data/projects_fr.json](data/projects_fr.json)
- Root cause hypothesis: `app-expl.js` renders the project title as `<a href="${project.link1}" target="_blank">...` even when `link1` is an empty string in JSON (seen in multiple project entries). Clicking the title can open a blank tab / same page in a new tab, which feels broken.
- Recommended fix (high-level): When `link1` is empty, either (a) render the title as plain text (no anchor), or (b) fall back to `link2`, or (c) disable pointer events / show “Coming soon”. Also add `rel="noopener noreferrer"` for any `target="_blank"`.
- How to verify:
	1) Open Explore Projects and click multiple project titles.
	2) Confirm every title click leads to a valid destination (no blank new tabs).
	3) Confirm `target=_blank` links have `rel`.

### A3 — Uncaught null risk in home script if DOM assumptions change
- Severity: High
- Affected pages/files: [index.html](index.html), [home_fr.html](home_fr.html), [js/app.js](js/app.js)
- Root cause hypothesis: `app.js` calls `menuToggle.addEventListener(...)` and `form.addEventListener(...)` without checking if elements exist. Today those pages include `#menu-toggle` and `#myForm`, but any future reuse of `app.js` on another page (or template drift) will cause immediate runtime errors.
- Recommended fix (high-level): Add defensive guards for required DOM nodes in `app.js` (and similarly in `app-expl.js` / other scripts). This makes “graceful fallback” real instead of best-effort.
- How to verify:
	1) Temporarily remove the contact form block in a dev branch OR load the script on a page without `#myForm`.
	2) Confirm no console exceptions.
	3) Confirm existing behavior remains unchanged on index/home.

---

## B) Functional inconsistencies

### B1 — Language switch behavior is inconsistent across sections (portfolio vs explore vs blog)
- Severity: High
- Affected pages/files: [index.html](index.html), [home_fr.html](home_fr.html), [explore-projects.html](explore-projects.html), [explore-projects_fr.html](explore-projects_fr.html), [pages/blog.html](pages/blog.html), [pages/blog_fr.html](pages/blog_fr.html), [js/app.js](js/app.js), [js/app-expl.js](js/app-expl.js)
- Root cause hypothesis:
	- Portfolio + Explore use `changeLanguage(...)` and persist `selectedLanguage` in localStorage.
	- Blog pages use inline `onchange="window.location.href=this.value"` and do not write `selectedLanguage`.
	- Result: switching language on blog doesn’t carry back to the portfolio/explore pages, and the stored language preference may unexpectedly override user intent when returning to home.
- Recommended fix (high-level): Standardize language switching logic across all pages (single shared helper + consistent localStorage key usage). Decide whether language preference should be “global” or “per-section”, then implement consistently.
- How to verify:
	1) Set language to FR on home, go to blog, switch to EN, return home.
	2) Confirm the site respects the user’s last selection consistently.
	3) Verify there are no surprise redirects on page load.

### B2 — Inconsistent navbar/brand link targets (logo behavior differs)
- Severity: Medium
- Affected pages/files: [index.html](index.html), [home_fr.html](home_fr.html), [explore-projects.html](explore-projects.html), [explore-projects_fr.html](explore-projects_fr.html), [pages/blog.html](pages/blog.html), [pages/blog_fr.html](pages/blog_fr.html), [pages/post.html](pages/post.html)
- Root cause hypothesis: Some logos use `href="#"` (doesn’t navigate), while others link to `index.html` or `home_fr.html`. This is inconsistent and breaks expected “click logo to go home” behavior.
- Recommended fix (high-level): Make the logo consistently link to the correct home for the current language (EN→`/` or `index.html`, FR→`home_fr.html`).
- How to verify: Click the logo on every page (desktop + mobile); confirm it navigates home in the correct language.

### B3 — Explore Projects filtering features do not match the stated requirements (no text search)
- Severity: Medium
- Affected pages/files: [explore-projects.html](explore-projects.html), [explore-projects_fr.html](explore-projects_fr.html), [js/app-expl.js](js/app-expl.js)
- Root cause hypothesis: The Explore page implements period (year) and tool filters, but there is no search input in HTML and no text filter logic in JS.
- Recommended fix (high-level): Add a lightweight search input (title/description/tools match) using existing layout patterns (same container/margins). Ensure counters update after search too.
- How to verify:
	1) Type a keyword present in project title/description.
	2) Confirm project grid filters live and counters update.
	3) Confirm combining filters (year+tool+search) works.

### B4 — Blog Post “missing id” redirect always goes to EN list
- Severity: Medium
- Affected pages/files: [pages/post.html](pages/post.html), [js/post.js](js/post.js)
- Root cause hypothesis: When `id` is missing, code redirects to `blog.html` without considering language context.
- Recommended fix (high-level): Determine language from referrer, stored preference, or a query param (e.g. `?lang=fr`) and redirect accordingly.
- How to verify:
	1) Open `pages/post.html` without params.
	2) Confirm redirect lands on the correct language blog page.

---

## C) Responsive issues (by breakpoint)

Notes: These are breakpoint-targeted risks based on CSS structure and fixed header layouts; verify in devtools responsive mode and on real devices.

### C1 — 390px (iPhone)
- Severity: High
- Affected pages/files: [index.html](index.html), [home_fr.html](home_fr.html), [css/style.css](css/style.css)
- Root cause hypothesis: Fixed header + complex navbar content (language select + theme toggle + burger) can produce horizontal crowding. Several images use non-informative sizing (`width="auto" height="100%"`) which can lead to layout instability.
- Recommended fix (high-level): Ensure the desktop `.navbar` fully collapses and only `#mobile-nav` is visible; enforce `max-width: 100%` on media; add consistent image sizing/aspect-ratio in CSS.
- How to verify:
	1) At 390px, scroll + open mobile menu.
	2) Confirm no horizontal scroll (`overflow-x`) and all controls are reachable.

### C2 — 430px
- Severity: Medium
- Affected pages/files: [pages/blog.html](pages/blog.html), [pages/blog_fr.html](pages/blog_fr.html)
- Root cause hypothesis: Blog controls stack at `max-width: 500px` which is good; risk remains around header/menu overlap and card spacing due to combined `style.css` + `style-expl.css` rules.
- Recommended fix (high-level): Consolidate blog page styling to avoid conflicting navbar/grid rules; verify `.navbar.active` menu panel doesn’t cover search/filters.
- How to verify: Toggle burger menu and interact with search/filter controls; confirm nothing is hidden behind the fixed header.

### C3 — 768px (iPad mini) and 820px (iPad Air)
- Severity: Medium
- Affected pages/files: [pages/post.html](pages/post.html), [css/style.css](css/style.css)
- Root cause hypothesis: Post layout switches between “sidebar hidden” and “sidebar visible” across breakpoints (900px / 1000px rules). Mid-tablet widths can feel cramped: TOC/sidebar may appear/disappear unexpectedly, and content width can become narrow.
- Recommended fix (high-level): Align breakpoints for TOC/sidebar/margins and test the transition widths; keep a consistent reading width.
- How to verify: Resize from 700→1000px; confirm no sudden layout jumps or overlapping elements.

### C4 — 1024px (iPad Pro)
- Severity: Low
- Affected pages/files: [pages/post.html](pages/post.html)
- Root cause hypothesis: Sidebar (220px) + gap (40px) can reduce main column width, increasing line breaks and vertical scroll.
- Recommended fix (high-level): Reduce sidebar width or gap at tablet widths; ensure main column has comfortable min-width.
- How to verify: Confirm main content remains readable and TOC doesn’t truncate excessively.

### C5 — 1366px and 1920px+
- Severity: Low
- Affected pages/files: [pages/blog.html](pages/blog.html), [pages/blog_fr.html](pages/blog_fr.html)
- Root cause hypothesis: Blog grids are capped (`max-width: 1050px`) leaving large unused whitespace. This isn’t a bug but may look sparse.
- Recommended fix (high-level): Optionally increase max-width slightly using existing container patterns (no redesign).
- How to verify: Check large screens; confirm the layout still feels balanced.

---

## D) Performance risks

### D1 — Heavy `backdrop-filter` usage across many components
- Severity: Medium
- Affected pages/files: [css/style.css](css/style.css), [css/style-expl.css](css/style-expl.css)
- Root cause hypothesis: Glassmorphism utilities apply `backdrop-filter: blur(...)` broadly (header, cards, inputs). On iOS/Safari and low-end GPUs, this can cause scroll jank and increased battery usage.
- Recommended fix (high-level): Limit `backdrop-filter` to a smaller set of elements (e.g., header only), reduce blur radius, and add a `prefers-reduced-transparency`/`prefers-reduced-motion` fallback.
- How to verify:
	1) Lighthouse/Performance profile on mobile.
	2) Confirm reduced paint cost during scroll.

### D2 — Blog pages load both main CSS and explore CSS
- Severity: Medium
- Affected pages/files: [pages/blog.html](pages/blog.html), [pages/blog_fr.html](pages/blog_fr.html)
- Root cause hypothesis: Blog pages include both `style.css` and `style-expl.css` plus inline CSS. This increases CSS parse time, raises conflict risk, and duplicates font imports.
- Recommended fix (high-level): Extract only the needed explore-grid styles into a small shared file or move the reusable grid rules into `style.css`.
- How to verify: Compare network+performance timings before/after; confirm no layout regressions.

### D3 — Remote icon/fonts dependencies can slow first render
- Severity: Low
- Affected pages/files: [index.html](index.html), [home_fr.html](home_fr.html), [explore-projects.html](explore-projects.html), [explore-projects_fr.html](explore-projects_fr.html), [pages/blog.html](pages/blog.html), [pages/blog_fr.html](pages/blog_fr.html)
- Root cause hypothesis: Multiple third-party resources (Font Awesome kit, Boxicons, Devicon, Google Fonts) are used. Some are loaded in the head and may impact first render.
- Recommended fix (high-level): Use `preconnect` for critical CDNs; consider self-hosting icons; defer non-critical scripts.
- How to verify: Lighthouse “Reduce unused JavaScript/CSS” and “Preconnect” checks; compare FCP/LCP.

---

## E) SEO issues

### E1 — Sitemap includes only the homepage
- Severity: High
- Affected pages/files: [sitemap.xml](sitemap.xml)
- Root cause hypothesis: The sitemap lists only `https://aurvl.github.io/portfolio/` and omits all other indexable pages (home_fr, explore pages, blog list, post template).
- Recommended fix (high-level): Expand sitemap to include:
	- `/home_fr.html`
	- `/explore-projects.html`, `/explore-projects_fr.html`
	- `/pages/blog.html`, `/pages/blog_fr.html`
	- Consider whether to include `/pages/post.html` (template) or rely on internal linking (static template URLs are OK, but query-based posts can’t be enumerated unless you generate per-post URLs).
- How to verify:
	1) Submit sitemap in Google Search Console.
	2) Confirm discovered URLs include the key pages.

### E2 — Blog list + post pages lack meta description and structured data
- Severity: Medium
- Affected pages/files: [pages/blog.html](pages/blog.html), [pages/blog_fr.html](pages/blog_fr.html), [pages/post.html](pages/post.html)
- Root cause hypothesis: Blog pages have `<title>` but no `<meta name="description">`, and no JSON-LD for Blog/Article. This reduces snippet quality and search understanding.
- Recommended fix (high-level): Add meta descriptions per page; add JSON-LD (Blog + BlogPosting). For posts, update JSON-LD dynamically in `post.js` based on the selected post (title/date/tags).
- How to verify: Use Google Rich Results Test and view “page source” + rendered DOM to confirm JSON-LD is present and valid.

### E3 — Language / hreflang strategy is incomplete
- Severity: Medium
- Affected pages/files: [index.html](index.html), [home_fr.html](home_fr.html), [pages/blog.html](pages/blog.html), [pages/blog_fr.html](pages/blog_fr.html)
- Root cause hypothesis: Pages do set `lang` on `<html>`, but there are no `<link rel="alternate" hreflang="...">` relationships between EN/FR equivalents.
- Recommended fix (high-level): Add hreflang pairs for EN/FR page equivalents (home, explore, blog). Keep consistent canonical URLs under the base URL.
- How to verify: Use SEO tools (Screaming Frog / Ahrefs) to confirm hreflang pairs are detected and non-conflicting.

---

## F) Accessibility issues

### F1 — Non-semantic interactive elements (theme toggle, burger, clickable spans)
- Severity: High
- Affected pages/files: [index.html](index.html), [home_fr.html](home_fr.html), [explore-projects.html](explore-projects.html), [explore-projects_fr.html](explore-projects_fr.html), [pages/blog.html](pages/blog.html), [pages/blog_fr.html](pages/blog_fr.html), [pages/post.html](pages/post.html)
- Root cause hypothesis: Several controls are `<div>` or `<span>` with click handlers and no keyboard/ARIA support (theme toggles, menu toggles, clickable “LinkedIn/Github/Hashnode” spans). Keyboard users may not be able to operate them.
- Recommended fix (high-level): Use `<button>` for toggles, add `aria-label`, `aria-expanded`, and keyboard handlers. Replace clickable spans with `<a>` elements.
- How to verify:
	1) Keyboard-only navigation (Tab/Enter/Space).
	2) Confirm focus order is logical and every control is operable.
	3) Test with a screen reader (NVDA/VoiceOver) for meaningful labels.

### F2 — Missing `rel="noopener noreferrer"` on external links with `target="_blank"`
- Severity: Medium
- Affected pages/files: Multiple pages (example: [index.html](index.html), [explore-projects.html](explore-projects.html), [explore-projects_fr.html](explore-projects_fr.html))
- Root cause hypothesis: Many external links use `target="_blank"` but omit `rel`. This is a security issue and also an a11y/user-safety concern.
- Recommended fix (high-level): Add `rel="noopener noreferrer"` consistently for all external `target="_blank"` links.
- How to verify: Search the built site HTML for `target="_blank"` and confirm `rel` is present.

### F3 — Heading hierarchy inconsistencies (H2 before H1 in sections)
- Severity: Low
- Affected pages/files: [index.html](index.html), [home_fr.html](home_fr.html)
- Root cause hypothesis: Some sections use an H2 “label” heading followed by an H1 within the section (e.g., ABOUT/Who am I). This isn’t fatal but can confuse assistive tech.
- Recommended fix (high-level): Keep one page-level H1 and use consistent section H2/H3 ordering.
- How to verify: Run an a11y outline tool and confirm heading levels are nested properly.

---

## G) Code hygiene / refactor opportunities (optional)

### G1 — Duplicate CSS systems (`style.css` vs `style-expl.css`) with overlapping selectors and divergent variable names
- Severity: Medium
- Affected pages/files: [css/style.css](css/style.css), [css/style-expl.css](css/style-expl.css), blog pages that load both
- Root cause hypothesis: Both CSS files define the same base tokens, navbar rules, glass utilities, etc., but use different variable names (`--text2-col` vs `--text2-color`, `--tool-col` vs `--tool-color`). Loading both increases maintenance cost and creates subtle override bugs.
- Recommended fix (high-level): Consolidate shared base styles into one file; keep `style-expl.css` only for Explore-specific layout rules.
- How to verify: Remove one stylesheet at a time in a dev branch and confirm visuals remain correct.

### G2 — Duplicate UI logic across `app.js`, `app-expl.js`, `ui-shared.js`
- Severity: Medium
- Affected pages/files: [js/app.js](js/app.js), [js/app-expl.js](js/app-expl.js), [js/ui-shared.js](js/ui-shared.js)
- Root cause hypothesis: Theme toggle + scroll-to-top + mobile menu patterns are repeated with small differences. This increases drift risk.
- Recommended fix (high-level): Move shared UI behavior into `ui-shared.js` and have all pages import it, keeping page-specific logic separate.
- How to verify: Confirm identical behavior of theme/menu/to-top on every page after consolidation.

### G3 — `window.onload = ...` assignments instead of `addEventListener`
- Severity: Low
- Affected pages/files: [js/app.js](js/app.js), [js/app-expl.js](js/app-expl.js)
- Root cause hypothesis: Assigning `window.onload` can clobber other `onload` handlers when pages evolve.
- Recommended fix (high-level): Replace with `window.addEventListener('load', ...)`.
- How to verify: Add a second load handler in another script and confirm both fire.

---

## Top-10 prioritized checklist (fix order)
1) Guard/fallback for Markdown rendering dependency on [pages/post.html](pages/post.html) / [js/post.js](js/post.js)
2) Fix Explore Projects title link behavior when `link1` is empty + add `rel` for `target=_blank`
3) Add `rel="noopener noreferrer"` across all external `target=_blank` links (site-wide)
4) Standardize language switching + persistence across portfolio/explore/blog
5) Expand [sitemap.xml](sitemap.xml) to include all key pages under the base URL
6) Add meta descriptions to blog list + post template; consider JSON-LD for Blog/Article
7) Convert non-semantic toggles (burger/theme) to accessible buttons with ARIA + keyboard support
8) Reduce CSS conflicts by consolidating shared rules between [css/style.css](css/style.css) and [css/style-expl.css](css/style-expl.css)
9) Revisit Explore Projects requirements: add text search filter + unify counters behavior
10) Performance pass: limit `backdrop-filter` scope and add reduced-transparency fallbacks

## Release-ready verdict
Verdict: **No**

Why: There is a genuine “blank page” risk on the post page if the Markdown CDN fails (Critical), plus multiple high-impact UX/security inconsistencies (empty links opening new tabs; missing `rel` on `target=_blank`; inconsistent language persistence). These should be addressed before deploy to ensure reliability, predictable navigation, and baseline security hygiene.

