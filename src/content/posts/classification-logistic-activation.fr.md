---
slug: "classification-logistic-activation"
seriesSlug: "ia-pas-a-pas"
lang: "fr"
title: "Du score à la décision, l'activation du perceptron"
summary: "Pourquoi le perceptron simple échoue sur les problèmes binaires, comment la sigmoïde transforme un score en probabilité, pourquoi la loss doit changer, et comment tout cela s'assemble pour former un vrai neurone."
date: "2026-03-31"
tags:
  - "ai"
  - "logistic-regression"
  - "sigmoid"
  - "log-loss"
  - "perceptron"
  - "classification"
cover: "/assets/blog/images/blog6.jpg"
featured: false
---

:::panel{tone="blue" title="Outils utilisés"}
- Python 3.8+
- Jupyter Notebook
- scikit-learn
- numpy
:::

# Introduction

Dans le premier article, on a posé une idée fondamentale : un modèle d'IA, c'est une fonction qui **agrège des informations pondérées** pour produire une réponse.

On a vu comment la régression linéaire apprend des poids, minimise une erreur, et s'améliore à chaque itération via le gradient descent. On a vu que cette mécanique - forward, loss, backward, update - est le cœur de tout apprentissage automatique.

Mais on a aussi vu ses limites.

Le perceptron simple produit un nombre. Un score. C'est parfait quand la question est "combien ?". Mais beaucoup de vraies questions sont différentes :

- Ce vol va-t-il être retardé ?
- Cet email est-il du spam ?
- Cette transaction est-elle frauduleuse ?

Ces questions appellent une réponse binaire. Et pour ça, produire un score brut comme `2.4` ou `-1.1` ne suffit pas.

Dans cet article, on va voir comment transformer proprement un score en probabilité. Ce changement en apparence simple va tout modifier : la sortie du modèle, la façon de mesurer l'erreur, et la façon de calculer les gradients. Mais la logique de fond, elle, reste la même.

À la fin, on aura construit quelque chose de nouveau : un {purple}vrai neurone{/purple}.

# L'intuition : décider avec du flou

Imagine ce matin. Tu regardes par la fenêtre. Le ciel est gris, mais pas complètement couvert. Tu regardes l'heure : il est 8h, tu as une longue journée dehors. Tu te souviens que la semaine dernière, il a plu deux fois dans ces conditions.

Tu te demandes : est-ce que je prends mon parapluie ?

Tu ne cherches pas à prédire "combien il va pleuvoir". Tu veux juste savoir si oui ou non tu vas te retrouver trempé.

Ce type de décision est fondamentalement différent. Ce n'est plus une valeur continue qu'on essaie d'estimer. C'est une **classe** parmi deux possibles. Et pour y répondre proprement, on a besoin d'une probabilité (une mesure de confiance entre 0 % et 100 %) avant de trancher.

C'est exactement ce problème que la régression logistique, et plus généralement le perceptron avec activation, vient résoudre.

# Rappel : le perceptron simple

Dans le premier article, on a construit cette équation :

$$
\hat{y} = w_1 x_1 + w_2 x_2 + \ldots + w_p x_p + b
$$

Le modèle prend des entrées, les multiplie par des poids, additionne le tout avec un biais, et produit une valeur de sortie.

C'est puissant pour prédire des quantités continues. Mais appliquer directement cette sortie à un problème binaire pose un problème évident.

# Pourquoi le perceptron simple échoue ici

Suppose que tu veuilles prédire si un vol va être retardé : 1 pour oui, 0 pour non.

Ton perceptron calcule un score. Mettons qu'il produit `3.7` pour un vol à fort risque de retard, et `-1.4` pour un vol tranquille.

:::panel{tone="red" title="Le problème"}
- [!] Un score de `3.7` ne signifie rien en termes de probabilité
- [!] Un score de `-1.4` peut être interprété comme "probabilité négative" - ce qui n'a aucun sens
- [!] La sortie n'est pas bornée : elle peut aller de -∞ à +∞
- [!] On ne peut pas comparer les scores entre différents modèles ou différents problèmes
:::

Ce qu'on veut, c'est une sortie qui reste entre `0` et `1`, interprétable comme une probabilité. Pour obtenir ça, on a besoin d'un mécanisme qui compresse n'importe quel score dans cet intervalle.

# La sigmoïde - comprimer le score en probabilité

Ce mécanisme existe. C'est la **fonction sigmoïde** :

$$
\sigma(z) = \frac{1}{1 + e^{-z}}
$$

Elle prend n'importe quel nombre réel $z$ et le transforme en une valeur entre 0 et 1.

- Un score très négatif ($z \ll 0$) → $\sigma(z) \approx 0$
- Un score nul ($z = 0$) → $\sigma(z) = 0.5$
- Un score très positif ($z \gg 0$) → $\sigma(z) \approx 1$

![Courbe sigmoide transformant un score en probabilite](/assets/blog/images/ia-pas-a-pas/bp2-sigmoid.png)

:::widget{id="sigmoid-activation-playground"}
:::

Ce n'est pas un choix arbitraire. La sigmoïde a une propriété mathématique élégante : elle est exactement la fonction qui, dans le cadre d'un problème binaire, sort naturellement d'un raisonnement probabiliste rigoureux. On y reviendra quand on introduira la vraisemblance.

# Le perceptron complet

On garde la même logique d'agrégation pondérée, mais on ajoute une étape : passer le score dans la sigmoïde.

**Étape 1 : calcul du score linéaire**

$$
z = w_1 x_1 + w_2 x_2 + \ldots + w_p x_p + b
$$

**Étape 2 : activation**

$$
a = \sigma(z) = \frac{1}{1 + e^{-z}}
$$

$a$ est maintenant une probabilité. Elle représente la confiance du modèle que la réponse soit 1.

On appelle $\sigma$ une **fonction d'activation** - son rôle est de transformer la sortie linéaire brute en quelque chose d'interprétable et d'utile pour la suite.

## Ce qui change : avant et maintenant

Voici la différence entre le perceptron simple et le perceptron complet, étape par étape :

| Étape | Perceptron simple | Perceptron complet |
|-------|-------------------|-------------------|
| **Forward** | $\hat{y} = f(x)$ | $z = f(x)$, puis $a = \sigma(z)$ |
| **Sortie** | valeur continue | probabilité entre 0 et 1 |
| **Loss** | MSE | Log-loss (Binary Cross-Entropy) |
| **Gradient $\partial L / \partial w_i$** | $(\hat{y} - y) \cdot x_i$ | $(a - y) \cdot x_i$ |
| **Gradient $\partial L / \partial b$** | $\hat{y} - y$ | $a - y$ |
| **Update** | $w \leftarrow w - \alpha \cdot \nabla w$ | identique dans sa forme |

:::panel{tone="green" title="Ce qu'on retient"}
On ne jette rien. La logique d'agrégation pondérée reste entière. La boucle d'apprentissage reste la même. Ce qui change, c'est l'interprétation de la sortie et, par conséquence, la façon de mesurer l'erreur.
:::

## Pourquoi la loss doit changer ?

Dans le premier article, on utilisait la MSE pour mesurer l'erreur :

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

Cette mesure est adaptée quand on prédit des valeurs continues. Mais maintenant, notre sortie est une probabilité. Et mesurer l'erreur d'une probabilité avec une simple différence au carré n'est pas la bonne façon de raisonner.

Il y a une raison mathématique précise à ça : avec la sigmoïde, la MSE produit une fonction de coût non-convexe, remplie de minima locaux. Le gradient descent s'y perd. La log-loss, elle, reste convexe, ce qui garantit qu'on converge vers le minimum global.

Mais il y a surtout une raison conceptuelle : ce qu'on veut mesurer maintenant, c'est **à quel point le modèle est cohérent avec ce qui s'est vraiment passé**. Et pour ça, on a besoin d'un autre outil : la {green}vraisemblance{/green}.

# La vraisemblance : mesurer la cohérence du modèle

La vraisemblance, c'est une idée simple : **dans quelle mesure les prédictions du modèle sont-elles en accord avec la réalité observée ?**

> Une histoire est vraisemblable quand elle est compatible avec des faits qui se sont vraiment produits. Un modèle est vraisemblable quand ses prédictions de probabilité correspondent à ce qui a effectivement eu lieu.

Exemple simple :

- Le modèle prédit $P(y=1) = 0.8$ pour un vol
- Ce vol a effectivement été retardé ($y = 1$)
- La vraisemblance de cette prédiction est `80 %`. Le modèle était très confiant, et il avait raison

Si le modèle avait prédit $P(y=1) = 0.2$ pour ce même vol, la vraisemblance serait seulement `20 %` : il était très confiant dans la mauvaise direction.

## Généraliser à plusieurs observations

Si on a plusieurs vols, on veut mesurer la vraisemblance globale du modèle ; c'est-à-dire la probabilité que **toutes** ses prédictions soient cohérentes avec la réalité en même temps.

Quand deux événements sont indépendants, la probabilité qu'ils se produisent tous les deux est le **produit** de leurs probabilités individuelles. On fait donc le produit des vraisemblances sur tous les exemples :

$$
L = \prod_{i=1}^{n} P(y = y_i)
$$

Avec la notation générale qui couvre les deux cas ($y_i = 1$ et $y_i = 0$), en utilisant la distribution de Bernoulli :

$$
L = \prod_{i=1}^{n} a_i^{y_i} \cdot (1 - a_i)^{1 - y_i}
$$

:::panel{tone="blue" title="Lire cette formule simplement"}
- Quand $y_i = 1$ : le terme devient $a_i^1 \cdot (1-a_i)^0 = a_i$ → on utilise la probabilité que ce soit 1
- Quand $y_i = 0$ : le terme devient $a_i^0 \cdot (1-a_i)^1 = 1 - a_i$ → on utilise la probabilité que ce soit 0

En clair : pour chaque exemple, on récupère la probabilité que le modèle a attribuée à ce qui s'est vraiment passé.
:::

## Propriétés

- $L \approx 1$ → le modèle est très cohérent avec la réalité
- $L \approx 0$ → le modèle est invraisemblable

## Le problème du produit

Regardons un cas concret. Trois exemples, des prédictions plutôt correctes :

| $y$ | $a$ (prédiction) | Contribution |
|-----|-----------------|-------------|
| 1 | 0.70 | 0.70 |
| 0 | 0.20 | 0.80 |
| 1 | 0.55 | 0.55 |

Première impression : les prédictions ont l'air correctes. La vraisemblance devrait être élevée.

$$
L = 0.70 \times 0.80 \times 0.55 = 0.308
$$

:::panel{tone="red" title="Surprise"}
30 % seulement. Et on n'avait que 3 exemples avec des prédictions raisonnables.

Maintenant imagine un million d'exemples. On multiplie un million de nombres entre 0 et 1. Le résultat devient si petit que les ordinateurs ne peuvent plus le représenter - c'est ce qu'on appelle un **underflow numérique**.
:::

## Passer au logarithme

La solution est élégante : on ne travaille plus avec $L$, mais avec $\log(L)$.

Le logarithme transforme un produit en somme :

$$
\log(L) = \sum_{i=1}^{n} \left[ y_i \log(a_i) + (1 - y_i) \log(1 - a_i) \right]
$$

Ce passage au log règle les deux problèmes en même temps :
- fini les problèmes numériques - on additionne des nombres, on ne multiplie plus
- le log est une fonction croissante, donc maximiser $\log(L)$ revient exactement à maximiser $L$

## Dernier ajustement : minimiser plutôt que maximiser

On sait maximiser des fonctions. Mais tous les algorithmes d'optimisation qu'on utilise en pratique (y compris le gradient descent) sont conçus pour **minimiser**.

La solution est triviale : on prend le négatif.

$$
\text{Log-Loss} = -\sum_{i=1}^{n} \left[ y_i \log(a_i) + (1 - y_i) \log(1 - a_i) \right]
$$

C'est la **log-loss**, aussi appelée **Binary Cross-Entropy**. C'est cette quantité qu'on va chercher à minimiser. Plus elle est proche de zéro, plus le modèle est cohérent avec la réalité.

:::panel{tone="green" title="La logique complète en une phrase"}
On veut que le modèle soit le plus vraisemblable possible → on maximise la vraisemblance → on passe au log pour éviter les problèmes numériques → on prend le négatif pour pouvoir minimiser.
:::

# Backward Propagation

Dans le premier article, on avait vu la back propagation et le gradient descent dans leur forme la plus simple. Ici, on complète le tableau.

![Processus d'apprentissage forward backward update](/assets/blog/images/ia-pas-a-pas/bp2-train_process-fr.png)

Un **gradient**, c'est une dérivée. Il mesure comment la loss varie quand on change légèrement un paramètre. Si le gradient de la loss par rapport à un poids $w_i$ est positif, ça veut dire que si on augmente $w_i$, la loss augmente aussi. Donc pour faire baisser la loss, on diminue $w_i$.

C'est tout. C'est le sens de la formule d'update :

$$
w_{t+1} = w_t - \alpha \frac{\partial L}{\partial w_t}
$$

- $\alpha$ → le taux d'apprentissage : à quelle vitesse on corrige
- $\frac{\partial L}{\partial w_t}$ → la direction dans laquelle la loss monte

![Courbe convexe de la log-loss](/assets/blog/images/ia-pas-a-pas/bp2-convex_loss_function.png)

:::panel{tone="blue" title="Propriété importante"}
La log-loss combinée à la sigmoïde produit une fonction de coût **convexe** - il n'y a qu'un seul minimum. Le gradient descent ne peut pas se perdre dans un faux creux. C'est une propriété précieuse, et c'est l'une des raisons pour lesquelles cette combinaison est si utilisée.
:::

## Les nouveaux gradients

Grâce à la règle de chaîne, les gradients de la log-loss se calculent en décomposant les dépendances :

$$
\frac{\partial L}{\partial w_i} = \frac{\partial L}{\partial a} \cdot \frac{\partial a}{\partial z} \cdot \frac{\partial z}{\partial w_i}
$$

Le résultat final est remarquablement simple :

$$
\frac{\partial L}{\partial w_i} = (a - y) \cdot x_i
$$

$$
\frac{\partial L}{\partial b} = a - y
$$

La même forme qu'avant. Mais avec $a$ - la probabilité prédite - à la place de $\hat{y}$ - le score brut.

L'intuition reste identique :
- $a - y$ → *"de combien me suis-je trompé ?"*
- $x_i$ → *"dans quelle direction cette variable a-t-elle contribué à l'erreur ?"*

# Le neurone - assembler les pièces

On a maintenant tous les éléments pour introduire la notion de **neurone artificiel**.

Un neurone, ce n'est pas une idée magique. C'est une structure à trois parties :

1. **Partie linéaire** : agréger les entrées avec des poids et un biais
   $$z = w_1 x_1 + \ldots + w_p x_p + b$$

2. **Fonction d'activation** : transformer la sortie linéaire
   $$a = \sigma(z)$$

3. **Sortie** : la valeur $a$, interprétable selon le contexte

![Schema d'un neurone artificiel](/assets/blog/images/ia-pas-a-pas/bp2-artificial_neuron.png)

Un neurone, c'est une somme pondérée passée dans une fonction d'activation.

La différence entre le perceptron simple et un vrai neurone, c'est exactement cette fonction d'activation. Elle est ce qui permet d'aller au-delà du linéaire.

# Code - Régression logistique sur un cas concret

:::codegroup
```python
# =====================================
# Régression logistique - scikit-learn
# =====================================
import numpy as np
from sklearn.linear_model import LogisticRegression

# Données : météo, congestion, retard entrant, alerte technique → retardé (1) ou non (0)
np.random.seed(42)
n = 500
X = np.random.rand(n, 4)
score_latent = 4*X[:,0] + 3*X[:,1] + 2*X[:,2] + 1.5*X[:,3] - 4
proba = 1 / (1 + np.exp(-score_latent))
y = (np.random.rand(n) < proba).astype(int)

model = LogisticRegression()
model.fit(X, y)

# Lecture des poids
features = ['Météo', 'Congestion', 'Retard entrant', 'Alerte technique']
for feat, coef in zip(features, model.coef_[0]):
    print(f"  {feat:<20} → poids : {coef:+.3f}")

# Prédiction sur un nouveau vol
nouveau_vol = np.array([[0.85, 0.75, 0.90, 0.10]])
a = model.predict_proba(nouveau_vol)[0, 1]
decision = "Retardé" if a >= 0.5 else "À l'heure"
print(f"\nProbabilité de retard : {a:.1%}")
print(f"Décision              : {decision}")
```

```python
# =====================================
# Perceptron logistique from scratch - numpy
# =====================================
import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def log_loss(a, y):
    eps = 1e-15
    a = np.clip(a, eps, 1 - eps)
    return -np.mean(y * np.log(a) + (1 - y) * np.log(1 - a))

# Données simulées
np.random.seed(42)
n, p = 200, 4
X = np.random.randn(n, p)
y_true = (X @ np.array([1.5, -1.0, 2.0, 0.5]) + np.random.randn(n) * 0.5 > 0).astype(float)

# Initialisation
w = np.zeros(p)
b = 0.0
alpha = 0.05

# Boucle d'apprentissage
for epoch in range(300):
    # Forward
    z = X @ w + b
    a = sigmoid(z)

    # Loss
    loss = log_loss(a, y_true)

    # Gradients
    dw = (1/n) * X.T @ (a - y_true)
    db = (1/n) * np.sum(a - y_true)

    # Update
    w -= alpha * dw
    b -= alpha * db

    if epoch % 100 == 0:
        acc = np.mean((a >= 0.5) == y_true)
        print(f"Epoch {epoch:>3} | Loss : {loss:.4f} | Accuracy : {acc:.2%}")
```
:::

# Généraliser les activations

La sigmoïde est parfaite pour les problèmes à deux classes. Mais la réalité est souvent plus riche.

**Softmax**, pour la classification multiclasse :

$$
\text{softmax}(z_k) = \frac{e^{z_k}}{\sum_j e^{z_j}}
$$

Elle transforme un vecteur de scores en un vecteur de probabilités qui somme à 1. "Est-ce que ce vol va être retardé de moins de 15 min, de 15 à 60 min, ou de plus d'une heure ?" - trois classes, softmax.

**ReLU**, pour les couches cachées des réseaux profonds :

$$
\text{ReLU}(z) = \max(0, z)
$$

**GELU, SiLU, etc...**, des variantes plus récentes, utilisées dans les transformers et les LLMs, qui apportent de légères nuances mathématiques mais suivent la même logique : transformer une sortie linéaire en quelque chose de non-linéaire.

# Les limites du perceptron : pourquoi une seule couche ne suffit pas ?

Un perceptron, même complet avec son activation, reste fondamentalement un **modèle à une couche**. Il trace une seule frontière de décision dans l'espace des données.

Pour des problèmes simples, c'est suffisant. Mais dès que les relations entre les variables deviennent complexes - quand une décision dépend d'interactions non-linéaires entre plusieurs signaux - un seul neurone ne peut pas les capturer.

:::panel{tone="red" title="La limite fondamentale"}
- [!] Un perceptron simple ne peut tracer qu'une **frontière linéaire** de décision
- [!] Il ne peut pas apprendre des relations du type "si X1 est élevé ET X2 est faible, alors oui - mais si les deux sont élevés, alors non"
- [!] Il ne peut pas résoudre des problèmes non-linéairement séparables
:::

La solution naturelle est de ne plus se limiter à un seul neurone, mais d'en assembler plusieurs en couches. Chaque couche apprend des représentations de plus en plus abstraites des données. C'est exactement ce que fait un **réseau de neurones multicouches**, ou **Multilayer Perceptron (MLP)**.

# Et maintenant ?

On vient de construire quelque chose de solide.

On sait maintenant pourquoi un score brut ne suffit pas pour des problèmes binaires. On comprend pourquoi et comment la sigmoïde transforme ce score en probabilité. On a vu que ce changement implique de repenser la loss, de passer par la vraisemblance, puis par la log-loss. On a vu que le gradient descent garde la même structure, mais s'adapte à ce nouveau cadre. Et on a assemblé toutes ces pièces pour comprendre ce qu'est vraiment un **neurone artificiel**.

Le fil directeur de la série reste le même :

> `ŷ = f(X)` - on cherche la meilleure fonction $f$ pour transformer des informations en décisions.

Mais on a vu aujourd'hui que cette fonction peut, et doit parfois, faire plus qu'une simple somme pondérée. Elle peut introduire de la non-linéarité. Et c'est cette non-linéarité qui va nous permettre, dans le prochain article, d'assembler des neurones en couches pour capturer des patterns que ni la régression linéaire ni le perceptron simple ne peuvent voir.

Dans le prochain article, on passe au **Multilayer Perceptron**, et on commence à comprendre pourquoi les réseaux de neurones profonds peuvent approximer des fonctions arbitrairement complexes.

# En résumé

:::panel{tone="green" title="Ce qu'on a construit"}
Un neurone complet : somme pondérée + biais + activation sigmoïde + log-loss.

$$
z = w_1 x_1 + \ldots + w_p x_p + b \qquad a = \sigma(z)
$$
:::

:::panel{tone="blue" title="Les concepts clés"}
- [v] **Sigmoïde** : compresse tout score en une probabilité entre 0 et 1
- [v] **Vraisemblance** : mesure à quel point le modèle est cohérent avec la réalité
- [v] **Log-loss** : la fonction de coût adaptée aux problèmes binaires
- [v] **Gradient descent complet** : même structure, nouveaux gradients
- [v] **Neurone** : somme pondérée + activation - la brique élémentaire de tout réseau
:::

:::panel{tone="red" title="Les limites"}
- [!] Une seule couche trace une seule frontière - linéaire
- [!] Insuffisant pour les problèmes avec des interactions complexes entre variables
- [!] La puissance réelle vient de l'empilement de plusieurs couches
:::

# Pour aller plus loin

- [Régression logistique - scikit-learn](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- [Binary Cross-Entropy expliquée - Towards Data Science](https://towardsdatascience.com/understanding-binary-cross-entropy-log-loss-a-visual-explanation-a3ac6025181a)
- [StatQuest - Logistic Regression](https://www.youtube.com/watch?v=yIYKR4sgzI8)
- [3Blue1Brown - Neural Networks](https://www.youtube.com/watch?v=aircAruvnKk)
- [Google ML Crash Course - Logistic Regression](https://developers.google.com/machine-learning/crash-course/logistic-regression)
- [FORMATION DEEP LEARNING - Machine Learnia](https://youtube.com/playlist?list=PLO_fdPEVlfKoanjvTJbIbd9V5d9Pzp8Rw&si=PZa45YYtdMouu_Fp)
