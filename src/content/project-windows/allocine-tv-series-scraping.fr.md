---
slug: "allocine-tv-series-scraping"
lang: "fr"
title: "AlloCiné TV Series Scraping"
summary: "Extraction de fiches AlloCiné sur les séries TV, structuration en dataset, requêtes SQL et analyse R du lien entre durée d'épisode et notation."
---

# Overview

## Ce qu'est réellement le projet
Ce projet montre une chaîne data complète à petite échelle : extraction de pages web, structuration d’un dataset, chargement en base SQL puis analyse statistique. Le terrain choisi, les fiches AlloCiné de séries TV, rend le projet immédiatement lisible tout en restant assez riche pour explorer plusieurs variables intéressantes.

L’intérêt du projet ne se limite pas au scraping. Il réside aussi dans la manière dont les données collectées sont ensuite organisées et utilisées pour répondre à une question simple d’analyse.

## Ce qui m'a intéressé
Ce projet réunit trois compétences : parsing web, structuration tabulaire et exploitation analytique. Il forme une chaîne complète, de la donnée brute à une conclusion statistique explicite, et montre que l'extraction web est reliée à un vrai usage analytique des données collectées.


- [v] J'ai couvert extraction, structuration, stockage et analyse.
- [v] J'ai fait le lien entre web scraping et exploitation analytique réelle.
- [v] Le sujet est concret et visuellement facile à comprendre.
- [!] Le scraping repose sur des fichiers HTML locaux et non sur un pipeline web robuste en ligne.

# Method

## Extraction et structuration
Le notebook parcourt `57` pages HTML locales et extrait, par expressions régulières, des champs comme le titre, le statut, la période, la durée, le genre, le réalisateur, l’acteur principal, la chaîne, les notes presse et public, le nombre de saisons et d’épisodes, ainsi qu’une description.

Les données sont ensuite exportées en CSV, intégrées dans une table SQL `series`, puis interrogées pour produire des agrégats et des classements. Ce chaînage donne au projet une bonne cohérence technique malgré un sujet accessible.

## Analyse et résultats
Le rapport `R` teste explicitement la relation `audience_rating ~ duration`. Les résultats affichent un intercept autour de `3.583`, un coefficient de durée d’environ `0.002`, un `p-value` de `0.588` et un `R²` de `0.005`. En pratique, cela signifie que, dans cet échantillon, la durée des épisodes n’explique pratiquement pas la note attribuée par le public.

Cette conclusion est intéressante parce qu’elle montre qu’un projet d’analyse n’a pas besoin de déboucher sur un “effet fort” pour avoir de la valeur. Montrer qu’une intuition n’est pas confirmée fait aussi partie d’un travail sérieux.

- [v] J'ai construit un pipeline complet, du HTML à l'analyse statistique.
- [v] Mon dataset final est structuré autour de variables riches et réutilisables.
- [v] Mon analyse aboutit à une conclusion claire et honnête.
- [v] J'ai ajouté une table SQL, étape de structuration utile entre collecte et analyse.
- [!] L’extraction par regex reste fragile face à un changement de structure HTML.
- [!] Le dépôt dépend de pages locales compressées dans `Pages.rar` : la reproductibilité n'est pas immédiate.

# Value

## Ce que j'ai voulu montrer
Je voulais enchaîner plusieurs briques data de manière cohérente : collecte, structuration, stockage, requêtes et analyse. Pour moi, une collecte web n'a de valeur que si elle débouche sur une structuration propre et sur une question d'analyse identifiable : l'intérêt est dans la continuité de la chaîne, plus que dans le scraping isolé.

## Ce que j'en retiens
- [v] J'ai produit un dataset structuré à partir d'un matériau HTML hétérogène, puis une conclusion statistique sobre et défendable.
- [v] Chaque étape apporte une transformation identifiable : le pipeline est facile à auditer et à réutiliser.
- [!] La robustesse technique est celle d'un prototype de scraping local, pas d'un pipeline web industrialisé.
