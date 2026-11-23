# Design system (V2)

> **V3 en cours (branche `redesign/researcher-friendly`)** : tout ce qui suit décrit le V2 et sera réécrit à
> l'étape 15 du plan (`design/PLAN.md`). La référence actuelle est `design/BRIEF.md`.

## V3 : tokens et style éditorial (résumé)

Tokens dans `src/styles/v3/tokens.css` (`@theme`), styles dans `src/styles/v3/*.css`.

- Couleurs : `--color-page`, `--color-ink`, `--color-muted`, `--color-line`, `--color-brand` (`#55a1f5`),
  `--color-brand-ink`, `--color-on-brand` (texte posé sur le bleu), variantes sombres sous `:root[data-theme='dark']`.
- Polices : `--font-sans` (Geist), `--font-serif` (Source Serif 4, changeable en une ligne).
- Rayons : `--radius-sharp` (2 px), `--radius-small` (4 px) pour le style éditorial ; `--radius-pill` pour la
  navbar et la pilule utilitaire. `--radius-field/card/card-lg` et `--shadow-*` appartiennent à l'ancien style
  V3 (utilisés par la landing et la navbar) et disparaîtront avec lui.
- Étiquettes : `--label-size`, `--label-spacing` ; classe `.eyebrow`. Chiffres alignés : `.tabular`.
- Animations : `--duration-fast` (160 ms), opacité et soulignement seulement.
- Boutons (`ui/Button.tsx`) : `solid` (un seul par écran), `line`, `link` pour le style éditorial ; les variantes
  `primary`, `secondary`, `outline`, `pill` sont l'ancien style.

The V2 look: Codex-like and calm. Warm neutrals, one blue accent, small radii, sparse text, visuals that
explain. Keep it; do not reintroduce the V1 style (glass cards, large radii, mono everywhere).
One deliberate exception: interactive blog widgets keep their own dark card style
(`docs/MARKDOWN_CONTENT_RULES.md`, section 10).

## Scope

All V2 styles are scoped under `.home-v2`. Every page passes it to the layout:
`<MainLayout className="home-v2" …>`. New pages must do the same, or they fall back to the old global styles.

Style sheets: `src/styles/home-v2.css` (tokens, homepage, shared components), `projects-v2.css` (catalogue),
`blog-v2.css` (blog, posts, series).

## Tokens

Defined on `.home-v2` in `home-v2.css`, with dark values under `:root[data-theme='dark'] .home-v2`.
Use the tokens, never raw colours, so both themes keep working.

- Surfaces: `--hv-bg`, `--hv-surface`, `--hv-surface-2`, `--hv-surface-3`
- Text: `--hv-ink`, `--hv-muted`, `--hv-faint`
- Lines: `--hv-line`, `--hv-line-2`, `--hv-line-3`
- Accent: `--hv-accent`, `--hv-accent-ink`, `--hv-accent-soft`, `--hv-accent-2`; status `--hv-ok`, `--hv-warn`
- Fonts: `--hv-display`, `--hv-mono`

## Typography

- Inter for text (17px base on the homepage).
- Bricolage Grotesque (`src/assets/fonts`) for section titles and display text.
- JetBrains Mono only for small metadata: publication kind and citation, project detail labels, graph labels,
  the profile journey, contact route audiences. Not for body text or headings.
- Titles never end with a period.

## Shape

- Radius 3px by default for cards, buttons, inputs and tags.
- Exceptions: fully rounded pills (`999px`, e.g. the hero byline) and circles; at most 8px for the large hero visual.
- Borders are thin lines (`--hv-line*`); avoid heavy shadows.

## Components and patterns

- Section heading: `.hv-eyebrow` (small label) above an `.hv-h2` title; sections use `.hv-section`.
- Cards: `.hv-card`. Project cards keep the catalogue's domain badge (colour from `domain.json`) and keyword tags.
- Status chips: `.hv-status--done`, `.hv-status--progress`, `.hv-status--prep`.
- Buttons: `.hv-btn`, `.hv-btn--primary`, `.hv-btn--ghost`, with the `FiChevronRight` icon for "go" actions.
- Text links: `.hv-link`, never underlined; on hover the text takes the blue → violet gradient.
- Background pattern (dots and plus signs): `.hv-section--pattern`, `.hv-section--pattern-left`.
- Reveal-on-scroll: wrap blocks in `Reveal`; animations respect `prefers-reduced-motion`.
- Icons: `react-icons/fi` (Feather) for UI icons.

## Responsive

- Mobile breakpoint: 760px. Tablet adjustments: 768–1100px and up to 1024px.
- On mobile, wide rows become swipeable carousels with dots (method steps); the navbar stays compact.
- Always check about 390px wide and a 14" laptop height: homepage cards must fit the screen.

## CSS pitfalls

- Plain CSS in these sheets is unlayered, so it beats Tailwind utilities (which live in a layer). To override
  a V2 rule, edit the sheet rather than adding a utility class.
- The global `select { font: inherit }` wins over utilities; style selects with a class selector
  (see `select.language-switcher` in `theme.css`).
