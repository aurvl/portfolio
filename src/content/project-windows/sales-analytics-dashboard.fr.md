---
slug: "sales-analytics-dashboard"
lang: "fr"
title: "Sales Analytics Dashboard"
summary: "Chaîne BI de bout en bout transformant des ventes retail brutes en vues SQL métier, segments clients et produits, puis en dashboard Power BI."
---

# Overview

## Périmètre du projet
Ce projet traite un problème classique de business intelligence :
transformer des transactions commerciales brutes en une couche analytique exploitable pour le suivi d'activité.

L'intérêt du dépôt ne repose pas uniquement sur la restitution visuelle.
Il tient surtout à la manière dont la logique métier est encodée en amont, avant l'étape dashboard.

Le workflow s'inscrit dans une chaîne BI complète :
source de données, transformation SQL, vues analytiques, puis reporting Power BI.

## Positionnement analytique
Le dépôt s'appuie sur un volume déjà significatif, avec environ `60 398` lignes de ventes,
`18 484` clients et `295` produits.

Cette échelle suffit pour traiter des questions concrètes de concentration du chiffre d'affaires,
de valeur client, de performance catalogue et de segmentation commerciale.

Le projet s'inscrit donc dans une logique d'aide à la décision.
Il montre comment des transactions peuvent être réorganisées pour faire émerger des indicateurs réellement lisibles.

- [v] La chaîne relie stockage, modélisation analytique et restitution dans un même ensemble cohérent.
- [v] Les règles métier apparaissent dès la couche SQL et pas seulement dans les graphiques.
- [!] Le projet vise d'abord la qualité analytique de la modélisation, pas l'orchestration industrielle d'un data warehouse complet.

# Method

## Couche de données et vues analytiques
Le cœur de l'implémentation repose sur PostgreSQL.
Les données sont restructurées à travers plusieurs vues, notamment `gold.report_customers`, `gold.report_products` et `gold.report_overview`.

Ces vues jouent le rôle de couche sémantique.
Elles simplifient la consommation par Power BI et rendent explicites les calculs métier retenus.

La logique va au-delà d'une simple agrégation de ventes.
Le projet encode la récence, la fréquence, la valeur client, le panier moyen, la performance produit et une estimation de marge brute.

## Choix techniques structurants
La segmentation clients repose sur des catégories telles que `VIP`, `Regular` et `New`.
La segmentation produits distingue `High-Performer`, `Mid-Performer` et `Low-Performer`.

Ce choix est important car il rapproche directement la couche de données de problématiques CRM et catalogue.
Power BI ne consomme donc pas des tables brutes, mais des objets déjà interprétables.

Le script `business_analytics.sql` utilise aussi des fonctions de fenêtre.
Cela permet de produire des cumuls, des comparaisons temporelles et des lectures en variation annuelle.

Cette orientation montre une maîtrise d'un SQL analytique plus riche qu'un enchaînement de `GROUP BY`.
La valeur du projet vient en grande partie de cette structuration en amont.

- [v] Les vues sont organisées autour de questions métier réelles.
- [v] La segmentation est directement intégrée dans la couche analytique.
- [v] Les fonctions de fenêtre renforcent la profondeur temporelle du reporting.
- [!] L'ingestion dépend encore de chemins CSV locaux, ce qui limite l'automatisation complète du pipeline.

# Value

## Ce que le projet met en évidence
Le projet met en évidence une capacité à traduire des données transactionnelles
en couche de pilotage structurée.

Il démontre une maîtrise de la modélisation orientée métier,
du SQL analytique, de la définition de KPI et de la restitution BI.

L'ensemble montre aussi que la valeur d'un dashboard provient souvent
de la qualité du modèle de données plus que de la finition graphique seule.

## Portée professionnelle
L'architecture retenue fait ressortir une capacité à organiser les données
autour d'entités et de variables de décision plutôt qu'autour de leur simple stockage initial.

Le travail s'inscrit dans une logique de reporting utilisable,
maintenable et relié à des besoins commerciaux explicites.

Pris dans son ensemble, le projet illustre une BI centrée sur la lisibilité analytique.
Sa contribution principale réside dans la qualité de la couche sémantique et des règles de calcul.

- [v] Le projet souligne une maîtrise du SQL analytique appliqué à des besoins business.
- [v] La structure relie clairement modélisation des données et sortie dashboard.
- [v] L'ensemble fait ressortir une logique d'aide à la décision plutôt qu'une simple démonstration visuelle.
- [!] Sa force principale se situe dans la conception analytique davantage que dans l'industrialisation d'infrastructure.
