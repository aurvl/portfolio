---
slug: "phillips-curve-europe-policy"
lang: "fr"
title: "Phillips Curve Europe Policy"
summary: "Exercice de politique économique inspiré de la courbe de Phillips sur cinq pays européens, avec recommandations budgétaires issues d'un modèle simplifié."
---

# Overview

## Ce qu'est réellement le projet
Ce projet prend la courbe de Phillips comme point de départ pour un exercice de recommandation de politique économique. L’objectif n’est pas de construire un modèle macro complet, mais de montrer comment relier inflation, chômage et taux de chômage naturel à une orientation budgétaire restrictive ou expansionniste.

Sa valeur tient justement à cette simplicité assumée. Le projet se lit comme une formalisation codée d’un raisonnement économique, avec hypothèses explicites et sortie interprétable.

## Pourquoi ce projet mérite l'attention
Le projet montre la capacité à transformer un cadre conceptuel en script reproductible. Il ne s'agit pas d'une prévision sophistiquée, mais d'une opérationnalisation explicite d'une logique économique.

Présenté honnêtement, il vaut plus comme démonstration de clarté analytique que comme outil normatif définitif.

- [v] Le projet explicite ses hypothèses au lieu de les cacher derrière un modèle opaque.
- [v] Il relie théorie macroéconomique et script de décision.
- [v] Il produit une sortie directement lisible pays par pays.
- [!] Le cadre reste volontairement simplifié et ne doit pas être surinterprété.

# Method

## Modèle et hypothèses
Le script `policy_guidance.py` encode des données 2023 et 2024 pour cinq pays européens, puis calcule un nombre de chômeurs, des moyennes d’inflation et de chômage, une pente et une constante de type `OLS`, ainsi que des écarts de chômage par rapport à un taux naturel fixé à `5 %`.

À partir de ces éléments, il génère une recommandation de politique budgétaire et un résumé textuel. La logique est donc très claire : on part d’un petit ensemble d’hypothèses quantitatives et on les convertit en recommandations lisibles.

## Ce que le dépôt montre et ses limites
Sur l’exécution partielle inspectée, le script produit une inflation moyenne proche de `2.82`, un chômage moyen autour de `5.32`, une pente d’environ `0.07` et une constante autour de `2.45`, avant de rencontrer un problème d’encodage sur la console Windows lors de l’affichage de certains symboles.

Le projet a cependant des limites fortes : seulement cinq observations, données codées en dur, taux naturel imposé, unités parfois ambiguës et logique de politique parfois discutable selon les cas. Ces réserves sont importantes et doivent être visibles dans la présentation pour préserver la crédibilité de l’ensemble.

- [v] Le script formalise clairement un raisonnement de politique économique.
- [v] Les sorties sont compréhensibles sans passer par un appareil technique trop lourd.
- [v] Le projet rend visibles les hypothèses qui sous-tendent la recommandation.
- [!] Les données sont codées en dur et l’échantillon est très réduit.
- [!] Il s’agit d’un prototype analytique, pas d’un moteur de politique macro prêt à l’emploi.

# Value

## Ce que le projet prouve
Ce projet montre une capacité à traduire un raisonnement économique en code, à rendre les hypothèses explicites et à produire une sortie directement interprétable. C’est une compétence précieuse pour des travaux d’aide à la décision ou de formalisation d’hypothèses.

## Portée professionnelle
Le projet compte surtout comme signal de clarté. Il montre une manière structurée de passer d’une idée théorique à une procédure calculable, sans masquer la simplicité du modèle ni surinterpréter la portée normative des sorties obtenues.

Il ouvre également une discussion utile sur les hypothèses, sur leurs limites et sur les améliorations nécessaires pour passer d’un prototype analytique à un cadre empirique plus défendable. Cette honnêteté méthodologique contribue directement à la crédibilité du travail.

:::panel{tone="blue" title="Lecture du projet"}
L’ensemble met en évidence une capacité à formaliser une intuition macroéconomique en script lisible, tout en gardant une distance critique sur sa portée réelle.
:::

- [v] Il valorise la capacité à formaliser une idée économique.
- [v] Il montre un souci de lisibilité et de structure.
- [v] Il souligne une pratique cohérente de l'économie appliquée et du raisonnement quantifié.
- [!] Son intérêt principal est pédagogique et analytique, plus que prédictif ou normatif.
