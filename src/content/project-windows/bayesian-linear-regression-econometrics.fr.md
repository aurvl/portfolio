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

- [v] Le projet clarifie le lien entre régression classique, régularisation et approche bayésienne.
- [v] Les estimateurs sont implémentés from scratch avec `NumPy` et `SciPy`.
- [!] Les résultats économiques doivent être lus comme une illustration méthodologique, pas comme une preuve causale.

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

- [v] Le projet relie les formules à du code inspectable.
- [v] Cholesky est utilisé pour le log-déterminant et le terme quadratique de manière plus stable.
- [!] `Empirical Bayes` estime un hyperparamètre ponctuel ; ce n'est pas un modèle totalement bayésien avec hyperprior.

# Value

## Ce que le projet démontre
Ce projet montre une bonne compréhension des modèles linéaires au-delà de l'appel à une librairie.
Il explique pourquoi la régularisation peut être lue comme une hypothèse probabiliste, et comment l'incertitude postérieure aide à interpréter des coefficients fragiles.

La valeur portfolio vient du pont entre économétrie et machine learning probabiliste.
Le projet ne vend pas seulement une métrique finale : il montre le mécanisme, les hypothèses et les limites.

## Positionnement professionnel
Le projet est particulièrement utile pour défendre une compétence en modélisation statistique.
Il montre une capacité à dériver, implémenter et comparer des estimateurs, tout en gardant une lecture prudente des données économiques.

L'image de cover avec des rubans de mesure fonctionne dans ce sens.
Elle évoque l'estimation, la mesure imparfaite et l'incertitude, ce qui correspond bien au message bayésien du projet.

- [v] Projet solide pour montrer une maîtrise des fondations statistiques.
- [v] Bonne articulation entre OLS, Ridge, Bayes et Empirical Bayes.
- [!] A présenter comme projet méthodologique, pas comme étude économique définitive sur la R&D.
