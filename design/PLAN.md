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
      bas au milieu, À CHEVAL sur le bord bas de la photo (2ᵉ voyage de `MorphNavbar`, emplacement vide `data-morph-slot`
      sous la section) ; le menu compact s'ouvre vers le bas, et vers le haut seulement s'il manque de place dessous. « Get in touch » y mène. À reprendre : `/contact` n'existe pas (la
      navbar des autres pages pointe vers `/#contact-form`), envoi non testé en réel, mobile à vérifier (13).
      Bilan 24/11/2026 : cochée, car ce qui était prévu est fait ; l'ancre est `#contact-form` (pas `#contact`, voir étape 9).
- [x] 8b. Footer v3 (toutes les pages) : `Footer` + `footer.css`. Pas de bandeau de photo (retiré : il contredisait la
      maquette du Contact) ; marque / Navigation (entrées de `useSiteNav`
      sans Accueil ni Contact, CV = lien direct) / Profils (ORCID, ResearchGate, GitHub, Threads) / Contact (Email,
      LinkedIn, « Me contacter → »), ligne du bas : © + Cookies, FR | EN, « ↑ Haut de page ». Desktop 4 colonnes,
      tablette 2 colonnes, mobile centré. `BackToTopButton` se masque quand le pied de page est à l'écran. Textes
      FR/EN dans `locales/`. À reprendre : les anciens styles V2 du footer disparaissent à l'étape 15 ; le nom du
      pied de page est le vrai (hors placeholders).
- [~] 9. Assemblage `HomePage` one-page en CSS scroll-snap, ancres, hash, SEO. Faite en grande partie pendant l'expérience
      (bilan du 24/11/2026, d'après le code, sans nouveau test). COUVERT : `HomePage` one-page (scène + `scroll-snap`
      `html.snap-home`) ; ancres `#home`, `#about`, `#research`, `#contact-form` présentes (ordinateur : zones de la scène ;
      mobile : `id` sur `PublicationsSection` / `ContactSection`) ; hash géré (`HomePage` → `navigateToSection`,
      `ScrollManager`, `useBambooMobile` pour l'écran de départ, liens `/#…` interceptés) ; `Seo` de l'accueil (titre,
      description, image, JSON-LD Person + WebSite, canonical, Open Graph). RESTE : (a) l'ancre `/#contact` n'existe pas :
      seule `#contact-form` existe (navbar, footer et boutons l'utilisent) ; décider d'un alias ou de garder ce nom ;
      (b) `/#about`, `/#research`, `/#contact-form` testés au Playwright seulement sur ordinateur et à 390 px pour
      l'expérience, pas rechargés à froid avec le hash sur tablette ; (c) SEO accueil non revérifié : pas de `hreflang`
      dans `Seo.tsx`, titre / description fondés sur `PERSON_*` de `lib/site.ts` (contenu réel à l'étape 16), et
      `scripts/generate-seo.ts` (sitemap, redirections) pas relu pour l'accueil v3 ; (d) `<h1>` / `<h2>` dupliqués
      entre landing et About (étape 14).
- [x] 10. Hub : en-tête, `FeaturedHub`, grille `ProjectCard` (24/11/2026, sans commit). RÉALISÉ : `components/hub-v3/` :
      `HubHeader` (bandeau de bambous fin = `bamboo-banner` partagé, titre serif « Project & Blog posts », champ « Search a
      project » rectangulaire et INACTIF jusqu'à l'étape 11), `FeaturedHub` = `FeaturedLead` (grand projet, bloc noir +
      image) + rangée de 4 `FeaturedStory` + `FeaturedCover` (série mise en avant, « Voir la série » et « S'abonner » →
      `/series/<slug>#subscribe`, ancre ajoutée à `BlogSubscribeSection`), choix des projets dans `featuredProjects.ts`.
      `ProjectCard` restylée (éditorial : filet, étiquette de domaine rectangulaire, titre serif, mots-clés en
      majuscules, « Read more » en lien) et `ProjectGrid` (3 / 2 / 1 colonnes), « Autres travaux » en lignes à filets.
      `ProjectsPage` recomposée (`overlayNavbar`) ; filtres, tri, `?project=`, `?tag=`, `ProjectWindow` et pagination
      inchangés. Styles : `styles/v3/hub.css` ; ancien CSS V2 de /projects (résumé, cartes, lignes) retiré de
      `projects-v2.css` ; libellés FR / EN dans `projectsPage.hub` (`home.ts`, `home.fr.ts`). Transition : règle
      `bamboo-banner` pour `.hub-header__banner` dans `page-transitions.css`. Vérifié : lint, content:validate, build,
      Playwright 1440 px et 390 px (clair). À REPRENDRE : (a) AUCUN projet n'a `featured: true` dans `projects.json` (le script
      d'ajout n'en autorise qu'un) : le « à la une » prend donc les projets d'économie appliquée les plus récents, ceux
      marqués passant en premier ; (b) `ProjectFilters` garde l'ancien style jusqu'à l'étape 11 ; (c) le bloc « derniers
      articles du blog » et la vue Séries du hub restent à l'étape 12 ; (d) mode sombre et tablette non vérifiés (13, 14) ;
      (e) champs `eyebrow`, `title`, `intro`, `summary`, `selectedTitle` de `projectsPage` désormais inutilisés (à
      retirer au nettoyage, étape 15) ; (f) `SelectedWorkGrid` n'est plus utilisé par le Hub (supprimé avec `home-v2`, 15).
- [x] 11. `SearchPanel` branché sur les filtres ; deep-link `?project=` intact (24/11/2026, sans commit). RÉALISÉ :
      `hub-v3/SearchPanel` (bloc noir : champ, domaine, bouton Search, « Advanced search » = tag / année / tri, liens
      rapides, compteur, fermeture). Caché au départ ; le bouton pilule de `HubHeader` l'affiche, défile jusqu'à lui
      (sans animation si mouvement réduit) et met le champ en focus. Il remplace `ProjectFilters` (supprimé, ainsi que
      son CSS). Fermer le bloc remet les filtres à zéro. `?tag=` ouvre le bloc d'office (recherche avancée dépliée) ;
      `?project=` inchangé (vérifié). Liens rapides = les 5 domaines les plus fournis, calculés depuis les données
      (pas de liste écrite à la main) ; un clic filtre et ramène sur la grille. Exception pilule notée au BRIEF §2.
      Textes ajoutés dans `home.ts` / `home.fr.ts` (`hub`), token `--color-night-line`. Vérifié : lint,
      content:validate, build, Playwright 1440 px (clair). À REPRENDRE : mobile, sombre et tablette (étape 13/14).
- [x] 12. Blog et Séries (24/11/2026, sans commit). RÉALISÉ : (a) `hub-v3/BlogLatest` : bloc « Derniers articles du blog »
      dans le Hub, après « À la une » (ancre `#blog`) : article le plus récent en grand avec image, deux autres en texte seul,
      filets verticaux sur ordinateur, lien « Voir les séries » (vers la série à la une) ; styles dans `styles/v3/hub.css`,
      libellés `hub.blogLabel / blogTitle / blogSeries` (`home.ts`, `home.fr.ts`). (b) `/blog` redirige vers `/projects#blog`
      (`App.tsx`) ; `BlogPage.tsx` supprimée ; `/blog/:slug` et `/series/:slug` inchangées. (c) `scripts/generate-seo.ts` :
      `blog` retiré du sitemap, `projects` prend la date la plus récente (projets ET articles), nouvelle page statique
      `public/blog/index.html` (200, `canonical` vers `/projects`, `noindex`, renvoi calculé depuis l'adresse courante).
      (d) `SeriesPage` et `BlogPostPage` restylées (`styles/v3/blog.css`, `blog/BlogBanner`) : bandeau de bambous partagé
      (`bamboo-banner`, règle ajoutée dans `page-transitions.css`), titres serif, filets 1 px, liste numérotée des articles
      de la série, précédent / suivant à filets, sommaire collant (≥ 1280 px, masqué en dessous), liens « Retour au blog » vers
      `/projects#blog`. Logique inchangée (tri, `Seo`, JSON-LD, chargement, `IntersectionObserver` du sommaire, `PostContent`).
      (e) `ScrollManager` réessaie jusqu'à 2 s pour trouver une ancre (arrivée directe sur `/projects#blog`, page chargée à la
      demande). (f) `BlogSubscribeSection` : bouton sans dégradé, titre serif. Vérifié : lint, content:validate, build ;
      Playwright 1440 px et 390 px (clair) ; article à formules `classification-logistic-activation` identique avant / après
      (66 éléments KaTeX dont 17 en bloc, 0 erreur, 12 titres, 1 bloc de code), version FR sans erreur KaTeX ; clic Hub → série →
      article → retour. À REPRENDRE : (a) mode sombre et tablette non vérifiés (13, 14) ; (b) au nettoyage (15) : composants
      devenus inutiles `BlogFilters`, `BlogSeriesCard`, `LastBlogPosts`, `PostGrid`, `PostCard`, `home-v2/BlogPostsSection`, et
      le CSS V2 correspondant dans `blog-v2.css` (à garder : `subscribe-v2`, `blog-post-content`) ; (c) champs `blog.section.*`
      et `blog.catalog.*` des locales à vérifier à ce moment ; (d) pas de page « toutes les séries » : le lien du Hub mène à la
      série à la une (une seule série aujourd'hui) ; (e) le bouton Précédent du navigateur n'est toujours pas animé.
      AJOUT (24/11/2026, demande du propriétaire) : les pages Séries sont l'endroit où l'on cherche dans TOUS les articles.
      `blog/BlogSearchPanel` (+ `BlogSearch`, `PostRow`) place la recherche EN TÊTE de `/series` et de `/series/:slug` :
      au repos une pilule « Rechercher un article » (même classe que « Search a project » du Hub), au clic le formulaire
      (champ + tag, « Fermer la recherche ») se déplie en dessous (framer-motion, sans animation si mouvement réduit) ; au repos on voit la page, en recherche les résultats (tous articles, du plus récent au plus ancien)
      la remplacent. Nouvelle page `/series` (`SeriesIndexPage`) : liste de TOUTES les séries (prête pour plusieurs) ; le lien
      « Voir les séries » du Hub y mène (et non plus à la série à la une) ; `/series/:slug` a un lien « Toutes les séries ».
      Sitemap : `series` ajouté ; navbar : `/series` active l'onglet Projets & Blog. `FeaturedCover` du Hub garde « Voir la
      série » vers la série à la une.
- [x] 13. Responsive, passe sur tout le site (24/11/2026, sans commit). Audit à 375, 390, 768, 1024 et 1280 px
      (accueil, Hub + SearchPanel, Séries, article, /publications, footer) : aucun défilement horizontal de page ;
      formules, tableaux et code d'article défilent dans leur cadre. RÉALISÉ : (a) `/publications` : les 6 ronds sociaux
      tiennent sur une ligne à 375 px (espace réduit à 0,75 rem sous 640 px, taille inchangée, `papers.css`) ;
      (b) zones de toucher ≥ 44 px, invisibles (`::before` centré, `max(100%, 44px)`), sous `(pointer: coarse), (max-width: 1023px)`
      pour couvrir aussi l'iPad en paysage (`atoms.css`) : ronds sociaux, bouton thème, liens `btn--link` / `btn--line`,
      liens de retour du blog, liens du footer, liens du SearchPanel, bouton de fermeture, onglets / copier / replier du code ;
      sélecteur de langue : remplissage + marge négative (un `<select>` n'a pas de `::before`), la pilule ne change pas de
      taille ; (c) SearchPanel : champs et bouton de 44 px, champs en pleine largeur sous 640 px (`hub.css`). Les liens
      « étirés » (cartes, séries, blog) couvraient déjà tout le bloc : inchangés. Transitions non touchées.
      Limites : voisins verticaux du footer qui se chevauchent de quelques px (le dernier dans le DOM l'emporte) ;
      toucher réel (iPad paysage) non émulé ; mode sombre = étape 14.
- [ ] 14. Dark mode, accessibilité, `prefers-reduced-motion`.
- [ ] 15. Nettoyage V2, réécriture complète de `docs/ARCHITECTURE.md` et `docs/DESIGN_SYSTEM.md`, `lint` +
      `content:validate` + `build`, vérif Playwright (clair/sombre, desktop/mobile), aperçu validé avant merge.
- [ ] 16. **Remplacement par le vrai contenu (obligatoire avant merge)** : supprimer `placeholders.ts` et toute
      mention fictive, rebrancher les vraies données, relire les claims (AGENTS.md).

Chaque étape : `npm run lint` + `npm run build` verts, résumé court, mise à jour de ce fichier.
Règles de lisibilité (CSS vertical, commentaires français sur les techniques complexes, `cn()`/`clsx`, ordre
des propriétés) : voir `CLAUDE.md`, section « Style de code ». Elles s'appliquent dès l'étape 1, et chaque
étape les vérifie avant de se terminer.

## 3b. Transitions immersives « entrer dans la forêt » — TERMINÉE ET FUSIONNÉE (E1 à E6)
Concept validé par le propriétaire (le 2026-11-23, rendu des étapes E1 et E2 jugé bon). Il remplace le morph « Learn more »
seul : la photo de bambous est le fil conducteur de toutes les pages. Spécification complète : `design/BRIEF.md` §6c
(elle n'existe QUE sur la branche `experiment/bamboo-transitions`, commit `75c5c36`, section « 6c. Transitions
immersives »).

**Décisions** : option A (scène collante + scroll-snap natif, décision 10 inchangée, jamais de détournement de la
molette) ; bouton Précédent du navigateur non animé (accepté pour l'instant) ; zone morte supprimée ; sur mobile on
garde le zoom des bambous ET le resserrement de la bannière (glissement avatar / nom supprimable si risqué) ; photo en
trois tailles 1200 / 1920 / 2400 px (`srcset`) + préchargement ; on n'anime que `transform`, `opacity`, `clip-path` ;
aucune nouvelle dépendance ; `prefers-reduced-motion` = fondu simple ; navigateur sans View Transitions = navigation
normale sans animation.

**Où est le code.** Fusionné dans `redesign/researcher-friendly` (la branche `experiment/bamboo-transitions` est supprimée). Concept
final, tel que codé : `design/BRIEF.md` §6c. Fichiers principaux : `hooks/useBambooScene.ts` (ordinateur), `hooks/useBambooMobile.ts`
+ `styles/v3/touch-scene.css` + `lib/morphPlayer.ts` (mobile et tactile), `lib/navigateToSection.ts` + `lib/jumpToSection.ts` (liens vers
les sections), `lib/pageTransition.ts` + `app/pages.tsx` + `components/routing/PageTransitions.tsx` + `styles/v3/page-transitions.css`
(entre pages), `components/layout/MorphNavbar.tsx`. Point de retour gardé : tag `e4a-v2-validee`.

- [x] E1. Scène collante (≥ 1024 px) : `.scene` de 200 dvh, cadre `position: sticky` de 100 dvh, photo commune au-dessus
      de la landing et de l'About, zones `#home` / `#about` (ancres, onglet actif de la navbar, points d'arrêt du
      `scroll-snap`), photo en `srcset` (`BambooPhoto`) + préchargement. Sous 1024 px rien ne change.
- [x] E2. Animation Landing → About pilotée par `useBambooScene` (`useScroll` sur la scène) : bannière resserrée par
      `clip-path` (609 → 323 px à 1651 px de large) avec zoom +16 %, l'avatar, le nom, le poste et les réseaux DE LA
      LANDING glissent vers leur place d'About (l'état initial de la landing n'est jamais modifié), relais par fondu
      avec l'en-tête de l'About entre 92 % et 100 %, « Latest things » s'efface, le contenu de l'About apparaît (35 %
      → 85 %), le poste passe du blanc au sombre entre 78 % et 92 %. `MorphNavbar` prend la progression de la scène
      (`sceneProgress`, `isSceneActive`), zone morte supprimée, plus de « suit la page » dans la scène.
- [x] E3. Branchement de `MorphNavbar` sur la scène, validé au Playwright (1651 x 900) : le voyage du bouton suit la
      scène (même progression que la photo), l'onglet actif passe de Home à About à 65 %, le clic sur « Learn more »
      défile jusqu'à `#about`, le second voyage vers le Contact se pose exactement sur son emplacement. Le bouton
      croisait l'avatar vers 35 % : il fait maintenant un léger arc vers la droite pendant la montée
      (`FLIGHT_ARC_PX = 90`, ordinateur seulement, nul en mouvement réduit) ; écart minimal avec l'avatar rond : 14 px.
- [x] E3b (validée par le propriétaire). Sections de l'accueil dans la scène (ordinateur ≥ 1024 px) : About → Recherche → Contact, même principe
      que Landing → About. UNE seule photo (cadre plein écran, `clip-path` = bande visible, bords mesurés :
      62,5 % → About → 8 rem (Recherche) → plein écran moins 4,5 rem (Contact)) ; zooms ×1,00 → ×1,16 → ×1,30 →
      ×1,45, plafonnés si la photo (2400 px) risque d'être floue (`PHOTO_MAX_UPSCALE`, selon la largeur en pixels
      d'écran) ; `sizes="145vw"` et deux préchargements dans `index.html` (≥ 1024 px et en dessous). `useBambooScene`
      généralisé : progression 0 à 3 (une unité par transition), partagée avec `MorphNavbar` (le voyage vers le Contact
      se joue pendant la dernière transition). Recherche : bloc `.papers` ordinaire qui défile librement, fixé à l'écran
      (`position: fixed`, classes `is-pinned-start` / `is-pinned-end`) avant et après son défilement ; il passe SOUS le
      cadre de la scène, donc derrière la bande de photo ; ronds sociaux + bande de la couleur de la page dans
      `PapersChrome` (collés au cadre). Contact : couche `position: sticky` placée après la liste (`contact--in-scene`),
      `ContactNavSlot` séparé (la navbar reste à cheval sur le bord de la photo). Points d'arrêt du scroll-snap : zones
      #home, #about, #contact-form et le bloc #research (début et fin ; défilement libre entre les deux). Mobile et
      tablette inchangés. Vérifié au Playwright (1651 x 900 et 390 px). À régler à l'œil : bande de Recherche
      (`--papers-band-height`, 8 rem), amplitudes (`ZOOM_STEPS`, `*_SHIFT_PX`), moments des fondus (`useBambooScene.ts`).
      Limite connue : la liste de Recherche (placeholders) n'a que ~30 px de défilement libre ; le vrai contenu sera plus long.
- [x] E4. Mobile et tablette, y compris iPad en paysage (voir le critère tactile ci-dessous) : VALIDÉE par le propriétaire (24/11/2026) sur mobile, tablette et desktop (E4a et E4b).
      Principe retenu après essais sur iPhone : DÉCLENCHER, pas SUIVRE (une animation liée à chaque pixel de scroll
      rampe, zigzague et reste coincée au doigt). Pas de scène collante : sections normales, `useBambooMobile`.
      - [x] E4a. Landing → About, déclenchée : au-delà de 40 px de scroll, une valeur 0 → 1 se joue en 0,6 s (ressort),
            partagée avec `MorphNavbar` (voyage du bouton jusqu'à la pilule « About », effacement de l'identité de la
            landing, zoom + resserrement des bambous) ; la page glisse jusqu'à l'About (scroll natif, sans
            `preventDefault`) ; retour en haut = transition inverse ; doigt arrêté entre deux = la page termine le
            mouvement (calage au repos). Le bouton suit la page sur les 40 premiers px, puis
            vole jusqu'en haut (position pilotée par le TEMPS, pas par le scroll) et se transforme en barre ; « Latest things »
            s'efface pendant le vol. Mesures de départ lues dans la mise en page (stables avec la barre d'adresse Safari).
      - [!] E4a, ÉTAT RÉEL SUR iOS (23-24/11/2026) : la transition marche sur ordinateur et dans Chrome simulé, mais le
            propriétaire ne voit pas le morph sur iPhone / iPad. Diagnostic sur appareil (encart ?debug=1, mouvement réduit
            NON, mode tactile OUI) : la progression atteint bien 1.00 mais Safari iOS n'affiche pas les animations JavaScript
            pendant l'élan natif du doigt (6 événements de scroll pour 695 px). Dernier correctif (commit 450a19c) : couper
            l'élan et dérouler la page nous-mêmes en 0,6 s (html.is-gliding) ; NON confirmé sur appareil. Pistes si ça
            échoue : animations 100 % CSS / WAAPI (thread compositeur) au lieu de JS, ou View Transitions API. Encart de
            diagnostic : src/components/debug/DebugOverlay.tsx (temporaire, branché sur ?debug=1 dans HomePage).
            PISTE WAAPI IMPLÉMENTÉE (24/11/2026, CONFIRMÉE sur appareil par le propriétaire : « me plaît assez bien ») : pendant la transition, ce que l'écran affiche
            est une animation `element.animate` jouée par le navigateur, plus nos valeurs JavaScript. `src/lib/morphPlayer.ts`
            garde un registre d'éléments ; chacun donne son style à une progression p, on échantillonne 24 images clés
            et on les joue en 0,6 s (courbe `morphEase`, la même que la progression framer-motion, donc pas de saut à la
            fin). Branchés : identité, « Latest things », bambous (zoom + clip-path) dans `useBambooMobile`, et la navbar
            (en-tête, « Learn more », pilule compacte, onglets) dans `MorphNavbar` ; les formules de la navbar sont
            maintenant des fonctions pures partagées (`getFlight*`). Écart : le rebond de la navbar est une courbe fixe
            (`getWidenOvershoot`) en version tactile au lieu du ressort, et le rebond du ressort de la progression a disparu.
            Vérifié en Chromium (390 x 844, molette) : 16 animations pendant le voyage, retour inclus, aucun saut à
            la fin, mouvement réduit exclu. LIMITE : top / left / width / height de la navbar sont des propriétés de mise en
            page (pas du compositeur) ; seuls opacité, transform et clip-path le sont. Si Safari ne les affiche toujours
            pas : convertir la navbar en `transform` (scale + translate) ou passer aux View Transitions.
      - [~] E4a v2, SCÈNE FIXE (24/11/2026, essai 1, VALIDÉE par le propriétaire sur iPhone et iPad ; point de retour : tag `e4a-v2-validee`) : la vidéo iPhone montrait que la page
            défilait réellement pendant l'animation (landing qui remonte, bouton sur l'avatar, pilule vide, images vides au
            retour). Nouveau principe < 1024 px / tactile : Landing et About sont DEUX ÉTATS d'une scène fixe
            (`html[data-scene="landing|about"]`, `src/styles/v3/touch-scene.css`). Sur la landing la page est verrouillée et
            la landing est `position: fixed` ; un geste vers le bas / molette / flèche / « Learn more » joue la transition
            (600 ms, scroll bloqué, WAAPI) : identité effacée à 25 %, bouton qui vole de 20 à 80 % (fondu croisé
            « Learn more » → « About », jamais vide), bambous zoom + resserrement, About qui apparaît en place à partir de
            60 % ; puis la landing passe en `absolute` (même place au scroll 0) et l'About défile normalement. Une seule
            photo (celle de la landing, qui défile avec la page). Retour : geste vers le haut seulement si `scrollY = 0` au
            début du geste, ou entrée « Accueil » de la navbar. Garde de 500 ms après chaque transition ; un doigt posé
            pendant la transition ou la garde ne déclenche rien. Lien direct `#about` / `#contact-form` : démarre sur
            l'About sans animation. Fichiers : `useBambooMobile.ts` (machine à états, gestes), `MorphNavbar.tsx`
            (chronologie tactile `TOUCH_TIMELINE`, plus de « suit la page »), `lib/morphPlayer.ts` (inchangé).
            Vérifié en Chromium tactile (390 x 844, 1180 x 820, mouvement réduit) ; desktop inchangé. Plus de calage
            `scroll-snap` en tactile (l'About est plus haute que l'écran). FALLBACK si ça échoue : tag git
            `retour-e4a-waapi` (commit 9aea60a), mobile = scroll classique + fondus à l'entrée, morph = desktop seulement.
      - [x] E4b v2, PORTES (24/11/2026, essai 1, VALIDÉE). Un premier essai (bandeaux
            déclenchés par leur position, scroll libre : commits 78b75da puis revert a6bc2dc) a été refusé : « c'est
            toujours du scroll ». Nouveau principe, celui de E4a étendu : quatre écrans (Landing, About, Recherche,
            Contact), UN seul affiché à la fois (classe `scene-hidden`), qui défile normalement s'il est plus haut que la
            fenêtre. Écran suivant : geste vers le bas / molette / flèche COMMENCÉ tout en bas de l'écran ; écran
            précédent : geste vers le haut commencé tout en haut. Transition de 600 ms, scroll bloqué : l'écran qui part
            devient une couche fixe (`is-leaving`, posée où il était) qui s'efface ; l'écran d'arrivée est déjà en place
            (scroll 0 en avant, tout en bas en arrière) et apparaît, avec zoom + ouverture du cadre pour Recherche et
            Contact. Le Contact joue aussi le voyage de la navbar (`contactProgress`, canal « contact » de morphPlayer).
            Onglets de la navbar, « Get in touch », « View papers » et liens `#…` passent par l'événement `scene:go`.
            Garde de 500 ms comme E4a. Pied de page et emplacement de la navbar : seulement avec le Contact (ils
            disparaissent d'un coup en le quittant). Encart ?debug=1 retiré. Desktop inchangé. Vérification : lint +
            content:validate + build seulement. FALLBACK si échec : tag `e4a-v2-validee` (Landing ↔ About seulement).
            CORRECTIF (24/11/2026) : sur le Contact, la pilule vibrait au scroll (position et sens du chevron recalculés en
            JavaScript, suspendu par Safari iOS pendant l'élan). Désormais, une fois posée, elle passe en `position: absolute`
            dans la page (classe `is-docked`, top = emplacement du Contact) et défile nativement ; le sens d'ouverture du menu
            n'est calculé qu'à l'ouverture. EN ATTENTE du test iPhone / iPad.
      - Landing en un écran sous 900 px (`100svh`) : « Latest things » devient un carrousel horizontal en scroll-snap
        (carte suivante qui dépasse, points indicateurs). Vérifié à 375 × 667, 390 × 844 et 768 × 1024.
      - Critère tactile : « ordinateur » = `(min-width: 1024px) and (hover: hover) and (pointer: fine)` (HomePage,
        MorphNavbar et les @media de scene / about / papers / contact / navbar). Un iPad au doigt, même en paysage
        (1180 px), garde la version tactile ; son About et sa Recherche sont centrés dans une colonne de 52 rem.
      - Autres retouches mobile : tags « I work on » comme les anciennes cartes projet, bouton CV centré, ronds
        sociaux du Contact sur une ligne, bouton « Send » centré et dégagé, pied de page en deux colonnes,
        « Back to about » retiré de la Recherche de l'accueil.
      - `prefers-reduced-motion` : ni zoom ni resserrement, fondu simple (à vérifier sur appareil).
      - À valider sur de vrais appareils (iPhone, iPad) : fluidité au doigt, calage `scroll-snap`, barre d'adresse Safari.
      - Desktop (≥ 1024 px à la souris) : inchangé, toujours lié au scroll (pas testé au trackpad).
- [x] E5. View Transitions entre pages (24/11/2026, essai 1, VALIDÉE par le propriétaire). RÉALISÉ : `document.startViewTransition` appelé
      directement (react-router 7 `viewTransition` ne sert qu'avec un routeur à données ; ici `BrowserRouter`). Fonction centrale
      `navigateToPage(to)` (`lib/pageTransition.ts`) : charge la page d'arrivée d'abord (`app/pages.tsx`, plus d'écran « Loading »),
      pose le sens sur <html> (`data-vt` = forward / back, d'après la profondeur : accueil 0 < Projets, Blog, Publications 1 <
      articles et séries 2 ; même profondeur = avant), attend que la page soit affichée. `components/routing/PageTransitions.tsx`
      intercepte TOUS les clics sur les liens internes (navbar, boutons, pied de page, cartes) : rien de spécial par lien.
      CSS : `styles/v3/page-transitions.css`. Bandeau de bambous = élément partagé `bamboo-banner` (le visible : photo de la scène
      sur desktop, bannière de l'écran affiché sur mobile, bannière de /publications), contenus posés dessus capturés à part
      (`vt-content`, sinon la photo les masquerait) ; navbar et pilule langue / thème capturées à part, immobiles, sans fondu ;
      le reste zoome (avant : l'ancienne grandit et s'efface, la nouvelle arrive petite ; retour : l'inverse), 550 ms, transform
      et opacity seulement. Sans View Transitions : navigation normale ; mouvement réduit : fondu de 200 ms. Limites : le bouton
      Précédent du navigateur n'est pas animé ; Projets, Blog, Séries et articles n'ont pas encore de bandeau de bambous (seul
      le zoom du reste de la page joue pour eux, le bandeau se « pose » en arrivant sur /publications ou l'accueil).
      Ancien texte du plan : E5. View Transitions entre pages (About → Projets, Recherche, articles, séries…) : `viewTransition` de
      react-router (v7.13 installée, `BrowserRouter` : à confirmer par un test) sur les `Link` et `navigate` ; le
      bandeau bambous est un élément partagé (`view-transition-name`, un seul par page) ; sens zoom avant / arrière
      d'après la profondeur de la route (accueil < hub et publications < article et série), posé sur `<html>` avant
      la navigation ; navbar et pilule langue / thème avec leur propre nom (pas de scintillement) ; animations
      `transform` + `opacity` seulement ; détection de `document.startViewTransition` (sans support : navigation
      normale) ; `prefers-reduced-motion` = fondu simple. Le bouton Précédent du navigateur n'est pas animé
      (limite acceptée). Le bandeau doit aussi exister (même photo) sur les pages hub / blog quand elles seront refaites
      (étapes 10 à 12).
- [x] E6. Intégration (24/11/2026) : `npm run lint`, `npm run content:validate` et `npm run build` passent ; code de debug et code mort
      retirés (encart `?debug=1`, anciens champs de mesure de la navbar, ancienne demande « Learn more » du hook mobile) ; BRIEF §6c
      réécrit d'après le code ; branche fusionnée dans `redesign/researcher-friendly`.
      RESTE À FAIRE de l'expérience (non bloquant, repris dans les étapes ci-dessous) :
      - tests au Playwright clair / sombre et tablette, performance (60 images / s sur la scène), calage `scroll-snap` sur Safari ;
      - accessibilité : titre `h1` / `h2` dupliqué entre landing et About, `inert`, focus (étape 14) ;
      - nom long qui passe sur deux lignes au relais (vrai nom attendu à l'étape 16) ;
      - bandeau de bambous sur les pages Projets, Blog, séries et articles quand elles seront refaites (étapes 10 à 12) :
        le morph de page est déjà branché (nom `bamboo-banner`) ;
      - bouton Précédent du navigateur non animé (limite acceptée).

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
    EXCEPTION MOBILE (24/11/2026, décision du propriétaire) : sous 1024 px / tactile, le scroll est bloqué pendant la
    transition Landing ↔ About (≈ 600 ms) et déclenché par un geste, comme dans une application. Seulement ce passage ;
    partout ailleurs et sur ordinateur, la règle reste inchangée.
11. Routes secondaires : navbar directe, sans morph. Navbar basse du Contact : en fin de page, pas fixe.
13. Colonne « couverture » = série mise en avant (image + titre), boutons « Voir la série » et « S'abonner »
    (via `BlogSubscribeSection`).
14. Aucune nouvelle dépendance : framer-motion + scroll natif.
15. Règles de qualité du code ajoutées à `CLAUDE.md` (« Style de code ») : lisibilité pour un non-développeur,
    CSS vertical, pas de style en ligne, commentaires français obligatoires sur les techniques complexes,
    ordre constant des propriétés CSS, composants complexes dans `src/styles/v3/`. Applicables dès l'étape 1.

## 5. Questions encore ouvertes
Aucune.
