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
- [ ] 0. Cadrage (voir « Décisions ») : `.gitignore` (`design/screens/`, `design/*.svg`, `design/*.png`, `design/svgs/`),
      note « V2 obsolète » en tête de `docs/DESIGN_SYSTEM.md`, proposition de mapping des anciennes sections
      (validation avant toute suppression), conversion `hero-bamboo.jpg` → `.webp`.
- [x] 1. Fondations : `src/styles/v3/tokens.css` (importé par `globals.css`) : `@theme static` (couleurs, rayons,
      ombres, `--font-sans` Geist, `--font-serif` Source Serif 4 changeable en une ligne), `@font-face` Geist,
      dark via `:root:not([data-theme='light'])` (même logique que le thème existant). Source Serif 4 ajoutée à
      l'import Google Fonts existant (aucune dépendance). Aucune page changée. Lint + build verts.
      Thème : **clair par défaut** (sombre si le système le demande ou via le toggle), `app/providers.tsx` +
      petit script dans `index.html` contre le flash sombre. `hero-bamboo.webp` (2400 px, 1,2 Mo) remplace le `.jpg`.
      Pas de scope `.home-v2` : les tokens sont globaux mais nouveaux (aucun conflit avec `--hv-*`).
- [x] 2a. `src/data/placeholders.ts` (fictif, `IS_PLACEHOLDER_DATA`) : profil, parcours, textes About,
      latest things, publications, 6 projets (type `Project`), en FR/EN. Les composants atomes
      (`Avatar`, `SocialIcons`, `UtilityPill`, boutons) restent à faire.
- [x] 2. Atomes : `ui/Avatar.tsx` (cercle, gris `--color-placeholder` sans image), `ui/SocialIcons.tsx` (6 ronds bleus
      depuis `SOCIAL_LINKS`, qui reçoit ORCID et ResearchGate), `ui/UtilityPill.tsx` (langue + thème, réutilise
      `i18n.changeLanguage` et `useTheme`), `ui/Button.tsx` (variantes `primary`, `secondary`, `outline`, `pill` ;
      `<a>` si `href`). Aide `lib/cn.ts`. Styles dans `src/styles/v3/atoms.css` (importé par `globals.css`).
      Les anciens `LanguageSwitcher`/`ThemeToggle` restent utilisés par la navbar V2 jusqu'à l'étape 3.
      Aucun atome n'est encore affiché dans une page : vérification visuelle à faire à l'étape 3 (navbar) et 5 (About).
      Lint + build verts.
- [x] 3. Navbar pilule + `MainLayout`. `Navbar.tsx` réécrite : capsule bleue centrée (Accueil / À propos / Recherche /
      Projets & Blog / CV / Contact), onglet actif bleu clair, `IntersectionObserver` et `aria-current` conservés,
      « CV » = lien `download` direct, « Projets & Blog » actif sur `/projects` et `/blog` (`matchPaths`). Mobile
      (< 768 px) : bouton compact (section courante + chevron) qui ouvre un panneau, fermé par Échap.
      `MainLayout` : `UtilityPill` fixe en haut à droite, props `navPlacement` (`top`/`bottom`, bas = en fin de page,
      non fixe, pour l'étape 8) et `overlayNavbar` (hero sous la navbar, étape 4) ; sinon `padding-top`
      (`--navbar-offset`). Le CTA `cta` disparaît (Contact est dans le menu) ; les 6 pages sont mises à jour.
      `useSiteNav` renvoie les nouvelles entrées (libellés `projectsBlog` et `cv` ajoutés en EN/FR dans
      `home.ts`/`home.fr.ts`). `AnimatedLogo` déplacé de la navbar au footer. Styles : `src/styles/v3/navbar.css`.
      Vérifié avec Playwright (desktop et 390 px, thème sombre). À faire plus tard : thème clair, navbar basse
      (étape 8), nettoyage du CSS `navbar-*` V2 de `theme.css`/`responsive.css` et de `LanguageSwitcher`/`ThemeToggle`
      devenus inutilisés (étape 15). Les sections V2 de l'accueil gardent leurs ids (`about`, `research`,
      `contact-form`) jusqu'à la réécriture de l'étape 9. Lint + build verts.
- [x] 4. Landing : `components/home-v3/LandingHero.tsx` (photo bambous voilée à 70 %, avatar, nom, poste, `SocialIcons`,
      bouton « En savoir plus » à cheval sur le bord bas de la bannière) et `LatestThings.tsx` (3 cartes horizontales :
      titre, description, date, vignette carrée ; lien vers la page concernée). Libellés dans `placeholders.ts`
      (`getLandingLabels`) ; titres des cartes fictives raccourcis pour tenir sur 2 lignes.
      Correction après revue visuelle : sur ordinateur (≥ 900 px) la landing tient exactement dans la fenêtre
      (`100dvh`, bannière 62,5 %, cartes dans le reste). Tout est dimensionné avec `--landing-unit` (= 1 % de la
      largeur de la maquette 1512 px, `clamp(8px, min(1vw, 1.54dvh), 19.2px)`) : proportions de la maquette
      conservées à toute taille. Sous 900 px, mise en page mobile qui défile.
      Navbar masquée sur la landing (`MainLayout hideNavbar` ; le morph viendra à l'étape 6). Anciennes sections V2
      retirées de `HomePage` (fichiers conservés, suppression à l'étape 15). `html.snap-home` : scroll-snap vertical
      mandatory (landing, puis pied de page en attendant l'About) ; « En savoir plus » défile d'un écran.
      `UtilityPill` : marge portée à 2 rem (haut et droite).
      Seconde correction : barre de défilement masquée sur la landing (`html.snap-home` ; une barre classique retirait
      15 px de largeur et décalait le contenu), calcul de `--landing-unit` commenté en détail (min largeur/hauteur),
      pilule `flex: none` + `max-width`. Mesures sur 1855×960, 1512×982, 1440×900, 1280×800 et 390 px : centre de
      l'avatar = centre de la fenêtre à 0,3 px, cartes dans la fenêtre sur ordinateur.
      Troisième correction : bannière indépendante du thème (fond `--color-banner-veil` fixe sous la photo à 70 %, nom et
      poste en blanc avec `text-shadow`) ; avatar = `hero-image.png`, la photo de l'ancien hero (la décision 7 citait à tort `about-image.png`) ; pictogrammes des ronds bleus via
      `--color-social-icon` (foncé en clair, blanc en sombre). Contraste sur #55A1F5 : foncé 6,9:1, blanc 2,7:1.
      Vérifié avec Playwright à 1512×982, 1440×900, 1280×800 et 390 px. Lint + build verts.
- [x] 5. About : `home-v3/AboutSection.tsx` + `Timeline.tsx` (ordre vertical, étape en cours en bleu, prochaine étape en
      pointillé, `aria-current`), styles dans `src/styles/v3/about.css`. Bannière bambous voilée, avatar à cheval sur
      le bord, 6 ronds sociaux, titre « About Me », intertitres serif, bouton CV (`getResumeDownloadUrl`),
      « Explore my Work » (→ `/projects`), « Get in touch » (ancre `#contact`, sans effet tant que l'étape 8 n'existe
      pas), « View my papers » (→ `/publications`) dont la flèche sautille (`@keyframes`, coupée par
      `prefers-reduced-motion`, en pause au survol). Textes, parcours et libellés = placeholders
      (`getAboutLabels` ajouté). Avatar : `profile.avatarSrc` (`hero-image.png`), la même photo que la landing, partout
      sur le site (décision du propriétaire ; `about-image.png` refusée). Sur ordinateur, même unité que la landing (`--about-unit`) : l'écran tient dans la fenêtre. Mesuré dans une
      iframe à 1512×982, 1440×900, 1280×800 (le bouton CV reste dans la fenêtre) et 390 px (défile). `HomePage` affiche
      Landing puis About (snap). Navbar toujours masquée sur l'accueil (étape 6). Lint + build verts.
      Limite : la fenêtre Playwright était bloquée à un viewport 3× trop grand (dpr 0,33), donc captures prises via
      iframe ; thème sombre et rendu mobile complet du bas de page non revérifiés.
- [x] 5b. About mobile (< 1024 px, voir `design/BRIEF.md` § 6b). Navbar : on GARDE le menu compact en haut ; le seuil de
      la capsule complète passe de 768 à 1024 px (`navbar.css`), ce qui corrige la navbar qui passait sous la
      `UtilityPill` à 768 px (tablettes = menu compact). Navbar visible sur l'About dès que la landing est quittée
      (`IntersectionObserver` dans `HomePage`, sans animation : le morph reste l'étape 6). `AboutSection` : éléments
      `about__mobile-only` / `about__desktop-only`, bascule à 1024 px (le desktop ne change pas, mesures identiques à
      1280 et 1512 px). Mobile : nom + accroche 2 lignes, pastilles « Je travaille sur » (→ `/projects?tag=`),
      `ui/Collapsible` (« Lire la suite », `aria-expanded`), `JourneyCard` (frise horizontale + CV dans la carte),
      `NextDoors` (cartes Recherche / Projets + lien discret « Une question ? Me contacter »), icônes sociales
      masquées. `ProjectsPage` lit `?tag=` au chargement (`?project=` intact). **Thèmes = placeholders à remplacer par
      les vrais thèmes du propriétaire au moment du vrai contenu (étape 16)** : ce sont des mots-clés présents dans les
      projets fictifs ET dans `projects.json` (le hub lit encore les vrais projets jusqu'à l'étape 10), donc le filtre
      répond déjà. Vérifié via iframe à 390, 768, 1023, 1280, 1512 px, clair et sombre. Lint + build verts.
      En-tête de l'About (tous formats, un seul composant `about__header`) : avatar à cheval sur le bord de la bannière,
      nom (titre principal, `h2`) à droite de l'avatar, POSÉ SUR LA PHOTO, bas du nom juste au-dessus du bord
      (`position: absolute; bottom: 100%`), blanc avec `text-shadow` et léger dégradé sombre en bas de la bannière,
      quel que soit le thème (même règle que la landing). Le poste est juste sous le bord, sur le fond de la page, en
      couleur de thème. Mobile : un nom sur 2 ou 3 lignes monte sur la photo (3 lignes à 390 px, sans toucher la navbar).
      Desktop : icônes sociales à cheval sur le bord, à droite (maquette 02), « About Me » en sous-titre (`h3`).
      Mesuré à 390, 768, 1512 px, clair et sombre : nom blanc, bas du nom 4 à 5 px au-dessus du bord, poste dessous ;
      bouton CV dans la fenêtre à 1512 (931 / 982).
      Style éditorial (BRIEF §2 « Style éditorial (prioritaire) ») : tokens ajoutés (`--radius-sharp/small`,
      `--color-on-brand`, `--label-*`, `--duration-fast`), variantes `solid` / `line` / `link` de `Button`, classes
      `.eyebrow` et `.tabular` (`atoms.css`). Appliqué à : About (blocs « Mon parcours » et « Pour aller plus loin »
      selon le schéma du propriétaire, thèmes en étiquettes à filet, titres serif, liens soulignés, sautillement de
      « View my papers » plus discret), Latest things (filet fin au lieu des cartes, titres serif, dates
      `tabular-nums`, étiquette de section), nom de la landing en serif, survol des ronds sociaux en simple
      opacité. « En savoir plus » : inchangé, à la demande du propriétaire. Navbar : inchangée (signature).
      Info du CV « PDF · 1 p. » : nombre de pages lu dans le PDF actuel (à revérifier si le CV change).
      Corrections About mobile / tablette : « Mon parcours » = frise horizontale interactive (`JourneyCard`) dans le
      style de la timeline desktop (points sur une ligne, années dessous, point choisi bleu plein avec halo). Clic ou
      tap sur un point = descriptif juste dessous (12 px sous l'année) avec une pointe alignée sous le point
      (`--caret-position`, `--step-count`) ; 2026 par défaut ; flèches gauche/droite + Début/Fin ; ARIA
      tablist / tab / tabpanel. « Pour aller plus loin » : deux boutons « Research → » et « Projects → », sans
      compteurs. « Research » : contour et texte bleus, rideau bleu déployé de gauche à droite (300 ms, ease-out)
      au survol, au focus clavier et au tap, texte blanc, sans animation si `prefers-reduced-motion` ; ajouté comme
      exception assumée au BRIEF §2. Bleus d'action (`--color-action-blue`, `--color-action-fill`) plus foncés que
      #55A1F5 pour le contraste (4,7:1 en clair, 8,7:1 en sombre, 5:1 sous le texte blanc). Vérifié à 390 et 768 px,
      clair et sombre. L'étape actuelle (2026) reste TOUJOURS bleue (point plein + halo) même si une autre étape est
      choisie ; l'étape choisie se marque par un anneau foncé et l'année en gras. Boutons « Research » / « Projects »
      réduits de 25 % en hauteur (55,8 px → 42,6 px). Bouton CV : mention « PDF · 1 p. » supprimée ; MÊME bouton
      (plein, rectangulaire, « Download my Resume ») sur mobile et sur desktop ; icône de fichier de CV fournie par
      le propriétaire (`ui/ResumeIcon.tsx`) à la place de l'icône de téléchargement. Sautillement : « View my papers »
      (desktop) et « Research » / « Projects » (mobile) font sauter le BOUTON ENTIER (`@keyframes about-hop`, deux
      rebonds de 12 et 6 px puis une pause, 2,2 s), au lieu de la seule flèche ; arrêt au survol / focus / tap ;
      aucune animation avec `prefers-reduced-motion`. Sur desktop, ce bouton et
      « View my papers » sont donc tous deux pleins (le BRIEF dit un seul plein par écran : écart décidé par le
      propriétaire).
- [ ] 6. Transitions : morph vers la navbar (landing uniquement), scrolls fluides, `prefers-reduced-motion`.
- [ ] 7. Publications (section + page + « Back to about »).
- [ ] 8. Contact (Formspree, navbar en fin de page).
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
