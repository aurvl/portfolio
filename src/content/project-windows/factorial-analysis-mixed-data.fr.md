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

## Ce qui m'a intéressé
J'ai traité un vrai cas de données mixtes, là où beaucoup de démonstrations restent sur de la PCA purement quantitative ou de l'ACM purement qualitative. C'est une méthode moins « spectaculaire » que le machine learning supervisé, mais souvent plus utile en phase d'exploration.

Ce qui m'intéresse : faire émerger des structures socio-économiques lisibles à partir d'un espace de variables hétérogènes.


- [v] J'ai mobilisé une méthode adaptée à un problème de données mixtes.
- [v] J'ai privilégié la compréhension de la structure à la performance prédictive.
- [v] J'ai donné une vraie place à l'interprétation multivariée.
- [!] Le projet produit moins d’effet immédiat qu’un modèle supervisé, mais il gagne en profondeur analytique.

# Method

## Préparation et exécution
Le pipeline charge le jeu `Adult`, retire la variable `education` jugée redondante avec `education_num`, convertit les variables qualitatives en facteurs, puis supprime les lignes contenant `?` sur certaines colonnes. Le jeu nettoyé compte environ `30 162` individus, ce qui donne une base suffisamment riche pour une lecture factorielle stable.

L’analyse repose ensuite sur `FactoMineR::FAMD`, avec un ensemble composé de `8` variables catégorielles et `6` variables quantitatives. Le dépôt génère les sorties attendues d’une analyse sérieuse : valeurs propres, screeplot, contributions des variables, qualité de représentation et coordonnées des individus.

## Enseignements mis en avant
Le projet met en avant que la première dimension est surtout portée par `relationship`, `marital_status` et `income`, tandis que la deuxième l’est davantage par `occupation`, `relationship` et `gender`. Cette lecture est importante, car elle montre que les dimensions extraites ne sont pas arbitraires ; elles condensent des rapports sociaux et économiques plausibles.

Le travail sur les cartes de contributions et sur la position des modalités enrichit encore l’analyse. On ne voit pas seulement quelles variables “comptent”, on voit aussi comment elles se regroupent et structurent le nuage des individus.

- [v] J'ai documenté explicitement le nettoyage du dataset et le choix des variables.
- [v] Mes sorties sont celles d'une vraie analyse factorielle exploitable.
- [v] J'ai interprété les dimensions obtenues de manière substantielle.
- [v] J'utilise des outils comme `FactoMineR` et `factoextra`.
- [!] Les figures finales ne sont pas toutes figées dans le dépôt, ce qui limite la lecture immédiate hors exécution.
- [!] La reproductibilité dépend d’un téléchargement live du dataset UCI.

# Value

## Ce que j'ai voulu montrer
Je voulais travailler proprement sur des données mixtes et produire une interprétation structurée d'un espace factoriel : une compétence utile en exploration de données, en sciences sociales quantitatives et en phase amont de modélisation. Savoir organiser un espace complexe de variables avant de choisir un modèle supervisé est souvent déterminant.

## Ce que j'en retiens
- [v] J'ai utilisé la réduction de dimension comme outil d'interprétation, pas comme simple prétraitement automatique.
- [v] Je m'intéresse à l'analyse multivariée et à la lecture des structures latentes, pas seulement à la prédiction.
- [!] Ma force est l'interprétation et la rigueur de lecture, pas un chiffre de performance unique.
