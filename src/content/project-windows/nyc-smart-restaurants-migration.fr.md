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

- [v] La migration est justifiée par des usages de consultation identifiés.
- [v] Le projet articule modélisation, requêtes et performance dans le même ensemble.
- [!] Le périmètre reste celui d'un prototype d'architecture et non d'une plateforme de recherche déployée à grande échelle.

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

- [v] Le format documentaire est pensé en fonction des scénarios d'usage.
- [v] La couche géographique donne au projet une vraie dimension applicative.
- [v] Le cache n'est pas seulement évoqué ; son impact est mesuré.
- [!] La recherche du plus proche voisin reste de type brute-force et non fondée sur un index spatial dédié.

# Value

## Ce que le projet met en lumière
Le projet met en lumière une capacité à raisonner simultanément
sur la forme des données, le coût des requêtes et les compromis de stockage.

Il démontre une maîtrise de la migration relationnel-vers-document,
de la transformation Python, des requêtes géographiques et de l'optimisation légère des temps de réponse.

Il fait aussi apparaître un point important en ingénierie :
la valeur d'une base vient souvent de son adéquation avec les usages plus que du choix technologique isolé.

## Portée professionnelle
L'architecture retenue montre une capacité à aligner
structure des données, ergonomie de recherche et performance observée.

Le travail s'inscrit dans une logique de backend et d'architecture appliquée,
où les décisions de modélisation sont reliées à des comportements de requête concrets.

Pris dans son ensemble, le projet vaut par la clarté de son raisonnement structurel.
Sa contribution principale réside dans la justification explicite des choix de modèle et de cache.

- [v] Le projet souligne un raisonnement d'architecture plutôt qu'un simple usage d'outils.
- [v] Il montre un lien clair entre schéma, requêtes et performance.
- [v] Le gain de cache apporte une mesure concrète à la démonstration.
- [!] Le dépôt reste un prototype compact qui n'a pas vocation à couvrir toutes les préoccupations de production.
