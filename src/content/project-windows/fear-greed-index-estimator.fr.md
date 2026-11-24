---
slug: "fear-greed-index-estimator"
lang: "fr"
title: "Fear & Greed Index Estimator"
summary: "Reconstruction transparente d'un indicateur de sentiment de marché à partir de données publiques, avec normalisation robuste, calibration et exposition via API."
---

# Overview

## Objectif du projet
Ce projet cherche à reconstituer un équivalent du Fear & Greed Index
à partir de sources publiques et d'une logique de calcul explicite.

L'intérêt du dépôt est de rendre inspectable un indicateur habituellement perçu
comme une boîte noire difficile à décomposer.

Le travail ne consiste pas seulement à obtenir une courbe proche d'un indice connu.
Il s'agit de montrer comment un score de sentiment peut être reconstruit, discuté et évalué.

## Positionnement analytique
Le projet se situe à l'interface entre collecte de données financières,
feature engineering, calibration statistique et livraison applicative.

Cette combinaison lui donne une identité plus solide
qu'un simple script de calcul d'indicateur de marché.

L'approche retenue privilégie la transparence.
Le score final reste interprétable parce que chaque composante est visible et justifiée.

- [v] J'ai transformé un indicateur opaque en pipeline analytique auditable.
- [v] J'ai rendu la logique d'agrégation explicite au lieu de l'imiter seulement visuellement.
- [!] Certaines composantes du benchmark d'origine sont approchées par des proxys plutôt que par les entrées exactes.

# Method

## Construction des signaux
Le pipeline s'appuie sur Yahoo Finance et FRED pour approcher
plusieurs dimensions du sentiment de marché.

Les sous-signaux couvrent notamment le momentum,
la demande de valeurs refuges, les spreads high yield, la volatilité relative et d'autres proxys de stress ou d'appétit pour le risque.

Chaque composante est ensuite transformée en score normalisé
sur la base de son comportement historique.

Le choix de normalisation constitue l'un des points forts du dépôt.
Le projet utilise `min_periods=252`, une fenêtre longue de `1260` observations et une winsorisation entre `1` et `99`.

## Agrégation et calibration
L'indice final peut être agrégé par moyenne simple
ou par un modèle linéaire calibré avec `scikit-learn`.

La version calibrée améliore nettement la fidélité de reconstruction,
avec des métriques documentées proches de `RMSE ≈ 6.31` et `R² ≈ 0.897`.

Les notebooks ajoutent également une lecture en régimes,
avec une accuracy autour de `76 %` et un `F1` pondéré voisin de `0.76`.

Cette étape compte car elle montre que le projet ne se limite pas à une ressemblance graphique.
La qualité de l'estimateur est effectivement mesurée.

## Couche de livraison
Le travail ne reste pas confiné aux notebooks.
Le dépôt inclut aussi une API et une interface web, ce qui donne une frontière applicative claire à l'indicateur.

L'architecture combine ainsi sourcing de données,
normalisation, calibration et exposition sous forme de service.

- [v] J'ai normalisé chaque composante sur son historique, de façon robuste aux extrêmes.
- [v] La version calibrée améliore la fidélité de reconstruction par rapport à l'agrégation naïve (RMSE ≈ 6.31, R² ≈ 0.897).
- [v] J'ai prolongé l'analyse avec une API et une interface web.
- [!] Mon dépôt n'est ni un benchmark institutionnel ni un système de validation exhaustif.

# Value

## Ce que j'ai voulu montrer
Je voulais décomposer un indicateur financier complexe en composantes mesurables, puis les recombiner dans un cadre cohérent : données multi-sources, feature engineering financier, normalisation robuste, calibration statistique. Je tiens à ce que le score soit expliqué plutôt que présenté comme une sortie mystérieuse.

## Ce que j'en retiens
- [v] J'ai construit un indicateur transparent, de la donnée brute à un estimateur consultable.
- [v] J'ai combiné raisonnement quantitatif et souci d'usage pratique.
- [!] C'est un estimateur public du sentiment de marché, pas une référence officielle de place.
