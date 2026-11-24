# BRIEF — Refonte visuelle du portfolio (v3)

> Ce document décrit le NOUVEAU design. Le repo existant reste la base technique :
> routes, i18n, thème, blog, séries, SEO, scripts de contenu → on garde et on réutilise.
> On remplace la COUCHE VISUELLE (pages, composants de présentation, styles).

## 0. Fichiers de référence

| Fichier | Contenu |
|---|---|
| `design/screens/00-vue-ensemble-flux.jpg` | Vue d'ensemble : tous les écrans + flèches + annotations d'animation |
| `design/screens/01-accueil-landing.jpg` | Écran d'arrivée (plein écran) |
| `design/screens/02-about.jpg` | About me (après scroll / clic "En savoir plus") |
| `design/screens/03-publications.jpg` | Research papers |
| `design/screens/04a-projets-blog-haut.jpg` | Hub Projets & Blog — haut (à la une) |
| `design/screens/04b-projets-blog-bas.jpg` | Hub Projets & Blog — bas (recherche + cartes projets) |
| `design/screens/05-contact.jpg` | Contact |
| `public/assets/images/hero-bamboo.webp` | Photo de fond (bambous, vue en contre-plongée) |

⚠️ Ne JAMAIS ouvrir les `.svg` de `design/` (25 Mo de base64). Les `.jpg` de `design/screens/` suffisent.

## 1. Règle de contenu : PLACEHOLDERS d'abord

Objectif de cette phase : **valider le visuel**, pas le contenu.

- **Repris du repo tel quel** : navigation (libellés + routes via `useSiteNav` / `routes.ts`),
  liens des réseaux sociaux (déjà dans le repo, ex. `lib/site.ts`), sélecteur de langue,
  toggle de thème, i18n, pipeline blog + séries (posts markdown, `useBlogIndex`, `series.json`).
- **En placeholder** : tout ce qui est perso → nom, poste, photo, bio, parcours (timeline),
  projets, publications, "Latest things", textes de l'about.
- Les placeholders vivent dans **un seul endroit** (ex. `src/data/placeholders.ts`),
  **typés avec les types existants** (`types/project.ts`, etc.), pour qu'on puisse
  rebrancher les vraies données plus tard en changeant juste la source.
- Placeholders lisibles et réalistes en longueur (pas 3 mots là où il y aura 3 lignes),
  et bilingues FR/EN si le composant passe par l'i18n.

## 2. Direction visuelle

- **Ambiance** : site de chercheur (doit parler aux chercheurs et institutions : sérieux,
  lisible, éditorial) mais **cool et personnel** : nature, lumière, coins arrondis, bleu vif.
- **Fond hero** : photo bambous, légèrement voilée (opacité ~70 % sur fond clair).
- **Couleurs relevées dans la maquette** :
  - Bleu principal (navbar, icônes sociales, boutons) : `#55A1F5`
  - Fond de page : `#FAFAF8` (hub projets : `#F6F2F2` en pied)
  - Placeholder avatar / gris : `#D9D9D9`
  - Bouton secondaire : bleu très clair (≈ `#55A1F5` à 30 %) avec texte foncé
  - Bloc de recherche du hub : fond noir, texte blanc
- **Typo** : titres en sans-serif grasse (type Inter/Geist), intertitres éditoriaux
  ("What is Lorem Ipsum?", titres d'articles à la une) en **serif**. Réutiliser Geist
  (déjà dans le repo) pour le sans ; proposer une serif (ex. Source Serif 4) — à valider.
- **Formes** : pilules (navbar, boutons, sélecteur), cartes à coins arrondis, ombres légères.
- Tous les tokens dans `@theme` (Tailwind v4), y compris une variante **dark** (le toggle existe).

### Style éditorial (prioritaire)
Direction : éditorial sobre inspiré de Nature, moderne mais pas générique. Où ce style contredit les lignes
« Formes » et « Ambiance » ci-dessus (coins arrondis, pilules, ombres), c'est lui qui l'emporte.
- **Signature conservée (personnalité)** : photo bambous, bleu `#55A1F5`, navbar pilule, `UtilityPill`.
  Ce sont les SEULS éléments en pilule, à UNE exception assumée : le bouton « Search a project » de l'en-tête du Hub
  (§4.4), gardé en pilule comme sur la maquette. (Avatar et ronds sociaux restent des cercles, comme sur les maquettes.)
- **Contenu** : hiérarchie par la typographie et des filets fins (1 px), pas par des boîtes. Pas de carte pour
  du texte ou des listes de liens.
- **Rayons** : 0 à 4 px max hors signature (`--radius-sharp` 2 px, `--radius-small` 4 px). Aucune ombre hors navbar.
- **Titres** en serif, grands et contrastés. **Étiquettes** au-dessus des titres en petites majuscules
  espacées (`--label-size`, `--label-spacing`), couleur atténuée (classe `.eyebrow`).
- **Boutons** : un seul bouton plein par écran (rectangulaire, coins quasi droits : variante `solid`).
  Les autres actions sont des liens soulignés avec flèche (`link`) ou des boutons à simple filet (`line`).
- **Chiffres alignés** (`tabular-nums`, classe `.tabular`) pour les dates, années et compteurs.
- **Animations** discrètes et courtes (opacité, soulignement, ≤ 200 ms, `--duration-fast`). Pas de rebond,
  d'agrandissement au survol ni d'effet « glass ».
- **Exception** : les boutons « View my papers » (desktop) et « Research » / « Projects » (mobile et tablette)
  SAUTENT en boucle (le bouton entier, deux rebonds puis une pause) pour inviter au clic ; arrêt au survol, au
  focus et au tap ; aucune animation si `prefers-reduced-motion`.
- Exception décidée par le propriétaire : le bouton « En savoir plus » de la landing garde son style actuel
  (pilule bleue pleine). Au survol, il a lui aussi l'effet « rideau » (fond blanc de gauche à droite, texte bleu
  nuit, ~300 ms) ; sans animation si `prefers-reduced-motion`. Code dans `landing.css`.
- **Exception assumée : le voyage du bouton « Learn more » vers la navbar** (landing → About). C'est UN SEUL
  élément qui se transforme, piloté par le scroll (framer-motion `useScroll` / `useTransform` / `useSpring`) :
  s'il remonte, l'animation revient en arrière. Ordinateur : le bouton monte vers le haut au centre en
  s'étirant (et en se balançant légèrement), puis s'élargit en navbar avec un petit rebond (ressort) ; le texte
  « Learn more » s'efface en fondu, les onglets apparaissent un par un du centre vers les bords. Mobile et
  tablette : même principe, mais il va se loger en haut à gauche et devient la pilule compacte « About ▾ ».
  Un clic sur « Learn more » lance le scroll fluide vers l'About, donc la même animation. Zone morte de 12 %,
  animation étalée sur toute la landing, bouton collé à la page au départ (il ne recouvre jamais le contenu).
  Sur mobile et tablette, le menu « About ▾ » s'ouvre en agrandissant la pilule elle-même (ressort, entrées une
  par une) et se referme en pilule. Même principe sur l'écran Contact : la navbar se décroche du haut, s'étire en
  descendant (et se penche légèrement), puis se pose en bas au milieu de la page, sur tous les formats ; sur
  mobile et tablette, le menu compact s'ouvre VERS LE BAS par défaut, et vers le haut seulement s'il n'y a pas
  assez de place sous la pilule dans la fenêtre (calculé à l'ouverture ; la chevron suit le sens). Avec
  `prefers-reduced-motion` : aucun déplacement, la navbar apparaît en fondu. À NE PAS retirer lors d'une mise
  en conformité du style éditorial. Technique commentée dans `MorphNavbar.tsx` ; un « fantôme » invisible du
  bouton dans la landing donne le point de départ exact.
- **Exception assumée : le « rideau » du bouton « Research »** (« Pour aller plus loin », mobile et tablette).
  Contour et texte bleus ; au survol (desktop), au focus clavier et au tap (mobile), le fond bleu se déploie de
  GAUCHE à DROITE comme un rideau et le texte passe en blanc (~300 ms, ease-out). Sans animation si
  `prefers-reduced-motion`. À NE PAS retirer lors d'une mise en conformité du style éditorial. La technique est
  commentée dans `about.css` (`.next-doors__door--curtain`) ; le bleu (`--color-action-fill`, 5:1 sous du texte
  blanc) est plus foncé que `#55A1F5`, qui ne passerait pas en contraste.

## 3. Composants globaux

- **Navbar "pilule"** : capsule bleue centrée, ~7 onglets texte blanc, onglet actif =
  fond bleu clair + texte noir. Libellés réels depuis le repo.
- **Pilule en haut à droite** (grise translucide, sur chaque écran) = **sélecteur de langue
  FR/EN + toggle thème clair/sombre** (réutiliser la logique existante).
- **Icônes sociales** : ronds bleus, icône blanche. Réseaux réels depuis le repo.
- **Avatar** : cercle (placeholder gris tant qu'il n'y a pas de photo).

## 4. Écrans et comportements

### 4.1 Accueil — landing (`01`)
- **Desktop : un seul écran, non scrollable en apparence** ("not scrollable / one page").
- Hero bambous sur ~60 % de la hauteur ; au centre : avatar, NOM & PRÉNOMS, poste,
  rangée d'icônes sociales, bouton pilule **"En savoir plus"**.
- Sous le hero : bloc **"Latest things"** = 3 cartes horizontales (titre, description,
  date, vignette carrée à droite). Placeholders.
- **Transition** : au scroll vers le bas OU au clic sur "En savoir plus" → animation fluide
  vers l'About, et **le bouton "En savoir plus" se transforme en navbar** (morph, ex.
  `layoutId` framer-motion, déjà installé).

### 4.2 About (`02`)
- Navbar en haut, hero bambous réduit en bandeau, avatar qui chevauche le bandeau à gauche,
  icônes sociales alignées à droite sur la ligne du bandeau.
- Colonne gauche : **timeline verticale du parcours** (points sur une ligne, l'étape
  active a un point bleu plein) + bouton **"View my Resume"** (icône document).
- Colonne droite : "About Me" + sections texte (intertitres serif).
- Boutons : **"Explore my Work"** (primaire bleu clair) et **"Get in touch"** (contour).
- Bouton **"View my papers ↓"** en bas à droite : **il sautille** en boucle pour attirer
  l'attention (respecter `prefers-reduced-motion`).
- Clic "Explore my Work" → animation fluide vers le hub Projets & Blog.
- Clic "Get in touch" → scroll animé vers le Contact.
- Clic "View my papers" OU scroll → section Publications.

### 4.3 Publications (`03`)
- Même en-tête (navbar + bandeau + icônes).
- Bouton **"Back to about ↑"** à gauche (ou scroll vers le haut pour revenir).
- Titre "My research Papers" + liste de cartes : titre serif, résumé, mention à droite.
- Placeholders (s'inspirer de la structure de `publications.json` pour les champs).

### 4.4 Hub Projets & Blog (`04a` + `04b`)
- **Cette page centralise projets ET articles de blog.**
- En-tête : navbar sur bandeau bambous fin, titre "Project & Blog posts",
  champ **"Search a project"** en pilule à droite.
- **Section "À la une"** — mise en page inspirée d'une revue scientifique (Nature) :
  - 1 grand article vedette (bloc texte sombre à gauche, grande image à droite)
  - une rangée de 4 articles (image, titre serif souligné, chapô)
  - une colonne "couverture" à droite avec 2 boutons (ex. "Contents" / "Subscribe")
  - ⚠️ Reprendre uniquement la **composition** : aucun logo, nom, texte ou image de Nature.
    Contenu = mes projets/articles (placeholders).
  - Dans "à la une", un **second bloc "derniers articles du blog"** + un bouton vers la
    **vue Séries** (la page Séries existe déjà dans le repo : la garder, la restyler).
- **Zone de recherche** (bloc noir : champ, filtre déroulant, bouton Search, lien
  recherche avancée, liens rapides) : elle **apparaît après clic sur "Search a project"**
  et la page **défile jusqu'à elle**. Sinon, après "à la une", on arrive au footer.
  Réutiliser la logique de filtres existante (recherche, domaine, tag, année, tri).
- **Cartes projets** (grille 3 colonnes) : image avec étiquette de domaine en surimpression,
  titre, tags en majuscules (petites pilules), séparateur, description, date en bas à
  gauche, "Read more ↗" en bas à droite. Le style actuel des cartes est proche : le garder
  comme base.

### 4.5 Contact (`05`)
- Hero bambous quasi plein écran ; avatar à gauche, NOM & PRÉNOMS + poste + icônes à droite.
- Grand bloc blanc central = **formulaire de contact** (nom, email, sujet, message, envoyer).
  Envoi : garder le mécanisme existant s'il y en a un, sinon UI seule pour l'instant.
- **La navbar est en bas de l'écran** sur cette vue, posée À CHEVAL sur le bord bas de la photo : ce bord passe
  exactement par le milieu vertical de la pilule. La photo s'arrête net ; dessous, un espace vide (fond de page),
  puis le footer, SANS bandeau de photo.

## 5. Ordre des sections de l'accueil (à confirmer)
Landing → About → Publications → Contact, en une seule page avec ancres et scroll fluide.
Hub Projets & Blog, Séries et articles = routes séparées (existantes).

## 6. Responsive
Pas de maquette mobile : proposer une adaptation (navbar → menu compact, colonnes empilées,
timeline au-dessus du texte, grille 1 colonne). Sur mobile, la landing peut scroller.

## 6b. Stratégie mobile (< 1024 px)
S'applique à TOUS les écrans. Sous 1024 px (mobiles ET tablettes, 768–1023 px compris), l'interface passe en mode mobile ;
la capsule complète en haut n'existe qu'à partir de 1024 px (à 768 px elle passait sous la pilule langue / thème).

1. **Navigation : on garde la navbar compacte EN HAUT** : pilule bleue « section courante ▾ » qui ouvre un menu
   déroulant (Accueil / À propos / Recherche / Projets & Blog / CV / Contact), fermé par Échap. Pas de barre fixe en bas.
2. **Dire en une phrase, détailler sur demande** : une accroche courte (2 lignes max), puis des sections repliables
   (« Lire la suite »). Le texte complet reste dans la page (SEO, accessibilité) ; seul l'affichage est limité.
3. **Tout ce qui est mentionné est cliquable** : les thèmes « Je travaille sur » sont des pastilles qui ouvrent le hub
   Projets filtré sur ce thème (`/projects?tag=<thème>`, filtres existants).
4. **Chaque section se termine par une porte vers la suite** : cartes avec aperçu (ex. « 3 articles », « 6 projets »),
   à la place des boutons isolés en bas de page. Le contact reste accessible par un lien discret sous les cartes.
5. **Icônes sociales** : seulement sur la landing et le contact en mobile (masquées ailleurs, dont l'About).

Le desktop (≥ 1024 px) ne change pas.

## 6c. Transitions immersives (« entrer dans la forêt ») : CONCEPT FINAL, tel que codé

> Statut : validé par le propriétaire et fusionné (24/11/2026). Cette section complète §2 (exceptions d'animation) et
> remplace le morph « Learn more » seul. Le détail de la réalisation est dans `design/PLAN.md` (étapes E1 à E6).

**Idée.** La photo de bambous est l'élément commun à toutes les pages et le fil conducteur : comme une « morph »
PowerPoint, on reste dans le même univers et la scène se transforme autour d'elle. Aller plus loin dans le site = on
avance dans la forêt (zoom avant) ; revenir = zoom arrière. Photo en trois tailles (1200 / 1920 / 2400 px, `srcset`),
préchargée ; le zoom est plafonné si la photo risque d'être floue (écrans très larges ou très denses).

**Deux versions, une seule règle de fond : la molette n'est jamais détournée sur ordinateur.**

**A. Ordinateur (≥ 1024 px, souris ou trackpad) : scène liée au scroll.**
- Une scène haute dont le cadre est `position: sticky` (une hauteur de fenêtre) : la photo reste FIXE à l'écran, la page
  défile normalement (décision 10) ; la distance parcourue est lue (`useScroll`, `useBambooScene`) et pilote tout.
  Calage natif en `scroll-snap` sur chaque écran.
- Landing → About : la bannière se resserre de sa hauteur landing à celle de l'About pendant que la photo zoome ;
  l'avatar et le nom glissent à leur place ; « Learn more » voyage et devient la navbar (rebond de ressort à l'arrivée,
  sans ressort en marche arrière) ; « Latest things » s'efface ; le contenu de l'About apparaît.
- About → Recherche : la bande se resserre encore et zoome ; l'About s'efface, la liste de Recherche apparaît puis défile
  librement sous la bande de photo (ronds sociaux à cheval sur son bord).
- Recherche → Contact : la photo se rouvre presque jusqu'en bas en zoomant ; la navbar descend se poser à cheval sur le bord
  bas de la photo (emplacement vide `data-morph-slot`, qui réserve sa place dans la page) ; identité et formulaire apparaissent.
- Zoom croissant de la photo : ×1,00 / 1,16 / 1,30 / 1,45 (plafonné pour la netteté). Retour en arrière = l'inverse exact.
- Clics (navbar, boutons, liens du pied de page, cartes) : défilement automatique continu qui joue la scène dans le bon ordre
  (`lib/jumpToSection.ts`, calage coupé le temps du mouvement, interrompu par un geste).

**B. Mobile, tablette et tout écran tactile (< 1024 px ou sans souris, iPad en paysage compris) : scène fixe à portes.**
- EXCEPTION ASSUMÉE À LA DÉCISION 10 : la transition est DÉCLENCHÉE, pas suivie (au doigt, une animation liée au scroll
  rampe et zigzague ; Safari iOS n'affiche pas les animations JavaScript pendant l'élan du doigt). Le scroll est bloqué
  pendant ≈ 600 ms, comme dans une application. Seulement ces passages ; le défilement à l'intérieur d'un écran reste natif.
- Quatre écrans, quatre « portes » : Landing → About → Recherche → Contact. Un seul est affiché à la fois
  (`html[data-scene]`, classe `scene-hidden`) ; il défile normalement s'il est plus haut que la fenêtre.
- Écran suivant : geste vers le bas, molette ou flèche COMMENCÉ tout en bas de l'écran ; écran précédent : geste vers le
  haut commencé tout en haut ; « Learn more », onglets de la navbar et tous les liens vers une section passent aussi par ici
  (`navigateToSection`, événement `scene:go`). Un geste commencé pendant une transition ou dans les 500 ms qui suivent
  (garde) ne déclenche rien ; une destination lointaine passe par la transition directe (About / Recherche / Contact) ou
  en deux temps via l'About (landing).
- Landing ↔ About : animation WAAPI jouée par le navigateur (`lib/morphPlayer.ts`). About ↔ Recherche ↔ Contact : fondu enchaîné
  (l'écran qui part est posé en couche fixe, à sa place exacte, et s'efface ; l'écran d'arrivée est déjà en place) avec
  zoom et ouverture du cadre de la bannière. Le Contact joue aussi le voyage de la navbar, qui se pose ensuite dans la page
  (`is-docked`, `position: absolute`, sans calcul au scroll).
- Le sens d'ouverture du menu compact (chevron) n'est calculé qu'à l'ouverture, jamais pendant le scroll.

**C. Entre pages (accueil, Projets, Blog, Publications, articles, séries).**
- View Transitions natives, appelées directement (`document.startViewTransition`) : le `viewTransition` de react-router
  ne sert qu'avec un routeur à données, pas avec `BrowserRouter`. Une seule fonction, `navigateToPage` (`lib/pageTransition.ts`),
  que tous les liens internes empruntent automatiquement (`components/routing/PageTransitions.tsx`). La page d'arrivée est
  chargée avant (`app/pages.tsx`).
- Le bandeau de bambous (`bamboo-banner`) est un élément partagé qui se déplace et change de taille d'une page à l'autre ;
  les contenus posés dessus sont capturés à part (`vt-content`). Navbar et pilule langue / thème sont capturées à part,
  immobiles, sans fondu (pas de scintillement).
- Plus profond dans le site = zoom avant ; moins profond = zoom arrière (profondeur : accueil 0 < Projets, Blog, Publications
  1 < articles et séries 2). Le bouton Précédent du navigateur n'est pas animé (limite acceptée).

**Contraintes tenues.** Aucune nouvelle dépendance. On n'anime que `transform`, `opacity` et `clip-path` (jamais la hauteur ni
la largeur, sauf la navbar qui voyage, dont la taille est portée par son propre élément). `prefers-reduced-motion` : simple
fondu, aucun zoom ni déplacement. Navigateur sans View Transitions : navigation normale.

## 7. Hors périmètre de cette phase
Contenu réel, SEO, analytics, scripts de contenu : ne pas toucher sauf si une route change.
