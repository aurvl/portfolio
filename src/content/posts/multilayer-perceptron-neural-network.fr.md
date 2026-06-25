---
slug: "multilayer-perceptron-neural-network"
seriesSlug: "ia-pas-a-pas"
lang: "fr"
title: "Empiler pour comprendre - du neurone au réseau"
summary: "Pourquoi un neurone seul ne suffit pas, comment on passe au multilayer perceptron, ce qui change dans la structure, le forward et le backward - et pourquoi tout ça s'appelle finalement un réseau de neurones."
date: "2026-04-07"
tags:
  - "ai"
  - "neural-network"
  - "mlp"
  - "backpropagation"
  - "deep-learning"
cover: "/assets/blog/images/blog6.jpg"
featured: false
---

:::panel{tone="blue" title="Outils utilisés"}
- Python 3.8+
- Jupyter Notebook
- numpy
- PyTorch
- R
:::

# Introduction

Dans les deux premiers articles, on a construit quelque chose de solide.

On a vu qu'un modèle, à la base, c'est une machine à agréger des informations. On lui donne des entrées, elle leur attribue des poids, les additionne avec un biais, et produit une valeur de sortie. On a vu comment introduire une fonction d'activation - la sigmoïde - pour transformer ce score en probabilité. Et on a vu comment cette mécanique apprend : forward, loss, backward, gradient descent, update. En boucle.

Le résultat de tout ça s'appelle un **neurone artificiel**. Une brique. Un perceptron.

Et un perceptron, ça marche très bien sur des problèmes simples. Quand les données sont bien séparables, quand les relations entre les entrées et la sortie sont relativement directes, un seul neurone suffit.

Mais la réalité, elle, est rarement aussi coopérative.

Dans la vraie vie, les données sont emmêlées. Les relations sont croisées. Une variable peut avoir un effet positif dans certaines conditions et négatif dans d'autres. Un seul neurone ne peut pas capturer ce genre de nuance - et on va voir pourquoi.

La solution est naturelle : au lieu d'utiliser un seul neurone, on en empile plusieurs. En couches. Et c'est exactement ce que fait un **multilayer perceptron** - ou MLP.

# Le neurone seul : rappel et limites

Un neurone artificiel prend plusieurs entrées $x_1, x_2, \ldots, x_p$, les agrège avec des poids, passe le résultat dans une activation, et produit une sortie.

$$
z = w_1 x_1 + w_2 x_2 + \ldots + w_p x_p + b \qquad a = \sigma(z)
$$

C'est puissant. Mais ça a une contrainte fondamentale.

Un neurone avec une activation sigmoïde trace une **frontière de décision linéaire** dans l'espace des données. Concrètement : il peut séparer "deux groupes" en dessinant une droite (ou un hyperplan, en plus de dimensions). Si les données de classe 1 sont d'un côté et les données de classe 0 de l'autre, le neurone s'en sort.

:::panel{tone="red" title="La limite fondamentale"}
- [!] Un seul neurone ne peut tracer qu'une **seule frontière linéaire**
- [!] Il ne peut pas capturer des interactions complexes entre variables
- [!] Il échoue dès que les données ne sont pas linéairement séparables
- [!] Il ne peut pas apprendre des représentations intermédiaires des données
:::

Imagine deux classes courbes qui s'imbriquent l'une dans l'autre. Aucune droite ne peut les séparer correctement. Même le neurone avec activation construit dans l'article précédent essaie, rate, et converge vers une solution médiocre quelle que soit sa configuration.

Pour résoudre ce type de problème, il faut une frontière de décision **courbe, complexe, adaptée**. Et pour construire une telle frontière, il faut plusieurs couches de neurones.

# Le Multilayer Perceptron

## Définition

Un **multilayer perceptron** est un réseau de neurones organisé en couches successives :

- une **couche d'entrée** qui reçoit les données brutes
- une ou plusieurs **couches cachées** qui apprennent des représentations intermédiaires
- une **couche de sortie** qui produit la décision finale

![Schema d'un multilayer perceptron](/assets/blog/images/ia-pas-a-pas/bp3-mlp.png)

Chaque couche est constituée de plusieurs neurones. Chaque neurone d'une couche reçoit en entrée toutes les sorties de la couche précédente. Et chaque couche produit ses propres sorties, transmises à la couche suivante.

## Pourquoi empiler des couches ?

L'intuition est belle.

Imagine que tu apprends à reconnaître un visage humain dans une image. Tu ne le fais pas en une seule étape. D'abord, tu détectes des contrastes - des bords, des lignes. Ensuite, tu assembles ces bords en formes - un nez, une bouche, des yeux. Enfin, tu assembles ces formes en une face reconnaissable.

Un réseau de neurones profond fait exactement ça. La première couche cachée apprend des patterns simples, locaux. La deuxième les compose en patterns plus abstraits. La troisième encore plus. Et ainsi de suite jusqu'à la couche de sortie, qui produit la décision finale à partir de tout ce qui a été construit en dessous.

:::panel{tone="blue" title="L'analogie du cerveau"}
Le cortex visuel humain fonctionne de façon similaire. Les neurones du premier niveau répondent à des orientations simples de lumière. Les suivants combinent ces signaux en formes. Les suivants encore en objets reconnaissables. Ce n'est pas une coïncidence : les réseaux de neurones artificiels s'inspirent directement de cette architecture biologique - même si la ressemblance reste partielle et très stylisée.
:::

Pour observer ce passage couche par couche sur des données réelles, le projet autonome suivant utilise les sept derniers jours de météo à Paris et fait circuler `51` entrées dans un MLP pour estimer la probabilité de pluie du lendemain.

:::widget{id="paris-rain-mlp"}
:::

## Ce qui change : structure, forward, backward

**La structure** : au lieu d'un seul ensemble de poids, on a maintenant un ensemble de poids par couche. Chaque couche a ses propres paramètres $W_l$ et $b_l$, qu'elle ajuste indépendamment pendant l'apprentissage.

**Le forward** : les données traversent le réseau couche par couche. La sortie d'une couche devient l'entrée de la suivante. À chaque couche, on calcule une somme pondérée, puis on applique une activation.

**Le backward** : la propagation de l'erreur remonte dans l'autre sens. On calcule d'abord le gradient sur la dernière couche, puis on le propage vers les couches précédentes, en utilisant la règle de chaîne à chaque étape. C'est plus long à dérouler - mais la logique reste la même qu'avec un neurone seul.

# Un problème qu'un neurone isolé ne peut pas résoudre

Prenons un exemple concret. Ce dataset contient **deux classes courbes imbriquées**, proches de deux croissants qui s'enroulent l'un autour de l'autre dans l'espace 2D. Elles ne sont pas linéairement séparables.

![Frontière de décision linéaire d'un neurone logistique sur deux classes courbes imbriquées](/assets/blog/images/ia-pas-a-pas/bp3-single-neuron-decision-boundary.png)

Le modèle représenté ici est le **neurone complet du deuxième article** :

$$
a = \sigma(WX + b)
$$

Le fond bleu et rouge représente ses probabilités, et la ligne blanche correspond au seuil $a = 0{,}5$. La sigmoïde transforme bien le score en probabilité, mais elle ne courbe pas cette frontière : comme elle est monotone, $a = 0{,}5$ équivaut toujours à $WX + b = 0$, donc à une droite en 2D.

:::panel{tone="blue" title="Clarification de vocabulaire"}
Dans le premier article, le **perceptron simple** désignait l'agrégateur linéaire sans activation, équivalent à une régression linéaire. Dans le deuxième, le **neurone complet** ajoute la sigmoïde pour produire une probabilité. Leurs sorties diffèrent, mais un neurone isolé conserve dans les deux cas une géométrie linéaire. C'est cette limite commune que l'on étudie ici.
:::

**Le MLP**, grâce à ses couches cachées et à la composition de plusieurs activations, peut apprendre une frontière de décision courbée et complexe qui suit la forme des deux classes.

![Frontière de décision non linéaire apprise par un MLP sur les deux mêmes classes](/assets/blog/images/ia-pas-a-pas/bp3-mlp-decision-boundary.png)

La différence n'est pas dans les données. Ce sont les mêmes. La différence est dans la **capacité expressive** du modèle - sa capacité à représenter des relations non-linéaires complexes.

:::panel{tone="green" title="Pourquoi ça marche ?"}
Chaque couche cachée transforme l'espace des données. Elle le déforme, l'étire, le projette dans un nouvel espace où les classes deviennent plus séparables. La couche suivante travaille dans cet espace transformé, et ainsi de suite. En empilant les couches, on construit une série de transformations qui finissent par rendre les données linéairement séparables - et la couche de sortie n'a plus qu'à tracer cette dernière frontière simple.
:::

# Formulation mathématique

## Avant : le neurone simple

$$
Z = X \cdot W + b
$$

Avec un dataset de $n$ observations et $p$ features, et un seul neurone :

$$
X = \begin{bmatrix} x_1^{(1)} & x_2^{(1)} & \cdots & x_p^{(1)} \\ x_1^{(2)} & x_2^{(2)} & \cdots & x_p^{(2)} \\ \vdots & \vdots & \ddots & \vdots \\ x_1^{(n)} & x_2^{(n)} & \cdots & x_p^{(n)} \end{bmatrix}, \quad W = \begin{bmatrix} w_1 \\ w_2 \\ \vdots \\ w_p \end{bmatrix}
$$

Le résultat $Z$ est un vecteur de $n$ scores, un par observation.

## Maintenant : généralisation au MLP

Dans un MLP, chaque couche $l$ a $m_l$ neurones. Chaque neurone de la couche $l$ reçoit toutes les sorties de la couche précédente.

La formule se généralise naturellement :

$$
Z_l = A_{l-1} \cdot W_l + b_l
$$

$$
A_l = \text{activation}(Z_l)
$$

Où :

- $A_{l-1}$ → la sortie (activations) de la couche précédente, de taille $(n \times m_{l-1})$
- $W_l$ → la matrice de poids de la couche $l$, de taille $(m_{l-1} \times m_l)$
- $b_l$ → le vecteur de biais de la couche $l$, de taille $(1 \times m_l)$
- $Z_l$ → les scores pré-activation de la couche $l$, de taille $(n \times m_l)$
- $A_l$ → les activations de la couche $l$, de taille $(n \times m_l)$

En forme développée, la matrice de poids pour une couche qui reçoit $p$ entrées et produit $m$ sorties :

$$
W_l = \begin{bmatrix} w_{11}^l & w_{12}^l & \cdots & w_{1m}^l \\ w_{21}^l & w_{22}^l & \cdots & w_{2m}^l \\ \vdots & \vdots & \ddots & \vdots \\ w_{p1}^l & w_{p2}^l & \cdots & w_{pm}^l \end{bmatrix}
$$

Et pour chaque couche $l$ dans le réseau :

$$
Z_l = A_{l-1} \cdot W_l + b_l \qquad A_l = \text{activation}(Z_l)
$$

:::panel{tone="blue" title="Comment lire ces formules"}
- $l$ est l'indice de la couche - couche 1, couche 2, couche 3...
- $m$ est le nombre de neurones dans cette couche
- On répète les mêmes deux opérations pour chaque couche : multiplication matricielle + activation
- La sortie de la dernière couche est la prédiction $\hat{y}$
:::

La beauté de cette notation, c'est sa régularité. Quel que soit le nombre de couches, la logique reste la même. On enchaîne des transformations linéaires et des activations, couche après couche.

---

On vient de décrire quelque chose d'important. Ce réseau de couches empilées, chacune avec ses propres poids, ses propres biais, sa propre activation - c'est ce qu'on appelle un **réseau de neurones**, ou **neural network**.

Ce terme recouvre aujourd'hui une famille d'architectures très larges. Mais à la base, tous reposent sur cette même idée : empiler des transformations paramétrées et les apprendre par gradient descent.

# Entraîner un neural network

## Le contexte

Prenons un exemple simple pour ancrer le backward multicouche.

Un réseau de classification binaire avec :
- 2 entrées : $x_1$, $x_2$
- 1 couche cachée avec 3 neurones
- 1 couche de sortie avec 1 neurone

![Schema d'un multilayer perceptron pour le backward](/assets/blog/images/ia-pas-a-pas/bp3-mlp.png)

**Forward :**

$$
Z_1 = X \cdot W_1 + b_1 \qquad A_1 = \text{ReLU}(Z_1)
$$

$$
Z_2 = A_1 \cdot W_2 + b_2 \qquad A_2 = \sigma(Z_2)
$$

La sortie $A_2$ est la probabilité prédite.

## La loss

Pour un problème de classification binaire, on utilise la log-loss vue dans le billet précédent :

$$
L = -\frac{1}{n} \sum_{i=1}^{n} \left[ y^{(i)} \log(A_2^{(i)}) + (1 - y^{(i)}) \log(1 - A_2^{(i)}) \right]
$$

## Le backward, propager l'erreur couche par couche

C'est ici que le MLP introduit quelque chose de nouveau. Avec un seul neurone, le gradient se calculait en une étape. Avec plusieurs couches, il faut le propager en remontant, couche par couche, en utilisant la règle de chaîne.

L'intuition reste la même qu'avant :
- *"de combien me suis-je trompé ?"* → la loss le dit
- *"quelle couche a contribué à cette erreur ?"* → le gradient le dit
- *"comment corriger ?"* → l'update le fait

**Gradients sur la couche de sortie (couche 2) :**

On définit d'abord l'erreur à la sortie :

$$
dZ_2 = A_2 - y
$$

Ce terme mesure simplement l'écart entre la prédiction et la réalité - exactement comme avant.

$$
\frac{\partial L}{\partial W_2} = \frac{1}{n} A_1^T \cdot dZ_2 \qquad \frac{\partial L}{\partial b_2} = \frac{1}{n} \sum dZ_2
$$

**Gradients sur la couche cachée (couche 1) :**

L'erreur se propage maintenant vers la couche précédente. On calcule d'abord l'erreur qui "remonte" à travers les poids de la couche 2 :

$$
dZ_1 = (dZ_2 \cdot W_2^T) \odot \text{ReLU}'(Z_1)
$$

Le terme $\text{ReLU}'(Z_1)$ est la dérivée de l'activation - il indique à quel point chaque neurone de la couche cachée a "transmis" l'information au forward. Le symbole $\odot$ est une multiplication élément par élément.

$$
\frac{\partial L}{\partial W_1} = \frac{1}{n} X^T \cdot dZ_1 \qquad \frac{\partial L}{\partial b_1} = \frac{1}{n} \sum dZ_1
$$

:::panel{tone="blue" title="L'intuition du backward multicouche"}
Imagine que tu travailles en équipe. Un problème survient en bout de chaîne - le résultat final est mauvais. Pour le corriger, tu dois remonter : qui a transmis quoi à qui ? La dernière personne de la chaîne reçoit l'erreur en premier. Elle la transmet à celle d'avant, pondérée par sa propre contribution. Et ainsi de suite jusqu'au début.

C'est exactement ce que fait la backpropagation : elle distribue la responsabilité de l'erreur à chaque couche, proportionnellement à ce qu'elle a contribué au forward.
:::

## La mise à jour - toujours la même forme

$$
W_l \leftarrow W_l - \alpha \frac{\partial L}{\partial W_l} \qquad b_l \leftarrow b_l - \alpha \frac{\partial L}{\partial b_l}
$$

Quelle que soit la profondeur du réseau, quelle que soit la complexité du backward, la mise à jour garde la même structure. On soustrait le gradient multiplié par le taux d'apprentissage. C'est la régularité du gradient descent.

## Code

Les scripts Python et R pour cet exemple sont disponibles dans le dépôt de la série :

:::codegroup
```python
import torch
import torch.nn as nn

# ============================================================
# 1) Définir une classe MLP
# ============================================================
# Une classe permet de regrouper :
# - les couches du modèle
# - la logique de calcul du forward
#
# Ici on crée un petit MLP pour une classification binaire.
class MLP(nn.Module):
    def __init__(self, input_dim, hidden_dims, output_dim=1):
        """
        input_dim   : nombre de features d'entrée
        hidden_dims : liste contenant le nombre de neurones
                      dans chaque couche cachée
        output_dim  : dimension de sortie (1 pour binaire)
        """
        super().__init__()

        # On prépare une liste vide pour construire les blocs du réseau
        layers = []

        # La première couche part de input_dim
        current_dim = input_dim

        # On ajoute chaque couche cachée
        for h in hidden_dims:
            # Couche linéaire
            layers.append(nn.Linear(current_dim, h))

            # Activation non linéaire
            layers.append(nn.ReLU())

            # La sortie de cette couche devient l'entrée de la suivante
            current_dim = h

        # Couche de sortie finale
        layers.append(nn.Linear(current_dim, output_dim))

        # Sigmoid finale pour une classification binaire
        layers.append(nn.Sigmoid())

        # nn.Sequential assemble tous les blocs dans l'ordre
        self.network = nn.Sequential(*layers)

    def forward(self, x):
        # Le forward délègue simplement le calcul à self.network
        return self.network(x)

# ============================================================
# 2) Créer une instance du modèle
# ============================================================
model = MLP(input_dim=2, hidden_dims=[32, 16, 16], output_dim=1)

print(model)

# ============================================================
# 3) Tester le modèle sur un batch
# ============================================================
y_hat = model(X)

print("\nSortie du MLP :")
print(y_hat[:5])
print("Shape :", y_hat.shape)
```

```python
from sklearn.metrics import accuracy_score
from tqdm import tqdm
# ============================================================
# Modèle
# ============================================================
print(model)

# ============================================================
# Loss et optimizer
# ============================================================
criterion = nn.BCELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.001)

# ============================================================
# 4) Boucle d'entraînement
# ============================================================
epochs = 30000
loss_history = []
accuracy_history = []

for epoch in tqdm(range(epochs)):

    # --------------------------------------------------------
    # a) Forward
    # --------------------------------------------------------
    # Le modèle produit une prédiction
    y_hat = model(X_tensor)

    # --------------------------------------------------------
    # b) Loss
    # --------------------------------------------------------
    # On compare la prédiction à la vérité terrain
    loss = criterion(y_hat, y_tensor)
    preds = (y_hat.detach().cpu().numpy().ravel() >= 0.5).astype(int)
    targets = y_tensor.detach().cpu().numpy().ravel().astype(int)
    acc = accuracy_score(targets, preds)

    # --------------------------------------------------------
    # c) Zero gradients
    # --------------------------------------------------------
    # Très important :
    # PyTorch accumule les gradients d'une itération à l'autre,
    # donc on doit les remettre à zéro avant backward().
    optimizer.zero_grad()

    # --------------------------------------------------------
    # d) Backward
    # --------------------------------------------------------
    # PyTorch calcule automatiquement tous les gradients
    loss.backward()

    # --------------------------------------------------------
    # e) Update
    # --------------------------------------------------------
    # L'optimizer met à jour les paramètres
    optimizer.step()

    # --------------------------------------------------------
    # f) Suivi
    # --------------------------------------------------------
    loss_history.append(loss.item())
    accuracy_history.append(acc)

    # if epoch % 20 == 0:
    #     # Transformer la probabilité en classe binaire
    #     preds = (y_hat >= 0.5).float()

    #     print(f"Epoch {epoch:03d} | Loss = {loss.item():.4f} | Accuracy = {acc.item():.4f}")

# ============================================================
# 5) Résultat final
# ============================================================
print("\nDernière loss :", loss_history[-1])
```
:::

Le dataset utilisé dans les exemples est disponible dans le dépôt à l'adresse indiquée dans les scripts.

# Ce à quoi il faut faire attention

Un neural network peut être très puissant. Mais cette puissance s'accompagne de nouvelles responsabilités. Quelques points critiques à ne pas négliger.

## Les données - quantité et qualité

Un réseau de neurones a beaucoup de paramètres à apprendre. Beaucoup de poids, beaucoup de biais, répartis sur plusieurs couches. Pour les apprendre correctement, il a besoin de **beaucoup d'exemples**.

:::panel{tone="blue" title="L'analogie de l'apprentissage humain"}
Un enfant apprend à reconnaître un chat après en avoir vu des dizaines, puis des centaines, dans des contextes variés. Montrez-lui un seul chat - il reconnaîtra peut-être ce chat précis, mais généralisera mal. Un réseau de neurones, c'est pareil : plus il voit d'exemples variés, plus il généralise bien.
:::

- [v] Plus de données → meilleure généralisation
- [v] Données variées → meilleure robustesse
- [!] Données insuffisantes → le modèle mémorise les exemples sans généraliser (overfitting)
- [!] Données de mauvaise qualité → le modèle apprend les mauvais patterns

## Le preprocessing

Avant de donner les données à un réseau, il faut les préparer. Des features à des échelles très différentes (une en milliers, une autre en centièmes) perturbent l'apprentissage. La normalisation - centrer et réduire les données - est presque toujours indispensable.

- [v] Normaliser les features entre 0 et 1, ou autour de 0 avec un écart-type de 1
- [v] Traiter les valeurs manquantes avant l'entraînement
- [!] Ne jamais normaliser en utilisant les statistiques des données de test - seulement celles d'entraînement

## Les hyperparamètres

Un réseau de neurones comporte plusieurs choix qu'on ne peut pas apprendre automatiquement - ce sont les **hyperparamètres**. Les principaux :

| Hyperparamètre | Rôle | Effets si mal choisi |
|---------------|------|---------------------|
| **Learning rate** ($\alpha$) | Vitesse d'update des poids | Trop grand → divergence / trop petit → apprentissage très lent |
| **Nombre de couches** | Profondeur du réseau | Trop peu → underfitting / trop → overfitting |
| **Nombre de neurones** | Largeur de chaque couche | Trop peu → capacité insuffisante / trop → surapprentissage |
| **Nombre d'epochs** | Durée d'entraînement | Trop peu → modèle pas convergé / trop → overfitting |
| **Fonction d'activation** | Transformation à chaque couche | Mauvais choix → gradients qui disparaissent ou explosent |

Trouver les bons hyperparamètres est souvent la partie la plus fastidieuse de l'entraînement. Des techniques comme la **grid search**, le **random search**, ou les **frameworks d'optimisation bayésienne** automatisent une partie de ce travail. Un exemple de recherche d'hyperparamètres optimaux est disponible dans le dépôt.

## Spécialisation, quand l'architecture s'adapte au problème

Le MLP est un réseau général. Puissant, mais généraliste. Dans certains domaines, on peut faire beaucoup mieux en adaptant l'architecture au **type de données** qu'on manipule.

# Et maintenant ?

On vient de franchir une étape importante.

On est parti d'un neurone - une somme pondérée + une activation. On a montré ses limites. On a introduit l'idée d'empiler plusieurs neurones en couches. On a vu ce que ça change dans la structure, le forward, et le backward. Et on a vu pourquoi cette architecture peut résoudre des problèmes qu'un neurone seul ne peut pas.

Le fil directeur de la série reste inchangé :

> `ŷ = f(X)` - on cherche la meilleure fonction $f$ pour transformer des informations en décisions.

Mais cette fonction est maintenant beaucoup plus riche. Ce n'est plus une simple somme pondérée. C'est une composition de transformations, couche après couche, chacune apprenant une représentation de plus en plus abstraite des données.

Dans les prochains articles, on va explorer comment cette idée se spécialise davantage :
- les **CNN** pour comprendre les images
- les **RNN** pour comprendre les séquences

# Conclusion

On est passé du neurone au réseau.

Un seul neurone trace une frontière linéaire. Plusieurs neurones en couches tracent des frontières arbitrairement complexes. C'est cette expressivité supplémentaire qui rend les réseaux de neurones si puissants - et c'est ce qui a permis les avancées spectaculaires des dix dernières années en vision, en langage, en décision automatique.

Mais cette puissance a un prix. Plus le réseau est profond, plus il y a de paramètres à apprendre. Plus il y a de paramètres, plus on a besoin de données, de preprocessing soigné, de choix d'hyperparamètres éclairés. Et plus il est difficile de comprendre ce que le modèle a vraiment appris.

C'est le paradoxe du deep learning : des modèles plus expressifs, mais aussi plus opaques. On verra comment gérer cette opacité - et comment des architectures spécialisées ont su tirer le meilleur de cette profondeur.

# Pour aller plus loin

- [Neural Networks from Scratch - Sentdex](https://www.youtube.com/playlist?list=PLQVvvaa0QuDcjD5BAebMuxqi0QFAla71i)
- [3Blue1Brown - But what is a Neural Network?](https://www.youtube.com/watch?v=aircAruvnKk)
- [Backpropagation calculus - 3Blue1Brown](https://www.youtube.com/watch?v=tIeHLnjs5U8)
- [PyTorch - Building Neural Networks](https://pytorch.org/tutorials/beginner/blitz/neural_networks_tutorial.html)
- [Deep Learning - Goodfellow, Bengio, Courville](https://www.deeplearningbook.org/)
- [FastAI Practical Deep Learning](https://course.fast.ai/)
