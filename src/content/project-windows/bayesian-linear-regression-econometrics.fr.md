---
slug: "bayesian-linear-regression-econometrics"
lang: "fr"
title: "Régression linéaire bayésienne en économétrie"
summary: "Projet économétrique from scratch unifiant OLS, Ridge, régression bayésienne et Empirical Bayes pour montrer shrinkage, incertitude postérieure et vraisemblance marginale."
---

# Overview

## Logique du projet
Ce projet reconstruit la régression linéaire bayésienne depuis les bases et la replace dans une famille plus large de modèles linéaires.
L'objectif est méthodologique : montrer comment `OLS`, `Ridge`, la régression bayésienne et `Empirical Bayes` peuvent être compris sur un même axe.

Le point central est l'incertitude.
Au lieu de traiter les coefficients comme de simples valeurs ponctuelles, le modèle bayésien les représente comme des distributions postérieures.
Cela permet de lire à la fois une estimation centrale, une variance et un effet de shrinkage.

Le dataset économique WBES 2023 sert d'illustration concrète autour de l'innovation, de la R&D et de la croissance des ventes.
Il n'est pas utilisé pour défendre une conclusion causale forte.

- [v] J'ai clarifié le lien entre régression classique, régularisation et approche bayésienne.
- [v] J'ai implémenté les estimateurs from scratch avec `NumPy` et `SciPy`.
- [!] Je présente les résultats économiques comme une illustration méthodologique, pas comme une preuve causale.

# Method

## Modèles implémentés
Le dépôt implémente plusieurs estimateurs linéaires dans `modules.py` :
`OLSRegression`, `RidgeRegression`, `BayesianRegression` et `EmpiricalBayesianRegression`.

La progression est volontairement pédagogique.
Une prior plate retrouve l'intuition de l'OLS, une prior gaussienne centrée en zéro conduit à une logique proche de Ridge, et `Empirical Bayes` apprend la force du prior à partir des données via la vraisemblance marginale.

Le projet rend visible l'effet de shrinkage sur les coefficients.
Dans l'exemple du coefficient de R&D, l'estimation OLS autour de `-0.121` est ramenée vers `-0.031` en version bayésienne, avec une erreur standard plus faible.

## Stabilité numérique
La partie `Empirical Bayes` optimise un hyperparamètre `tau^2` à partir de la log-vraisemblance marginale.
Le calcul utilise une factorisation de Cholesky pour éviter une inversion explicite de la matrice de covariance.

Cette décision est importante.
Elle montre que le projet ne se limite pas à écrire les formules, mais traite aussi les problèmes numériques qui apparaissent dans une implémentation réelle.

- [v] J'ai relié les formules à du code que chacun peut inspecter.
- [v] J'utilise une factorisation de Cholesky pour le log-déterminant et le terme quadratique, ce qui est plus stable.
- [!] Mon `Empirical Bayes` estime un hyperparamètre ponctuel : ce n'est pas un modèle totalement bayésien avec hyperprior.

# Value

## Ce que j'ai voulu montrer
Je voulais comprendre la régression linéaire bayésienne de l'intérieur, sans passer par une librairie : dériver les estimateurs, les coder avec `NumPy` et `SciPy`, et voir comment `OLS`, `Ridge`, la régression bayésienne et `Empirical Bayes` s'enchaînent sur un même axe.

Ce qui m'a le plus intéressé, c'est l'incertitude. Un coefficient n'est plus une valeur unique mais une distribution, et on voit directement l'effet de shrinkage : pour le coefficient de R&D, l'estimation OLS autour de `-0.121` est ramenée vers `-0.031`, avec une erreur standard plus faible.

## Ce que j'en retiens
- [v] J'ai relié les formules à du code lisible, d'OLS à Empirical Bayes, sur un même axe.
- [v] J'ai traité la stabilité numérique (factorisation de Cholesky) au lieu de m'arrêter aux formules.
- [!] Les résultats sur les données WBES illustrent la méthode : je n'en tire aucune conclusion causale sur la R&D.
