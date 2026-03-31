---
slug: "logistic-regression-score-probability"
seriesSlug: "ia-pas-a-pas"
lang: "fr"
title: "Oui ou non, avec nuance"
summary: "La suite simple de la régression linéaire : garder le score pondéré, le passer dans une sigmoïde, et obtenir une probabilité pour des décisions oui ou non."
date: "2026-03-31"
tags:
  - "ai"
  - "logistic-regression"
  - "classification"
cover: "/assets/blog/images/blog6.jpg"
featured: false
---

## Stack requise pour réaliser les exemples de cet article

:::panel{tone="blue" title="Outils utilisés"}
- Python 3.8+
- Jupyter Notebook
- scikit-learn
- matplotlib
- numpy
- pandas
- R
:::

# Introduction

Dans le premier article, on a vu quelque chose d'essentiel : un modèle peut prendre plusieurs signaux, leur donner un poids, et les transformer en un score.

Cela marche très bien quand la question est "combien ?". Combien d'électricité un quartier va-t-il consommer ce soir ? Combien de chiffre d'affaires une entreprise va-t-elle générer le mois prochain ? Combien de temps une livraison va-t-elle prendre ?

Mais beaucoup de questions réelles ne portent pas sur une quantité. Elles sont binaires :

- Ce vol sera-t-il retardé ?
- Cet email est-il du spam ?
- Cette transaction est-elle suspecte ?

Si on garde le score linéaire tel quel, on obtient des valeurs comme `1.7` ou `-0.3`. Utile en interne. Peu pratique comme réponse finale.

Ce dont on a besoin maintenant, ce n'est pas d'une nouvelle façon de combiner l'information. C'est d'une nouvelle façon d'interpréter le score.

C'est exactement là que la **régression logistique** entre en scène.

> L'idée de base reste la même : `y = f(X)`. La différence, c'est que `y` devient d'abord une probabilité avant de devenir une décision.

# Le même score, une autre question

Imaginons que tu veuilles estimer si un vol va être retardé.

Tu récupères plusieurs signaux :

* $x_1$ = niveau de mauvais temps
* $x_2$ = congestion de l'aéroport
* $x_3$ = avion précédent déjà en retard
* $x_4$ = alerte technique avant embarquement

Le modèle commence toujours par calculer un score pondéré :

$score = w_0 + w_1 x_1 + w_2 x_2 + w_3 x_3 + w_4 x_4$

Un score élevé veut dire "plus de chances d'être retardé". Un score faible veut dire "moins de chances d'être retardé".

:::panel{tone="blue" title="Ce qui ne change pas"}
On agrège toujours plusieurs signaux. On apprend toujours des poids à partir d'exemples passés. La régression logistique ne remplace pas la brique précédente. Elle s'appuie directement dessus.
:::

Jusque-là, la logique est presque la même que pour la régression linéaire.

Le problème est simple : un score brut peut prendre n'importe quelle valeur. Une probabilité doit rester entre `0` et `1`.

# Transformer un score en probabilité

Pour résoudre ça, la régression logistique fait passer le score dans une toute petite fonction mathématique qu'on appelle la **sigmoïde** :

$p = \frac{1}{1 + e^{-score}}$

Cette fonction écrase n'importe quel nombre pour en faire une probabilité :

- un score très négatif devient une probabilité proche de `0`
- un score autour de `0` devient une probabilité proche de `0.5`
- un score très positif devient une probabilité proche de `1`

Tout le tour de magie est là.

Au lieu de s'arrêter à un score, le modèle peut maintenant dire :

- "il y a `92%` de chances que ce vol soit retardé"
- ou "il n'y a que `14%` de chances"

:::panel{tone="green" title="Régression logistique : une baseline de classification"}
La régression logistique est l'un des outils les plus simples et les plus utiles pour la classification binaire. Elle garde la lisibilité d'un modèle linéaire tout en produisant une sortie interprétable comme une probabilité.
:::

## Application : décider si un vol sera retardé

:::codegroup
```python
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

# Générer des données d'exemple
np.random.seed(0)
n_samples = 1000
X = np.random.rand(n_samples, 4)  # météo, congestion, retard entrant, alerte technique

# Construire un score latent, puis le transformer en probabilité
score = 4 * X[:, 0] + 3 * X[:, 1] + 2 * X[:, 2] + 1.5 * X[:, 3] - 4
probability = 1 / (1 + np.exp(-score))
y = (np.random.rand(n_samples) < probability).astype(int)  # 1 = retardé, 0 = à l'heure

# Entraîner le modèle
model = LogisticRegression()
model.fit(X, y)

# Faire une prédiction
# En ce moment : météo difficile, aéroport chargé, avion entrant en retard, pas d'alerte technique
new_data = np.array([[0.8, 0.7, 0.9, 0.1]])
predicted_probability = model.predict_proba(new_data)[0, 1]
decision = "Retardé" if predicted_probability >= 0.5 else "À l'heure"

print(f"Probabilité de retard : {predicted_probability:.2%}")
print(f"Décision : {decision}")
```

```r
set.seed(0)

# Générer des données d'exemple
n_samples <- 1000
X <- matrix(runif(n_samples * 4), ncol = 4)  # météo, congestion, retard entrant, alerte technique

# Construire un score latent, puis le transformer en probabilité
score <- 4 * X[, 1] + 3 * X[, 2] + 2 * X[, 3] + 1.5 * X[, 4] - 4
probability <- 1 / (1 + exp(-score))
y <- rbinom(n_samples, 1, probability)  # 1 = retardé, 0 = à l'heure

data <- data.frame(
  y = y,
  weather = X[, 1],
  congestion = X[, 2],
  incoming_delay = X[, 3],
  technical_alert = X[, 4]
)

# Entraîner le modèle
model <- glm(y ~ weather + congestion + incoming_delay + technical_alert, data = data, family = binomial())

# Faire une prédiction
# En ce moment : météo difficile, aéroport chargé, avion entrant en retard, pas d'alerte technique
new_data <- data.frame(weather = 0.8, congestion = 0.7, incoming_delay = 0.9, technical_alert = 0.1)
predicted_probability <- predict(model, newdata = new_data, type = "response")
decision <- ifelse(predicted_probability >= 0.5, "Retardé", "À l'heure")

print(paste("Probabilité de retard :", sprintf("%.2f%%", predicted_probability * 100)))
print(paste("Décision :", decision))
```
:::

## Quand la probabilité devient une décision

Une probabilité est déjà beaucoup plus utile qu'un score brut. Mais dans beaucoup de situations, il faut encore prendre une action.

La règle la plus simple est :

- si la probabilité `>= 0.5`, on prédit `OUI`
- si la probabilité `< 0.5`, on prédit `NON`

Dans notre exemple :

- `0.84` devient "le vol sera probablement retardé"
- `0.21` devient "le vol sera probablement à l'heure"

:::panel{tone="red" title="Nuance importante"}
Le seuil est une règle de décision, pas une loi de la nature. Si rater un vol retardé coûte très cher, on peut baisser le seuil. Si les fausses alertes coûtent trop cher, on peut le relever.
:::

Tu vois déjà apparaître une idée importante en IA : le modèle fait les calculs, mais la décision finale dépend aussi du contexte, du coût de l'erreur et de la tolérance au risque.

# En résumé : la régression logistique

:::panel{tone="green" title="Ce que c'est"}
Un modèle qui garde la logique d'agrégation pondérée de la régression linéaire, puis fait passer le résultat dans une sigmoïde pour produire une probabilité de décision binaire.

$p = \frac{1}{1 + e^{-score}}$
:::

:::panel{tone="blue" title="Là où elle brille"}
- [v] Prédire des issues binaires : retard ou non, spam ou non, fraude ou non
- [v] Produire des probabilités plutôt que des scores bruts
- [v] Rester interprétable et rapide
- [v] Servir de très bonne baseline avant d'utiliser des classifieurs plus complexes
:::

:::panel{tone="red" title="Ses limites"}
- [!] Elle trace encore une frontière de décision assez simple
- [!] Elle dépend beaucoup de la qualité des variables en entrée
- [!] Le seuil impose des arbitrages entre cas ratés et fausses alertes
- [!] Quand les relations deviennent trop emmêlées, une seule couche ne suffit plus
:::

# Et maintenant ?

La régression logistique est une excellente deuxième brique. Mais elle reste proche d'une façon linéaire de penser.

Dans la vraie vie, les relations entre les signaux et la réponse finale sont souvent plus tordues que ça. Parfois, un seul score pondéré, même passé dans une sigmoïde, ne suffit plus.

Dans le prochain article, on ajoute une nouvelle idée : au lieu d'utiliser une seule couche de calcul, on empile plusieurs couches.

C'est là qu'entrent en scène les **réseaux de neurones**.

# Pour aller plus loin

- [Régression logistique - scikit-learn](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- [Modèles linéaires généralisés - documentation R](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/glm.html)
- [Google Machine Learning Crash Course - Logistic Regression](https://developers.google.com/machine-learning/crash-course/logistic-regression)
- [StatQuest - Logistic Regression](https://www.youtube.com/watch?v=yIYKR4sgzI8)
