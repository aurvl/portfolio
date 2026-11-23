# Marche à suivre + prompts (à copier-coller dans Claude Code)

## A. Préparation (une seule fois, dans ton terminal, à la racine du repo)

```bash
git checkout -b redesign/researcher-friendly          # tout le travail se fait sur cette branche
```

1. Copie le contenu du kit à la racine du repo (fusionne `design/`, `public/`, `.claude/`, `CLAUDE.md`).
   Si tu avais déjà un `CLAUDE.md`, garde le tien et colle le contenu du kit à la suite.
2. Ajoute à `.gitignore` (s'ils n'y sont pas) :
   ```
   *.log
   dist/
   scripts/__pycache__/
   ```
3. (Optionnel mais très utile) Donne des yeux à Claude Code pour comparer son rendu aux maquettes :
   ```bash
   claude mcp add playwright -- npx @playwright/mcp@latest
   ```
4. Commit : `git add -A && git commit -m "chore: kit de refonte v3"`

## B. Comment travailler (les règles d'or)

- **Une étape = une session.** Entre deux étapes, tape `/clear` : Claude repart léger,
  et retrouve le fil grâce à `CLAUDE.md` + `design/PLAN.md`. C'est LA grosse économie de tokens.
- **Plan avant code** pour les grosses étapes : `Shift+Tab` (mode plan), tu valides, puis il code.
- **Après chaque étape validée** : `git add -A && git commit -m "..."`. Si ça part de travers :
  `git restore .` pour annuler ce qui n'est pas commité.
- **Corrections visuelles** : sois concret ("titre plus gros", "moins d'espace sous le bouton"),
  ou fais une capture de son rendu, entoure ce qui cloche, et glisse-la dans Claude Code.

## C. La séquence de prompts

### Étape 1 — Audit et plan (aucun code)
```
Lis CLAUDE.md, AGENTS.md, design/BRIEF.md, docs/ARCHITECTURE.md et docs/DESIGN_SYSTEM.md,
puis regarde design/screens/00-vue-ensemble-flux.jpg.
Explore la structure de src/ (pages, components, hooks, lib, styles, data) sans tout lire.

Écris design/PLAN.md avec :
1. Pour chaque écran du brief : les fichiers existants concernés et ce qu'on garde / remplace / supprime.
2. Les composants à créer ou modifier.
3. Les étapes de travail dans l'ordre (petites, testables), avec une case à cocher chacune.
4. Tes questions sur ce qui est ambigu.
Ne modifie aucun autre fichier.
```
→ Réponds à ses questions, fais-lui mettre à jour le PLAN, commit.

### Étape 2 — Fondations : tokens, thème, placeholders
```
Étape "fondations" de design/PLAN.md :
- Définis les tokens du nouveau design dans @theme (couleurs du BRIEF §2, rayons, ombres,
  typo sans + serif), en clair ET en sombre, en t'appuyant sur le système de thème existant.
- Crée src/data/placeholders.ts : données fictives typées avec les types existants
  (profil, parcours, projets, publications, latest things), en FR et EN.
Ne touche pas encore aux pages. lint + build, puis mets à jour PLAN.md.
```

### Étape 3 — Composants globaux
```
Étape "composants globaux" : navbar pilule, pilule langue + thème, icônes sociales, avatar,
boutons (primaire, secondaire, contour, pilule). Réutilise useSiteNav, la logique i18n et le
thème existants. Référence visuelle : design/screens/02-about.jpg (haut de l'écran).
```

### Étape 4 — Landing
```
Étape "landing" : implémente l'écran design/screens/01-accueil-landing.jpg avec les
placeholders et public/assets/images/hero-bamboo.webp. Suis BRIEF §4.1, y compris la
transition "En savoir plus" → navbar (scroll ou clic). Lance le serveur de dev et compare
ton rendu à la maquette ; liste les écarts restants.
```

### Étape 5 — About
```
Étape "about" : design/screens/02-about.jpg, BRIEF §4.2 (timeline, boutons, bouton
"View my papers" qui sautille, scrolls animés). Compare à la maquette.
```

### Étape 6 — Publications
```
Étape "publications" : design/screens/03-publications.jpg, BRIEF §4.3.
```

### Étape 7 — Hub Projets & Blog (le plus gros : mode plan conseillé)
```
Étape "hub projets & blog" : design/screens/04a-projets-blog-haut.jpg et 04b-projets-blog-bas.jpg,
BRIEF §4.4. Commence par me proposer le découpage en composants et comment tu fusionnes
ProjectsPage et BlogPage (routes, redirections), puis attends mon feu vert.
```
Puis, après validation :
```
Restyle la page Séries existante pour qu'elle colle au nouveau design (tokens, cartes, typo),
sans changer sa logique.
```

### Étape 8 — Contact
```
Étape "contact" : design/screens/05-contact.jpg, BRIEF §4.5 (formulaire, navbar en bas).
```

### Étape 9 — Responsive
```
Étape "responsive" : adapte tous les écrans refaits en mobile et tablette (BRIEF §6).
Montre-moi des captures à 390px et 768px de large.
```

### Étape 10 — Nettoyage
```
Étape "nettoyage" : liste les composants et CSS de l'ancien design (home-v2, *-v2.css, etc.)
qui ne sont plus utilisés. Montre-moi la liste, puis supprime-les après mon accord.
lint + build + vérifie toutes les routes.
```

### Plus tard — Brancher les vraies données
```
Remplace les placeholders par les vraies données du repo, écran par écran, en commençant
par le profil et les liens. Ne supprime src/data/placeholders.ts qu'à la fin.
```

## D. Option : 1 appel Figma MCP bien placé (plan gratuit)
Si tu veux les polices et tailles exactes, connecte le MCP Figma et lance UNE seule fois :
```
Utilise UN SEUL appel à get_design_context sur ce lien : [lien vers la frame About, via
"Copy link to selection"]. Donne-moi uniquement les familles de polices, tailles, graisses
et interlignages utilisés, puis mets à jour les tokens typo dans @theme. Aucun autre appel Figma.
```
