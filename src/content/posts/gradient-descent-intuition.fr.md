---
slug: "gradient-descent-intuition"
seriesSlug: "ia-pas-a-pas"
lang: "fr"
title: "Comment un modele s'ajuste vraiment"
summary: "Une intuition simple de la descente de gradient: observer l'erreur, avancer dans une meilleure direction, puis recommencer jusqu'a stabilisation."
date: "2026-03-30"
tags:
  - "optimisation"
  - "gradient-descent"
  - "ia"
cover: "/assets/blog/images/blog6.jpg"
featured: false
---

# Introduction

Une fois qu'on comprend qu'un modele combine des signaux, il reste une question: comment trouve-t-il les bons poids?

La reponse standard s'appelle descente de gradient. Le terme impressionne, mais l'idee de base reste simple.

## Une logique d'ajustement progressif

Le modele part d'une configuration imparfaite, mesure son erreur, puis ajuste ses parametres pour reduire cette erreur.

- [v] on observe l'ecart entre prediction et realite
- [v] on modifie legerement les poids
- [v] on recommence plusieurs fois

## Une intuition utile

Imagine que tu descends une colline dans le brouillard. Tu ne connais pas la carte complete du relief, mais tu peux sentir si le pas que tu viens de faire t'amene vers le bas ou non.

:::panel{tone="blue" title="Intuition a garder"}
La descente de gradient n'est pas une formule magique. C'est une procedure d'amelioration locale, repetee assez longtemps pour trouver une zone plus stable.
:::

## Exemple compact

```python title="Mise a jour iterative"
weight = 4.0
learning_rate = 0.1

for _ in range(5):
    gradient = 2 * (weight - 1)
    weight = weight - learning_rate * gradient
    print(round(weight, 4))
```

Dans cet exemple, le poids se rapproche progressivement de `1`, qui represente ici la meilleure valeur.

## Les deux pieges classiques

- [!] un pas trop grand peut faire diverger l'apprentissage
- [!] un pas trop petit peut rendre l'entrainement inutilement lent

## Pourquoi cette notion est utile

Comprendre cette logique aide a lire les notions de `learning_rate`, d'epochs et de stabilite d'entrainement. Ce n'est pas reserve au deep learning: c'est une idee de fond sur la maniere dont un modele apprend.
