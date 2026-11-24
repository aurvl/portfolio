---
slug: "ab-testing-new-model"
lang: "fr"
title: "A/B Testing: The New Model"
summary: "Comparaison méthodologiquement cadrée de modèles de risque d'échec scolaire, avec randomisation stratifiée, analyse appariée et test de McNemar."
---

# Overview

## Périmètre du projet
Ce projet ne présente pas une simple comparaison de scores entre deux modèles.
Son intérêt principal réside dans le fait que l'évaluation est traitée comme un problème de design expérimental.

L'enjeu est de comparer un modèle baseline et un nouveau modèle
sans confondre amélioration réelle et biais de protocole.

Cette posture compte.
Beaucoup de comparaisons de modèles s'arrêtent à un tableau de métriques globales.

Ici, la question centrale porte d'abord sur la validité de la comparaison.
Le projet s'inscrit donc davantage dans une logique d'évaluation appliquée que de benchmark automatique.

## Positionnement analytique
Le dépôt se distingue par une attention explicite
aux conditions de comparabilité entre modèles.

Même si la documentation publique reste partielle,
les éléments disponibles indiquent déjà une approche plus mature qu'un simple "meilleur score gagne".

L'intérêt du projet tient précisément à cette architecture d'évaluation.
La logique de test y compte autant que le modèle évalué.

- [v] J'ai traité l'évaluation prédictive comme un problème statistique et expérimental.
- [v] Pour moi, la valeur est dans le protocole plutôt que dans l'algorithme seul.
- [!] L'implémentation publique disponible ne permet pas de vérifier l'ensemble des sorties quantitatives.

# Method

## Protocole documenté
Les informations disponibles décrivent une comparaison
entre un modèle baseline et un `Random Forest`.

La constitution des groupes repose sur une randomisation stratifiée,
afin de conserver une comparabilité satisfaisante sur les dimensions jugées importantes.

Le projet mentionne aussi une analyse appariée
sur les mêmes individus.

Ce point est méthodologiquement fort,
car il évite de s'appuyer uniquement sur des écarts agrégés potentiellement trompeurs.

## Ce qui peut être établi
Le recours au test de `McNemar` constitue un signal important.
Il montre que la comparaison n'est pas réduite à un simple écart d'accuracy.

Le projet mentionne également des analyses par sous-groupes,
notamment selon l'arrière-plan socio-économique.

L'outillage documenté combine `R`,
`Python` et des méthodes de comparaison statistique.

En revanche, le dépôt GitHub public inspecté reste pratiquement vide sur la partie implémentation.
Cela limite la reproductibilité externe du pipeline exact et des métriques associées.

- [v] La randomisation stratifiée renforce la comparabilité des groupes.
- [v] L'analyse appariée améliore la lecture des écarts au niveau des observations.
- [v] J'ai retenu le test de McNemar par souci de validité méthodologique.
- [!] Mon code et mes sorties détaillées ne sont pas publiquement exposés à ce stade.

# Value

## Ce que j'ai voulu montrer
Je voulais montrer qu'évaluer un modèle ne revient pas seulement à choisir un algorithme : la qualité de la comparaison dépend de la constitution des groupes, de l'analyse des différences appariées et du test de significativité retenu. Je défends une logique d'évaluation rigoureuse plutôt qu'une course au score.

## Ce que j'en retiens
- [v] J'ai structuré mon évaluation davantage qu'un leaderboard classique.
- [v] Je mobilise une culture statistique appliquée : validité, sous-groupes, cadre de comparaison.
- [!] La documentation publique soutient mieux la méthode que l'implémentation détaillée.
