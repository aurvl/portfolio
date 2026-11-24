---
slug: "okuns-law-economic-indicators"
lang: "fr"
title: "Okun's Law and Economic Indicators"
summary: "Étude économétrique de la relation croissance-chômage sur données européennes, avec comparaison par pays et attention portée aux cas atypiques."
---

# Overview

## Objet du projet
La loi d'Okun constitue un cadre classique de macroéconomie appliquée :
elle relie la croissance du PIB et l'évolution du chômage.

Ce projet reprend ce cadre sur données européennes
et s'intéresse particulièrement à ce qui se produit lorsqu'un pays s'écarte de la relation attendue.

L'intérêt du dépôt ne réside donc pas dans une simple illustration de théorie.
Il tient aussi à la discussion des situations où le cadre théorique explique imparfaitement les données observées.

## Intérêt analytique
Le projet combine un cadre économique connu,
des données publiques et une volonté explicite de ne pas lisser les cas atypiques.

Le focus sur la Serbie enrichit l'analyse.
Il évite de traiter la loi d'Okun comme une relation uniforme valable partout avec la même intensité.

Le travail s'inscrit ainsi dans une logique d'économie empirique.
Il fait de l'écart à la théorie un objet d'analyse plutôt qu'un bruit à écarter.

- [v] J'ai confronté un cadre théorique net à des données comparables.
- [v] J'ai donné une place méthodique aux cas qui s'ajustent mal au schéma attendu.
- [!] La loi d'Okun reste un cadre simplifié qui ne résume pas toute la dynamique de l'emploi.

# Method

## Construction de l'analyse
Le script `R` récupère des données Eurostat sur le PIB et le chômage,
auxquelles s'ajoute pour la Serbie une source sur la productivité du travail.

À partir de ces séries,
le projet calcule des taux de croissance, des variations de chômage et ajuste des modèles linéaires globaux puis par pays.

La progression du raisonnement est cohérente.
Elle part d'une vue agrégée, passe à une lecture par pays, puis approfondit le cas serbe avec des graphiques dédiés.

## Ce que les résultats suggèrent
Le dépôt montre que la Serbie apparaît comme un cas atypique
au regard de la relation croissance-chômage attendue.

Cette divergence fait la valeur analytique du travail.
Elle incite à regarder la productivité, la structure du marché du travail et les mécanismes nationaux qui peuvent modifier la relation théorique.

Le dépôt ne publie pas un tableau final de coefficients figés pour toutes les variantes.
En revanche, la logique de construction des indicateurs et le diagnostic restent lisibles.

- [v] J'ai mobilisé des données publiques comparables.
- [v] J'ai relié comparaison européenne et approfondissement d'un cas particulier.
- [v] J'ai évité une lecture automatique de la relation macroéconomique.
- [!] Mes résultats dépendent de sources en ligne et ne sont pas tous figés dans des artefacts finaux du dépôt.

# Value

## Ce que j'ai voulu montrer
Je voulais partir d'un cadre théorique simple, le confronter proprement aux données et accepter qu'un résultat intéressant puisse être un écart à la théorie. Pour moi, les données servent à raisonner, pas à illustrer une idée déjà fermée : le diagnostic compte autant que la forme du coefficient estimé.

## Ce que j'en retiens
- [v] J'ai traité une relation macroéconomique connue comme une hypothèse à éprouver, pas comme un résultat acquis.
- [v] J'ai relié cadre conceptuel, données publiques et lecture des anomalies.
- [!] Ma force est la qualité de l'interprétation, pas la complexité du modèle.
