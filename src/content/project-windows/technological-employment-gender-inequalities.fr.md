---
slug: "technological-employment-gender-inequalities"
lang: "fr"
title: "Technological Employment and Gender Inequalities"
summary: "Étude d'économétrie spatiale sur le chômage féminin régional en Europe, reliant emploi technologique, variables HRST-STEM et effets de voisinage."
---

# Overview

## Objectif de recherche
Ce projet étudie le lien entre emploi technologique,
capital humain scientifique et chômage féminin à l'échelle régionale européenne.

Le dépôt adopte une perspective d'économétrie spatiale,
ce qui est cohérent dès lors que les marchés du travail régionaux ne sont pas indépendants les uns des autres.

L'étude couvre les régions `NUTS2` de `2012` à `2021`
pour la France, l'Espagne, l'Italie, les Pays-Bas et la Belgique.

## Pourquoi le projet compte
L'intérêt principal réside dans le refus
de traiter chaque région comme une observation isolée.

L'emploi technologique, les spécialisations voisines
et la concentration du capital humain peuvent produire des spillovers qu'une régression standard manquerait.

Le projet s'inscrit donc dans une logique de recherche appliquée.
Il articule une question socio-économique substantielle et un cadre méthodologique adapté à sa géographie.

- [v] J'ai relié inégalités de genre, marché du travail et structure territoriale.
- [v] J'ai traité la dépendance spatiale comme une exigence de méthode, pas comme un raffinement optionnel.
- [!] L'interprétation reste observationnelle : ce n'est pas une preuve causale au sens fort.

# Method

## Données et structure régionale
Le dépôt compile des indicateurs Eurostat sur dix années
au niveau `NUTS2`.

La variable expliquée est le chômage féminin,
mis en relation avec l'emploi technologique, les variables `HRST`, `STEM` et des indicateurs d'éducation.

Cette composition est intéressante car elle empêche
une lecture simpliste du lien entre technologie et emploi.

## Cadre économétrique
L'implémentation mobilise `plm`, `splm`, `spdep` et `sf` dans `R`.
Cet outillage est bien adapté à des spécifications où comptent à la fois la structure de panel et le voisinage géographique.

Le projet considère plusieurs familles de modèles,
dont `SAR`, `SEM` et `SAC`.

Ce choix est important,
car chaque processus spatial conduit à une lecture différente des effets locaux et indirects.

## Résultats principaux
Les résultats rapportés indiquent qu'une hausse de l'emploi technologique
est associée à une baisse du chômage féminin, localement comme via les régions voisines.

À l'inverse, les variables `HRST` et `STEM`
apparaissent associées à une hausse du chômage féminin dans le cadre estimé, tandis que l'éducation joue un rôle protecteur.

Ces résultats sont intéressants parce qu'ils refusent
une équation automatique entre intensité technologique et amélioration uniforme des trajectoires d'emploi.

- [v] J'ai choisi une méthode alignée sur la structure territoriale des données.
- [v] J'ai testé plusieurs spécifications spatiales, pour une interprétation plus robuste qu'avec un seul modèle.
- [v] J'ai gardé la complexité des résultats au lieu de forcer une lecture technophile simplifiée.
- [!] Des stratégies d'identification supplémentaires seraient nécessaires pour des prétentions causales plus fortes.

# Value

## Ce que j'ai voulu montrer
Je voulais traduire une question publique concrète dans un cadre de modélisation explicite : économétrie spatiale, raisonnement en panel, interprétation socio-économique sur données régionales. J'ai laissé place aux effets mixtes et aux résultats non intuitifs plutôt que de les aplanir, en intégrant le territoire comme variable analytique centrale du raisonnement sur les inégalités d'emploi.

## Ce que j'en retiens
- [v] J'ai pratiqué le panel spatial sur un sujet socio-économique important.
- [v] J'ai interprété des spillovers régionaux sans simplification excessive.
- [!] Ma valeur est analytique et méthodologique, pas celle d'un message politique univoque.
