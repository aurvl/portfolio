---
slug: "nyc-smart-restaurants-migration"
lang: "fr"
title: "NYC Smart Restaurants: Migration Postgres-MongoDB"
summary: "Migration d'un catalogue de restaurants new-yorkais de PostgreSQL vers MongoDB, avec requêtes géographiques, documents JSON et cache mesuré."
---

# Overview

## Périmètre du projet
Ce projet traite un problème d'architecture de données très concret :
faire évoluer un catalogue de restaurants d'un modèle relationnel vers un modèle documentaire plus adapté aux usages de recherche.

Le dataset couvre des restaurants new-yorkais
et doit supporter des recherches par nom, quartier, type de cuisine et proximité géographique.

Le dépôt ne se limite donc pas à une exportation SQL vers MongoDB.
Il porte sur une redéfinition de la forme de la donnée en fonction des requêtes réellement attendues.

## Intérêt analytique
Le projet relie modélisation relationnelle,
transformation documentaire, requêtes géographiques et optimisation par cache.

Cette articulation lui donne une portée plus forte
qu'un simple exercice comparant deux technologies de base de données.

Le sujet s'inscrit dans une logique de conception.
PostgreSQL et MongoDB n'y sont pas interchangeables ; chacun répond à un rôle précis.

- [v] J'ai justifié la migration par des usages de consultation identifiés.
- [v] J'ai articulé modélisation, requêtes et performance dans un même ensemble.
- [!] Je le présente comme un prototype d'architecture, pas comme une plateforme de recherche déployée à grande échelle.

# Method

## Logique de migration
Des scripts Python convertissent les tables relationnelles
en documents JSON insérés dans MongoDB.

La source représente plus de `25 000` instructions d'insertion,
ce qui donne assez de matière pour rendre le changement de forme réellement significatif.

Le modèle cible est pensé pour des scénarios de recherche flexibles.
Cela évite de traiter la migration comme un simple changement d'outil sans réflexion sur les accès.

## Modèle de requêtes
L'application prend en charge la recherche textuelle sur le nom,
le filtrage par cuisine, le filtrage par quartier et la recherche des restaurants les plus proches.

La proximité est calculée via la formule de Haversine,
ce qui apporte une dimension géolocalisée cohérente avec le domaine.

Pour accélérer les appels répétés,
le système introduit un cache `JSONB` dans PostgreSQL.

La clé inclut `(latitude, longitude, k, cuisine_filter, results)`
et une tolérance de `±0.001` sur les coordonnées permet de réutiliser des résultats proches.

Le rapport documente un gain de temps clair,
avec un passage d'environ `0.125 s` à `0.0034 s` sur cache hit.

- [v] J'ai pensé le format documentaire à partir des scénarios d'usage.
- [v] J'ai ajouté une couche géographique (formule de Haversine) pour une vraie dimension applicative.
- [v] J'ai mesuré l'impact du cache (d'environ 0.125 s à 0.0034 s sur cache hit).
- [!] La recherche du plus proche voisin reste de type brute-force, sans index spatial dédié.

# Value

## Ce que j'ai voulu montrer
Je voulais raisonner en même temps sur la forme des données, le coût des requêtes et les compromis de stockage : migration relationnel → document, transformation en Python, requêtes géographiques, optimisation légère des temps de réponse. Pour moi, la valeur d'une base vient de son adéquation aux usages plus que du choix technologique isolé.

## Ce que j'en retiens
- [v] J'ai fait un raisonnement d'architecture plutôt qu'un simple usage d'outils.
- [v] J'ai relié clairement schéma, requêtes et performance.
- [!] C'est un prototype compact : il ne couvre pas toutes les préoccupations de production.
