---
slug: "logistic-threshold-decisions"
seriesSlug: "ia-pas-a-pas"
lang: "en"
title: "When a score becomes a decision"
summary: "Why a classification model does not simply answer yes or no, but first estimates a probability that must then be converted into a decision."
date: "2026-03-28"
tags:
  - "classification"
  - "probabilities"
  - "ai"
cover: "/assets/blog/images/blog6.jpg"
featured: true
---

# Introduction

After regression, a more practical question appears quickly: how do we turn a model output into a clean binary decision?

In many situations, we do not only want to predict a value. We want to decide:

- spam or not
- fraud or not
- churn or not

## The real role of probability

A good classification model often starts by estimating a probability. That step matters because it preserves more information than a raw answer.

:::panel{tone="green" title="A better way to read a model"}
Saying that a customer has a `0.82` probability of churn is more useful than simply saying "yes".
:::

Once we have that probability, we can choose a threshold that fits the context.

## Not every threshold is equal

A `0.5` threshold is not a law of nature. It is only a common default.

- [v] in fraud detection, we may prefer a wider net
- [v] in marketing, we may target only the strongest cases
- [!] a poor threshold can cost more than a poor model

## Minimal example

```python title="Probability then threshold"
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

## What to keep in mind

- [v] the model first estimates a probability
- [v] the final decision also depends on the chosen threshold
- [v] the threshold should reflect business risk

## Why this step matters

Understanding the shift from score to decision makes it easier to discuss a model with non-technical stakeholders. It also forces us to talk about error cost, which is often more useful than a single overall metric.
