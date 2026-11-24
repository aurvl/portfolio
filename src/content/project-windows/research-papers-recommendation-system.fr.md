---
slug: "research-papers-recommendation-system"
lang: "fr"
title: "Research Papers Recommendation System"
summary: "Système hybride de recommandation d'articles scientifiques, combinant recherche lexicale, embeddings sémantiques, profil utilisateur et API FastAPI."
---

# Overview

## Logique du projet
Ce projet construit un système de recommandation
pour des publications scientifiques à partir d'un corpus académique volumineux.

L'objectif est d'améliorer la découverte d'articles
en combinant pertinence lexicale, proximité sémantique et classement tenant compte du profil utilisateur.

Le dépôt se situe à l'intersection
de l'information retrieval et de la recommandation.

Il ne se limite ni à une recherche par mots-clés,
ni à un simple voisinage vectoriel sans logique de ranking explicite.

## Pourquoi le sujet est important
La recherche académique souffre souvent d'un arbitrage difficile
entre précision des mots-clés et richesse de la similarité sémantique.

Le projet traite justement cette tension
à travers une architecture à plusieurs signaux.

Le corpus, d'environ `58 891` articles,
donne suffisamment d'ampleur au système pour rendre les choix de représentation et de classement réellement significatifs.

- [v] J'ai répondu à un problème concret de découverte documentaire.
- [v] Mon corpus est assez large pour dépasser la démonstration jouet.
- [!] La qualité finale dépend encore de la richesse des métadonnées et de la manière de représenter les préférences.

# Method

## Couches de représentation
Le dépôt fait coexister deux familles de représentation.
La première repose sur `TF-IDF`, avec une vocabulaire pouvant monter vers `500000` dimensions.

La seconde utilise des embeddings `MiniLM-L6-v2`
de dimension `384`.

Cette combinaison est centrale.
Elle permet de conserver la transparence du lexical tout en ajoutant une lecture sémantique plus robuste aux variations de formulation.

## Profil utilisateur et ranking
Le système combine un profil initial
et le centroïde des articles likés selon une pondération de type `60 / 40`.

Le dépôt définit aussi un score "hot"
fondé sur une combinaison de tendance, récence et citations avec des poids proches de `0.5`, `0.3` et `0.2`.

Ces choix montrent que la recommandation n'est pas pensée
comme une simple similarité locale, mais comme un mécanisme de ranking plus large.

## Couche de service
Le projet est exposé via `FastAPI`.
Cette frontière applicative compte, car elle transforme le système en service interrogeable et non en notebook isolé.

Pris dans son ensemble, le workflow combine
recherche sparse, sémantique dense, profilage et exposition API.

- [v] J'ai articulé plusieurs signaux de ranking dans une architecture lisible.
- [v] J'ai utilisé les représentations sparse et dense de manière complémentaire.
- [v] J'ai donné une forme applicative au système avec une API.
- [!] Mon évaluation reste plus qualitative que benchmarkée par des métriques offline complètes.

# Value

## Ce que j'ai voulu montrer
Je voulais construire une recommandation hybride, fondée à la fois sur la recherche d'information et sur les embeddings : représentation textuelle, similarité sémantique, profil utilisateur et exposition en service. J'ai séparé clairement retrieval, ranking, ajustement de tendance et service, pour rendre visibles les compromis entre précision lexicale, couverture sémantique, nouveauté et lisibilité du ranking.

## Ce que j'en retiens
- [v] J'ai relié choix de représentation, logique de ranking et exposition API.
- [v] J'ai fait un système plus proche d'un service exploitable que d'un exercice de similarité.
- [!] C'est un système centré contenu bien construit, pas une plateforme industrielle avec feedback en ligne.
