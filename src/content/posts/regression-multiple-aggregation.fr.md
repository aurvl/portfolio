---
slug: "regression-multiple-aggregation"
seriesSlug: "ia-pas-a-pas"
lang: "fr"
title: "Décider avec des chiffres"
summary: "Une introduction simple à l'idée centrale derrière de nombreux modèles : agréger plusieurs signaux, leur assigner des poids, et produire une décision."
date: "2026-03-26"
tags:
  - "regression"
  - "agregation"
  - "ia"
cover: "/assets/blog/images/blog6.jpg"
featured: true
---

### Stack requise pour réaliser les exemples de cet article

:::panel{tone="blue" title="Outils utilisés"}
- Python 3.8+
- Jupyter Notebook
- scikit-learn
- matplotlib
- numpy
- pandas
- R
:::

## Introduction

On entend parler d'intelligence artificielle partout. Et souvent, la première réaction c'est : *"ça doit être hyper compliqué."*

Logique, non ? Elle parle. Elle lit des documents. Elle répond à des questions. Elle code. Elle génère des images. Et toi tu te dis — moi-même je ne sais pas vraiment comment je fais pour parler, comment mon cerveau fonctionne, comment je prends mes décisions. Alors une machine qui fait tout ça… ça doit être quelque chose d'inaccessible, etc...

Sauf que non.

Parce qu'en vrai, l'IA repose sur une idée ridiculement simple. Une idée que tu utilises déjà sans t'en rendre compte, tous les jours.

Cette idée, c'est l'**agrégation d'informations** : le fait de rassembler plusieurs indices, de les peser, et d'en tirer une décision.

C'est exactement ce que tu fais quand tu choisis un resto le soir. Tu regardes les avis, le prix, la distance, si tes amis ont aimé. Tu additionnes tout ça dans ta tête — et tu décides. Tu viens de faire de l'IA sans le savoir.

Toute cette série repose sur une seule idée :

> y = f(X) une IA, c'est une fonction qui transforme des informations X en une réponse y.

Si tu comprends ça, tu comprends déjà 80 % de ce qu'il faut savoir. Le reste, c'est de la sophistication.

Dans cet article, on pose la première brique, la base des bases. Pas de jargon, pas de maths complexes, juste l'intuition fondamentale sur laquelle tout le reste est construit.

## La centrale électrique : ton cerveau fait déjà de l'IA

Imaginons un manager dans une centrale électrique. Ce matin, il doit décider si le réseau va tenir ce soir. 

- Il regarde la météo : il fait -8°C. 
- Il regardes le calendrier : c'est un lundi, il y a un match important à la télé. 
- Il regardes l'heure : c'est l'heure de pointe.

- [v] Il rassemble tout ça dans sa tête et il décide.

Ce que tu viens de faire, c'est exactement ce qu'un modèle d'IA fait. Ni plus, ni moins. Il prend des informations, leur donne un poids, les additionne, et produit une réponse.

:::panel{tone="red" title="La différence ?"}
Il le fait sur des millions d'exemples, en quelques millisecondes, sans jamais se fatiguer.
:::

## Peser des informations pour décider

Restons dans la centrale. Tu veux maintenant prédire la consommation d'électricité du quartier ce soir. Tu as plusieurs informations :

* $x_1$ = température extérieure (°C)
* $x_2$ = heure de la journée
* $x_3$ = jour de la semaine
* $x_4$ = événement spécial ce soir (match, concert)

La machine va apprendre une équation de ce type :

$Consommation = w_1 x_1 + w_2 x_2 + w_3 x_3 + w_4 x_4$

:::panel{tone="red" title="Les $w_1$, $w_2$... c'est quoi exactement ?"}
Ce sont des poids, des coefficients que la machine ajuste automatiquement à partir de milliers d'exemples passés. Elle apprend que la température compte beaucoup, que l'heure de pointe aussi, que le dimanche est très différent du lundi.
:::

Ce n'est pas de la magie. C'est de l'optimisation : **trouver les poids qui minimisent l'écart entre ce qu'elle prédit et ce qui s'est vraiment passé**, comme toi quand tu ajustes par exemple, ta recette de cuisine pour qu'elle soit parfaite.

:::panel{tone="blue" title="L'analogie du coach"}
Un entraîneur qui évalue ses joueurs note chacun sur la vitesse, le passing, la résistance physique. Il multiplie chaque note par son importance :

- la vitesse compte double en attaque
- le passing compte pour `1,5`
- la résistance physique compte pour `1`

Il additionne le tout pour obtenir un score.

- [v] C'est ce qu'on appelle la *régression linéaire** : Apprendre quels facteurs comptent, et combien.
:::

:::panel{tone="green" title="Regression linéaire : un outil de base"}
La régression linéaire est l'outil de base pour faire ce genre d'agrégation pondérée. C'est simple, rapide, et souvent très efficace pour des problèmes de prédiction de valeurs continues.
:::

[Aller plus loin](https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares)

### Application : prédire la consommation d'électricité

:::codegroup
```python
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

# Générer des données d'exemple
np.random.seed(0)
n_samples = 1000
X = np.random.rand(n_samples, 4)  # 4 features : température, heure, jour, événement
y = 10 * X[:, 0] + 5 * X[:, 1] + np.random.rand(n_samples)  # consommation avec un peu de bruit

# Entraîner le modèle
model = LinearRegression() # machine qui apprend la configuration optimale pour faire des bonnes prédictions

model.fit(X, y) # Ici on lui montre les données (X) et les résultats (y) pour qu'elle puisse apprendre les poids (w1, w2, w3, w4)

# Faire une prédiction
# En ce moment: température = 15°C, heure = 18h, jour = jeudi, événement = match
new_data = np.array([[0.15, 0.75, 0, 1]])  # normalisé entre 0 et 1
predicted_consumption = model.predict(new_data)
print(f"Consommation prédite : {predicted_consumption[0]:.2f} MW")
```

```r
library(MASS)
set.seed(0)

# Générer des données d'exemple
n_samples <- 1000
X <- matrix(runif(n_samples * 4), ncol = 4) # 4 features : température, heure, jour, événement
y <- 10 * X[, 1] + 5 * X[, 2] + rnorm(n_samples) # consommation avec un peu de bruit

# Entraîner le modèle
model <- lm(y ~ X)

# Faire une prédiction
# En ce moment: température = 15°C, heure = 18h, jour = jeudi, événement = match
new_data <- data.frame(X1 = 0.15, X2 = 0.75, X3 = 0, X4 = 1) # normalisé entre 0 et 1
predicted_consumption <- predict(model, newdata = new_data)
print(paste("Consommation prédite :", round(predicted_consumption, 2), "MW"))
```
:::


### Avantages et limites de cette approche :

- [v] prédire une valeur continue (une consommation en MW, un chiffre d'affaires, un temps de livraison).
- [!] répondre `OUI` ou `NON`. Et c'est là qu'on a besoin d'aller un cran plus loin.

---

Exactement, il manque une section de synthèse avant de passer à la suite. Voici ce que j'insèrerais juste avant "Et maintenant ?" :

---

## En résumé : la régression linéaire

:::panel{tone="green" title="Ce que c'est"}
Un modèle qui apprend à **peser des informations** pour prédire une valeur continue. Il cherche les poids $w_1, w_2, ..., w_n$ qui minimisent l'écart entre ses prédictions et la réalité.

$y = w_0 + w_1 x_1 + w_2 x_2 + ... + w_n x_n$
:::

:::panel{tone="blue" title="Là où elle brille"}
- [v] Prédire une valeur continue : consommation électrique, chiffre d'affaires, temps de livraison
- [v] Résultats interprétables : on peut lire les poids et comprendre ce qui compte
- [v] Rapide à entraîner, facile à déployer
- [v] Bonne baseline — toujours tester ça en premier avant de complexifier
:::

:::panel{tone="red" title="Ses limites"}
- [!] Elle suppose que la relation entre X et y est **linéaire** — si la réalité est plus complexe, elle rate
- [!] Sensible aux valeurs aberrantes — un outlier peut tirer les poids dans le mauvais sens
- [!] Elle ne sait pas répondre OUI ou NON — elle produit un nombre, pas une décision
:::

---

## Et maintenant ?

La régression linéaire est puissante. Mais elle a une limite claire : elle prédit des nombres, pas des décisions.

Dans la vraie vie de l'IA, beaucoup de questions sont binaires — cet email est-il du spam ? Ce vol va-t-il être retardé ? Cette transaction est-elle frauduleuse ? Si on utilisait directement notre équation, on obtiendrait des valeurs comme `1.7` ou `-0.3`. Difficile d'en faire une décision claire. Et impossible de parler en probabilités.

Dans le prochain article, on introduit la brique qui résout exactement ce problème : la **{purple}régression logistique{/purple}** — et avec elle, une petite fonction mathématique qui va changer ta façon de voir les choses.

Elle s'appelle la {purple}sigmoïde{/purple}. Et une fois que tu l'auras vue, tu la retrouveras partout.

---

## Pour aller plus loin

- [Régression linéaire — scikit-learn](https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares)
- [Régression linéaire — documentation R](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/lm.html)
- [Gradient descent visualisé](https://distill.pub/2017/momentum/)
- [StatQuest — Linear Regression](https://www.youtube.com/watch?v=nk2CQITm_eo)