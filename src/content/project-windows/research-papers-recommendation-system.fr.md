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

- [v] Le projet répond à un problème concret de découverte documentaire.
- [v] Le corpus est assez large pour dépasser le cadre d'une démonstration jouet.
- [!] La qualité finale dépend encore de la richesse des métadonnées et de la manière dont les préférences sont représentées.

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

- [v] Le projet articule plusieurs signaux de ranking dans une architecture lisible.
- [v] Les représentations sparse et dense sont utilisées de manière complémentaire.
- [v] L'API donne une forme applicative claire au système.
- [!] L'évaluation publiée reste davantage qualitative que benchmarkée par des métriques offline complètes.

# Value

## Ce que le projet met en évidence
Le projet met en évidence un ensemble de compétences large
en recommandation et traitement du texte.

Il démontre une maîtrise de la représentation textuelle,
de la similarité sémantique, de la construction de profil utilisateur et du packaging applicatif.

Il montre aussi une bonne décomposition du problème.
Le dépôt sépare clairement retrieval, ranking, ajustement de tendance et exposition service.

## Portée professionnelle
Ce travail s'inscrit dans une logique de système de recommandation centré contenu
avec profondeur méthodologique réelle.

L'architecture retenue fait ressortir une compréhension concrète
des compromis entre précision lexicale, couverture sémantique, nouveauté et lisibilité du ranking.

Pris dans son ensemble, le projet vaut
par l'articulation entre composantes algorithmiques et logique produit.

Sa contribution principale réside dans cette structure hybride,
plus proche d'un service de recommandation exploitable que d'un simple exercice de similarité.

- [v] Le projet souligne une conception hybride de la recommandation fondée à la fois sur l'IR et les embeddings.
- [v] Il relie choix de représentation, logique de ranking et exposition API.
- [!] Il doit être lu comme un système centré contenu bien construit, non comme une plateforme industrielle complète avec feedback en ligne.
