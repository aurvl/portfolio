# Responsive rollback log

Date: 2026-03-28
Workspace: `c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old`
Scope: `lg` breakpoint investigation around `1024px`

## Objective

Reduce the visual right-side band seen at `1024px` and harden the sections that were most likely to create horizontal pressure at `lg`, while keeping the hero floating icons intentionally overflowing.

## Findings

1. Background effect, not only overflow
Reference: [globals.css](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\styles\globals.css)
The visible band on the right at `1024px` was strongly amplified by the global `body` background, especially the bottom-right radial gradient.

1b. True mobile overflow floor
Reference: [globals.css](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\styles\globals.css)
`body` used `min-width: 320px`, which guarantees horizontal overflow on narrower devtools widths such as `306px`.

1c. Breakpoint overlap at exactly `1024px`
Reference: [responsive.css](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\styles\responsive.css)
The custom media query used `@media (max-width: 1024px)` while Tailwind `lg:` starts at `min-width: 1024px`. At exactly `1024px`, both rule sets applied at once, creating a one-pixel overlap zone with mixed layout behavior.

1d. Real horizontal overflow source
References:
- [home.css](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\styles\home.css)
- [globals.css](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\styles\globals.css)

The document overflow at `1024px` was caused by absolutely positioned `.tool-tooltip` elements in the skills section. They extended past the right edge of the viewport and increased `documentElement.scrollWidth`, which exposed a visible strip on the right. A global `overflow-x: clip` guard and narrower wrapping tooltips were added.

2. Skills section was fragile at `lg`
Reference: [SkillsSection.tsx](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\components\home\SkillsSection.tsx)
The section used a horizontal flex row with a large gap and no wrapping, which could push the layout too wide or make the breakpoint feel cramped.

3. CTA widths were too rigid
References:
- [AboutSection.tsx](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\components\home\AboutSection.tsx)
- [FeaturedProjects.tsx](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\components\home\FeaturedProjects.tsx)
- [RecentPosts.tsx](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\components\home\RecentPosts.tsx)

Fixed percentage widths such as `w-[30%]` and `w-[20%]` were making the layout more brittle around intermediate viewport sizes.

4. Mobile projects behavior at `<=450px`
Reference: [FeaturedProjects.tsx](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\components\home\FeaturedProjects.tsx)
On small screens only, the recent projects fallback now renders as a native swipeable carousel with scroll snapping and a dynamic dot indicator. When a featured project exists, mobile now uses `ProjectCard` instead of `FeaturedProjectCard`. Desktop and tablet rendering remain intentionally unchanged.

5. Mobile navbar behavior at `<=450px`
References:
- [Navbar.tsx](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\components\layout\Navbar.tsx)
- [theme.css](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\styles\theme.css)
- [responsive.css](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\styles\responsive.css)

On small screens only, inline navigation is replaced by a burger button placed before the language switcher. The button opens a lightweight animated dropdown panel, closes on item click, preserves the existing section-scroll behavior, and closes on `Escape` or when leaving the mobile breakpoint.

6. Projects page catalog wiring
References:
- [ProjectsPage.tsx](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\pages\ProjectsPage.tsx)
- [ProjectFilters.tsx](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\components\projects\ProjectFilters.tsx)
- [SearchField.tsx](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\components\projects\SearchField.tsx)
- [FilterField.tsx](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\components\projects\FilterField.tsx)
- [ProjectsSummary.tsx](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\components\projects\ProjectsSummary.tsx)
- [en.json](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\locales\en.json)
- [fr.json](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\locales\fr.json)

The projects page now uses the full catalog for search, filters, sorting, summary metrics, and progressive loading by batches of 15. Search is applied across localized title, summary, and keywords before pagination is applied.

6b. Projects summary no longer depends on shared `StatBox`
Reference: [ProjectsSummary.tsx](c:\Users\aurel\Desktop\Portfolio\MAJ portf1\portfolio-old\portfolio\src\components\projects\ProjectsSummary.tsx)

The projects summary now renders its own local metric card component instead of reusing the shared `StatBox`. This keeps the summary styling isolated to the projects page and makes rollback straightforward.

## Applied changes

1. `portfolio/src/styles/responsive.css`
Changed the custom responsive breakpoint from `max-width: 1024px` to `max-width: 1023px` to remove the overlap with Tailwind `lg:`, removed the bottom-right radial gradient under that threshold, reduced the `gap-rersponsive` value using `clamp(...)`, and tightened the navbar shell/logo on small screens.

2. `portfolio/src/styles/globals.css`
Changed `body` from `min-width: 320px` to `min-width: 0` so very narrow viewports do not overflow by construction, and added horizontal clipping on `html` and `body`.

3. `portfolio/src/styles/home.css`
Reduced the maximum width of `.tool-tooltip`, allowed wrapping, and kept tooltip positioning centered so the skills tooltips no longer enlarge the page width.

4. `portfolio/src/components/home/SkillsSection.tsx`
Kept the section full width and switched the inner content stack to a vertical layout below `lg`, then restored a side-by-side layout from `lg` upward with a reduced gap.

5. `portfolio/src/components/home/AboutSection.tsx`
Made the content stack on smaller widths and changed CTA buttons from fixed percentages to fluid width with a minimum width.

6. `portfolio/src/components/home/FeaturedProjects.tsx`
Changed the CTA button to fluid width with a minimum width, added `<=450px` small-screen detection, added a native swipeable recent-projects carousel with a dynamic indicator, and switched featured mobile rendering from `FeaturedProjectCard` to `ProjectCard`.

7. `portfolio/src/components/home/RecentPosts.tsx`
Changed the CTA button to fluid width with a minimum width.

8. `portfolio/src/components/layout/Navbar.tsx`
Added a mobile-only burger menu state, preserved the existing section scroll logic, closed the menu on item click and `Escape`, and kept the desktop inline nav intact.

9. `portfolio/src/styles/theme.css`
Added localized burger button, animated mobile panel, and mobile nav link styles for the navbar only.

10. `portfolio/src/styles/responsive.css`
Enabled the burger button and mobile menu panel only at `<=450px`, without changing desktop or tablet navbar behavior.

## Rollback instructions

If the new responsive behavior is worse, revert exactly these edits:

1. In `portfolio/src/styles/responsive.css`
Restore the breakpoint and remove the custom mobile-only changes:
`@media (max-width: 1024px)`
Remove the `body { ... }` block inside that media query and restore:
`gap: 10rem;`
Also remove the `@media (max-width: 640px)` block that adjusts `.navbar-shell` and `.navbar-logo`.

2. In `portfolio/src/styles/globals.css`
Restore:
`min-width: 320px;`
Remove:
`overflow-x: clip;`

3. In `portfolio/src/styles/home.css`
Restore `.tool-tooltip` to:
- remove `max-width`
- restore `white-space: nowrap`
- remove `overflow-wrap: anywhere`
- remove `text-align: left`

4. In `portfolio/src/components/home/SkillsSection.tsx`
Restore the original classes:
- section: `bdc w-full py-15 md:py-12 xl:px-15 lg:px-10 flex flex-col items-center`
- header wrapper: `xl:px-12 md:p-12 md:pb-0 bdc lg:px-2`
- content row: `flex justify-between gap-20 xl:px-12 md:p-12 md:pt-0 lg:px-2`

Current patched row class:
`flex w-full flex-col gap-8 md:p-12 md:pt-0 lg:flex-row lg:justify-between lg:gap-10 lg:px-2 xl:px-12`

5. In `portfolio/src/components/home/AboutSection.tsx`
Restore:
- wrapper row: `flex p-8 md:p-12 gap-rersponsive`
- button container: `flex justify-center gap-3`
- buttons: `w-[30%]`

6. In `portfolio/src/components/home/FeaturedProjects.tsx`
Remove the `ProjectCard` import, remove the small-screen media detection and carousel state, restore the previous featured/non-featured rendering branches, and keep only the CTA width adjustment if desired.

7. In `portfolio/src/components/home/RecentPosts.tsx`
Restore the CTA width to:
`w-[20%]`

8. In `portfolio/src/components/layout/Navbar.tsx`
Remove the mobile menu state, effects, burger button, mobile panel markup, and restore the original navbar structure with inline nav plus language/theme controls only.

9. In `portfolio/src/styles/theme.css`
Remove the `.navbar-mobile-*` rules.

10. In `portfolio/src/styles/responsive.css`
Remove the `<=450px` activation rules for `.navbar-mobile-toggle` and `.navbar-mobile-panel-shell`.

11. In `portfolio/src/components/projects/ProjectsSummary.tsx`
Restore the `StatBox` import, remove the local `SummaryMetricCard` component, and replace the four summary cards back with `StatBox` instances.

## Validation checklist

1. Test at exactly `1024px` width in Chrome DevTools.
2. Check that the hero icons still overflow slightly and remain visible.
3. Check that no section introduces horizontal scroll.
4. Compare `1024px`, `1100px`, and `1280px` to ensure the transition still feels intentional.
