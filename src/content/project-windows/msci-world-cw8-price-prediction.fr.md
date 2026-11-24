---
slug: "msci-world-cw8-price-prediction"
lang: "fr"
title: "MSCI World CW8 Price Prediction"
summary: "Pipeline LSTM de prévision sur l'ETF CW8, avec enrichissement technique, séquences temporelles et interface Streamlit."
---

# Overview

## Objet du projet
Ce projet traite un problème de prévision financière très visible :
modéliser la dynamique de prix de `CW8.PA`, un ETF répliquant le MSCI World.

L'intérêt du dépôt ne réside pas dans une promesse de prédiction certaine.
Il tient plutôt à la construction d'une chaîne de prévision cohérente, de la donnée de marché jusqu'à une application interactive.

Le travail doit donc être lu comme un projet structuré de séries temporelles.
Il ne prétend pas établir une robustesse de marché définitive.

## Positionnement analytique
Le dépôt expose plusieurs parties du pipeline :
construction des features, préparation séquentielle, architecture récurrente et déploiement via `Streamlit`.

Cette largeur de périmètre lui donne plus de substance
qu'un notebook qui entraînerait un LSTM directement sur une série de prix bruts.

Elle permet aussi une discussion plus sérieuse de l'évaluation,
puisque la qualité apparente du résultat peut être reliée à la manière dont le pipeline a été construit.

- [v] J'ai couvert la chaîne complète de préparation, modélisation et restitution.
- [v] La logique séquentielle est visible et documentée.
- [!] Les scores élevés doivent être lus avec prudence dans un contexte financier intrinsèquement instable.

# Method

## Préparation des données et features
Le modèle s'appuie sur des données de marché enrichies
par des variables techniques comme `lag_1_week`, `Vol_1_month`, `SMA20`, `SMA50`, `RSI(10)` et des rendements.

Les entrées sont normalisées via `MinMaxScaler`
puis converties en séquences de longueur `10`.

Ce choix montre que le projet ne travaille pas uniquement
sur le niveau brut du prix.

Il cherche à injecter dans le modèle
une structure de court terme à travers un ensemble de features explicites.

## Modèle, application et limites
L'architecture empile trois couches `LSTM`,
avec dropout et tête dense finale.

La couche de restitution repose sur `Streamlit`
et sur des visualisations `Plotly`, avec prévision récursive sur une trentaine de jours ouvrés.

Les métriques indiquées dans `src/metrics.txt`
sont fortes sur le papier, autour de `MAE 11.68`, `RMSE 14.42` et `R² 0.9773`.

Le dépôt montre cependant aussi des limites importantes.
Le split train-test n'est pas totalement irréprochable du point de vue série temporelle,
et certaines différences apparaissent entre la logique d'entraînement et la logique d'inférence récursive.

- [v] J'ai défini un jeu de features explicite et cohérent avec une logique de prévision pratique.
- [v] J'ai exposé le modèle dans une application plutôt que de le laisser au niveau notebook.
- [v] J'ai documenté à la fois les métriques et la logique d'inférence.
- [!] La validation pourrait être plus stricte du point de vue temporel.

# Value

## Ce que j'ai voulu montrer
Je voulais construire une chaîne de prévision complète sur données financières : préparation de features, modélisation séquentielle et restitution applicative, en laissant visibles les contraintes méthodologiques qui conditionnent l'interprétation des scores. Pour moi, le modèle deep learning vaut autant par la structure du pipeline que par ses résultats.

## Ce que j'en retiens
- [v] J'ai relié préparation, apprentissage séquentiel, interface et lecture prudente de l'évaluation.
- [v] J'ai mis en avant la méthode et ses contraintes plutôt qu'un effet d'annonce.
- [!] Ma force est la clarté du pipeline, pas une promesse de prédiction robuste du marché.
