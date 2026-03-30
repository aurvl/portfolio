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

- [v] Le projet traite l'évaluation prédictive comme un problème statistique et expérimental.
- [v] Le cœur de la valeur réside dans le protocole plutôt que dans l'algorithme seul.
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
- [v] Le test de McNemar montre une vraie attention à la validité méthodologique.
- [!] Le code et les sorties détaillées ne sont pas publiquement exposés à ce stade.

# Value

## Ce que le projet met en évidence
Le projet met en évidence une compréhension importante :
évaluer un modèle ne revient pas seulement à choisir un algorithme.

La qualité de la comparaison dépend aussi
de la constitution des groupes, de l'analyse des différences appariées et du test de significativité retenu.

L'ensemble fait ressortir une sensibilité statistique solide.
Il valorise une logique d'évaluation défendable plutôt qu'une course au score.

## Portée professionnelle
Le travail s'inscrit dans une logique de machine learning appliqué
où la rigueur du protocole conditionne la qualité de la décision finale.

Même avec une implémentation publique incomplète,
la structure documentée montre une attention claire à la validité, aux sous-groupes et au cadre de comparaison.

Pris dans son ensemble, le projet vaut d'abord
comme architecture d'évaluation.

Sa contribution principale réside dans cette maturité méthodologique,
davantage que dans la démonstration publique d'un pipeline intégralement reproductible.

- [v] Le projet souligne une maturité réelle dans la comparaison expérimentale.
- [v] La logique d'évaluation est plus structurée qu'un leaderboard classique.
- [v] L'ensemble fait ressortir une culture statistique appliquée.
- [!] La documentation publique soutient mieux la méthode que l'implémentation détaillée.
