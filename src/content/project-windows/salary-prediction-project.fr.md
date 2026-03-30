---
slug: "salary-prediction-project"
lang: "fr"
title: "Salary Prediction Project"
summary: "Pipeline de prédiction de salaires à partir de métadonnées d'emploi, avec feature engineering, encodage mixte, tuning et comparaison régression linéaire versus Random Forest."
---

# Overview

## Ce qu'est réellement le projet
Prédire un salaire à partir d’informations de poste est un problème à la fois très concret et très parlant métier. Ce projet travaille sur `salary_in_usd` à partir de variables comme l’année, le niveau d’expérience, le type d’emploi, l’intitulé de poste, le télétravail, la localisation de l’entreprise et sa taille.

Le dépôt est intéressant parce qu’il ne traite pas ces colonnes comme un simple tableau à envoyer dans un modèle. Il montre une vraie logique de préparation, de regroupement et d’encodage, avec l’idée que la qualité de représentation des variables conditionne une grande partie du résultat final.

## Pourquoi ce projet mérite l'attention
Le sujet est immédiatement lisible, mais le vrai intérêt se situe dans la démarche. Le projet montre comment construire un pipeline tabulaire raisonnable, tester plusieurs représentations et accepter des performances modestes sans maquiller la réalité.

Il est justement plus crédible parce qu’il n’essaie pas de transformer un problème complexe en promesse exagérée. Il montre un travail de modélisation appliquée, avec ses essais, ses limites et ses apprentissages.

- [v] Le projet traite un sujet concret et universellement compréhensible.
- [v] Il met le focus sur la préparation des variables, ce qui est souvent le vrai nerf du problème.
- [v] Il compare plusieurs approches au lieu de figer trop vite une solution.
- [!] Les performances restent modérées, ce qui doit être assumé comme un résultat utile et non comme un échec.

# Method

## Préparation des données
Le pipeline exploite des variables comme `work_year`, `experience_level`, `employment_type`, `job_title`, `remote_ratio`, `company_location` et `company_size`. Les titres de poste sont regroupés en familles plus larges (`Engineer`, `Analyst`, `Scientist`, `Others`) afin d’éviter une cardinalité trop dispersée.

La préparation combine plusieurs techniques : imputation médiane et modale, target encoding pour certaines catégories, one-hot encoding pour d’autres, création d’une variable composite `company_job_size`, normalisation `MinMaxScaler` et expansion polynomiale de degré `2`.

## Modèles, tuning et résultats
Le dépôt compare une régression linéaire et un `Random Forest Regressor`. Le tuning explore à la fois les hyperparamètres du Random Forest et des combinaisons de variables pour la régression linéaire. Les scores observés restent modestes mais instructifs : environ `R² = 0.29` pour le Random Forest test, `R² = 0.31` pour la régression linéaire, avec une moyenne de validation croisée autour de `0.315`. Le meilleur résultat stocké dans `res.csv` atteint un `R²` hors échantillon proche de `0.334`.

Le dépôt rend aussi visibles plusieurs imperfections utiles à signaler : certains scripts attendent des fichiers absents (`data_eval.csv`, `data.csv`), une variable comme `employee_residence` existe dans les données mais n’est pas utilisée, et le preprocessing génère des `SettingWithCopyWarning`. Ce sont précisément ces détails qui rendent le projet plus honnête et plus concret.

- [v] Le projet montre une vraie démarche de feature engineering et pas seulement un entraînement brut.
- [v] Les encodages sont choisis selon la nature des variables.
- [v] Le tuning documente une recherche réelle de combinaisons plus pertinentes.
- [v] Les limites techniques du dépôt sont identifiables et explicites.
- [!] La pipeline n’est pas totalement propre ni complètement reproductible sans ajustements.
- [!] Les performances ne justifient pas une lecture trop ambitieuse du pouvoir prédictif du modèle.

# Value

## Ce que le projet prouve
Ce projet montre quelque chose de très utile en machine learning appliqué : un modèle tabulaire se joue souvent d’abord dans la manière dont on comprend et transforme les variables. La valeur du travail réside ici dans le feature engineering, l’encodage, le tuning et la lecture honnête des résultats.

## Portée professionnelle
Le projet traite un sujet familier tout en donnant à voir une démarche sérieuse. Il ne repose pas sur une performance spectaculaire ; il montre plutôt une manière propre de travailler sur un problème réaliste, avec plusieurs itérations de préparation, d’encodage et de comparaison de modèles.

Cette posture a de la valeur parce qu’elle met en avant un raisonnement de praticien lucide : tester, comparer, lire un résultat imparfait et identifier où se situe réellement l’apport du projet. Dans ce cas précis, la contribution se situe moins dans le niveau de `R²` que dans la qualité de la transformation des variables.

:::panel{tone="blue" title="Lecture du projet"}
L’ensemble fait ressortir une bonne maîtrise du machine learning tabulaire lorsqu’il faut accepter des performances modérées, sans masquer les limites du signal disponible.
:::

- [v] Le projet valorise le raisonnement de modélisation plus que l’effet d’annonce.
- [v] Il montre des compétences utiles en preprocessing, encodage et sélection de variables.
- [v] Il est facile à comprendre tout en restant techniquement sérieux.
- [!] La force principale du projet réside davantage dans la méthode que dans la seule valeur du `R²`.
