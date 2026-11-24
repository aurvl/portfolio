# Design system (v3)

The look is editorial and calm: sparse text, a photo of bamboo as the common thread, thin lines instead of cards,
a serif for big titles, one blue accent. The specification is `design/BRIEF.md`; this file describes what the code
does today. Do not reintroduce the old V2 style (warm greys, glass cards, mono labels everywhere).

## Style sheets

| Sheet | Role |
| --- | --- |
| `src/styles/globals.css` | Entry point: imports Tailwind, the v3 sheets, then the legacy variables |
| `src/styles/v3/tokens.css` | **The tokens** (`@theme`) and their dark values |
| `src/styles/v3/atoms.css` | Buttons, `.eyebrow`, `.tabular`, form fields, skip link, shared pieces |
| `src/styles/v3/navbar.css`, `landing.css`, `about.css`, `papers.css`, `contact.css`, `footer.css` | One sheet per homepage screen and the navbar |
| `src/styles/v3/hub.css`, `blog.css` | The Projects hub, series and article pages |
| `src/styles/v3/scene.css`, `touch-scene.css` | Homepage scene: desktop (sticky frame) and touch |
| `src/styles/v3/page-transitions.css` | Page-to-page View Transitions |
| `src/styles/markdown.css` | Article body (`.md-content__*`), code blocks, math, panels |
| `src/styles/blog-v2.css`, `projects-v2.css` | What remains of V2: subscribe form, article image rules, project window, filter fields |
| `src/styles/home-v2.css` | The `--hv-*` variables (still read by the two sheets above and by the cookie banner) and the cookie banner |
| `src/styles/theme.css`, `responsive.css` | Legacy variables and a few shared pieces (project window tabs, back-to-top button) |

Plain CSS written in these sheets is unlayered, so it beats Tailwind utilities (which live in a layer). To change
an existing rule, edit the sheet; do not stack a utility class on top.

## Tokens

All in `v3/tokens.css`, declared in `@theme static`. Tailwind v4 turns them into classes (`bg-page`, `text-ink`,
`font-serif`, `rounded-pill`…). Never write a raw colour when a token exists, and never create a
`tailwind.config.js`.

- Colour: `--color-page`, `--color-page-alt`, `--color-surface`, `--color-ink`, `--color-muted`, `--color-line`,
  `--color-brand` (`#55a1f5`), `--color-brand-ink`, `--color-on-brand` (text on the blue, `#141413`),
  `--color-action-blue`, `--color-night` (the black blocks).
- Fonts: `--font-sans` (Geist, local), `--font-serif` (Source Serif 4; change the serif in that one line).
- Radius: `--radius-sharp` (2 px) and `--radius-small` (4 px) for the editorial look; `--radius-pill` for the navbar
  and utility pill. `--radius-field/card/card-lg` and `--shadow-*` belong to the older look still used by the
  landing and the navbar.
- Labels: `--label-size`, `--label-spacing` (small spaced capitals: class `.eyebrow`). Aligned figures: `.tabular`.
- Motion: `--duration-fast` (160 ms).

### Dark mode

`:root[data-theme='dark']` in `tokens.css` redefines the same variables, so classes do not change. Rules:

- Text must reach WCAG AA: 4.5:1 for normal text, 3:1 for large text (24 px, or 18.7 px bold).
- Text on the blue brand colour uses `--color-on-brand` (dark). White on `#55a1f5` is only 2.7:1.
- Text placed on a photo needs a gradient or veil under it (see `featured-cover__caption`).
- Colours written for dark only (light green, light red) need a dark counterpart under `[data-theme='light']`
  (see the "done / avoid" lists in `markdown.css`).
- The black "night" blocks and the interactive blog widgets keep their dark look in both themes on purpose.

## Typography

- Geist for text, Source Serif 4 for page titles and article headings. No mono except code.
- Titles never end with a period.
- Heading levels: one `<h1>` per page. In an article the title is the `<h1>` and Markdown headings render from `<h2>`.
  On the homepage the name is the `<h1>`; the About name is a paragraph, not a second heading.

## Components

- **Buttons** (`ui/Button.tsx`): `solid` (one per screen), `line` and `link` are the editorial variants. The
  default `primary`, and `secondary`, `outline`, `pill`, are the older look, still used by the landing "Learn more"
  button. It renders an `<a>` when given `href`, otherwise a `<button>`.
- **Navbar**: blue pill with dark text; the active tab is a lighter blue. On the homepage it grows out of the
  "Learn more" button (`MorphNavbar`); on mobile and tablet it is a compact menu (`CompactMenu`).
- **Cards**: thin line, sharp corners, serif title, rectangular domain label. A "stretched link" (`::after`) makes
  the whole card clickable, so its focus ring is drawn on `::after` too.
- **Icons**: `react-icons/fi` for UI icons.
- **Skip link**: `.skip-link`, first element of every page, visible only on keyboard focus.

## Responsive

- Desktop scene: `min-width: 1024px` **and** `hover: hover` **and** `pointer: fine`. An iPad in landscape is wide but
  touch, so it gets the touch version. The same condition is used in the CSS and in `HomePage.tsx`.
- Other breakpoints in use: 640, 768 and 900 px (carousels, grids).
- Touch targets are at least 44 px (`atoms.css`).
- Check about 390 px wide, tablet, and a laptop height.

## Accessibility

- Every interactive element shows a focus ring (`:focus-visible`), at least 2 px.
- Every image has an `alt` (empty for decoration); every icon-only button has an `aria-label`.
- `prefers-reduced-motion`: smooth scrolling off, the homepage scene and transitions reduced to fades.
- Check a page in light and dark mode before finishing, with Tab only.
