# PLAN — Refonte visuelle v3

Spécification : `design/BRIEF.md`. Branche : `redesign/researcher-friendly` (depuis `origin/master`).
À mettre à jour à la fin de chaque étape.

## Contexte
Le site V2 (tons chauds, rayon 3px, accueil long en 10 sections) est remplacé visuellement par le design v3
« chercheur-friendly » : bambous, bleu `#55A1F5`, navbar pilule, pilules et cartes arrondies, serif éditoriale.
On garde la plomberie (routes, i18n, thème, blog/séries, SEO, scripts).

## Constats de l'audit
- `src/lib/routes.ts` est **vide** : les routes sont dans `src/App.tsx`.
- Aucun `@theme` Tailwind : les tokens actuels sont des variables CSS (`--hv-*` sous `.home-v2` dans
  `home-v2.css`, `--bg-color`… dans `globals.css`/`theme.css`). Le v3 crée le premier `@theme`.
- Polices actuelles : Inter (Google Fonts) + Bricolage Grotesque (`src/assets/fonts`). Geist n'est pas dans la
  branche (il est dans le stash `zed-inspired WIP`). Le brief demande Geist + une serif.
- `design/screens/` : `00`–`03` et `05` sont en .png, seuls `04a`/`04b` sont en .jpg (le brief dit .jpg).
  `public/assets/images/hero-bamboo.jpg` existe (le brief dit .webp).
- `design/` n'apparaît pas dans `git ls-files` sur cette branche : à vérifier (ignoré ?).
- Styles V2 scopés `.home-v2` via `MainLayout className="home-v2"` : le v3 remplace ce scope sans casser
  blog posts, markdown et widgets.
- Contact : Formspree déjà en place (`ContactSection.tsx`), à garder. `SOCIAL_LINKS` (`src/data/home.ts`) = 4
  entrées (LinkedIn, GitHub, Threads, email) ; la maquette montre 6 icônes.
- CV : `getResumeDownloadUrl(lang)` dans `src/lib/site.ts`.

## 1. Écrans : garder / remplacer / supprimer

### Global
- `components/layout/Navbar.tsx` : **remplacer** par une navbar pilule bleue (actif = bleu clair, version basse
  sur Contact, menu compact mobile). Garder : section active (IntersectionObserver), `href` vs scroll, menu mobile
  accessible.
- `hooks/useSiteNav.ts` : **garder**, adapter les sections.
- `ui/LanguageSwitcher.tsx`, `ui/ThemeToggle.tsx` : **garder la logique**, regrouper dans une pilule grise
  translucide en haut à droite (`UtilityPill`).
- `layout/MainLayout.tsx` : **modifier** (navbar haut/bas, scope v3). `Footer`, `BackToTopButton`,
  `CookieBanner` : garder (restyler). `AnimatedLogo` : à décider.
- **Créer** `SocialIcons` (ronds bleus, depuis `SOCIAL_LINKS`) et `Avatar` (cercle, placeholder `#D9D9D9`).

### 4.1 Landing (`01`)
- `pages/HomePage.tsx` : **réécrire** en one-page : Landing → About → Publications → Contact (ancres).
- `home-v2/HomeHero.tsx` : **remplacer** par `LandingHero`.
- **Créer** `LatestThings` (3 cartes horizontales). Morph « En savoir plus » → navbar via `layoutId`.
- **Supprimer** après bascule : `StackMarquee`, `MethodSection`, `MethodGraph`, `DoctoralResearchSection`,
  `WorkSection`, `NowBuildingSection`, `HelpSection`, `BlogPostsSection`, `ProfileSection`. Garder `Reveal`.

### 4.2 About (`02`)
- **Créer** `AboutSection` + `Timeline` verticale, bouton CV, intertitres serif, « Explore my Work » /
  « Get in touch », « View my papers ↓ » qui sautille (`prefers-reduced-motion`).

### 4.3 Publications (`03`)
- `pages/PublicationsPage.tsx` : **restyler** (route `/publications` gardée). Section d'accueil v3 qui réutilise
  `PublicationCard` (`home-v2/PublicationsSection.tsx`). **Créer** « Back to about ↑ ».

### 4.4 Hub Projets & Blog (`04a`/`04b`)
- `pages/ProjectsPage.tsx` : **recomposer** en hub « Project & Blog posts ». Garder filtres, tri, deep-link
  `?project=`, `ProjectWindow`, pagination.
- `pages/BlogPage.tsx` : redirection ou onglet du hub (à décider). Garder `useBlogIndex`, `LastBlogPosts`,
  `BlogSeriesCard`, `PostGrid`, `BlogFilters`.
- `SeriesPage`, `BlogPostPage` : garder, restyler.
- **Créer** `FeaturedHub` (composition seule, aucun élément « Nature ») et `SearchPanel` (bloc noir, apparaît
  au clic « Search a project » + scroll), branché sur `ProjectFilters`/`SearchField`/`FilterField`.
- `projects/ProjectCard.tsx` : garder comme base.

### 4.5 Contact (`05`)
- `home-v2/ContactSection.tsx` : **remplacer** (hero bambous, bloc blanc, navbar en bas). Garder Formspree,
  validation, hints, sujets.

### Plomberie / styles
- **Garder** : `App.tsx`, `lib/i18n.ts`, `locales/*`, `app/*`, `Seo`, `ScrollManager`, analytics/consent,
  scripts, `MarkdownRenderer` + `markdown.css` + widgets.
- **Remplacer** `home-v2.css`, `projects-v2.css`, `blog-v2.css` par `src/styles/v3/*.css` basé sur `@theme`.
- **Créer** `src/data/placeholders.ts` (types existants).

## 2. Composants
Créer : `UtilityPill`, `SocialIcons`, `Avatar`, navbar pilule, `LandingHero`, `LatestThings`, `AboutSection`,
`Timeline`, section Publications v3, `FeaturedHub`, `SearchPanel`, `ContactSection` v3, `placeholders.ts`,
tokens `@theme`.
Modifier : `Navbar`, `MainLayout`, `HomePage`, `ProjectsPage`, `BlogPage`, `PublicationsPage`, `ProjectCard`,
`Footer`, `useSiteNav`, `main.tsx`.

## 3. Étapes
- [x] 0. Cadrage : `.gitignore` (`design/screens/`, `*.svg`, `*.png`, `svgs/`), note V3 en tête de
      `docs/DESIGN_SYSTEM.md`, `hero-bamboo.jpg` → `.webp`. Le mapping des anciennes sections est dans les
      Décisions (4) ; reste à le faire valider avant de supprimer les fichiers `home-v2` (étape 15).
- [x] 1. Fondations : `src/styles/v3/tokens.css` (`@theme static`, Geist + Source Serif 4, clair par défaut, sombre
      via toggle ou système, script anti-flash dans `index.html`), `hero-bamboo.webp`. Tokens globaux, sans conflit
      avec les `--hv-*` du V2.
- [x] 2. Placeholders et atomes : `src/data/placeholders.ts` (tout est fictif, FR/EN, `IS_PLACEHOLDER_DATA`),
      `ui/Avatar`, `SocialIcons` (6 réseaux), `UtilityPill`, `Button`, `lib/cn.ts`, `atoms.css`. Les anciens
      `LanguageSwitcher` / `ThemeToggle` sont à supprimer à l'étape 15.
- [x] 3. Navbar pilule + `MainLayout` : `Navbar` (6 entrées, `matchPaths`, CV = téléchargement direct), props
      `navPlacement` (le bas = étape 8) et `overlayNavbar`. À reprendre : navbar basse (8), CSS `navbar-*` du V2 (15) ;
      les sections V2 gardent leurs ids jusqu'à l'étape 9.
- [x] 4. Landing : `LandingHero` + `LatestThings`, tout dimensionné avec `--landing-unit` (tient dans la fenêtre sur
      ordinateur, défile sous 900 px), `html.snap-home` (scroll-snap), bannière indépendante du thème, avatar =
      `hero-image.png` (décision 7). Anciennes sections V2 retirées de `HomePage` (fichiers supprimés à l'étape 15).
- [x] 5. About desktop : `AboutSection`, `Timeline`, en-tête commun (avatar à cheval sur la bannière, nom sur la
      photo, poste dessous), mêmes unités que la landing. Bouton CV plein identique partout (`ResumeIcon`), « View my
      papers » qui saute. À reprendre : « Get in touch » n'a pas de cible tant que le Contact (8) n'existe pas.
- [x] 5b. About mobile et tablette (< 1024 px, BRIEF §6b) et style éditorial (BRIEF §2) : menu compact en haut,
      capsule complète dès 1024 px, accroche, thèmes cliquables (`/projects?tag=`), textes repliables, frise
      interactive, boutons « Research » (rideau) et « Projects ». Variantes `solid` / `line` / `link`. À reprendre :
      thèmes « Je travaille sur » = placeholders (16) ; deux boutons pleins sur desktop (écart voulu par le
      propriétaire) ; `BackToTop`, cookies et `Footer` encore en V2.
- [x] 6. Transition landing → About (`MorphNavbar`, exception du BRIEF §2) : « Learn more » devient la navbar, piloté
      par le scroll (zone morte 12 %, suit la page au départ, ressort, onglets un par un) ; sur mobile la pilule
      s'agrandit en menu (`CompactMenu`). À reprendre : ressenti à la molette et au doigt (non testé), scrolls fluides
      vers les autres sections (9).
- [x] 7. Publications : `PublicationsSection` (id `research`, bannière + ronds sociaux, articles séparés par des
      filets, « Back to about » en filet) sur l'accueil après l'About et sur `/publications` (navbar directe) ;
      « View my papers » défile vers elle ; styles dans `papers.css`. À reprendre : titre du bouton « Back to about »
      (↑ ici, ↓ sur la maquette), ORCID seulement via les ronds sociaux, bloc travaux en cours / thèse (contenu réel),
      mobile non vérifié (13).
- [x] 8. Contact : `ContactSection` (id `contact-form`, photo plein écran, identité, formulaire Formspree inchangé
      sans les 3 cartes « routes », bouton plein unique) en dernier écran de l'accueil. Le formulaire passe sur deux
      colonnes dès 768 px (message à droite). La MÊME navbar se décroche du haut au scroll et descend se poser en
      bas au milieu (2ᵉ voyage de `MorphNavbar`, emplacement vide `data-morph-slot` en fin de page), sur tous les
      formats ; sur mobile son menu s'ouvre vers le haut. « Get in touch » y mène. À reprendre : `/contact` n'existe pas (la
      navbar des autres pages pointe vers `/#contact-form`), envoi non testé en réel, mobile à vérifier (13).
- [x] 8b. Footer v3 (toutes les pages) : `Footer` + `footer.css`. Fin de bandeau bambous en haut (même photo et même
      voile, même fichier que les bannières donc déjà en cache), puis marque / Navigation (entrées de `useSiteNav`
      sans Accueil ni Contact, CV = lien direct) / Profils (ORCID, ResearchGate, GitHub, Threads) / Contact (Email,
      LinkedIn, « Me contacter → »), ligne du bas : © + Cookies, FR | EN, « ↑ Haut de page ». Desktop 4 colonnes,
      tablette 2 colonnes, mobile centré. `BackToTopButton` se masque quand le pied de page est à l'écran. Textes
      FR/EN dans `locales/`. À reprendre : les anciens styles V2 du footer disparaissent à l'étape 15 ; le nom du
      pied de page est le vrai (hors placeholders).
- [ ] 9. Assemblage `HomePage` one-page en CSS scroll-snap, ancres, hash, SEO.
- [ ] 10. Hub : en-tête, `FeaturedHub`, grille `ProjectCard`.
- [ ] 11. `SearchPanel` branché sur les filtres ; deep-link `?project=` intact.
- [ ] 12. Blog : `/blog` redirige vers la partie blog du hub ; bloc derniers articles + série mise en avant ;
      restyle `SeriesPage`/`BlogPostPage` ; sitemap et redirections dans `scripts/generate-seo.ts`.
- [ ] 13. Responsive (≈390 px, tablette, laptop 14″).
- [ ] 14. Dark mode, accessibilité, `prefers-reduced-motion`.
- [ ] 15. Nettoyage V2, réécriture complète de `docs/ARCHITECTURE.md` et `docs/DESIGN_SYSTEM.md`, `lint` +
      `content:validate` + `build`, vérif Playwright (clair/sombre, desktop/mobile), aperçu validé avant merge.
- [ ] 16. **Remplacement par le vrai contenu (obligatoire avant merge)** : supprimer `placeholders.ts` et toute
      mention fictive, rebrancher les vraies données, relire les claims (AGENTS.md).

Chaque étape : `npm run lint` + `npm run build` verts, résumé court, mise à jour de ce fichier.
Règles de lisibilité (CSS vertical, commentaires français sur les techniques complexes, `cn()`/`clsx`, ordre
des propriétés) : voir `CLAUDE.md`, section « Style de code ». Elles s'appliquent dès l'étape 1, et chaque
étape les vérifie avant de se terminer.

## 4. Décisions (réponses du propriétaire)
0. `design/` : seuls les `.md` (BRIEF, PLAN, PROMPTS) sont suivis par git. `design/screens/` et tous les exports
   lourds (`*.svg`, `*.png`) sont ignorés : le repo est public.
1. Source Serif 4, changeable en une ligne via `@theme`. Geist : seulement les fichiers de police du stash (OFL).
2. Note « V2 obsolète, voir design/BRIEF.md » en tête de `docs/DESIGN_SYSTEM.md` dès l'étape 0 ; réécriture à l'étape 15.
3. Placeholders uniquement sur cette branche, clairement marqués fictifs. **Interdit de merger sur `master`
   tant qu'il en reste** (étape 16).
4. Navbar : pas forcément 7 onglets. Mapping des anciennes sections : Research → Publications ; Method et
   Where I can help → texte de l'About ; Now building → cartes « Latest things ». **Je propose le mapping avant
   de supprimer quoi que ce soit.**
5. Le hub reste `/projects`. `/blog` redirige vers la partie blog du hub. `/blog/:slug` et les séries ne changent pas.
   Mise à jour du sitemap et des redirections dans `generate-seo.ts`.
4bis. **Navbar définitive** : Accueil / À propos / Recherche / Projets & Blog / CV / Contact
   (EN : Home / About / Research / Projects & Blog / CV / Contact). « Recherche » = la section publications
   élargie (articles, travaux en cours, thèse) et affiche l'ORCID. « CV » = lien direct vers
   `getResumeDownloadUrl(lang)`, pas une section.
6. **6 réseaux** dans `SOCIAL_LINKS` : LinkedIn, GitHub, Threads, email + ORCID
   (`https://orcid.org/0009-0006-2676-2400`) + ResearchGate (`https://www.researchgate.net/profile/Aurel-Vehi`).
   Logos `SiOrcid` et `SiResearchgate` de `react-icons/si` : vérifiés dans la version installée, aucune
   nouvelle dépendance.
7. Avatar : photo `hero-image.png` (celle de l'ancien hero ; `about-image.png` était une erreur).
12. Stash `zed-inspired WIP` : polices Geist (`Geist-latin.woff2`, `Geist-latin-ext.woff2`) et
    `LICENSE-Geist-OFL.txt` récupérées dans `src/assets/fonts/`, build vérifié, stash supprimé.
8. `hero-bamboo.webp` s'il existe, sinon conversion du `.jpg` (présent aujourd'hui : `hero-bamboo.jpg` seul).
9. `AnimatedLogo` retiré de la navbar, gardé dans le footer.
10. Scroll natif avec CSS scroll-snap, jamais de détournement de la molette.
11. Routes secondaires : navbar directe, sans morph. Navbar basse du Contact : en fin de page, pas fixe.
13. Colonne « couverture » = série mise en avant (image + titre), boutons « Voir la série » et « S'abonner »
    (via `BlogSubscribeSection`).
14. Aucune nouvelle dépendance : framer-motion + scroll natif.
15. Règles de qualité du code ajoutées à `CLAUDE.md` (« Style de code ») : lisibilité pour un non-développeur,
    CSS vertical, pas de style en ligne, commentaires français obligatoires sur les techniques complexes,
    ordre constant des propriétés CSS, composants complexes dans `src/styles/v3/`. Applicables dès l'étape 1.

## 5. Questions encore ouvertes
Aucune.
