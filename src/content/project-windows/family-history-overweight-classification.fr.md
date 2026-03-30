---
slug: "family-history-overweight-classification"
lang: "fr"
title: "Family History of Overweight Classification"
summary: "Comparaison de classifieurs pour prédire les antécédents familiaux de surpoids, avec SMOTE, encodage mixte, importance des variables et lecture critique des métriques."
---

# Overview

## Ce qu'est réellement le projet
Ce projet part d’une question simple en apparence : peut-on prédire l’existence d’antécédents familiaux de surpoids à partir de caractéristiques individuelles et comportementales ? Derrière cette question, le dépôt montre un cas intéressant de classification binaire sur données de santé et habitudes de vie.

L’intérêt du projet ne réside pas seulement dans le choix des modèles. Il se situe aussi dans le travail sur les variables, le traitement du déséquilibre et l’interprétation des résultats lorsque les métriques ne racontent pas toutes la même histoire.

## Pourquoi ce projet mérite l'attention
Le sujet est lisible, mais la démarche est plus riche qu’une simple démo de classification. Le projet cherche à comprendre quelles variables portent le signal, à comparer plusieurs familles de modèles et à discuter un cas de résultat contradictoire, notamment sur `XGBoost`.

Il est donc intéressant autant pour sa partie predictive que pour sa partie lecture critique des sorties.

- [v] Le projet combine préparation des données, modélisation et interprétation.
- [v] Il traite un problème de classification appliqué avec variables hétérogènes.
- [v] Il ne s’arrête pas au score final et regarde aussi l’importance des variables.
- [!] Le sujet impose une lecture prudente pour éviter de surinterpréter des signaux corrélationnels.

# Method

## Préparation et modèles
Le dépôt récupère un jeu de données sur l’obésité, distingue variables numériques, binaires et catégorielles multiniveaux, puis applique un encodage adapté, notamment sur `CAEC`, `CALC`, `MTRANS` et `NObeyesdad`. La cible est recodée en binaire, le déséquilibre traité via `SMOTE`, puis les données sont séparées en train/test selon une logique `80/20`.

Trois approches sont ensuite comparées : `Logistic Regression`, `Random Forest` avec `500` arbres, et `XGBoost`. Cette combinaison est utile, car elle permet de confronter un modèle interprétable, un ensemble d’arbres robuste et un boosting plus puissant mais plus délicat à régler.

## Résultats et lecture utile
La régression logistique atteint environ `85.34 %` d’accuracy avec un `AUC-ROC` proche de `85.28 %`. Le `Random Forest` ressort comme le meilleur compromis, avec `94.43 %` d’accuracy, `93.45 %` de `F1-score` et `94.21 %` d’`AUC-ROC`. `XGBoost`, en revanche, affiche un cas beaucoup plus ambigu : `57.14 %` d’accuracy, rappel nul, mais `AUC-ROC` très élevé (`97.99 %`), ce qui suggère un problème de seuil, d’encodage ou d’implémentation.

Le dépôt inclut aussi des graphiques d’importance et d’autres sorties interprétatives, ce qui évite de réduire le projet à un tableau de métriques et rend le travail plus utile pour comprendre quelles dimensions pèsent dans la classification.

- [v] Le projet traite explicitement le déséquilibre de classes avec `SMOTE`.
- [v] Il compare plusieurs familles de modèles avec des comportements différents.
- [v] Le `Random Forest` produit un résultat solide et cohérent sur plusieurs métriques.
- [v] Le cas `XGBoost` est lu de manière critique au lieu d’être artificiellement valorisé.
- [!] Certaines incohérences du script suggèrent que les sorties `XGBoost` doivent être interprétées avec prudence.
- [!] Le projet reste prédictif et exploratoire ; il ne démontre pas une causalité sur les facteurs de surpoids.

# Value

## Ce que le projet prouve
Ce projet montre plusieurs réflexes importants : préparer proprement des variables hétérogènes, traiter un déséquilibre de classes, comparer plusieurs modèles et refuser de prendre un chiffre isolé pour une vérité complète. Cette lucidité méthodologique est une vraie force.

## Portée professionnelle
Le projet montre qu’un travail de classification sérieux ne consiste pas seulement à lancer plusieurs modèles puis à retenir le meilleur score. Il faut aussi interpréter, diagnostiquer et savoir repérer lorsqu’un résultat paraît incohérent malgré une métrique flatteuse.

Cette lecture critique donne de la consistance au projet. Elle montre une capacité à confronter les sorties du pipeline à une exigence de cohérence globale, notamment lorsqu’un modèle plus sophistiqué ne se comporte pas comme attendu.

:::panel{tone="blue" title="Lecture du projet"}
L’ensemble fait ressortir une maîtrise utile de la classification tabulaire, combinée à une vigilance explicite sur la validité des résultats reportés.
:::

- [v] Le projet valorise une lecture critique des métriques.
- [v] Il montre une compétence claire en classification tabulaire appliquée.
- [v] Il associe performance, interprétation et prudence méthodologique.
- [!] La contribution majeure réside autant dans l’analyse critique des résultats que dans le meilleur score obtenu.
