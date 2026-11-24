---
slug: "tsc-finance-temporal-signal-classification"
lang: "fr"
title: "TSC Finance: Temporal Signal Classification"
summary: "Prototype de classification temporelle pour signaux de trading, combinant features financières, régimes de marché, deep learning et backtests long/cash."
---

# Overview

## Ce qu'est réellement le projet
Ce projet ne cherche pas à prédire directement un prix futur. Il s’attaque à une question plus proche d’un usage trading : classifier des séquences temporelles afin d’identifier des moments propices à une entrée longue. Cette nuance est importante, car elle déplace l’objectif du simple forecasting vers la détection de signaux exploitables.

Le dépôt se situe à l’interface entre machine learning temporel, finance de marché et simulation de stratégie. Cela lui donne une portée intéressante, car il ne s’arrête pas à un score de classification hors contexte.

## Ce qui m'a intéressé
J'ai voulu traiter un problème difficile sans le simplifier à outrance. J'ai pris en compte des variables techniques et des variables de régime de marché, puis j'ai confronté les performances de classification à un backtest, ce qui est beaucoup plus informatif qu'un simple `ROC AUC`.

En finance, un modèle peut avoir une qualité statistique moyenne mais rester intéressant dans un cadre de décision, ou au contraire afficher une métrique correcte mais échouer à produire un signal utile.

- [v] Je raisonne en signaux de décision, pas seulement en prédiction brute.
- [v] J'ai relié apprentissage supervisé et lecture stratégique par backtest.
- [v] J'ai pris au sérieux la notion de régime de marché.
- [!] Ce sont des résultats de prototype de recherche appliquée, pas une stratégie prête à l'emploi.

# Method

## Pipeline de classification
Le dépôt contient des jeux de features et de labels pour une dizaine d’actifs. Les notebooks décrivent un espace d’environ `28` variables mêlant indicateurs techniques, momentum, volatilité, signaux de risque, variables macro et indicateurs de régime.

Le classifieur central est un `TCKPyramidClassifier` utilisé avec `3` blocs, des noyaux `(3, 5, 7)`, des dimensions cachées `64/32` et des séquences de longueur `40`. Les régimes de marché sont dérivés à partir de tendances à `20` jours sur le `DXY`, le `Dow Jones`, le `VIX` et le taux américain `10Y`.

## Évaluation et retour de réalité
Le backtest suit une logique long/cash avec `capital=10000`, `hold_days=126` et `max_dd=0.20`. Ce cadre reste simple, mais il suffit à montrer que la performance d’un classifieur ne se résume pas à une métrique globale. Selon l’actif, les résultats varient fortement.

Sur `GBPUSD=X`, le notebook affiche un `TEST ROC AUC 0.7580` mais un `F1=0.0000` au seuil par défaut, ce qui révèle immédiatement un problème de calibration ou d’imbalance. Sur `^TNX`, les scores de classification restent mitigés, alors que le backtest imprimé apparaît meilleur que le buy-and-hold dans l’exemple fourni. Cette hétérogénéité rend le projet intéressant, car elle oblige à discuter le lien entre score et valeur d’usage.

Le dépôt a néanmoins des limites notables : le code source du classifieur n’est pas présent sous forme `.py` lisible, il n’y a pas de coûts de transaction ni de slippage, et la logique de stratégie reste limitée à une alternance long/cash.

- [v] J'ai combiné apprentissage temporel et validation par simulation.
- [v] J'ai intégré les régimes de marché pour enrichir la représentation du signal.
- [v] Mes notebooks donnent des résultats contrastés, qui sont une vraie matière d'analyse.
- [v] J'ai fait ressortir les questions de seuil de décision et de déséquilibre des classes.
- [!] Le code du classifieur n'est pas entièrement exposé de façon lisible dans le dépôt.
- [!] Mon backtest ne modélise ni les coûts, ni les frictions, ni une exécution réaliste.

# Value

## Ce que j'ai voulu montrer
Je voulais relier features financières, classification temporelle et usage décisionnel. Un score de classification ne suffit pas en finance appliquée : il faut regarder comment il se traduit en comportement de portefeuille ou de stratégie. J'ai exposé un terrain difficile, des résultats hétérogènes et des limites franches, plutôt que de prétendre battre le marché.

## Ce que j'en retiens
- [v] J'ai privilégié la rigueur d'analyse à l'effet d'annonce.
- [v] J'ai appliqué le ML temporel à un domaine exigeant.
- [!] L'intérêt est dans la démarche et la lucidité sur les résultats, pas dans une promesse de trading miracle.
