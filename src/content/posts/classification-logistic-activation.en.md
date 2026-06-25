---
slug: "classification-logistic-activation"
seriesSlug: "ia-pas-a-pas"
lang: "en"
title: "From Score to Decision: The Perceptron Activation"
summary: "Why the simple perceptron fails on binary problems, how the sigmoid transforms a score into a probability, why the loss must change, and how all of this comes together to form a real neuron."
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

:::panel{tone="blue" title="Tools used"}
- Python 3.8+
- Jupyter Notebook
- scikit-learn
- numpy
:::

# Introduction

In the first article, we laid down a fundamental idea: an AI model is a function that **aggregates weighted information** to produce an answer.

We saw how linear regression learns weights, minimizes an error, and improves at each iteration through gradient descent. We saw that this mechanism - forward, loss, backward, update - is the heart of all machine learning.

But we also saw its limits.

A simple perceptron produces a number. A score. That is perfect when the question is "how much?". But many real questions are different:

- Will this flight be delayed?
- Is this email spam?
- Is this transaction fraudulent?

These questions call for a binary answer. And for that, producing a raw score like `2.4` or `-1.1` is not enough.

In this article, we will see how to properly transform a score into a probability. This seemingly simple change modifies everything: the model output, the way we measure error, and the way we compute gradients. But the underlying logic remains the same.

By the end, we will have built something new: a {purple}real neuron{/purple}.

# The Intuition: Deciding with Uncertainty

Imagine this morning. You look out the window. The sky is gray, but not completely covered. You check the time: it is 8 a.m., and you have a long day outside. You remember that last week, it rained twice under similar conditions.

You ask yourself: should I take an umbrella?

You are not trying to predict "how much it will rain". You just want to know whether or not you will end up soaked.

This type of decision is fundamentally different. We are no longer estimating a continuous value. We are choosing a **class** among two possible classes. And to answer properly, we need a probability (a confidence measure between 0% and 100%) before making the final decision.

This is exactly the problem logistic regression, and more generally the perceptron with activation, is designed to solve.

# Reminder: The Simple Perceptron

In the first article, we built this equation:

$$
\hat{y} = w_1 x_1 + w_2 x_2 + \ldots + w_p x_p + b
$$

The model takes inputs, multiplies them by weights, adds everything with a bias, and produces an output value.

This is powerful for predicting continuous quantities. But directly applying this output to a binary problem creates an obvious issue.

# Why the Simple Perceptron Fails Here

Suppose you want to predict whether a flight will be delayed: 1 for yes, 0 for no.

Your perceptron computes a score. Let us say it produces `3.7` for a high-delay-risk flight, and `-1.4` for a calm flight.

:::panel{tone="red" title="The problem"}
- [!] A score of `3.7` means nothing in probability terms
- [!] A score of `-1.4` could be interpreted as a "negative probability" - which makes no sense
- [!] The output is unbounded: it can go from -∞ to +∞
- [!] We cannot compare scores across different models or different problems
:::

What we want is an output that stays between `0` and `1`, interpretable as a probability. To get that, we need a mechanism that compresses any score into that interval.

# The Sigmoid - Compressing the Score into a Probability

That mechanism exists. It is the **sigmoid function**:

$$
\sigma(z) = \frac{1}{1 + e^{-z}}
$$

It takes any real number $z$ and transforms it into a value between 0 and 1.

- A very negative score ($z \ll 0$) -> $\sigma(z) \approx 0$
- A zero score ($z = 0$) -> $\sigma(z) = 0.5$
- A very positive score ($z \gg 0$) -> $\sigma(z) \approx 1$

![Sigmoid curve transforming a score into a probability](/assets/blog/images/ia-pas-a-pas/bp2-sigmoid.png)

:::widget{id="sigmoid-activation-playground"}
:::

This is not an arbitrary choice. The sigmoid has an elegant mathematical property: in a binary problem, it is exactly the function that naturally emerges from rigorous probabilistic reasoning. We will come back to that when we introduce likelihood.

# The Complete Perceptron

We keep the same weighted aggregation logic, but add one step: passing the score through the sigmoid.

**Step 1: compute the linear score**

$$
z = w_1 x_1 + w_2 x_2 + \ldots + w_p x_p + b
$$

**Step 2: activation**

$$
a = \sigma(z) = \frac{1}{1 + e^{-z}}
$$

$a$ is now a probability. It represents the model's confidence that the answer is 1.

We call $\sigma$ an **activation function** - its role is to transform the raw linear output into something interpretable and useful for the next step.

## What Changes: Before and Now

Here is the difference between the simple perceptron and the complete perceptron, step by step:

| Step | Simple perceptron | Complete perceptron |
|------|-------------------|---------------------|
| **Forward** | $\hat{y} = f(x)$ | $z = f(x)$, then $a = \sigma(z)$ |
| **Output** | continuous value | probability between 0 and 1 |
| **Loss** | MSE | Log-loss (Binary Cross-Entropy) |
| **Gradient $\partial L / \partial w_i$** | $(\hat{y} - y) \cdot x_i$ | $(a - y) \cdot x_i$ |
| **Gradient $\partial L / \partial b$** | $\hat{y} - y$ | $a - y$ |
| **Update** | $w \leftarrow w - \alpha \cdot \nabla w$ | identical in form |

:::panel{tone="green" title="What to remember"}
We do not throw anything away. The weighted aggregation logic remains intact. The learning loop remains the same. What changes is the interpretation of the output and, as a consequence, the way we measure error.
:::

## Why Must the Loss Change?

In the first article, we used MSE to measure error:

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

This measure is suited to continuous value prediction. But now, our output is a probability. Measuring the error of a probability with a simple squared difference is not the right way to reason.

There is a precise mathematical reason for this: with the sigmoid, MSE produces a non-convex cost function, full of local minima. Gradient descent can get lost. Log-loss, on the other hand, remains convex, which guarantees convergence toward the global minimum.

But there is above all a conceptual reason: what we now want to measure is **how coherent the model is with what actually happened**. And for that, we need another tool: {green}likelihood{/green}.

# Likelihood: Measuring Model Coherence

Likelihood is a simple idea: **to what extent are the model's predictions compatible with the observed reality?**

> A story is plausible when it is compatible with facts that actually happened. A model is likely when its probability predictions match what actually occurred.

Simple example:

- The model predicts $P(y=1) = 0.8$ for a flight
- That flight was indeed delayed ($y = 1$)
- The likelihood of this prediction is `80%`. The model was confident, and it was right

If the model had predicted $P(y=1) = 0.2$ for the same flight, the likelihood would be only `20%`: it was very confident in the wrong direction.

## Generalizing to Several Observations

If we have several flights, we want to measure the model's overall likelihood; that is, the probability that **all** its predictions are coherent with reality at the same time.

When two events are independent, the probability that both happen is the **product** of their individual probabilities. So we multiply likelihoods across all examples:

$$
L = \prod_{i=1}^{n} P(y = y_i)
$$

With the general notation that covers both cases ($y_i = 1$ and $y_i = 0$), using the Bernoulli distribution:

$$
L = \prod_{i=1}^{n} a_i^{y_i} \cdot (1 - a_i)^{1 - y_i}
$$

:::panel{tone="blue" title="Reading this formula simply"}
- When $y_i = 1$: the term becomes $a_i^1 \cdot (1-a_i)^0 = a_i$ -> we use the probability that it is 1
- When $y_i = 0$: the term becomes $a_i^0 \cdot (1-a_i)^1 = 1 - a_i$ -> we use the probability that it is 0

In plain terms: for each example, we retrieve the probability the model assigned to what actually happened.
:::

## Properties

- $L \approx 1$ -> the model is very coherent with reality
- $L \approx 0$ -> the model is unlikely

## The Product Problem

Let us look at a concrete case. Three examples, with rather correct predictions:

| $y$ | $a$ (prediction) | Contribution |
|-----|------------------|--------------|
| 1 | 0.70 | 0.70 |
| 0 | 0.20 | 0.80 |
| 1 | 0.55 | 0.55 |

First impression: the predictions look correct. The likelihood should be high.

$$
L = 0.70 \times 0.80 \times 0.55 = 0.308
$$

:::panel{tone="red" title="Surprise"}
Only 30%. And we had just 3 examples with reasonable predictions.

Now imagine one million examples. We multiply one million numbers between 0 and 1. The result becomes so small that computers can no longer represent it - this is called **numerical underflow**.
:::

## Moving to the Logarithm

The solution is elegant: we no longer work with $L$, but with $\log(L)$.

The logarithm transforms a product into a sum:

$$
\log(L) = \sum_{i=1}^{n} \left[ y_i \log(a_i) + (1 - y_i) \log(1 - a_i) \right]
$$

This move to log solves both problems at once:
- no more numerical issues - we add numbers instead of multiplying them
- log is an increasing function, so maximizing $\log(L)$ is exactly the same as maximizing $L$

## Final Adjustment: Minimizing Instead of Maximizing

We know how to maximize functions. But all optimization algorithms we use in practice (including gradient descent) are designed to **minimize**.

The solution is trivial: we take the negative.

$$
\text{Log-Loss} = -\sum_{i=1}^{n} \left[ y_i \log(a_i) + (1 - y_i) \log(1 - a_i) \right]
$$

This is the **log-loss**, also called **Binary Cross-Entropy**. This is the quantity we will try to minimize. The closer it is to zero, the more coherent the model is with reality.

:::panel{tone="green" title="The full logic in one sentence"}
We want the model to be as likely as possible -> we maximize likelihood -> we move to logs to avoid numerical issues -> we take the negative so we can minimize.
:::

# Backward Propagation

In the first article, we saw backpropagation and gradient descent in their simplest form. Here, we complete the picture.

![Forward backward update learning process](/assets/blog/images/ia-pas-a-pas/bp2-train_process-fr.png)

A **gradient** is a derivative. It measures how the loss varies when we slightly change a parameter. If the gradient of the loss with respect to a weight $w_i$ is positive, it means that increasing $w_i$ increases the loss too. So to reduce the loss, we decrease $w_i$.

That is all. That is the meaning of the update formula:

$$
w_{t+1} = w_t - \alpha \frac{\partial L}{\partial w_t}
$$

- $\alpha$ -> the learning rate: how fast we correct
- $\frac{\partial L}{\partial w_t}$ -> the direction in which the loss increases

![Convex log-loss curve](/assets/blog/images/ia-pas-a-pas/bp2-convex_loss_function.png)

:::panel{tone="blue" title="Important property"}
The log-loss combined with the sigmoid produces a **convex** cost function - there is only one minimum. Gradient descent cannot get lost in a false valley. This is a valuable property, and one reason this combination is so widely used.
:::

## The New Gradients

Thanks to the chain rule, the gradients of the log-loss are computed by decomposing dependencies:

$$
\frac{\partial L}{\partial w_i} = \frac{\partial L}{\partial a} \cdot \frac{\partial a}{\partial z} \cdot \frac{\partial z}{\partial w_i}
$$

The final result is remarkably simple:

$$
\frac{\partial L}{\partial w_i} = (a - y) \cdot x_i
$$

$$
\frac{\partial L}{\partial b} = a - y
$$

The same form as before. But with $a$ - the predicted probability - instead of $\hat{y}$ - the raw score.

The intuition remains identical:
- $a - y$ -> *"how wrong was I?"*
- $x_i$ -> *"in which direction did this variable contribute to the error?"*

# The Neuron - Assembling the Pieces

We now have everything we need to introduce the idea of an **artificial neuron**.

A neuron is not a magical idea. It is a structure with three parts:

1. **Linear part**: aggregate inputs with weights and a bias
   $$z = w_1 x_1 + \ldots + w_p x_p + b$$

2. **Activation function**: transform the linear output
   $$a = \sigma(z)$$

3. **Output**: the value $a$, interpreted depending on the context

![Diagram of an artificial neuron](/assets/blog/images/ia-pas-a-pas/bp2-artificial_neuron.png)

A neuron is a weighted sum passed through an activation function.

The difference between a simple perceptron and a real neuron is exactly this activation function. It is what allows us to go beyond linearity.

# Code - Logistic Regression on a Concrete Case

:::codegroup
```python
# =====================================
# Logistic regression - scikit-learn
# =====================================
import numpy as np
from sklearn.linear_model import LogisticRegression

# Data: weather, congestion, incoming delay, technical alert -> delayed (1) or not (0)
np.random.seed(42)
n = 500
X = np.random.rand(n, 4)
latent_score = 4*X[:,0] + 3*X[:,1] + 2*X[:,2] + 1.5*X[:,3] - 4
proba = 1 / (1 + np.exp(-latent_score))
y = (np.random.rand(n) < proba).astype(int)

model = LogisticRegression()
model.fit(X, y)

# Reading weights
features = ['Weather', 'Congestion', 'Incoming delay', 'Technical alert']
for feat, coef in zip(features, model.coef_[0]):
    print(f"  {feat:<20} -> weight: {coef:+.3f}")

# Prediction on a new flight
new_flight = np.array([[0.85, 0.75, 0.90, 0.10]])
a = model.predict_proba(new_flight)[0, 1]
decision = "Delayed" if a >= 0.5 else "On time"
print(f"\nDelay probability: {a:.1%}")
print(f"Decision         : {decision}")
```

```python
# =====================================
# Logistic perceptron from scratch - numpy
# =====================================
import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def log_loss(a, y):
    eps = 1e-15
    a = np.clip(a, eps, 1 - eps)
    return -np.mean(y * np.log(a) + (1 - y) * np.log(1 - a))

# Simulated data
np.random.seed(42)
n, p = 200, 4
X = np.random.randn(n, p)
y_true = (X @ np.array([1.5, -1.0, 2.0, 0.5]) + np.random.randn(n) * 0.5 > 0).astype(float)

# Initialization
w = np.zeros(p)
b = 0.0
alpha = 0.05

# Learning loop
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
        print(f"Epoch {epoch:>3} | Loss: {loss:.4f} | Accuracy: {acc:.2%}")
```
:::

# Generalizing Activations

The sigmoid is perfect for two-class problems. But reality is often richer.

**Softmax**, for multiclass classification:

$$
\text{softmax}(z_k) = \frac{e^{z_k}}{\sum_j e^{z_j}}
$$

It transforms a vector of scores into a vector of probabilities that sum to 1. "Will this flight be delayed by less than 15 min, by 15 to 60 min, or by more than one hour?" - three classes, softmax.

**ReLU**, for hidden layers in deep networks:

$$
\text{ReLU}(z) = \max(0, z)
$$

**GELU, SiLU, etc.**, more recent variants used in transformers and LLMs, which add slight mathematical nuances but follow the same logic: transforming a linear output into something non-linear.

# The Limits of the Perceptron: Why One Layer Is Not Enough

A perceptron, even complete with its activation, remains fundamentally a **one-layer model**. It draws one decision boundary in the data space.

For simple problems, that is enough. But as soon as relationships between variables become complex - when a decision depends on non-linear interactions between several signals - a single neuron cannot capture them.

:::panel{tone="red" title="The fundamental limit"}
- [!] A simple perceptron can only draw a **linear** decision boundary
- [!] It cannot learn relationships like "if X1 is high AND X2 is low, then yes - but if both are high, then no"
- [!] It cannot solve non-linearly separable problems
:::

The natural solution is to stop limiting ourselves to a single neuron, and instead assemble several neurons into layers. Each layer learns increasingly abstract representations of the data. This is exactly what a **multilayer neural network**, or **Multilayer Perceptron (MLP)**, does.

# What Comes Next?

We have built something solid.

We now know why a raw score is not enough for binary problems. We understand why and how the sigmoid transforms that score into a probability. We saw that this change requires rethinking the loss, going through likelihood, then log-loss. We saw that gradient descent keeps the same structure, but adapts to this new framework. And we assembled all these pieces to understand what an **artificial neuron** really is.

The guiding thread of the series remains the same:

> `ŷ = f(X)` - we are looking for the best function $f$ to transform information into decisions.

But today we saw that this function can, and sometimes must, do more than a simple weighted sum. It can introduce non-linearity. And that non-linearity will allow us, in the next article, to assemble neurons into layers and capture patterns that neither linear regression nor the simple perceptron can see.

In the next article, we move to the **Multilayer Perceptron**, and begin to understand why deep neural networks can approximate arbitrarily complex functions.

# Summary

:::panel{tone="green" title="What we built"}
A complete neuron: weighted sum + bias + sigmoid activation + log-loss.

$$
z = w_1 x_1 + \ldots + w_p x_p + b \qquad a = \sigma(z)
$$
:::

:::panel{tone="blue" title="Key concepts"}
- [v] **Sigmoid**: compresses any score into a probability between 0 and 1
- [v] **Likelihood**: measures how coherent the model is with reality
- [v] **Log-loss**: the cost function adapted to binary problems
- [v] **Complete gradient descent**: same structure, new gradients
- [v] **Neuron**: weighted sum + activation - the elementary brick of any network
:::

:::panel{tone="red" title="Limits"}
- [!] One layer draws only one boundary - a linear one
- [!] Insufficient for problems with complex interactions between variables
- [!] The real power comes from stacking several layers
:::

# Go Further

- [Logistic regression - scikit-learn](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- [Binary Cross-Entropy explained - Towards Data Science](https://towardsdatascience.com/understanding-binary-cross-entropy-log-loss-a-visual-explanation-a3ac6025181a)
- [StatQuest - Logistic Regression](https://www.youtube.com/watch?v=yIYKR4sgzI8)
- [3Blue1Brown - Neural Networks](https://www.youtube.com/watch?v=aircAruvnKk)
- [Google ML Crash Course - Logistic Regression](https://developers.google.com/machine-learning/crash-course/logistic-regression)
- [DEEP LEARNING COURSE - Machine Learnia](https://youtube.com/playlist?list=PLO_fdPEVlfKoanjvTJbIbd9V5d9Pzp8Rw&si=PZa45YYtdMouu_Fp)
