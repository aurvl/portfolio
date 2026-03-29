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

## Pourquoi ce projet mérite l'attention
Le projet attire l’attention parce qu’il traite un problème difficile sans le simplifier à outrance. Il prend en compte des variables techniques, des variables de régime de marché, puis il confronte les performances de classification à un backtest, ce qui est beaucoup plus informatif qu’un simple `ROC AUC`.

Il montre aussi une idée importante : en finance, un modèle peut avoir une qualité statistique moyenne mais rester intéressant dans un cadre de décision, ou au contraire afficher une métrique correcte mais échouer à produire un signal utile.

- [v] Le projet raisonne en termes de signaux de décision et non uniquement de prédiction brute.
- [v] Il relie apprentissage supervisé et lecture stratégique par backtest.
- [v] Il prend au sérieux la notion de régime de marché.
- [!] Les résultats doivent être interprétés comme ceux d’un prototype de recherche appliquée, pas comme une stratégie prête à l’emploi.

# Method

## Pipeline de classification
Le dépôt contient des jeux de features et de labels pour une dizaine d’actifs. Les notebooks décrivent un espace d’environ `28` variables mêlant indicateurs techniques, momentum, volatilité, signaux de risque, variables macro et indicateurs de régime.

Le classifieur central est un `TCKPyramidClassifier` utilisé avec `3` blocs, des noyaux `(3, 5, 7)`, des dimensions cachées `64/32` et des séquences de longueur `40`. Les régimes de marché sont dérivés à partir de tendances à `20` jours sur le `DXY`, le `Dow Jones`, le `VIX` et le taux américain `10Y`.

## Évaluation et retour de réalité
Le backtest suit une logique long/cash avec `capital=10000`, `hold_days=126` et `max_dd=0.20`. Ce cadre reste simple, mais il suffit à montrer que la performance d’un classifieur ne se résume pas à une métrique globale. Selon l’actif, les résultats varient fortement.

Sur `GBPUSD=X`, le notebook affiche un `TEST ROC AUC 0.7580` mais un `F1=0.0000` au seuil par défaut, ce qui révèle immédiatement un problème de calibration ou d’imbalance. Sur `^TNX`, les scores de classification restent mitigés, alors que le backtest imprimé apparaît meilleur que le buy-and-hold dans l’exemple fourni. Cette hétérogénéité rend le projet intéressant, car elle oblige à discuter le lien entre score et valeur d’usage.

Le dépôt a néanmoins des limites notables : le code source du classifieur n’est pas présent sous forme `.py` lisible, il n’y a pas de coûts de transaction ni de slippage, et la logique de stratégie reste limitée à une alternance long/cash.

- [v] Le projet combine apprentissage temporel et validation par simulation.
- [v] L’intégration des régimes de marché enrichit la représentation du signal.
- [v] Les notebooks montrent des résultats contrastés, ce qui donne une matière d’analyse réelle.
- [v] Le projet met en évidence les questions de seuil de décision et d’imbalance.
- [!] Le code du classifieur n’est pas entièrement exposé de manière lisible dans le dépôt.
- [!] Le backtest ne modélise ni coûts, ni friction, ni exécution réaliste.

# Value

## Ce que le projet prouve
Ce projet montre une capacité à relier features financières, classification temporelle et usage décisionnel. Il démontre aussi une bonne compréhension d’un point essentiel en finance appliquée : un score de classification ne suffit pas, il faut regarder comment il se traduit en comportement de portefeuille ou de stratégie.

## Portée professionnelle
Le projet expose un terrain difficile, des résultats hétérogènes, des arbitrages de conception et des limites franches. Cette présentation le rend plus crédible qu’un projet qui prétend battre le marché sans nuance ni discussion sur le protocole.

Il met aussi en évidence une capacité à explorer un problème complexe sans cacher les zones d’incertitude. La classification temporelle y est traitée comme un problème de décision séquentielle et non comme un simple exercice de score hors contexte.

:::panel{tone="blue" title="Lecture du projet"}
L’ensemble fait ressortir une maîtrise du raisonnement quant appliqué, où la qualité du projet tient autant à la lucidité sur les résultats qu’à la modélisation elle-même.
:::

- [v] Le projet valorise la rigueur d’analyse plus que l’effet d’annonce.
- [v] Il montre une compétence en ML temporel appliqué à un domaine exigeant.
- [v] Il relie de manière crédible quant research, data science temporelle et logique de backtest.
- [!] Le vrai intérêt du projet réside dans la démarche et dans la lucidité sur les résultats, pas dans une promesse de trading miracle.
