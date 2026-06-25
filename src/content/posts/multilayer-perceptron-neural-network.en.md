---
slug: "multilayer-perceptron-neural-network"
seriesSlug: "ia-pas-a-pas"
lang: "en"
title: "Stacking to Understand - From Neuron to Network"
summary: "Why a single neuron is not enough, how we move to the multilayer perceptron, what changes in the structure, forward pass, and backward pass - and why all of this is ultimately called a neural network."
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

:::panel{tone="blue" title="Tools used"}
- Python 3.8+
- Jupyter Notebook
- numpy
- PyTorch
- R
:::

# Introduction

In the first two articles, we built something solid.

We saw that, at its core, a model is a machine that aggregates information. We give it inputs, it assigns weights to them, adds them with a bias, and produces an output value. We saw how to introduce an activation function - the sigmoid - to transform that score into a probability. And we saw how this mechanism learns: forward, loss, backward, gradient descent, update. In a loop.

The result of all that is called an **artificial neuron**. A brick. A perceptron.

And a perceptron works very well on simple problems. When the data is well separated, when the relationships between inputs and output are relatively direct, one neuron is enough.

But reality is rarely that cooperative.

In real life, data is tangled. Relationships cross each other. A variable can have a positive effect in some conditions and a negative effect in others. A single neuron cannot capture this kind of nuance - and we will see why.

The solution is natural: instead of using a single neuron, we stack several of them. In layers. And that is exactly what a **multilayer perceptron** - or MLP - does.

# The Single Neuron: Reminder and Limits

An artificial neuron takes several inputs $x_1, x_2, \ldots, x_p$, aggregates them with weights, passes the result through an activation, and produces an output.

$$
z = w_1 x_1 + w_2 x_2 + \ldots + w_p x_p + b \qquad a = \sigma(z)
$$

It is powerful. But it has a fundamental constraint.

A neuron with a sigmoid activation draws a **linear decision boundary** in the data space. Concretely: it can separate "two groups" by drawing a line (or a hyperplane, in more dimensions). If class 1 data points are on one side and class 0 data points are on the other, the neuron succeeds.

:::panel{tone="red" title="The fundamental limit"}
- [!] A single neuron can only draw **one linear boundary**
- [!] It cannot capture complex interactions between variables
- [!] It fails as soon as the data is not linearly separable
- [!] It cannot learn intermediate representations of the data
:::

Imagine two curved classes intertwined with each other. No straight line can separate them correctly. Even the activated neuron built in the previous article tries, fails, and converges toward a mediocre solution whatever its configuration.

To solve this type of problem, we need a **curved, complex, adaptive** decision boundary. And to build such a boundary, we need several layers of neurons.

# The Multilayer Perceptron

## Definition

A **multilayer perceptron** is a neural network organized into successive layers:

- an **input layer** that receives the raw data
- one or more **hidden layers** that learn intermediate representations
- an **output layer** that produces the final decision

![Diagram of a multilayer perceptron](/assets/blog/images/ia-pas-a-pas/bp3-mlp.png)

Each layer is made of several neurons. Each neuron in a layer receives as input all outputs from the previous layer. And each layer produces its own outputs, passed to the next layer.

## Why Stack Layers?

The intuition is beautiful.

Imagine you are learning to recognize a human face in an image. You do not do it in one step. First, you detect contrasts - edges, lines. Then you assemble those edges into shapes - a nose, a mouth, eyes. Finally, you assemble those shapes into a recognizable face.

A deep neural network does exactly that. The first hidden layer learns simple, local patterns. The second composes them into more abstract patterns. The third even more. And so on until the output layer, which produces the final decision from everything that was built underneath.

:::panel{tone="blue" title="The brain analogy"}
The human visual cortex works in a similar way. First-level neurons respond to simple light orientations. The next ones combine these signals into shapes. The next ones into recognizable objects. This is not a coincidence: artificial neural networks are directly inspired by this biological architecture - even if the resemblance remains partial and highly stylized.
:::

To observe this layer-by-layer flow on real data, the following standalone project uses the latest seven days of Paris weather and passes `51` inputs through an MLP to estimate the probability of rain the next day.

:::widget{id="paris-rain-mlp"}
:::

## What Changes: Structure, Forward, Backward

**The structure**: instead of one set of weights, we now have one set of weights per layer. Each layer has its own parameters $W_l$ and $b_l$, which it adjusts independently during learning.

**The forward pass**: data travels through the network layer by layer. The output of one layer becomes the input of the next. At each layer, we compute a weighted sum, then apply an activation.

**The backward pass**: error propagation moves in the opposite direction. We first compute the gradient on the last layer, then propagate it back toward previous layers, using the chain rule at every step. It takes longer to unfold - but the logic remains the same as with a single neuron.

# A Problem a Single Neuron Cannot Solve

Let us take a concrete example. This dataset contains **two intertwined curved classes**, similar to two crescents winding around each other in 2D space. They are not linearly separable.

![Linear decision boundary of a logistic neuron on two intertwined curved classes](/assets/blog/images/ia-pas-a-pas/bp3-single-neuron-decision-boundary.png)

The model shown here is the **complete neuron from the second article**:

$$
a = \sigma(WX + b)
$$

The blue and red background represents its probabilities, while the white line is the $a = 0.5$ threshold. The sigmoid does transform the score into a probability, but it does not curve this boundary: because it is monotonic, $a = 0.5$ is still equivalent to $WX + b = 0$, which is a straight line in 2D.

:::panel{tone="blue" title="Terminology clarification"}
In the first article, the **simple perceptron** referred to the linear aggregator without an activation, equivalent to linear regression. In the second, the **complete neuron** adds the sigmoid to produce a probability. Their outputs differ, but a single neuron retains linear geometry in both cases. That shared limitation is what we study here.
:::

**The MLP**, through its hidden layers and the composition of several activations, can learn a curved, complex decision boundary that follows the shape of both classes.

![Non-linear decision boundary learned by an MLP on the same two classes](/assets/blog/images/ia-pas-a-pas/bp3-mlp-decision-boundary.png)

The difference is not in the data. The data is the same. The difference is in the model's **expressive capacity** - its ability to represent complex non-linear relationships.

:::panel{tone="green" title="Why does it work?"}
Each hidden layer transforms the data space. It bends it, stretches it, projects it into a new space where classes become more separable. The next layer works in that transformed space, and so on. By stacking layers, we build a series of transformations that eventually make the data linearly separable - and the output layer only has to draw that last simple boundary.
:::

# Mathematical Formulation

## Before: The Simple Neuron

$$
Z = X \cdot W + b
$$

With a dataset of $n$ observations and $p$ features, and one single neuron:

$$
X = \begin{bmatrix} x_1^{(1)} & x_2^{(1)} & \cdots & x_p^{(1)} \\ x_1^{(2)} & x_2^{(2)} & \cdots & x_p^{(2)} \\ \vdots & \vdots & \ddots & \vdots \\ x_1^{(n)} & x_2^{(n)} & \cdots & x_p^{(n)} \end{bmatrix}, \quad W = \begin{bmatrix} w_1 \\ w_2 \\ \vdots \\ w_p \end{bmatrix}
$$

The result $Z$ is a vector of $n$ scores, one per observation.

## Now: Generalizing to the MLP

In an MLP, each layer $l$ has $m_l$ neurons. Each neuron in layer $l$ receives all outputs from the previous layer.

The formula generalizes naturally:

$$
Z_l = A_{l-1} \cdot W_l + b_l
$$

$$
A_l = \text{activation}(Z_l)
$$

Where:

- $A_{l-1}$ -> the output (activations) of the previous layer, of size $(n \times m_{l-1})$
- $W_l$ -> the weight matrix of layer $l$, of size $(m_{l-1} \times m_l)$
- $b_l$ -> the bias vector of layer $l$, of size $(1 \times m_l)$
- $Z_l$ -> the pre-activation scores of layer $l$, of size $(n \times m_l)$
- $A_l$ -> the activations of layer $l$, of size $(n \times m_l)$

Expanded, the weight matrix for a layer that receives $p$ inputs and produces $m$ outputs is:

$$
W_l = \begin{bmatrix} w_{11}^l & w_{12}^l & \cdots & w_{1m}^l \\ w_{21}^l & w_{22}^l & \cdots & w_{2m}^l \\ \vdots & \vdots & \ddots & \vdots \\ w_{p1}^l & w_{p2}^l & \cdots & w_{pm}^l \end{bmatrix}
$$

And for every layer $l$ in the network:

$$
Z_l = A_{l-1} \cdot W_l + b_l \qquad A_l = \text{activation}(Z_l)
$$

:::panel{tone="blue" title="How to read these formulas"}
- $l$ is the layer index - layer 1, layer 2, layer 3...
- $m$ is the number of neurons in that layer
- We repeat the same two operations for every layer: matrix multiplication + activation
- The output of the last layer is the prediction $\hat{y}$
:::

The beauty of this notation is its regularity. Whatever the number of layers, the logic remains the same. We chain linear transformations and activations, layer after layer.

---

We have just described something important. This network of stacked layers, each with its own weights, biases, and activation - this is what we call a **neural network**.

Today, this term covers a very broad family of architectures. But at the foundation, they all rely on the same idea: stacking parameterized transformations and learning them through gradient descent.

# Training a Neural Network

## The Context

Let us take a simple example to anchor multilayer backward propagation.

A binary classification network with:
- 2 inputs: $x_1$, $x_2$
- 1 hidden layer with 3 neurons
- 1 output layer with 1 neuron

![Diagram of a multilayer perceptron for backward propagation](/assets/blog/images/ia-pas-a-pas/bp3-mlp.png)

**Forward:**

$$
Z_1 = X \cdot W_1 + b_1 \qquad A_1 = \text{ReLU}(Z_1)
$$

$$
Z_2 = A_1 \cdot W_2 + b_2 \qquad A_2 = \sigma(Z_2)
$$

The output $A_2$ is the predicted probability.

## The Loss

For a binary classification problem, we use the log-loss seen in the previous post:

$$
L = -\frac{1}{n} \sum_{i=1}^{n} \left[ y^{(i)} \log(A_2^{(i)}) + (1 - y^{(i)}) \log(1 - A_2^{(i)}) \right]
$$

## The Backward Pass: Propagating Error Layer by Layer

This is where the MLP introduces something new. With one neuron, the gradient was computed in one step. With several layers, we need to propagate it backward, layer by layer, using the chain rule.

The intuition remains the same as before:
- *"how wrong was I?"* -> the loss tells us
- *"which layer contributed to this error?"* -> the gradient tells us
- *"how do we correct it?"* -> the update does it

**Gradients on the output layer (layer 2):**

We first define the output error:

$$
dZ_2 = A_2 - y
$$

This term simply measures the gap between prediction and reality - exactly as before.

$$
\frac{\partial L}{\partial W_2} = \frac{1}{n} A_1^T \cdot dZ_2 \qquad \frac{\partial L}{\partial b_2} = \frac{1}{n} \sum dZ_2
$$

**Gradients on the hidden layer (layer 1):**

The error now propagates toward the previous layer. We first compute the error that "moves back" through the weights of layer 2:

$$
dZ_1 = (dZ_2 \cdot W_2^T) \odot \text{ReLU}'(Z_1)
$$

The term $\text{ReLU}'(Z_1)$ is the derivative of the activation - it indicates how much each hidden neuron "transmitted" information during the forward pass. The symbol $\odot$ is element-wise multiplication.

$$
\frac{\partial L}{\partial W_1} = \frac{1}{n} X^T \cdot dZ_1 \qquad \frac{\partial L}{\partial b_1} = \frac{1}{n} \sum dZ_1
$$

:::panel{tone="blue" title="The intuition of multilayer backward propagation"}
Imagine you work in a team. A problem occurs at the end of the chain - the final result is bad. To correct it, you need to move backward: who transmitted what to whom? The last person in the chain receives the error first. They transmit it to the previous person, weighted by their own contribution. And so on back to the beginning.

That is exactly what backpropagation does: it distributes responsibility for the error to each layer, proportionally to what it contributed during the forward pass.
:::

## The Update - Still the Same Form

$$
W_l \leftarrow W_l - \alpha \frac{\partial L}{\partial W_l} \qquad b_l \leftarrow b_l - \alpha \frac{\partial L}{\partial b_l}
$$

Whatever the depth of the network, whatever the complexity of the backward pass, the update keeps the same structure. We subtract the gradient multiplied by the learning rate. That is the regularity of gradient descent.

## Code

The Python and R scripts for this example are available in the series repository:

:::codegroup
```python
import torch
import torch.nn as nn

# ============================================================
# 1) Define an MLP class
# ============================================================
# A class allows us to group:
# - the model layers
# - the forward computation logic
#
# Here we create a small MLP for binary classification.
class MLP(nn.Module):
    def __init__(self, input_dim, hidden_dims, output_dim=1):
        """
        input_dim   : number of input features
        hidden_dims : list containing the number of neurons
                      in each hidden layer
        output_dim  : output dimension (1 for binary)
        """
        super().__init__()

        # Prepare an empty list to build the network blocks
        layers = []

        # The first layer starts from input_dim
        current_dim = input_dim

        # Add each hidden layer
        for h in hidden_dims:
            # Linear layer
            layers.append(nn.Linear(current_dim, h))

            # Non-linear activation
            layers.append(nn.ReLU())

            # The output of this layer becomes the input of the next one
            current_dim = h

        # Final output layer
        layers.append(nn.Linear(current_dim, output_dim))

        # Final sigmoid for binary classification
        layers.append(nn.Sigmoid())

        # nn.Sequential assembles all blocks in order
        self.network = nn.Sequential(*layers)

    def forward(self, x):
        # The forward simply delegates computation to self.network
        return self.network(x)

# ============================================================
# 2) Create an instance of the model
# ============================================================
model = MLP(input_dim=2, hidden_dims=[32, 16, 16], output_dim=1)

print(model)

# ============================================================
# 3) Test the model on a batch
# ============================================================
y_hat = model(X)

print("\nMLP output:")
print(y_hat[:5])
print("Shape:", y_hat.shape)
```

```python
from sklearn.metrics import accuracy_score
from tqdm import tqdm
# ============================================================
# Model
# ============================================================
print(model)

# ============================================================
# Loss and optimizer
# ============================================================
criterion = nn.BCELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.001)

# ============================================================
# 4) Training loop
# ============================================================
epochs = 30000
loss_history = []
accuracy_history = []

for epoch in tqdm(range(epochs)):

    # --------------------------------------------------------
    # a) Forward
    # --------------------------------------------------------
    # The model produces a prediction
    y_hat = model(X_tensor)

    # --------------------------------------------------------
    # b) Loss
    # --------------------------------------------------------
    # Compare prediction to ground truth
    loss = criterion(y_hat, y_tensor)
    preds = (y_hat.detach().cpu().numpy().ravel() >= 0.5).astype(int)
    targets = y_tensor.detach().cpu().numpy().ravel().astype(int)
    acc = accuracy_score(targets, preds)

    # --------------------------------------------------------
    # c) Zero gradients
    # --------------------------------------------------------
    # Very important:
    # PyTorch accumulates gradients from one iteration to the next,
    # so we must reset them before backward().
    optimizer.zero_grad()

    # --------------------------------------------------------
    # d) Backward
    # --------------------------------------------------------
    # PyTorch automatically computes all gradients
    loss.backward()

    # --------------------------------------------------------
    # e) Update
    # --------------------------------------------------------
    # The optimizer updates the parameters
    optimizer.step()

    # --------------------------------------------------------
    # f) Tracking
    # --------------------------------------------------------
    loss_history.append(loss.item())
    accuracy_history.append(acc)

    # if epoch % 20 == 0:
    #     # Transform probability into binary class
    #     preds = (y_hat >= 0.5).float()

    #     print(f"Epoch {epoch:03d} | Loss = {loss.item():.4f} | Accuracy = {acc.item():.4f}")

# ============================================================
# 5) Final result
# ============================================================
print("\nFinal loss:", loss_history[-1])
```
:::

The dataset used in the examples is available in the repository at the address indicated in the scripts.

# What to Watch Out For

A neural network can be very powerful. But this power comes with new responsibilities. A few critical points should not be overlooked.

## Data - Quantity and Quality

A neural network has many parameters to learn. Many weights, many biases, spread across several layers. To learn them properly, it needs **many examples**.

:::panel{tone="blue" title="The human learning analogy"}
A child learns to recognize a cat after seeing dozens, then hundreds, in varied contexts. Show them a single cat - they may recognize that specific cat, but generalize poorly. A neural network is the same: the more varied examples it sees, the better it generalizes.
:::

- [v] More data -> better generalization
- [v] Varied data -> better robustness
- [!] Insufficient data -> the model memorizes examples without generalizing (overfitting)
- [!] Poor quality data -> the model learns the wrong patterns

## Preprocessing

Before giving data to a network, we must prepare it. Features on very different scales (one in thousands, another in hundredths) disrupt learning. Normalization - centering and scaling the data - is almost always essential.

- [v] Normalize features between 0 and 1, or around 0 with a standard deviation of 1
- [v] Handle missing values before training
- [!] Never normalize using statistics from the test data - only from the training data

## Hyperparameters

A neural network includes several choices that cannot be learned automatically - these are **hyperparameters**. The main ones:

| Hyperparameter | Role | Effects if poorly chosen |
|---------------|------|--------------------------|
| **Learning rate** ($\alpha$) | Speed of weight updates | Too high -> divergence / too low -> very slow learning |
| **Number of layers** | Network depth | Too few -> underfitting / too many -> overfitting |
| **Number of neurons** | Width of each layer | Too few -> insufficient capacity / too many -> overfitting |
| **Number of epochs** | Training duration | Too few -> model not converged / too many -> overfitting |
| **Activation function** | Transformation at each layer | Bad choice -> vanishing or exploding gradients |

Finding the right hyperparameters is often the most tedious part of training. Techniques such as **grid search**, **random search**, or **Bayesian optimization frameworks** automate part of this work. An example of optimal hyperparameter search is available in the repository.

## Specialization: When the Architecture Adapts to the Problem

The MLP is a general network. Powerful, but general-purpose. In some domains, we can do much better by adapting the architecture to the **type of data** we manipulate.

# What Comes Next?

We have just crossed an important step.

We started from a neuron - a weighted sum + an activation. We showed its limits. We introduced the idea of stacking several neurons into layers. We saw what changes in the structure, the forward pass, and the backward pass. And we saw why this architecture can solve problems that a single neuron cannot.

The guiding thread of the series remains unchanged:

> `ŷ = f(X)` - we are looking for the best function $f$ to transform information into decisions.

But this function is now much richer. It is no longer a simple weighted sum. It is a composition of transformations, layer after layer, each learning an increasingly abstract representation of the data.

In the next articles, we will explore how this idea specializes further:
- **CNNs** to understand images
- **RNNs** to understand sequences

# Conclusion

We moved from the neuron to the network.

A single neuron draws a linear boundary. Several neurons in layers draw arbitrarily complex boundaries. This additional expressiveness is what makes neural networks so powerful - and what enabled the spectacular advances of the last ten years in vision, language, and automated decision-making.

But this power has a cost. The deeper the network, the more parameters there are to learn. The more parameters there are, the more we need data, careful preprocessing, and informed hyperparameter choices. And the harder it becomes to understand what the model has really learned.

This is the paradox of deep learning: more expressive models, but also more opaque ones. We will see how to handle this opacity - and how specialized architectures have learned to make the most of this depth.

# Go Further

- [Neural Networks from Scratch - Sentdex](https://www.youtube.com/playlist?list=PLQVvvaa0QuDcjD5BAebMuxqi0QFAla71i)
- [3Blue1Brown - But what is a Neural Network?](https://www.youtube.com/watch?v=aircAruvnKk)
- [Backpropagation calculus - 3Blue1Brown](https://www.youtube.com/watch?v=tIeHLnjs5U8)
- [PyTorch - Building Neural Networks](https://pytorch.org/tutorials/beginner/blitz/neural_networks_tutorial.html)
- [Deep Learning - Goodfellow, Bengio, Courville](https://www.deeplearningbook.org/)
- [FastAI Practical Deep Learning](https://course.fast.ai/)
