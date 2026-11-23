@AGENTS.md

# Refonte visuelle v3 — règles pour Claude Code

## Contexte
Refonte du DESIGN du portfolio existant. Spécification : `design/BRIEF.md`.
Plan et avancement : `design/PLAN.md` (à tenir à jour à la fin de chaque étape).
Docs du projet : `docs/ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md` (lire seulement si utile à la tâche).

## Stack
React 19, TypeScript strict, Vite, Tailwind CSS v4, framer-motion, react-router, i18next.

## Règles
- On garde la plomberie (routes, i18n, thème, blog/séries, SEO, scripts). On refait la présentation.
- Tailwind v4 uniquement : tokens dans `@theme` (CSS). Jamais de `tailwind.config.js` ni de syntaxe v3.
- Pas de valeurs arbitraires (`bg-[#...]`, `p-[37px]`) si un token existe ; sinon créer le token.
- Contenu perso = placeholders typés dans `src/data/placeholders.ts` (voir BRIEF §1).
- Réutiliser les composants et hooks existants avant d'en créer.
- HTML sémantique, accessibilité (alt, aria, focus visible), `prefers-reduced-motion` respecté.
- Animations avec framer-motion (déjà installé). Pas de nouvelle dépendance sans me demander.
- Une étape à la fois. À la fin de chaque étape : `npm run lint` + `npm run build` doivent passer,
  puis résumé court de ce qui a changé et mise à jour de `design/PLAN.md`.

## Style de code
S'applique à toutes les étapes, dès l'étape 1.

1. **Lisibilité avant tout** : le propriétaire n'est pas développeur et doit pouvoir lire et comprendre le code.

2. **Mise en forme verticale**
   - CSS : une propriété par ligne, bien indentée, jamais plusieurs déclarations sur une ligne.
   - Pas de style en ligne dans le JSX (`style={{...}}`), sauf valeur réellement dynamique.
   - `className` : au-delà de 4-5 classes, découper sur plusieurs lignes avec `cn()`/`clsx`, regroupées par rôle
     (mise en page / espacements / typo / couleurs / états / responsive).
   - Composant au style complexe : préférer un fichier CSS dans `src/styles/v3/` avec des classes nommées
     clairement plutôt qu'une longue chaîne de classes Tailwind.

3. **Commentaires (en français)**
   - Aucun commentaire pour l'évident (couleur, border, padding, margin...).
   - Commentaire OBLIGATOIRE la première fois qu'une technique complexe apparaît dans un fichier :
     `grid-template-areas`, `clamp()`, `position: sticky`, `z-index` et contextes d'empilement, `backdrop-filter`,
     `mask`, `scroll-snap`, `color-mix()`, `@keyframes`, transforms, container queries, sélecteurs avancés
     (`:has`, `:where`...), variantes dark ; côté React : `layoutId` / animations framer-motion,
     `IntersectionObserver`, hooks personnalisés.
   - Le commentaire explique POURQUOI et ce que ça fait visuellement, en 1-2 lignes simples.
     Exemple : `/* clamp : le titre grandit avec la largeur de l'écran, entre 2rem et 4rem max */`
   - En tête de chaque nouveau composant : 1-2 lignes sur son rôle et l'écran où il apparaît.

4. **Organisation**
   - Ordre des propriétés CSS constant : position → affichage/mise en page → dimensions → espacements → typo
     → couleurs/fond → bordures/ombres → animations.
   - Noms de classes et de variables explicites (pas de `.x1`, `.wrap2`).
   - Pas de code mort ni de CSS dupliqué : factoriser dans les tokens `@theme` ou une classe commune.

## Économie de contexte
- Ne jamais lire : `design/*.svg`, `dist/`, `node_modules/`, `*.log`, `package-lock.json`.
- Images de référence : uniquement celles de `design/screens/` nécessaires à l'étape en cours.
- Lire les fichiers ciblés plutôt que d'explorer tout `src/`.
