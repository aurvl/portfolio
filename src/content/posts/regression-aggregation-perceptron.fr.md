---
slug: "regression-aggregation-perceptron"
seriesSlug: "ia-pas-a-pas"
lang: "fr"
title: "Agréger pour décider"
summary: "La brique fondamentale de tout modèle d'IA : pondérer des informations, les agréger, mesurer l'erreur, et apprendre à corriger. De la régression linéaire au perceptron, en passant par la loss et le gradient descent."
date: "2026-03-26"
tags:
  - "regression"
  - "perceptron"
  - "gradient-descent"
  - "agregation"
  - "ia"
cover: "/assets/blog/images/blog6.jpg"
featured: true
---

:::panel{tone="blue" title="Outils utilisés"}
- Python 3.8+
- Jupyter Notebook
- scikit-learn
- matplotlib
- pandas
- numpy
:::

# Introduction

On entend parler d'intelligence artificielle partout. Et souvent, la première réaction, c'est : *"ça doit être hyper compliqué."*

Logique, non ? Elle parle. Elle lit des documents. Elle répond à des questions. Elle code. Elle génère des images. Et toi tu te dis : moi-même, je ne sais pas vraiment comment je fais pour parler, comment mon cerveau fonctionne, ou comment je prends mes décisions. Alors une machine qui fait tout ça doit être quelque chose d'inaccessible.

Sauf que **non**.

Parce qu'en vrai, l'IA repose sur une idée ridiculement simple. Une idée que tu utilises déjà sans t'en rendre compte, tous les jours.

Cette idée, c'est l'**agrégation d'informations** : rassembler plusieurs indices, les peser, et en tirer une décision.

C'est exactement ce que tu fais quand tu choisis un resto le soir. Tu regardes les avis, le prix, la distance, si tes amis ont aimé. Tu additionnes tout ça dans ta tête et tu décides. Tu viens de faire de l'IA sans le savoir.

Au cœur de cette série se trouve une idée simple et puissante :

> `ŷ = f(X)`

- [v] Une IA, c'est une fonction qui transforme des informations `X` en une réponse `ŷ`.

Si tu comprends ça, tu comprends déjà 80 % de ce qu'il faut savoir. Le reste, c'est de la sophistication, et c'est exactement ce qu'on va construire ensemble, brique par brique.

Dans cet article, on pose le socle. On part de l'intuition la plus simple, on construit la logique de pondération et d'agrégation, on introduit la notion d'erreur, et on arrive à comprendre comment un système apprend vraiment. Ce n'est pas juste un article sur la régression linéaire. C'est l'article qui rend tout le reste de la série compréhensible.

# La centrale électrique : ton cerveau fait déjà de l'IA

Imaginons un manager dans une centrale électrique. Ce matin, il doit décider si le réseau va tenir ce soir.

- Il regarde la météo : il fait `-8°C`.
- Il regarde le calendrier : c'est un lundi, et il y a un match important à la télé.
- Il regarde l'heure : c'est l'heure de pointe.
- [v] Il rassemble tout ça dans sa tête et il décide.

Ce qui vient de se passer, c'est exactement ce qu'un modèle d'IA fait. Ni plus, ni moins. Il prend des informations, leur donne un poids, les additionne, et produit une réponse.

:::panel{tone="red" title="La différence ?"}
Il le fait sur des millions d'exemples, en quelques millisecondes, sans jamais se fatiguer.
:::

Derrière ce mécanisme se cache une équation très simple :

$$
\hat{y} = f(X)
$$

où `X` ce sont les informations d'entrée (la météo, l'heure, le jour...), et `ŷ` c'est la réponse produite (la consommation prévue, la décision, le score...).

Maintenant, regardons comment cette équation se construit concrètement.

# Pondérer - Donner une importance à chaque information

Toutes les informations ne se valent pas.

Dans notre exemple de la centrale, la température extérieure compte probablement plus que le jour de la semaine. Un match de foot en prime time compte plus qu'un mardi ordinaire. Et l'heure de pointe a un effet systématique sur la consommation.

Cette idée - que certaines informations comptent plus que d'autres s'exprime mathématiquement avec des **poids**.

$$
\hat{y} = w_1 x_1 + w_2 x_2 + \ldots + w_p x_p + b
$$

- $x_1, x_2, \ldots, x_p$ → les informations d'entrée (température, heure, événement...)
- $w_1, w_2, \ldots, w_p$ → les **poids**, l'importance accordée à chaque information
- $b$ → le **biais**, une valeur de base indépendante des entrées
- $\hat{y}$ → la valeur prédite

:::panel{tone="blue" title="L'analogie du coach"}
Un entraîneur évalue ses joueurs sur trois critères : vitesse, qualité de passe, résistance physique.

Mais il ne les pondère pas de la même façon :
- la vitesse compte double en attaque → $w = 2$
- la qualité de passe compte pour `1,5` → $w = 1.5$
- la résistance physique compte pour `1` → $w = 1$

Le score final d'un joueur, c'est la somme pondérée de ses notes.

- [v] C'est exactement la logique des poids dans un modèle d'IA : apprendre **quels facteurs comptent**, et **combien**.
:::

Les poids ne sont pas juste un détail technique. Ils sont le cœur du modèle. Un poids élevé signifie que cette variable influence beaucoup la prédiction. Un poids proche de zéro signifie qu'elle n'apporte presque rien. Un poids négatif signifie qu'elle joue dans le sens inverse.

Lire les poids d'un modèle, c'est lire ce que la machine a appris sur le monde.

# Agréger - Produire une réponse à partir des poids

Une fois qu'on a les poids et les informations, on **agrège** : {purple}on additionne tout pour produire une valeur de sortie{/purple}.

$$
\hat{y} = w_1 x_1 + w_2 x_2 + w_3 x_3 + w_4 x_4 + b
$$

Prenons un exemple concret. Pour prédire la consommation électrique ce soir :

| Information | Valeur | Poids | Contribution |
|-------------|--------|-------|-------------|
| Température ($x_1$) | -8°C | 3.2 | -25.6 MW |
| Heure ($x_2$) | 19h | 1.5 | +28.5 MW |
| Jour de semaine ($x_3$) | Lundi = 1 | 4.0 | +4.0 MW |
| Match ce soir ($x_4$) | Oui = 1 | 12.0 | +12.0 MW |
| Biais ($b$) | - | - | +50.0 MW |

**Consommation prédite : 68.9 MW**

Chaque information contribue à la prédiction finale selon son poids. La machine additionne ces contributions : {purple}c'est l'agrégation{/purple}.

:::widget{id="power-plant-perceptron"}
:::

Pour des problèmes simples, on peut fixer ces poids manuellement. Mais pour des problèmes complexes avec des dizaines ou des centaines de variables ? Impossible de les deviner à la main. C'est là qu'intervient la notion d'**apprentissage**.

# La loss, mesurer l'écart entre ce qu'on prédit et la réalité

Avant d'apprendre quoi que ce soit, il faut pouvoir mesurer à quel point on se trompe.

Imagine que ton modèle prédit une consommation de 68.9 MW, mais que la réalité ce soir-là est 74.2 MW. L'écart, c'est 5.3 MW. C'est l'**erreur**.

$$
\text{erreur} = \hat{y} - y
$$

Mais une seule erreur ne suffit pas. On veut mesurer la qualité du modèle sur **beaucoup d'exemples**. Pour ça, on utilise une **fonction de coût** (ou *loss*) : {purple}une façon de résumer toutes les erreurs en un seul nombre{/purple}.

La plus courante pour la prédiction de valeurs continues, c'est la **MSE** (Mean Squared Error) :

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

:::panel{tone="red" title="Pourquoi on met les erreurs au carré ?"}
Deux raisons simples :
- une erreur de -5 et une erreur de +5 sont aussi graves l'une que l'autre - en les mettant au carré, elles donnent toutes les deux 25
- les grandes erreurs sont encore plus pénalisées que les petites (une erreur de 10 donne 100, pas juste le double d'une erreur de 5)

- [!] Si on utilisait juste la moyenne des erreurs brutes, les erreurs positives et négatives s'annuleraient - et le modèle semblerait parfait alors qu'il se trompe tout le temps.
:::

La loss est le **nerf de tout ce travail**. C'est elle qui dit à la machine si elle s'améliore ou non. C'est elle qu'on cherche à minimiser. Et c'est elle qui guide la mise à jour des poids.

# Apprendre les poids : De la calibration manuelle à l'optimisation automatique

Pour des problèmes simples, on pourrait tâtonner manuellement : essayer des poids, calculer la loss, ajuster, recalculer. Mais dès que le problème devient un peu complexe (plusieurs dizaines de variables, des millions d'exemples), cette approche manuelle est impossible.

Il faut un mécanisme automatique. Un mécanisme qui, à partir de l'erreur, sache dans quelle direction ajuster chaque poids.

Ce mécanisme existe. On l'appelle la **régression linéaire** - et plus généralement, c'est le cœur de tout apprentissage automatique.

:::panel{tone="green" title="Ce que signifie « apprendre » pour une machine"}
Apprendre, pour un système d'IA, ce n'est pas mémoriser. C'est **ajuster des paramètres** (les poids) pour que les prédictions se rapprochent le plus possible de la réalité, sur le plus grand nombre d'exemples possible.

C'est un peu comme le cerveau humain qui renforce les connexions neuronales quand on répète une tâche. Plus on s'entraîne, plus les connexions sont calibrées. Ici, c'est pareil - mais avec des équations.
:::

# Le perceptron

La régression linéaire qu'on vient de décrire est, sous une autre forme, ce qu'on appelle un {purple}perceptron{/purple}, ou neurone artificiel simple.

$$
\hat{y} = w_1 x_1 + w_2 x_2 + \ldots + w_p x_p + b
$$

![Schema d'un perceptron simple](/assets/blog/images/ia-pas-a-pas/bp1-neuron.png)

C'est la même équation. La même logique. Juste un nom différent, emprunté au vocabulaire des réseaux de neurones.

**Le problème central est toujours le même :**

> Comment trouver $w_i$ et $b$ à partir de $n$ données ?

C'est là qu'intervient le **processus d'apprentissage**.

# Comment un modèle se calibre ? Le processus d'apprentissage

L'apprentissage d'un modèle suit une boucle en cinq étapes. C'est **le même processus utilisé en deep learning**, des modèles les plus simples aux plus complexes.

## 1. Forward propagation : Produire une prédiction

On prend les données d'entrée, on applique les poids actuels, et on calcule $\hat{y}$.

Au début, les poids sont initialisés aléatoirement. La prédiction sera donc mauvaise (c'est normal). C'est le point de départ.

## 2. Fonction de coût : Mesurer l'erreur

On compare $\hat{y}$ à la vraie valeur $y$, et on calcule la loss.

$$
\text{MSE} = \frac{1}{2}(y - \hat{y})^2
$$

Plus la loss est élevée, plus le modèle est loin de la réalité.

## 3. Backward propagation : Comprendre d'où vient l'erreur

C'est ici que la magie opère. On remonte l'équation à l'envers pour calculer **la contribution de chaque poids à l'erreur totale**.

En termes simples : *"qu'est-ce qui a le plus contribué à cette erreur ?"*

Ce calcul produit des **gradients** : des nombres qui indiquent dans quelle direction chaque poids doit bouger pour réduire l'erreur.

![Propagation backward d'un perceptron](/assets/blog/images/ia-pas-a-pas/bp1-backward.png)

## 4. Gradient descent : Corriger les poids

On met à jour les poids en suivant la direction opposée au gradient :

$$
w_{t+1} = w_t - \alpha \frac{\partial L}{\partial w_t}
$$

- $\alpha$ → le **taux d'apprentissage** (*learning rate*) : à quelle vitesse on corrige
- $\frac{\partial L}{\partial w}$ → le gradient : dans quelle direction l'erreur augmente

:::panel{tone="blue" title="L'analogie de la descente"}
Imagine que tu es dans le brouillard sur une montagne et que tu veux descendre dans la vallée. Tu ne vois pas loin, mais tu peux sentir la pente sous tes pieds.

À chaque pas, tu regardes dans quelle direction le sol descend, et tu fais un pas dans cette direction.

C'est exactement ce que fait le gradient descent : à chaque étape, il regarde dans quelle direction la loss diminue, et il ajuste les poids dans cette direction.
:::

## 5. Boucle : Répéter jusqu'à convergence

On répète les étapes 1 à 4 sur tous les exemples du dataset, encore et encore, jusqu'à ce que la loss atteigne un minimum acceptable.

- [v] C'est ce qu'on appelle un **epoch** : une passe complète sur toutes les données.
- [v] Après plusieurs epochs, les poids ont convergé et le modèle a appris.

# Cas simple : Un perceptron à 2 entrées

Pour ancrer tout ça, prenons le cas le plus simple possible : un perceptron avec seulement 2 inputs.

$$
\hat{y} = w_1 x_1 + w_2 x_2 + b
$$

**Données d'exemple :**

| $x_1$ | $x_2$ | $y$ (réel) | $\hat{y}$ (prédit) | Erreur |
|-------|-------|-----------|------------------|--------|
| 2 | 3 | 13 | 10.5 | -2.5 |
| 4 | 1 | 14 | 13.2 | -0.8 |
| 1 | 5 | 16 | 12.1 | -3.9 |

La **loss MSE** sur ces 3 exemples :
$$
\text{MSE} = \frac{1}{2}((-2.5)^2 + (-0.8)^2 + (-3.9)^2) \approx 10.75
$$

**Mise à jour des poids** à partir des gradients :

$$
w_i \leftarrow w_i - \alpha \cdot (\hat{y} - y) \cdot x_i
$$

$$
b \leftarrow b - \alpha \cdot (\hat{y} - y)
$$

:::panel{tone="blue" title="Lire ces formules sans les craindre"}
La formule de mise à jour dit simplement :

- $\hat{y} - y$ → *"de combien je me suis trompé ?"*
- $x_i$ → *"dans quelle direction cette variable a-t-elle contribué à l'erreur ?"*
- $\alpha$ → *"à quelle vitesse je veux corriger ?"*

On corrige chaque poids proportionnellement à son implication dans l'erreur. Un poids lié à une variable qui a beaucoup contribué à l'erreur est plus fortement corrigé.
:::

Après une mise à jour avec $\alpha = 0.01$, les poids bougent légèrement. On recalcule. On mesure la nouvelle loss. Elle a diminué. On recommence. C'est ça, apprendre.

# Généraliser à un dataset entier - Vecteurs et matrices

Jusqu'ici, on a raisonné sur un exemple à la fois. En pratique, on travaille avec des **datasets** (des milliers ou millions d'exemples).

Pour rendre les calculs efficaces, on passe en notation matricielle.

**Un dataset de $n$ exemples et $p$ features** s'écrit :

$$
X = \begin{pmatrix} x_{11} & x_{12} & \cdots & x_{1p} \\ x_{21} & x_{22} & \cdots & x_{2p} \\ \vdots & & \ddots & \vdots \\ x_{n1} & x_{n2} & \cdots & x_{np} \end{pmatrix}, \quad w = \begin{pmatrix} w_1 \\ w_2 \\ \vdots \\ w_p \end{pmatrix}
$$

Et la prédiction sur tout le dataset s'écrit simplement :

$$
\hat{Y} = X \cdot w + b
$$

Une seule ligne. Toutes les prédictions d'un coup.

:::panel{tone="green" title="Pourquoi c'est important"}
- [v] Le code devient plus simple et plus lisible
- [v] Les calculs sont beaucoup plus rapides (NumPy, PyTorch les optimisent nativement)
- [v] C'est la base de tout framework de deep learning - comprendre ça, c'est comprendre comment PyTorch ou TensorFlow fonctionnent sous le capot
:::

# Code - Régression linéaire et perceptron simple

:::codegroup
```python
# =====================================
# Régression linéaire
# =====================================
import numpy as np
from sklearn.linear_model import LinearRegression

# Dataset : température, heure, jour, événement → consommation
X = np.array([
    [-8, 19, 1, 1],   # lundi soir, match, -8°C
    [15,  9, 3, 0],   # mercredi matin, beau temps
    [ 2, 21, 5, 0],   # vendredi soir, sans événement
    [-5, 18, 1, 1],   # lundi soir, match, -5°C
])
y = np.array([74.2, 41.3, 52.8, 68.9])  # consommation réelle en MW

# Entraînement
model = LinearRegression()
model.fit(X, y)

# Lecture des poids appris
for feature, coef in zip(['Température', 'Heure', 'Jour', 'Événement'], model.coef_):
    print(f"  {feature:<15} → poids : {coef:+.2f}")
print(f"  {'Biais':<15} → {model.intercept_:.2f}")

# Prédiction sur un nouveau cas
nouveau = np.array([[-8, 19, 1, 1]])
print(f"\nConsommation prédite : {model.predict(nouveau)[0]:.1f} MW")
```

```python
# =====================================
# Perceptron from scratch
# =====================================
import numpy as np

# Données
X = np.array([[2, 3], [4, 1], [1, 5], [3, 2]], dtype=float)
y = np.array([13, 14, 16, 14], dtype=float)

# Initialisation aléatoire des poids
np.random.seed(42)
w = np.random.randn(2)
b = 0.0
alpha = 0.01  # learning rate

# Boucle d'apprentissage
for epoch in range(200):
    # Forward
    y_hat = X @ w + b

    # Loss MSE
    loss = np.mean((y - y_hat) ** 2)

    # Gradients
    grad_w = -2 * X.T @ (y - y_hat) / len(y)
    grad_b = -2 * np.mean(y - y_hat)

    # Mise à jour
    w -= alpha * grad_w
    b -= alpha * grad_b

    if epoch % 50 == 0:
        print(f"Epoch {epoch:>3} | Loss : {loss:.4f}")

print(f"\nPoids appris : w = {w}, b = {b:.2f}")
```
:::

# Au-delà du linéaire - Pourquoi on a besoin de non-linéarité

Le modèle qu'on vient de construire est puissant pour les relations linéaires. Mais le monde réel est rarement linéaire.

Imagine que tu veuilles prédire si un vol va être retardé **oui ou non** et pas juste de combien. Ou détecter si une transaction est frauduleuse. Ou reconnaître un visage sur une image.

Ces problèmes ont une structure fondamentalement différente : les variables interagissent entre elles de façon complexe, et la réponse ne peut pas s'exprimer comme une simple somme pondérée.

C'est là qu'entrent les {purple}fonctions d'activation{/purple}.

Une fonction d'activation prend la sortie de notre somme pondérée et lui applique une transformation non-linéaire. La plus simple et la plus utilisée aujourd'hui s'appelle **ReLU** (*Rectified Linear Unit*) :

$$
\text{ReLU}(z) = \max(0, z)
$$

![Fonction d'activation ReLU](/assets/blog/images/ia-pas-a-pas/bp1-relu.png)

En clair : si le score est positif, on le garde. S'il est négatif, on le met à zéro.

```python title="ReLU - PyTorch"
import torch
import torch.nn as nn

relu = nn.ReLU()

scores = torch.tensor([-3.0, -1.0, 0.0, 2.0, 5.0])
print(relu(scores))
# tensor([0., 0., 0., 2., 5.])
```

Ce détail en apparence anodin change tout. En empilant plusieurs couches de neurones avec des fonctions d'activation, on peut approximer n'importe quelle relation complexe entre des inputs et un output.

- [!] Sans fonction d'activation, empiler des couches linéaires ne sert à rien, le résultat reste linéaire.
- [v] Avec une fonction d'activation, chaque couche peut capturer des patterns de plus en plus abstraits.

C'est le principe fondateur des réseaux de neurones profonds et on y reviendra en détail dans les prochains articles.

# Et maintenant ?

On vient de construire quelque chose d'important.

On est parti de l'intuition la plus simple - agréger des informations pour produire une décision. On a vu comment les poids traduisent l'importance de chaque variable. On a compris ce qu'est une loss, pourquoi elle est centrale, et comment elle guide l'apprentissage. On a décortiqué le processus complet : forward, loss, backward, gradient descent, boucle. Et on a introduit l'idée que le linéaire seul a des limites.

Le fil directeur reste le même tout au long de la série :

> `ŷ = f(X)` - on cherche la meilleure fonction $f$ pour transformer des informations en décisions.

Dans le prochain article, on va directement attaquer le problème des décisions binaires. Comment répondre **oui ou non** avec nuance ? Comment transformer un score continu en une probabilité entre 0 % et 100 % ?

La réponse s'appelle la **{purple}régression logistique{/purple}**. Et elle introduit une petite fonction en forme de S qui va changer ta façon de voir les choses.

Elle s'appelle la {purple}sigmoïde{/purple}. Et une fois que tu l'auras vue, tu la retrouveras partout.

# En résumé

:::panel{tone="green" title="Ce qu'on a construit"}
Un modèle qui apprend à **peser des informations** pour produire une prédiction. Il cherche les poids $w_1, w_2, \ldots, w_n$ qui minimisent la loss - c'est-à-dire l'écart entre ses prédictions et la réalité.

$$
\hat{y} = w_1 x_1 + w_2 x_2 + \ldots + w_p x_p + b
$$
:::

:::panel{tone="blue" title="Les concepts clés"}
- [v] **Poids** : l'importance apprise de chaque variable
- [v] **Biais** : la valeur de base indépendante des entrées
- [v] **Loss** : la mesure de l'erreur - le nerf de l'apprentissage
- [v] **Gradient descent** : le mécanisme qui ajuste les poids dans la bonne direction
- [v] **Forward / Backward** : produire une prédiction, puis remonter l'erreur
- [v] **Vectorisation** : passer à l'échelle sur un dataset entier avec des matrices
:::

:::panel{tone="red" title="Les limites de ce modèle"}
- [!] Relations non-linéaires : si la réalité est plus complexe, le modèle rate
- [!] Réponses binaires : il produit un nombre, pas une décision oui/non
- [!] Sans fonction d'activation, empiler des couches ne sert à rien
:::

# Pour aller plus loin

- [Régression linéaire - scikit-learn](https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares)
- [Gradient descent visualisé](https://distill.pub/2017/momentum/)
- [StatQuest - Linear Regression](https://www.youtube.com/watch?v=nk2CQITm_eo)
- [3Blue1Brown - What is backpropagation?](https://www.youtube.com/watch?v=Ilg3gGewQ5U)
- [Neural Networks from Scratch - Sentdex](https://www.youtube.com/playlist?list=PLQVvvaa0QuDcjD5BAebMuxqi0QFAla71i)
- [FORMATION DEEP LEARNING - Machine Learnia](https://youtube.com/playlist?list=PLO_fdPEVlfKoanjvTJbIbd9V5d9Pzp8Rw&si=PZa45YYtdMouu_Fp)
