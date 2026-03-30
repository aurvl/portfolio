---
slug: "allocine-data-visualization"
lang: "fr"
title: "Data Visualization - AlloCine"
summary: "Analyse visuelle d'un catalogue AlloCine enrichi, combinant graphiques descriptifs et réseau de cooccurrence des genres."
---

# Overview

## Périmètre analytique
Ce projet prolonge un travail de collecte précédent
en déplaçant le centre de gravité vers l'interprétation.

L'objectif n'est pas de prédire un comportement,
mais de lire la structure d'un corpus culturel à travers plusieurs angles visuels cohérents.

Le dépôt travaille sur un classeur contenant `365` entrées.
Cette taille suffit pour faire émerger des régularités sur les acteurs, les chaînes, les durées, les périodes de sortie et les associations de genres.

## Pourquoi le projet compte
L'intérêt du travail tient à la discipline des questions posées.
Le dépôt n'impose pas artificiellement un objectif de machine learning à un dataset qui se prête d'abord à l'exploration structurée.

Cette posture est méthodologiquement saine.
Dans de nombreux projets, l'analyse descriptive est l'étape qui permet de déterminer si une modélisation ultérieure a réellement du sens.

Le projet s'inscrit donc dans une logique de lecture du corpus.
Il cherche à rendre visibles des structures de catalogue plutôt qu'à produire des graphiques décoratifs.

- [v] La visualisation est utilisée comme instrument d'analyse et non comme simple habillage.
- [v] Le projet réemploie utilement des données issues d'un travail d'acquisition antérieur.
- [!] La portée des conclusions dépend de la cohérence interne et de la couverture du workbook source.

# Method

## Workflow de visualisation
Le notebook s'appuie sur `pandas` pour la préparation,
puis sur `matplotlib` et `seaborn` pour la couche graphique.

Plusieurs familles d'analyses sont produites :
fréquence d'apparition des acteurs, nombre de saisons par diffuseur, durée moyenne par genre, volume de sorties par année et réseau de cooccurrence des genres.

Cette variété n'est pas anecdotique.
Chaque vue répond à une question distincte sur la structure du catalogue.

## Lecture relationnelle des genres
La partie `NetworkX` constitue l'élément le plus singulier du projet.
Elle fait passer l'analyse d'un simple comptage à une représentation relationnelle des catégories.

Ce choix améliore la qualité de lecture.
Les proximités entre genres deviennent plus visibles dans un graphe que dans une table isolée.

## Principaux enseignements
Le dépôt fait ressortir David Tennant
comme acteur le plus récurrent dans l'échantillon analysé.

Des diffuseurs comme `BBC` et `Tokyo MX`
apparaissent associés à des séries plus longues en nombre de saisons.

Les genres famille, aventure et historique
ressortent comme plus longs en moyenne.

Le réseau de genres met aussi en évidence
des combinaisons fréquentes autour de labels comme drama, comedy et crime.

- [v] Le projet combine graphiques descriptifs et approche réseau dans un même workflow.
- [v] Les angles retenus sont complémentaires et non redondants.
- [v] Les figures exportées rendent l'analyse réutilisable au-delà du notebook.
- [!] Le dépôt reste exploratoire et ne vise pas une validation statistique formelle de chaque motif observé.

# Value

## Ce que le projet démontre
Le projet démontre une capacité à transformer un catalogue brut
en objet analytique lisible.

Il met en évidence une maîtrise du nettoyage,
du choix de visualisation, de l'interprétation catégorielle et de l'usage des graphes comme outil de lecture.

Il montre également une forme de retenue méthodologique utile.
Le dépôt n'exagère pas ce que le dataset permet d'affirmer.

## Portée professionnelle
Le travail complète utilement le versant visualisation du cycle de vie de la donnée.
Il rappelle qu'un projet data ne se limite ni à la collecte ni à la modélisation.

L'architecture retenue fait ressortir une capacité à organiser un notebook
autour de preuves lisibles plutôt qu'autour d'une juxtaposition de graphiques.

Pris dans son ensemble, le projet vaut par la qualité de la lecture produite.
Sa contribution principale réside dans l'articulation entre exploration visuelle et interprétation structurée.

- [v] Le projet souligne une pratique solide de la visualisation analytique sur données culturelles.
- [v] Il complète utilement le projet de scraping associé par une vraie couche d'interprétation.
- [!] Sa portée première relève de l'exploration et de l'analyse, non de la prédiction ou du déploiement produit.
