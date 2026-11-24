---
slug: "excel-data-analyst-project"
lang: "fr"
title: "Analyse de la performance commerciale sur Excel (2012-2014)"
summary: "Projet Excel d'analyse commerciale combinant nettoyage de données, modélisation de KPI et reporting management pour étudier la trajectoire 2012-2014, entre volatilité du chiffre d'affaires, concentration produit et faiblesse de rétention."
---

# Overview

## Angle commercial et historique
Ce projet se lit d'abord comme une analyse commerciale sur la période 2012-2014, puis comme une implémentation Excel. Le rapport final ressemble à un diagnostic de direction : environ `8 M EUR` de ventes, près de `25k` commandes, puis une rupture visible de dynamique après la fin 2012. L'enjeu n'est pas seulement de visualiser l'activité, mais de comprendre ce qui se cache derrière cette trajectoire : volatilité du chiffre d'affaires, concentration produit, structure clientèle et faiblesses de rétention.

Cette narration donne du poids au projet. L'entreprise paraît capable d'acquérir des clients à grande échelle, mais plus fragile sur plusieurs dimensions stratégiques. Les ventes de vélos dominent largement le chiffre d'affaires, le cross-sell sur les accessoires reste sous-exploité, la rétention VIP s'érosionne, et la structure d'âge pose une question de renouvellement à long terme. Le projet fonctionne donc comme une vraie lecture commerciale plutôt que comme une simple démo de dashboard.

## Ce qui rend l'analyse crédible
La partie technique est essentielle, parce que cette lecture business n'est crédible que si la couche analytique est solide. J'ai donc documenté le travail amont : fichiers bruts imparfaits, décisions de nettoyage explicites, logique de mapping, tables de faits structurées et sorties de reporting finales.

- [v] Je suis parti d'une histoire business concrète plutôt que d'un affichage générique de KPI.
- [v] J'ai cadré l'analyse sur 2012-2014 pour la rendre plus lisible et plus défendable.
- [!] Je présente ce dataset comme une étude de portefeuille, pas comme un reporting financier audité.

# Method

## Pipeline Excel et chaîne de reporting
Le workflow suit une logique claire `raw -> clean -> fact -> reporting` à l'intérieur d'Excel. Les sources couvrent les clients, les produits, les commandes, les lignes de vente, les dépenses, les mouvements de trésorerie, les budgets et le calendrier. Le dépôt sépare ensuite le classeur analytique `eda.xlsx` du classeur de restitution `report.xlsx`, avec Power Query comme pont entre préparation de la donnée et restitution.

Cette structure technique compte parce que le projet fait plus que résumer des ventes. Il standardise les libellés, reconstruit les dates, gère les valeurs manquantes, normalise les champs numériques et applique des règles métier explicites avant toute restitution finale. Les sorties restent donc traçables plutôt que purement cosmétiques.

## Logique KPI et choix analytiques
Le dépôt s'organise autour de mesures explicites comme le revenue, le COGS, le gross profit, la gross margin, les OPEX, le net income, les cash flows, l'ending cash et les comparaisons budget versus actual. Il matérialise aussi des tables intermédiaires telles que `fact_sales`, `fact_opex`, `fact_cash`, `financial_summary` et `activity_survey`.

Plusieurs choix sont importants du point de vue analyste : remplacer les remises manquantes par `0`, utiliser la médiane pour les prix de vente absents, garder les catégories inconnues visibles au lieu de supprimer les lignes, et conserver un chemin lisible depuis les données brutes jusqu'aux indicateurs management. C'est ce qui permet à la narration commerciale d'émerger avec crédibilité : chute fin 2012, dépendance excessive aux catégories vélo, faiblesse de conversion vers les segments VIP et potentiel de cross-sell sur les accessoires.

# Value

## Ce que j'ai voulu montrer
Je voulais transformer des données business imparfaites en colonne vertébrale de reporting, puis en interprétation commerciale exploitable par un manager. Je ne m'arrête pas aux graphiques : j'explique ce que les chiffres impliquent sur la stabilité du revenu, la concentration du portefeuille produit, la rétention client et le renouvellement démographique.

## Ce que j'en retiens
- [v] J'ai mis mes compétences Excel et Power Query au service de questions business.
- [v] J'ai traduit des données de ventes historiques en recommandations pour un manager.
- [v] J'ai tenu ensemble la solidité du pipeline et la narration d'aide à la décision.
- [!] La valeur vient du raisonnement d'analyste et de la structure du reporting, pas d'une complexité logicielle élevée.
