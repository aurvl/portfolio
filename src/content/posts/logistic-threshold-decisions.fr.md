---
slug: "logistic-threshold-decisions"
seriesSlug: "ia-pas-a-pas"
lang: "fr"
title: "Quand un score devient une decision"
summary: "Pourquoi un modele de classification ne repond pas seulement oui ou non, mais passe d'abord par une probabilite qu'il faut ensuite convertir en decision."
date: "2026-03-28"
tags:
  - "classification"
  - "probabilites"
  - "ia"
cover: "/assets/blog/images/blog6.jpg"
featured: true
---

# Introduction

Apres la regression, on arrive vite a une question plus pratique: comment produire une decision binaire proprement?

Dans beaucoup de cas, on ne veut pas seulement predire une valeur. On veut trancher:

- spam ou non
- fraude ou non
- churn ou non

## Le vrai role de la probabilite

Un bon modele de classification commence souvent par estimer une probabilite. Cette etape est cruciale, car elle garde plus d'information qu'une reponse brute.

:::panel{tone="green" title="Bonne lecture d'un modele"}
Dire qu'un client a `0.82` de probabilite de churn est plus utile que de dire seulement "oui".
:::

Avec cette probabilite, on peut choisir un seuil adapte au contexte.

## Tous les seuils ne se valent pas

Un seuil a `0.5` n'est pas une loi naturelle. C'est juste une convention frequente.

- [v] en fraude, on peut preferer detecter plus large
- [v] en marketing, on peut viser les cas les plus probables
- [!] un mauvais seuil peut couter plus qu'un mauvais modele

## Exemple minimal

```python title="Probabilite puis seuil"
import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([
    [2, 1],
    [3, 1],
    [8, 0],
    [9, 0],
])
y = np.array([0, 0, 1, 1])

model = LogisticRegression()
model.fit(X, y)

proba = model.predict_proba(np.array([[7, 0]]))[0, 1]
decision = int(proba >= 0.6)

print(proba, decision)
```

## Ce qu'il faut retenir

- [v] le modele estime d'abord une probabilite
- [v] la decision finale depend aussi du seuil choisi
- [v] le seuil doit refleter le risque metier

## Pourquoi cette etape est importante

Comprendre cette transition entre score et decision aide a mieux discuter un modele avec une equipe metier. Cela force aussi a parler de cout d'erreur, ce qui est souvent plus utile qu'un simple score global.
