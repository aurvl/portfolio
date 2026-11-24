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

## Ce qui m'a intéressé
Le sujet est lisible, mais j'ai voulu une démarche plus riche qu'une simple démo de classification : comprendre quelles variables portent le signal, comparer plusieurs familles de modèles et discuter un cas de résultat contradictoire, notamment sur `XGBoost`.

Je m'intéresse autant à la partie prédictive qu'à la lecture critique des sorties.


- [v] J'ai combiné préparation des données, modélisation et interprétation.
- [v] J'ai traité un problème de classification appliqué avec des variables hétérogènes.
- [v] Je ne me suis pas arrêté au score final : j'ai regardé aussi l'importance des variables.
- [!] Le sujet impose une lecture prudente pour ne pas surinterpréter des signaux corrélationnels.

# Method

## Préparation et modèles
Le dépôt récupère un jeu de données sur l’obésité, distingue variables numériques, binaires et catégorielles multiniveaux, puis applique un encodage adapté, notamment sur `CAEC`, `CALC`, `MTRANS` et `NObeyesdad`. La cible est recodée en binaire, le déséquilibre traité via `SMOTE`, puis les données sont séparées en train/test selon une logique `80/20`.

Trois approches sont ensuite comparées : `Logistic Regression`, `Random Forest` avec `500` arbres, et `XGBoost`. Cette combinaison est utile, car elle permet de confronter un modèle interprétable, un ensemble d’arbres robuste et un boosting plus puissant mais plus délicat à régler.

## Résultats et lecture utile
La régression logistique atteint environ `85.34 %` d’accuracy avec un `AUC-ROC` proche de `85.28 %`. Le `Random Forest` ressort comme le meilleur compromis, avec `94.43 %` d’accuracy, `93.45 %` de `F1-score` et `94.21 %` d’`AUC-ROC`. `XGBoost`, en revanche, affiche un cas beaucoup plus ambigu : `57.14 %` d’accuracy, rappel nul, mais `AUC-ROC` très élevé (`97.99 %`), ce qui suggère un problème de seuil, d’encodage ou d’implémentation.

Le dépôt inclut aussi des graphiques d’importance et d’autres sorties interprétatives, ce qui évite de réduire le projet à un tableau de métriques et rend le travail plus utile pour comprendre quelles dimensions pèsent dans la classification.

- [v] J'ai traité explicitement le déséquilibre de classes avec `SMOTE`.
- [v] J'ai comparé plusieurs familles de modèles aux comportements différents.
- [v] Le `Random Forest` donne un résultat solide et cohérent sur plusieurs métriques.
- [v] J'ai lu le cas `XGBoost` de façon critique au lieu de le valoriser artificiellement.
- [!] Certaines incohérences du script invitent à interpréter les sorties `XGBoost` avec prudence.
- [!] Mon projet reste prédictif et exploratoire : il ne démontre pas de causalité sur les facteurs de surpoids.

# Value

## Ce que j'ai voulu montrer
Je voulais montrer plusieurs réflexes : préparer proprement des variables hétérogènes, traiter un déséquilibre de classes, comparer plusieurs modèles et refuser de prendre un chiffre isolé pour une vérité complète. Un travail de classification sérieux ne consiste pas à retenir le meilleur score : il faut aussi interpréter, diagnostiquer et repérer un résultat incohérent malgré une métrique flatteuse.

## Ce que j'en retiens
- [v] J'ai fait une lecture critique des métriques.
- [v] J'ai associé performance, interprétation et prudence méthodologique.
- [!] La contribution est autant l'analyse critique des résultats que le meilleur score obtenu.
