---
slug: "house-price-prediction"
lang: "fr"
title: "House Price Prediction"
summary: "Pipeline de régression sur données immobilières américaines, avec nettoyage, gestion des outliers, mise à l'échelle et comparaison de modèles de prix."
---

# Overview

## Ce qu'est réellement le projet
La prédiction de prix immobiliers est un classique du machine learning tabulaire, mais elle reste un excellent terrain pour évaluer la qualité d’un pipeline de régression. Ce projet travaille sur un jeu de `5 000` observations et cherche à expliquer les prix à partir de variables numériques liées au bien et à son environnement.

L’intérêt du projet ne tient pas à une sophistication excessive. Il tient au fait qu’il met en place un enchaînement propre : nettoyage, traitement des valeurs atypiques, standardisation, persistance des artefacts et comparaison de modèles.

## Pourquoi ce projet mérite l'attention
Le sujet reste immédiatement lisible tout en montrant des réflexes de praticien. Il rappelle qu’un bon pipeline de régression dépend souvent davantage de la qualité du prétraitement que du prestige du modèle utilisé.

C’est précisément cette sobriété méthodologique qui le rend crédible.

- [v] Le sujet est simple à comprendre et techniquement légitime.
- [v] Le projet met l’accent sur le prétraitement, ce qui est souvent la bonne priorité.
- [v] Il permet une comparaison claire entre modèles sur une base propre.
- [!] Le caractère relativement simple des features limite aussi la portée du modèle.

# Method

## Préparation et modélisation
Le notebook retire la variable `Address`, puis applique une chaîne de prétraitement structurée : filtrage des valeurs atypiques par logique `IQR`, imputation médiane, mise à l’échelle standard et sauvegarde des objets nécessaires au pipeline. Cette logique est centralisée dans un module dédié, ce qui améliore la lisibilité et la réutilisabilité du projet.

La version actuellement documentée compare surtout une `Linear Regression` et un `KNN` avec `n_neighbors=5`. Ce choix est intéressant parce qu’il confronte un modèle linéaire transparent à une approche non paramétrique plus flexible mais souvent plus sensible à l’échelle et au bruit.

## Résultats et points de lecture
La régression linéaire obtient un `R²` moyen en validation croisée d’environ `0.8586` et un `R²` test autour de `0.858`, avec un `MSE` proche de `1.54e10`. Le `KNN` est nettement plus faible, avec un `R²` test autour de `0.749`. Le projet montre donc qu’un modèle relativement simple peut déjà capturer une bonne partie de la structure du problème si la préparation est bien menée.

Le notebook comporte toutefois une petite faiblesse technique : `r2_score` est appelé avec les arguments inversés (`y_pred`, `y_test`), ce qui peut légèrement perturber la valeur finale reportée. C’est un détail intéressant à noter, car il montre l’importance de la relecture même sur des pipelines assez classiques.

- [v] Le projet construit un prétraitement cohérent et explicite.
- [v] La comparaison de modèles reste lisible et pédagogiquement utile.
- [v] Les artefacts de preprocessing sont conservés, ce qui renforce la structure du pipeline.
- [v] La supériorité de la régression linéaire dans ce cadre est clairement établie.
- [!] Une petite erreur d’appel sur `r2_score` invite à relire les métriques finales.
- [!] Les variables utilisées restent surtout numériques, ce qui limite potentiellement la richesse explicative.

# Value

## Ce que le projet prouve
Ce projet montre la capacité à poser proprement un problème de régression, à nettoyer les données avant l’entraînement et à comparer des approches différentes sans perdre de vue l’importance du pipeline amont. C’est souvent ce qui fait la différence dans les projets tabulaires réels.

## Portée professionnelle
Le projet ne cherche pas à impressionner artificiellement. Il montre des bases solides, une bonne discipline de travail sur les données et une lecture raisonnable des résultats. Cette sobriété technique est souvent plus crédible qu’un empilement de modèles complexes sur un cas simple.

Il apporte aussi une lecture claire de ce que vaut un pipeline tabulaire bien conduit : un problème bien posé, un prétraitement cohérent, une comparaison lisible et une identification explicite des faiblesses du notebook lorsque des détails techniques méritent correction.

:::panel{tone="blue" title="Lecture du projet"}
L’ensemble fait ressortir une maîtrise des fondamentaux de la régression tabulaire et une attention réelle portée à la qualité de l’exécution plutôt qu’à l’effet de sophistication.
:::

- [v] Le projet valorise la qualité du pipeline plus que la complexité du modèle.
- [v] Il montre une bonne maîtrise des fondamentaux de la régression tabulaire.
- [v] Il reste très lisible tout en conservant des choix méthodologiques réellement discutables.
- [!] Sa portée est surtout celle d’un pipeline de régression propre, pas d’un benchmark exhaustif sur la prédiction immobilière.
