---
slug: "logistic-regression-score-probability"
seriesSlug: "ia-pas-a-pas"
lang: "en"
title: "Yes or No, with nuance"
summary: "A simple continuation of linear regression: keep the weighted score, pass it through a sigmoid, and turn it into a probability for yes-or-no decisions."
date: "2026-03-31"
tags:
  - "ai"
  - "logistic-regression"
  - "classification"
cover: "/assets/blog/images/blog6.jpg"
featured: false
---

## Stack required to run the examples in this article

:::panel{tone="blue" title="Tools used"}
- Python 3.8+
- Jupyter Notebook
- scikit-learn
- matplotlib
- numpy
- pandas
- R
:::

# Introduction

In the first article, we learned something essential: a model can take several signals, weigh them, and turn them into a score.

That works perfectly when the question is "how much?" How much electricity will a neighbourhood consume tonight? How much revenue will a company generate next month? How long will a delivery take?

But many real questions are not about quantities. They are binary:

- Will this flight be delayed?
- Is this email spam?
- Is this transaction suspicious?

If we keep the linear score exactly as it is, we get values like `1.7` or `-0.3`. Useful internally. Awkward as a final answer.

What we need now is not a new way to combine information. We need a new way to interpret the score.

This is exactly where **logistic regression** enters the story.

> The core idea stays the same: `y = f(X)`. The difference is that `y` first becomes a probability before it becomes a decision.

# The same score, a different question

Suppose you want to estimate whether a flight will be delayed.

You collect several signals:

* $x_1$ = bad weather level
* $x_2$ = airport congestion
* $x_3$ = incoming aircraft already late
* $x_4$ = technical alert before boarding

The model still starts by computing a weighted score:

$score = w_0 + w_1 x_1 + w_2 x_2 + w_3 x_3 + w_4 x_4$

A high score means "more likely to be delayed." A low score means "less likely to be delayed."

:::panel{tone="blue" title="What stays the same?"}
We still aggregate signals. We still learn weights from past examples. Logistic regression does not replace the previous brick. It builds directly on top of it.
:::

So far, the logic is almost identical to linear regression.

The problem is simple: a raw score can be any number. A probability must stay between `0` and `1`.

# Turning a score into a probability

To solve that, logistic regression passes the score through a very small mathematical function called the **sigmoid**:

$p = \frac{1}{1 + e^{-score}}$

This function squeezes any number into a probability:

- a very negative score becomes a probability close to `0`
- a score around `0` becomes a probability close to `0.5`
- a very positive score becomes a probability close to `1`

That is the whole trick.

Instead of stopping at a score, the model now says:

- "there is a `92%` chance this flight will be delayed"
- or "there is only a `14%` chance"

:::panel{tone="green" title="Logistic regression: a classification baseline"}
Logistic regression is one of the simplest and most useful tools for binary classification. It keeps the interpretability of a linear model while producing an output that humans can read as a probability.
:::

## Application: deciding if a flight will be delayed

:::codegroup
```python
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

# Generate sample data
np.random.seed(0)
n_samples = 1000
X = np.random.rand(n_samples, 4)  # weather, congestion, incoming delay, technical alert

# Build a latent score, then turn it into a probability
score = 4 * X[:, 0] + 3 * X[:, 1] + 2 * X[:, 2] + 1.5 * X[:, 3] - 4
probability = 1 / (1 + np.exp(-score))
y = (np.random.rand(n_samples) < probability).astype(int)  # 1 = delayed, 0 = on time

# Train the model
model = LogisticRegression()
model.fit(X, y)

# Make a prediction
# Right now: rough weather, busy airport, late incoming plane, no technical alert
new_data = np.array([[0.8, 0.7, 0.9, 0.1]])
predicted_probability = model.predict_proba(new_data)[0, 1]
decision = "Delayed" if predicted_probability >= 0.5 else "On time"

print(f"Probability of delay: {predicted_probability:.2%}")
print(f"Decision: {decision}")
```

```r
set.seed(0)

# Generate sample data
n_samples <- 1000
X <- matrix(runif(n_samples * 4), ncol = 4)  # weather, congestion, incoming delay, technical alert

# Build a latent score, then turn it into a probability
score <- 4 * X[, 1] + 3 * X[, 2] + 2 * X[, 3] + 1.5 * X[, 4] - 4
probability <- 1 / (1 + exp(-score))
y <- rbinom(n_samples, 1, probability)  # 1 = delayed, 0 = on time

data <- data.frame(
  y = y,
  weather = X[, 1],
  congestion = X[, 2],
  incoming_delay = X[, 3],
  technical_alert = X[, 4]
)

# Train the model
model <- glm(y ~ weather + congestion + incoming_delay + technical_alert, data = data, family = binomial())

# Make a prediction
# Right now: rough weather, busy airport, late incoming plane, no technical alert
new_data <- data.frame(weather = 0.8, congestion = 0.7, incoming_delay = 0.9, technical_alert = 0.1)
predicted_probability <- predict(model, newdata = new_data, type = "response")
decision <- ifelse(predicted_probability >= 0.5, "Delayed", "On time")

print(paste("Probability of delay:", sprintf("%.2f%%", predicted_probability * 100)))
print(paste("Decision:", decision))
```
:::

## When probability becomes a decision

A probability is already much more useful than a raw score. But in many situations, you still need an action.

The simplest rule is:

- if probability `>= 0.5`, predict `YES`
- if probability `< 0.5`, predict `NO`

In our example:

- `0.84` becomes "the flight will probably be delayed"
- `0.21` becomes "the flight will probably be on time"

:::panel{tone="red" title="Important nuance"}
The threshold is a decision rule, not a law of nature. If missing a delayed flight is very costly, you may prefer a lower threshold. If false alarms are expensive, you may prefer a higher one.
:::

This is your first glimpse of an important idea in AI: the model does the math, but the final decision also depends on business cost, context, and risk tolerance.

# Summary: logistic regression

:::panel{tone="green" title="What it is"}
A model that keeps the weighted aggregation logic of linear regression, then passes the result through a sigmoid to produce a probability for binary decisions.

$p = \frac{1}{1 + e^{-score}}$
:::

:::panel{tone="blue" title="Where it shines"}
- [v] Predicting binary outcomes: delay or not, spam or not, fraud or not
- [v] Producing probabilities instead of raw scores
- [v] Remaining interpretable and fast
- [v] Serving as a strong baseline before using more complex classifiers
:::

:::panel{tone="red" title="Its limits"}
- [!] It still draws a fairly simple decision boundary
- [!] It depends heavily on the quality of the input features
- [!] The threshold creates trade-offs between missed cases and false alarms
- [!] When relationships become more tangled, one layer is not enough
:::

# What's next?

Logistic regression is a powerful second brick. But it still stays close to a linear way of thinking.

Real life is often messier than that. Sometimes the relationship between signals and the final answer is too twisted to be captured by a single weighted score, even after a sigmoid.

In the next article, we add a new idea: instead of using one layer of computation, we stack several layers together.

That is where **neural networks** enter the story.

# Go further

- [Logistic regression - scikit-learn](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- [Generalized linear models - R documentation](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/glm.html)
- [Google Machine Learning Crash Course - Logistic Regression](https://developers.google.com/machine-learning/crash-course/logistic-regression)
- [StatQuest - Logistic Regression](https://www.youtube.com/watch?v=yIYKR4sgzI8)
