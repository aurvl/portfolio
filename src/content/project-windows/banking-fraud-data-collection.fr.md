---
slug: "banking-fraud-data-collection"
lang: "fr"
title: "Banking Fraud Data Collection"
summary: "Prototype web de collecte transactionnelle construit avec PHP et MySQL pour structurer des signaux exploitables dans une future logique de fraude."
---

# Overview

## Positionnement du projet
Ce projet ne cherche pas à détecter la fraude bancaire à lui seul.
Il se place en amont, sur une étape trop souvent négligée : la qualité de la collecte.

L'objectif est de concevoir une interface capable de produire
des données structurées sur des transactions et sur des comportements associés au risque.

Cette orientation est importante,
car une grande partie de la qualité d'un système de détection provient d'abord du dispositif d'entrée des données.

## Pourquoi le projet compte
Le dépôt montre une chaîne simple mais complète :
interface web, validation côté client, enrichissement géographique, traitement PHP et persistance MySQL.

Sa valeur réside dans cette vue end-to-end.
Il rappelle qu'un pipeline data commence souvent par un formulaire, un schéma et une logique de persistance avant de commencer par un modèle.

Le projet s'inscrit ainsi dans une logique de collecte structurée.
Il prépare une base exploitable pour un usage analytique ultérieur.

- [v] Le projet traite la collecte comme une brique essentielle du cycle data.
- [v] Il relie front, backend et base relationnelle dans une seule chaîne lisible.
- [!] Le dépôt reste un prototype de collecte et non un système de fraude complet.

# Method

## Architecture de collecte
Le formulaire recueille des informations d'identité,
de localisation et de comportement transactionnel.

Les réponses sont enregistrées dans une table `transactions`
avec des colonnes telles que `full_name`, `gender`, `country`, `state`, `city`, `category`, `amount`, `fraud_status`, `likes_money` et `risk_choice`.

La partie front repose sur `HTML`, `CSS` et `JavaScript`.
L'API `CountryStateCity` alimente dynamiquement les champs pays, région et ville.

Le backend `PHP` reçoit le `POST`
puis insère les réponses dans `MySQL`.

## Ce que le code rend visible
Le projet va jusqu'au schéma SQL
et aux indications de déploiement local ou web.

Sa contribution principale est la structuration des données collectées.
C'est ce qui lui donne sa cohérence, davantage qu'une quelconque sophistication algorithmique.

Le code fait aussi apparaître plusieurs limites concrètes.
Le statut de fraude est mal recodé à cause d'un décalage entre `'Oui'` et `oui/non`, une clé API est exposée côté client et `var_dump($_POST)` reste présent.

- [v] Le schéma SQL montre précisément quelles variables sont collectées.
- [v] L'intégration front, backend et base de données est complète.
- [v] Le projet constitue une base exploitable pour une analyse ou une modélisation ultérieure.
- [!] La sécurité et l'hygiène de code devraient être renforcées avant tout usage plus sérieux.

# Value

## Ce que le projet met en évidence
Le projet met en évidence des compétences utiles
en développement web orienté donnée et en data engineering léger.

Il démontre une maîtrise de la conception de formulaire,
de la validation, de l'ingestion de données et de la modélisation relationnelle minimale.

Il montre également que les fragilités d'un prototype
peuvent constituer des objets techniques pertinents à diagnostiquer.

## Portée professionnelle
Le travail s'inscrit dans une logique d'amont de pipeline.
Il montre une compréhension concrète du passage de l'interface à la base, puis de la base vers un futur usage analytique.

L'architecture retenue fait ressortir une capacité à structurer l'entrée de la donnée,
ce qui reste une compétence souvent moins visible que la modélisation en aval.

Pris dans son ensemble, le projet vaut
par sa clarté de chaîne de collecte et par l'identification explicite de ses limites techniques.

- [v] Le projet souligne une compétence pratique en collecte structurée de données.
- [v] Il apporte un angle full-stack utile au sein de l'ensemble des projets.
- [!] Sa valeur doit être lue comme celle d'un prototype de collecte cohérent, pas comme celle d'un moteur de détection prêt à l'emploi.
