---
slug: "regression-aggregation-perceptron"
seriesSlug: "ia-pas-a-pas"
lang: "en"
title: "Aggregating to Decide"
summary: "The fundamental brick of any AI model: weighting information, aggregating it, measuring error, and learning how to correct it. From linear regression to the perceptron, through loss and gradient descent."
date: "2026-03-26"
tags:
  - "regression"
  - "perceptron"
  - "gradient-descent"
  - "aggregation"
  - "ai"
cover: "/assets/blog/images/blog6.jpg"
featured: true
---

:::panel{tone="blue" title="Tools used"}
- Python 3.8+
- Jupyter Notebook
- scikit-learn
- matplotlib
- pandas
- numpy
:::

# Introduction

Artificial intelligence is everywhere. And often, the first reaction is: *"this must be extremely complicated."*

Makes sense, right? It talks. It reads documents. It answers questions. It codes. It generates images. And you think: I do not even really know how I speak, how my brain works, or how I make decisions. So a machine that does all of that must be something inaccessible.

Except **no**.

Because in reality, AI rests on a ridiculously simple idea. An idea you already use every day without realizing it.

That idea is **information aggregation**: gathering several clues, weighting them, and turning them into a decision.

That is exactly what you do when you choose a restaurant at night. You look at reviews, price, distance, whether your friends liked it. You add all that up in your head and decide. You just did AI without knowing it.

At the heart of this series is one simple and powerful idea:

> `ŷ = f(X)`

- [v] An AI is a function that transforms information `X` into an answer `ŷ`.

If you understand that, you already understand 80% of what matters. The rest is sophistication, and that is exactly what we are going to build together, brick by brick.

In this article, we lay the foundation. We start from the simplest intuition, build the logic of weighting and aggregation, introduce the idea of error, and reach an understanding of how a system really learns. This is not just an article about linear regression. It is the article that makes the rest of the series understandable.

# The Power Plant: Your Brain Already Does AI

Imagine a manager in a power plant. This morning, he has to decide whether the grid will hold tonight.

- He checks the weather: it is `-8°C`.
- He checks the calendar: it is Monday, and there is an important match on TV.
- He checks the time: it is peak hour.
- [v] He gathers all of that in his head and makes a decision.

What just happened is exactly what an AI model does. Nothing more, nothing less. It takes information, gives it a weight, adds it up, and produces an answer.

:::panel{tone="red" title="The difference?"}
It does it on millions of examples, in milliseconds, without ever getting tired.
:::

Behind this mechanism is a very simple equation:

$$
\hat{y} = f(X)
$$

where `X` is the input information (weather, time, day...), and `ŷ` is the produced answer (forecast consumption, decision, score...).

Now let us see how this equation is built concretely.

# Weighting - Giving Importance to Each Piece of Information

Not all information has the same value.

In our power plant example, outside temperature probably matters more than the day of the week. A football match in prime time matters more than an ordinary Tuesday. And peak hour has a systematic effect on consumption.

This idea - that some pieces of information matter more than others - is expressed mathematically with **weights**.

$$
\hat{y} = w_1 x_1 + w_2 x_2 + \ldots + w_p x_p + b
$$

- $x_1, x_2, \ldots, x_p$ -> the input information (temperature, time, event...)
- $w_1, w_2, \ldots, w_p$ -> the **weights**, the importance given to each piece of information
- $b$ -> the **bias**, a base value independent of the inputs
- $\hat{y}$ -> the predicted value

:::panel{tone="blue" title="The coach analogy"}
A coach evaluates players on three criteria: speed, passing quality, and physical endurance.

But he does not weight them the same way:
- speed counts double in attack -> $w = 2$
- passing quality counts for `1.5` -> $w = 1.5$
- physical endurance counts for `1` -> $w = 1$

The final score of a player is the weighted sum of his ratings.

- [v] This is exactly the logic of weights in an AI model: learning **which factors matter**, and **how much**.
:::

Weights are not just a technical detail. They are the heart of the model. A high weight means this variable strongly influences the prediction. A weight close to zero means it brings almost nothing. A negative weight means it acts in the opposite direction.

Reading a model's weights is reading what the machine has learned about the world.

# Aggregating - Producing an Answer from the Weights

Once we have the weights and the information, we **aggregate**: {purple}we add everything up to produce an output value{/purple}.

$$
\hat{y} = w_1 x_1 + w_2 x_2 + w_3 x_3 + w_4 x_4 + b
$$

Let us take a concrete example. To predict electricity consumption tonight:

| Information | Value | Weight | Contribution |
|-------------|-------|--------|--------------|
| Temperature ($x_1$) | -8°C | 3.2 | -25.6 MW |
| Time ($x_2$) | 7 p.m. | 1.5 | +28.5 MW |
| Weekday ($x_3$) | Monday = 1 | 4.0 | +4.0 MW |
| Match tonight ($x_4$) | Yes = 1 | 12.0 | +12.0 MW |
| Bias ($b$) | - | - | +50.0 MW |

**Predicted consumption: 68.9 MW**

Each piece of information contributes to the final prediction according to its weight. The machine adds these contributions: {purple}that is aggregation{/purple}.

:::widget{id="power-plant-perceptron"}
:::

For simple problems, we can set these weights manually. But for complex problems with dozens or hundreds of variables? Impossible to guess them by hand. This is where the idea of **learning** comes in.

# The Loss: Measuring the Gap Between Prediction and Reality

Before learning anything, we need to measure how wrong we are.

Imagine your model predicts consumption of 68.9 MW, but the actual value that evening is 74.2 MW. The gap is 5.3 MW. That is the **error**.

$$
\text{error} = \hat{y} - y
$$

But one error is not enough. We want to measure the model's quality on **many examples**. For that, we use a **cost function** (or *loss*): {purple}a way to summarize all errors into a single number{/purple}.

The most common one for continuous value prediction is **MSE** (Mean Squared Error):

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

:::panel{tone="red" title="Why square the errors?"}
Two simple reasons:
- an error of -5 and an error of +5 are equally bad - by squaring them, they both become 25
- large errors are penalized even more than small ones (an error of 10 gives 100, not just twice an error of 5)

- [!] If we used only the average of raw errors, positive and negative errors would cancel each other out - and the model could look perfect while being wrong all the time.
:::

The loss is the **nerve center of this whole process**. It tells the machine whether it is improving or not. It is what we try to minimize. And it guides the weight updates.

# Learning the Weights: From Manual Calibration to Automatic Optimization

For simple problems, we could try things manually: test weights, calculate the loss, adjust, recalculate. But as soon as the problem becomes even slightly complex (dozens of variables, millions of examples), this manual approach becomes impossible.

We need an automatic mechanism. A mechanism that, from the error, knows in which direction each weight should be adjusted.

That mechanism exists. We call it **linear regression** - and more generally, it is the heart of machine learning.

:::panel{tone="green" title="What learning means for a machine"}
Learning, for an AI system, is not memorizing. It is **adjusting parameters** (the weights) so that predictions get as close as possible to reality, on as many examples as possible.

It is a bit like the human brain reinforcing neural connections when we repeat a task. The more we train, the better calibrated the connections become. Here, it is the same - but with equations.
:::

# The Perceptron

The linear regression we just described is, in another form, what we call a {purple}perceptron{/purple}, or simple artificial neuron.

$$
\hat{y} = w_1 x_1 + w_2 x_2 + \ldots + w_p x_p + b
$$

![Diagram of a simple perceptron](/assets/blog/images/ia-pas-a-pas/bp1-neuron.png)

It is the same equation. The same logic. Just a different name, borrowed from neural network vocabulary.

**The central problem is still the same:**

> How do we find $w_i$ and $b$ from $n$ data points?

This is where the **learning process** comes in.

# How Does a Model Calibrate Itself? The Learning Process

Model learning follows a loop in five steps. It is **the same process used in deep learning**, from the simplest models to the most complex ones.

## 1. Forward Propagation: Producing a Prediction

We take the input data, apply the current weights, and compute $\hat{y}$.

At the beginning, the weights are initialized randomly. The prediction will therefore be bad (that is normal). This is the starting point.

## 2. Cost Function: Measuring the Error

We compare $\hat{y}$ to the true value $y$, and compute the loss.

$$
\text{MSE} = \frac{1}{2}(y - \hat{y})^2
$$

The higher the loss, the further the model is from reality.

## 3. Backward Propagation: Understanding Where the Error Comes From

This is where the magic happens. We go backward through the equation to calculate **the contribution of each weight to the total error**.

In simple terms: *"what contributed most to this error?"*

This calculation produces **gradients**: numbers that indicate in which direction each weight should move to reduce the error.

![Backward propagation of a perceptron](/assets/blog/images/ia-pas-a-pas/bp1-backward.png)

## 4. Gradient Descent: Correcting the Weights

We update the weights by following the opposite direction of the gradient:

$$
w_{t+1} = w_t - \alpha \frac{\partial L}{\partial w_t}
$$

- $\alpha$ -> the **learning rate**: how fast we correct
- $\frac{\partial L}{\partial w}$ -> the gradient: the direction in which the error increases

:::panel{tone="blue" title="The downhill analogy"}
Imagine you are in the fog on a mountain and you want to go down into the valley. You cannot see far, but you can feel the slope under your feet.

At every step, you check which direction the ground goes down, and you take a step in that direction.

That is exactly what gradient descent does: at each step, it looks in which direction the loss decreases, and adjusts the weights in that direction.
:::

## 5. Loop: Repeat Until Convergence

We repeat steps 1 to 4 on all examples in the dataset, again and again, until the loss reaches an acceptable minimum.

- [v] This is called an **epoch**: one complete pass over all the data.
- [v] After several epochs, the weights have converged and the model has learned.

# Simple Case: A Perceptron with 2 Inputs

To anchor all this, let us take the simplest possible case: a perceptron with only 2 inputs.

$$
\hat{y} = w_1 x_1 + w_2 x_2 + b
$$

**Example data:**

| $x_1$ | $x_2$ | $y$ (actual) | $\hat{y}$ (predicted) | Error |
|-------|-------|--------------|-----------------------|-------|
| 2 | 3 | 13 | 10.5 | -2.5 |
| 4 | 1 | 14 | 13.2 | -0.8 |
| 1 | 5 | 16 | 12.1 | -3.9 |

The **MSE loss** on these 3 examples:
$$
\text{MSE} = \frac{1}{2}((-2.5)^2 + (-0.8)^2 + (-3.9)^2) \approx 10.75
$$

**Weight update** from the gradients:

$$
w_i \leftarrow w_i - \alpha \cdot (\hat{y} - y) \cdot x_i
$$

$$
b \leftarrow b - \alpha \cdot (\hat{y} - y)
$$

:::panel{tone="blue" title="Reading these formulas without fear"}
The update formula simply says:

- $\hat{y} - y$ -> *"how wrong was I?"*
- $x_i$ -> *"in which direction did this variable contribute to the error?"*
- $\alpha$ -> *"how fast do I want to correct?"*

Each weight is corrected proportionally to its involvement in the error. A weight linked to a variable that contributed strongly to the error is corrected more strongly.
:::

After an update with $\alpha = 0.01$, the weights move slightly. We recalculate. We measure the new loss. It has decreased. We start again. That is learning.

# Generalizing to a Whole Dataset - Vectors and Matrices

So far, we have reasoned on one example at a time. In practice, we work with **datasets** (thousands or millions of examples).

To make calculations efficient, we move to matrix notation.

**A dataset with $n$ examples and $p$ features** is written:

$$
X = \begin{pmatrix} x_{11} & x_{12} & \cdots & x_{1p} \\ x_{21} & x_{22} & \cdots & x_{2p} \\ \vdots & & \ddots & \vdots \\ x_{n1} & x_{n2} & \cdots & x_{np} \end{pmatrix}, \quad w = \begin{pmatrix} w_1 \\ w_2 \\ \vdots \\ w_p \end{pmatrix}
$$

And the prediction on the whole dataset is simply:

$$
\hat{Y} = X \cdot w + b
$$

One line. All predictions at once.

:::panel{tone="green" title="Why this matters"}
- [v] The code becomes simpler and more readable
- [v] Calculations become much faster (NumPy and PyTorch optimize them natively)
- [v] This is the basis of every deep learning framework - understanding this means understanding how PyTorch or TensorFlow work under the hood
:::

# Code - Linear Regression and Simple Perceptron

:::codegroup
```python
# =====================================
# Linear regression
# =====================================
import numpy as np
from sklearn.linear_model import LinearRegression

# Dataset: temperature, time, day, event -> consumption
X = np.array([
    [-8, 19, 1, 1],   # Monday evening, match, -8°C
    [15,  9, 3, 0],   # Wednesday morning, good weather
    [ 2, 21, 5, 0],   # Friday evening, no event
    [-5, 18, 1, 1],   # Monday evening, match, -5°C
])
y = np.array([74.2, 41.3, 52.8, 68.9])  # actual consumption in MW

# Training
model = LinearRegression()
model.fit(X, y)

# Reading learned weights
for feature, coef in zip(['Temperature', 'Time', 'Day', 'Event'], model.coef_):
    print(f"  {feature:<15} -> weight: {coef:+.2f}")
print(f"  {'Bias':<15} -> {model.intercept_:.2f}")

# Prediction on a new case
new_case = np.array([[-8, 19, 1, 1]])
print(f"\nPredicted consumption: {model.predict(new_case)[0]:.1f} MW")
```

```python
# =====================================
# Perceptron from scratch
# =====================================
import numpy as np

# Data
X = np.array([[2, 3], [4, 1], [1, 5], [3, 2]], dtype=float)
y = np.array([13, 14, 16, 14], dtype=float)

# Random weight initialization
np.random.seed(42)
w = np.random.randn(2)
b = 0.0
alpha = 0.01  # learning rate

# Learning loop
for epoch in range(200):
    # Forward
    y_hat = X @ w + b

    # MSE loss
    loss = np.mean((y - y_hat) ** 2)

    # Gradients
    grad_w = -2 * X.T @ (y - y_hat) / len(y)
    grad_b = -2 * np.mean(y - y_hat)

    # Update
    w -= alpha * grad_w
    b -= alpha * grad_b

    if epoch % 50 == 0:
        print(f"Epoch {epoch:>3} | Loss: {loss:.4f}")

print(f"\nLearned weights: w = {w}, b = {b:.2f}")
```
:::

# Beyond Linear - Why We Need Non-Linearity

The model we just built is powerful for linear relationships. But the real world is rarely linear.

Imagine you want to predict whether a flight will be delayed **yes or no**, not just by how much. Or detect whether a transaction is fraudulent. Or recognize a face in an image.

These problems have a fundamentally different structure: variables interact with each other in complex ways, and the answer cannot be expressed as a simple weighted sum.

This is where {purple}activation functions{/purple} come in.

An activation function takes the output of our weighted sum and applies a non-linear transformation to it. The simplest and most widely used today is called **ReLU** (*Rectified Linear Unit*):

$$
\text{ReLU}(z) = \max(0, z)
$$

![ReLU activation function](/assets/blog/images/ia-pas-a-pas/bp1-relu.png)

In plain terms: if the score is positive, we keep it. If it is negative, we set it to zero.

```python title="ReLU - PyTorch"
import torch
import torch.nn as nn

relu = nn.ReLU()

scores = torch.tensor([-3.0, -1.0, 0.0, 2.0, 5.0])
print(relu(scores))
# tensor([0., 0., 0., 2., 5.])
```

This seemingly tiny detail changes everything. By stacking several layers of neurons with activation functions, we can approximate any complex relationship between inputs and an output.

- [!] Without an activation function, stacking linear layers is useless: the result remains linear.
- [v] With an activation function, each layer can capture increasingly abstract patterns.

This is the founding principle of deep neural networks, and we will come back to it in detail in the next articles.

# What Comes Next?

We have just built something important.

We started from the simplest intuition - aggregating information to produce a decision. We saw how weights express the importance of each variable. We understood what a loss is, why it is central, and how it guides learning. We dissected the full process: forward, loss, backward, gradient descent, loop. And we introduced the idea that linear models alone have limits.

The guiding thread remains the same throughout the series:

> `ŷ = f(X)` - we are looking for the best function $f$ to transform information into decisions.

In the next article, we will directly tackle the problem of binary decisions. How do we answer **yes or no** with nuance? How do we transform a continuous score into a probability between 0% and 100%?

The answer is called **{purple}logistic regression{/purple}**. And it introduces a small S-shaped function that will change the way you see things.

It is called the {purple}sigmoid{/purple}. And once you have seen it, you will find it everywhere.

# Summary

:::panel{tone="green" title="What we built"}
A model that learns to **weigh information** to produce a prediction. It looks for the weights $w_1, w_2, \ldots, w_n$ that minimize the loss - that is, the gap between its predictions and reality.

$$
\hat{y} = w_1 x_1 + w_2 x_2 + \ldots + w_p x_p + b
$$
:::

:::panel{tone="blue" title="Key concepts"}
- [v] **Weights**: the learned importance of each variable
- [v] **Bias**: the base value independent of the inputs
- [v] **Loss**: the measure of error - the nerve center of learning
- [v] **Gradient descent**: the mechanism that adjusts weights in the right direction
- [v] **Forward / Backward**: produce a prediction, then trace the error backward
- [v] **Vectorization**: scaling to a whole dataset with matrices
:::

:::panel{tone="red" title="Limits of this model"}
- [!] Non-linear relationships: if reality is more complex, the model fails
- [!] Binary answers: it produces a number, not a yes/no decision
- [!] Without an activation function, stacking layers is useless
:::

# Go Further

- [Linear regression - scikit-learn](https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares)
- [Gradient descent visualized](https://distill.pub/2017/momentum/)
- [StatQuest - Linear Regression](https://www.youtube.com/watch?v=nk2CQITm_eo)
- [3Blue1Brown - What is backpropagation?](https://www.youtube.com/watch?v=Ilg3gGewQ5U)
- [Neural Networks from Scratch - Sentdex](https://www.youtube.com/playlist?list=PLQVvvaa0QuDcjD5BAebMuxqi0QFAla71i)
- [DEEP LEARNING COURSE - Machine Learnia](https://youtube.com/playlist?list=PLO_fdPEVlfKoanjvTJbIbd9V5d9Pzp8Rw&si=PZa45YYtdMouu_Fp)
