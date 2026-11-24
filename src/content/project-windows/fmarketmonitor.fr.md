---
slug: "fmarketmonitor"
lang: "fr"
title: "FMarketMonitor"
summary: "Un prototype de recherche : un observatoire qui résume des centaines de séries économiques américaines en 15 indicateurs lisibles, datés et traçables, construits uniquement avec les données disponibles à chaque date."
---

# Overview

## Périmètre du projet
FMarketMonitor (FinancialMarketMonitor) est la couche de mesure d'un projet plus large : un observatoire macroéconomique et financier. Il est conçu pour résumer des centaines de statistiques économiques américaines en 15 indicateurs, un par grand concept économique et financier. Chaque indicateur est noté de 0 à 100 et s'accompagne de ses sous-scores, de la contribution de chaque série et d'un niveau de confiance.

## Le problème
L'économie est décrite par des centaines de séries, publiées à des rythmes différents puis révisées. On ne sait pas quoi regarder, ni comment l'interpréter, ni distinguer un vrai changement d'une révision ou d'un trou de données. Exemple réel : le chômage d'octobre 2025 n'a jamais été collecté à cause du shutdown américain.

L'objectif est de décider sur une lecture courte et justifiée du contexte, plutôt que de réagir à une série isolée ou à une news. L'outil est d'abord construit pour un particulier qui veut placer son épargne pour battre l'inflation (moi, au départ), et plus largement pour des investisseurs, des analystes et des chercheurs.

## Où en est le projet
C'est un prototype de recherche. Le premier indicateur (Concept 01 : croissance, activité, emploi) est construit et testé, mois par mois, dans un notebook. Les 14 suivants suivront la même méthode. Le terminal (l'interface), les prévisions et les stratégies viennent après ; le terminal est conçu, pas construit.

# Method

## Un processus de recherche répété pour chaque concept
Chaque concept aura sa propre méthode de calcul, mais tous sont construits et validés de la même façon. Le Concept 01 est le premier passage complet.

1. **Définir le concept** à partir des références scientifiques et institutionnelles officielles (NBER, indice CFNAI de la Fed de Chicago, indice ADS de la Fed de Philadelphie), pour mesurer ce que les institutions et la science reconnaissent, et non un concept inventé.
2. **Collecter chaque série avec toutes ses versions publiées** (vintages ALFRED) dans une base où rien n'est jamais écrasé. On peut ainsi reconstituer ce qu'on savait réellement à chaque date et ne jamais utiliser d'information du futur.
3. **Rédiger une fiche par série** (rôle, sens attendu, délai de publication, remplaçant) et appliquer des garde-fous : au moins 10 à 15 ans d'historique et couverture de la crise de 2008. Les séries sont choisies selon l'économie et la qualité des données, jamais parce qu'elles « marchent » sur les récessions.
4. **Écrire et sceller le protocole de validation avant tout calcul** : 8 critères chiffrés, comparaison à 3 références (CFNAI-MA3, ADS, score à poids égaux) et deux périodes mises de côté (06/2007 à 12/2009 et 01/2023 à 10/2026), consultables une seule fois. Cela empêche de choisir la méthode après avoir vu le résultat.
5. **Construire le score** avec un modèle à facteurs dynamique et un filtre de Kalman, réestimés chaque mois sur le passé uniquement. Les variantes sont testées une à une avec des règles fixées à l'avance, puis une seule variante est soumise aux périodes réservées.

## Données et outils
Les sources sont FRED et ALFRED (Fed de St. Louis), qui distribuent des séries produites par le BLS, le BEA, la Réserve fédérale (G.17) et le Census, auxquelles s'ajoutent la Fed de Philadelphie (indice ADS), la Fed de Chicago (CFNAI), la Fed de San Francisco (Daily News Sentiment Index) et les dates de récession du NBER. Le catalogue compte 85 variables, dont 26 rattachées au Concept 01. 22 séries FRED ont été collectées avec leurs vintages pour ce concept, et l'indicateur final en utilise 8. L'échantillon de sélection compte 365 mois ; l'évaluation va de 1990 à octobre 2026.

La pile technique est Python (statsmodels, modèle à facteurs dynamique), SQL et PostgreSQL 16. La base est découpée en couches (référentiel, données brutes, transformations, modèles, indicateurs, validation, prévisions) ; elle est bitemporelle et en ajout seul, les modifications étant bloquées par des triggers. Environ 25 connecteurs de collecte l'alimentent, et les résultats sont présentés dans un notebook Jupyter.

## Premier résultat vérifiable
Sur la récession de 2008, qui faisait partie d'une période réservée, l'indicateur recalculé en temps réel repère les mois de récession avec une précision moyenne (PR-AUC) de 0,934, contre 0,918 pour le CFNAI-MA3 de la Fed de Chicago et 0,829 pour un score à poids égaux. Sur 1990 à 2026, il obtient 0,718 contre 0,671, sans aucune fausse alerte (CFNAI-MA3 : 1 ; poids égaux : 4).

Ce résultat est obtenu avec 8 séries, un modèle réestimé chaque mois sur le passé seulement, des critères et des seuils écrits avant le calcul, et une période réservée consultée une seule fois (le 24 novembre 2026).

## Ce qui n'est pas prouvé
- **Le verdict du protocole de validation scientifique est NON VALIDÉ.** Un critère échoue : la stabilité face aux révisions est légèrement moins bonne que celle du score à poids égaux (3,1 % des mois contre 1,9 %, les deux très en dessous du seuil de 10 %).
- Deux faiblesses ont été mesurées : retirer le taux de chômage peut faire bouger le score de 48 points, et l'accord avec l'indice ADS est faible.
- La récession de 2008 est signalée avec 5 mois de retard sur son pic.
- L'écart avec le CFNAI (0,934 contre 0,918) est faible et repose sur une seule récession.
- Les réglages de cette recette ont été choisis à l'origine alors que je connaissais déjà 2001, 2008 et 2020 : le test sur 2008 n'est donc pas totalement aveugle.
- Aucune prévision, aucune stratégie et aucune performance financière n'est démontrée.

[!] Limites connues des données : les vintages commencent tard pour certaines séries (avant, on travaille en pseudo-temps réel), le trou d'octobre 2025, la consommation réelle (PCEC96) disponible seulement depuis 2007, l'indice ADS disponible dans sa dernière version uniquement, les commandes en dollars courants, et les sauts de janvier dans l'emploi de l'enquête ménages.

# Value

## Ce que le projet démontre
- **Économie et économétrie :** un indice d'activité de type CFNAI et ADS (modèle à facteurs dynamique, filtre de Kalman, données en temps réel), confronté aux récessions du NBER selon un protocole écrit à l'avance, en publiant aussi les verdicts négatifs.
- **Données et ingénierie :** une base PostgreSQL bitemporelle où chaque chiffre garde la période qu'il décrit, sa date de publication, sa source et la méthode qui l'a utilisé, sans que rien ne soit jamais écrasé. On peut reconstituer ce que le système savait à n'importe quelle date.
- **Communication :** la base est documentée par une histoire réelle (le chômage de novembre 2025, publié à 4,6 % puis révisé à 4,5 %), et chaque série de tests est résumée en une phrase avec un verdict clair.

## La suite
Écrire un nouveau protocole (C01_VAL_v2) avant toute amélioration, avec un test prospectif sur les mois publiés après le 22 novembre 2026, puis corriger la dépendance au chômage et le retard. Ensuite : le terminal, les 14 autres concepts et la couche régimes et décision.

## Limites et positionnement
Ce n'est pas un système de trading, ni un outil de prévision des prix, ni un conseil en investissement. Aucune donnée sous licence n'est utilisée (la série ISM a été exclue pour cette raison). Le projet n'est pas encore publié : aucun code ni démo n'est lié, et sa contribution la plus solide pour l'instant est la rigueur de sa validation, pas une promesse de performance.
