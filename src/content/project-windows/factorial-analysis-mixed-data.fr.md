---
slug: "factorial-analysis-mixed-data"
lang: "fr"
title: "Factorial Analysis of Mixed Data"
summary: "Analyse factorielle de données mixtes sur le jeu Adult de l'UCI afin de cartographier des relations socio-économiques mêlant variables quantitatives et qualitatives."
---

# Overview

## Ce qu'est réellement le projet
Ce projet s’éloigne volontairement de la logique purement prédictive pour travailler sur l’exploration structurelle des données. L’objectif est d’appliquer une `FAMD` au dataset `Adult` de l’UCI afin de comprendre comment s’organisent conjointement variables numériques et catégorielles dans un espace réduit.

Cette orientation est intéressante parce qu’elle montre une autre facette de la compétence data : savoir explorer, synthétiser et interpréter un espace de variables mixtes, sans transformer immédiatement le problème en tâche de classification.

## Pourquoi ce projet mérite l'attention
Le projet vaut le détour parce qu’il traite un vrai cas de données mixtes, là où beaucoup de démonstrations restent soit sur de la PCA purement quantitative, soit sur de l’ACM purement qualitative. Il met en avant une méthode moins “spectaculaire” que le machine learning supervisé, mais souvent plus utile dans les phases d’exploration.

Il a aussi une valeur intellectuelle intéressante : il montre comment faire émerger des structures socio-économiques lisibles à partir d’un espace de variables hétérogènes.

- [v] Le projet mobilise une méthode adaptée à un problème de données mixtes.
- [v] Il privilégie la compréhension de la structure à la performance prédictive.
- [v] Il donne une vraie place à l’interprétation multivariée.
- [!] Le projet produit moins d’effet immédiat qu’un modèle supervisé, mais il gagne en profondeur analytique.

# Method

## Préparation et exécution
Le pipeline charge le jeu `Adult`, retire la variable `education` jugée redondante avec `education_num`, convertit les variables qualitatives en facteurs, puis supprime les lignes contenant `?` sur certaines colonnes. Le jeu nettoyé compte environ `30 162` individus, ce qui donne une base suffisamment riche pour une lecture factorielle stable.

L’analyse repose ensuite sur `FactoMineR::FAMD`, avec un ensemble composé de `8` variables catégorielles et `6` variables quantitatives. Le dépôt génère les sorties attendues d’une analyse sérieuse : valeurs propres, screeplot, contributions des variables, qualité de représentation et coordonnées des individus.

## Enseignements mis en avant
Le projet met en avant que la première dimension est surtout portée par `relationship`, `marital_status` et `income`, tandis que la deuxième l’est davantage par `occupation`, `relationship` et `gender`. Cette lecture est importante, car elle montre que les dimensions extraites ne sont pas arbitraires ; elles condensent des rapports sociaux et économiques plausibles.

Le travail sur les cartes de contributions et sur la position des modalités enrichit encore l’analyse. On ne voit pas seulement quelles variables “comptent”, on voit aussi comment elles se regroupent et structurent le nuage des individus.

- [v] Le nettoyage du dataset et le choix des variables sont explicitement documentés.
- [v] Les sorties produites sont celles d’une vraie analyse factorielle exploitable.
- [v] Les dimensions obtenues sont interprétées de manière substantielle.
- [v] Le projet montre une bonne maîtrise d’outils comme `FactoMineR` et `factoextra`.
- [!] Les figures finales ne sont pas toutes figées dans le dépôt, ce qui limite la lecture immédiate hors exécution.
- [!] La reproductibilité dépend d’un téléchargement live du dataset UCI.

# Value

## Ce que le projet prouve
Ce projet montre une capacité à travailler proprement sur des données mixtes et à produire une interprétation structurée d’un espace factoriel. C’est une compétence utile en exploration de données, en sciences sociales quantitatives et dans toute phase amont de modélisation.

## Portée professionnelle
Le projet apporte quelque chose de différent d’un benchmark ML classique. Il montre un intérêt pour l’analyse multivariée, la visualisation explicative et la lecture des structures latentes, ce qui renforce une posture analytique moins centrée sur la seule prédiction.

Il met aussi en évidence une compétence moins fréquente mais très utile : savoir organiser un espace complexe de variables avant même de décider quel modèle supervisé appliquer. Cette étape amont est souvent déterminante dans les travaux de segmentation, d’exploration ou de cadrage de données mixtes.

:::panel{tone="blue" title="Lecture du projet"}
L’ensemble met en lumière une maîtrise de la réduction de dimension comme outil d’interprétation, et non comme simple prétraitement automatique.
:::

- [v] Le projet valorise la compréhension de la structure des données.
- [v] Il met en évidence une compétence en analyse multivariée moins courante dans des travaux data classiques.
- [v] Il enrichit l’image d’un profil capable de faire plus que du benchmarking ML.
- [!] Sa force repose sur l’interprétation et la rigueur de lecture, pas sur un chiffre de performance unique.
