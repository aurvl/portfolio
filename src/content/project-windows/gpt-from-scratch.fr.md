---
slug: "gpt-from-scratch"
lang: "fr"
title: "Mini GPT from scratch"
summary: "Implémentation pédagogique en PyTorch d'un mini modèle GPT, du nettoyage texte et de la tokenisation jusqu'à l'attention causale, l'entraînement, l'évaluation et la génération."
---

# Overview

## Logique du projet
Ce projet construit un mini modèle de langage de type GPT depuis les bases.
L'objectif n'est pas de créer un chatbot généraliste, mais de comprendre concrètement la chaîne complète de prédiction du prochain token.

Le notebook part du texte brut et remonte jusqu'à la génération :
nettoyage, tokenisation, construction des séquences, batching, embeddings, attention causale, blocs Transformer, entraînement, évaluation et génération.

Le projet est volontairement compact.
Il sert à rendre visible ce qui est souvent caché derrière les grands modèles de langage : comment un texte devient des tokens, comment le modèle apprend une distribution sur le token suivant, et pourquoi l'attention causale empêche de regarder le futur.

- [v] Le projet montre une compréhension de la mécanique interne d'un GPT, pas seulement l'usage d'une API.
- [v] La baseline bigramme permet de comparer le Transformer à un point de départ simple.
- [!] Les générations restent celles d'un petit modèle pédagogique entraîné sur un corpus compact.

# Method

## Données et tokenisation
Le corpus est synthétique et original.
Il combine dialogues, petits récits, procédures, reformulations, messages pratiques, résumés et exemples de raisonnement simple.

Deux stratégies de tokenisation sont explorées :
une version character-level avec un vocabulaire réduit, puis une version BPE avec `tiktoken`.
Cette comparaison rend visible le compromis entre simplicité, taille du vocabulaire et longueur des séquences.

## Architecture et entraînement
Le projet implémente un pipeline complet de langage autorégressif en `PyTorch`.
La logique centrale suit le schéma classique :

```text
text -> tokens -> sequences -> batches -> model -> logits -> loss -> gradients -> generation
```

Le modèle inclut des embeddings token/position, une self-attention causale, des blocs Transformer et une tête de prédiction du prochain token.
Le notebook compare notamment une baseline bigramme, un mini GPT character-level et une version finale plus large.

Les résultats reportés dans le dépôt indiquent une forte amélioration par rapport au bigramme :
la perplexité descend d'environ `9.51` pour la baseline à `1.32` pour le GPT, puis autour de `1.25` pour la version finale.
La next-token accuracy passe d'environ `0.2917` à `0.9040`, puis `0.9300`.

- [v] Le pipeline est reproductible et suit les étapes fondamentales d'un modèle de langage.
- [v] Les métriques donnent une lecture claire du gain entre baseline et Transformer.
- [!] Les scores mesurent surtout l'apprentissage local du corpus, pas une capacité générale de raisonnement.

# Value

## Ce que le projet démontre
Ce projet démontre une capacité à ouvrir la boîte noire des modèles de langage.
Il relie la théorie du Transformer à une implémentation lisible : décalage entre `x` et `y`, masque causal, logits, cross-entropy, perplexité et génération.

Pour un portfolio, sa valeur vient de cette transparence.
Le projet montre que le sujet GPT n'est pas traité comme un simple mot-clé, mais comme un système que l'on peut reconstruire, tester et critiquer.

## Positionnement professionnel
Le bon positionnement est pédagogique et technique.
Le projet prouve une familiarité réelle avec les briques de base des LLM, sans prétendre produire un modèle de production.

Il complète bien des projets plus applicatifs : ici, la valeur est dans la compréhension fine du mécanisme.
La cover abstraite en couches garde cette idée : un modèle de langage est une architecture empilée, progressive, difficile à voir directement mais structurée.

- [v] Projet fort pour montrer une compréhension interne des Transformers.
- [v] Bon support pour discuter tokenisation, attention causale et évaluation.
- [!] A présenter comme mini GPT from scratch, pas comme concurrent d'un LLM généraliste.
