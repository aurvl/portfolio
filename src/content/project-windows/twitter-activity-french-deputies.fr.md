---
slug: "twitter-activity-french-deputies"
lang: "fr"
title: "Twitter Activity of French Deputies"
summary: "Analyse politique de l'activité Twitter des députés français, croisant volumes, retweets, temporalité mensuelle et signaux lexicaux."
---

# Overview

## Objet de l'étude
Ce projet analyse l'activité Twitter de députés français
en la replaçant dans une lecture à la fois temporelle, partisane et lexicale.

Le sujet est intéressant car il relie
comportement numérique, visibilité politique et structure de diffusion des messages.

Le dépôt ne s'arrête pas au volume brut de tweets.
Il s'intéresse aussi à la part des retweets, au rythme de publication et à la structure des contenus.

## Intérêt analytique
La valeur du travail tient à la transformation
de traces de plateforme en indicateurs politiques lisibles.

L'analyse ne réduit pas l'activité à un comptage global.
Elle traite la communication numérique comme un système où comptent la temporalité, l'amplification et le vocabulaire.

Le projet s'inscrit ainsi dans une logique d'analyse politique des données.
Il combine des dimensions descriptives et quantitatives dans un cadre cohérent.

- [v] J'ai relié activité, amplification et contenu textuel.
- [v] Mon terrain est concret et immédiatement interprétable.
- [!] La reproductibilité complète dépend de fichiers sources Excel qui ne sont pas dans le dépôt public.

# Method

## Consolidation des données
Le dépôt fusionne les informations de tweets,
de retweets et de métadonnées sur les députés.

Cette étape est déterminante,
car la signification politique de l'activité dépend à la fois de l'auteur, du parti et du type de message.

Le dataset final permet des analyses mensuelles,
des comparaisons entre partis et des explorations lexicales ciblées.

## Sorties analytiques
Le projet examine les rythmes mensuels d'activité par parti
ainsi que la part des retweets dans la communication totale.

Cette distinction est utile,
car publier et relayer ne renvoient pas au même usage politique de la plateforme.

Le dépôt produit aussi des nuages de mots
et des lectures lexicales par camp politique.

Sans constituer une modélisation linguistique complète,
ces sorties apportent un signal rapide sur les thèmes et styles de communication.

## Structure statistique
L'un des éléments les plus intéressants
est une relation log-log de la forme `ln(n) = -1.36 + 2.19 ln(t)`.

Cette formalisation ajoute une couche quantitative
au-delà du simple commentaire graphique sur la croissance de l'activité.

Elle montre que le projet cherche à exprimer
une régularité de structure et pas seulement à juxtaposer des visualisations.

- [v] J'ai assemblé métadonnées politiques et traces d'activité dans un dataset cohérent.
- [v] J'ai distingué clairement activité originale et amplification par retweet.
- [v] J'ai ajouté une spécification log-log pour une lecture quantitative utile.
- [!] L'absence des sources brutes limite la reproductibilité complète du pipeline.

# Value

## Ce que j'ai voulu montrer
Je voulais analyser des données de communication politique à plusieurs niveaux à la fois : fusion de sources, agrégation temporelle, exploration textuelle et formalisation statistique simple. Pour moi, la plateforme est un espace de visibilité et de circulation, pas un simple compteur de messages.

## Ce que j'en retiens
- [v] J'ai relié volume, temporalité, retweets et vocabulaire dans une même lecture.
- [v] J'ai combiné sorties descriptives et formalisation quantitative courte mais utile.
- [!] Ma valeur empirique est liée à des données sources non embarquées dans le dépôt public.
