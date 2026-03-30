---
slug: "regression-multiple-aggregation"
seriesSlug: "ia-pas-a-pas"
lang: "en"
title: "Deciding with numbers"
summary: "A simple introduction to the core idea behind many models: aggregate several signals, assign weights, and produce a decision."
date: "2026-03-26"
tags:
  - "ai"
  - "regression"
  - "intuition"
cover: "/assets/blog/images/blog6.jpg"
featured: true
---

# Introduction

When people look at AI from a distance, they often imagine an opaque machine. In practice, a large part of the basic logic can be reduced to something much simpler: combine several pieces of information and turn them into a useful answer.

That first step matters because it changes how we read a model. Instead of a black box, we see a mechanism: signals, weights, then a decision.

## A very human logic

When you choose an apartment, you already aggregate information:

- price
- location
- overall condition
- distance to work

- [v] You compare several criteria at once.
- [v] You give them different importance.
- [v] You end with a decision.

A linear model does exactly that, only more systematically.

## From signal to prediction

We can summarize that logic with a very simple form: `y = f(X)`.

- `X` represents the input information
- `y` represents the expected output

In regression, the model learns how to transform several variables into a target value. The idea is not magical:

- [v] each variable contributes part of the information
- [v] each variable receives a weight
- [!] not every signal has the same usefulness

:::panel{tone="blue" title="Key point"}
Regression does not invent an answer. It searches for a combination of signals that matches past observations as closely as possible.
:::

## A concrete example

Imagine an electricity consumption estimate. We use:

- temperature
- hour of the day
- type of day
- whether there is a special event

A linear model searches for a simple relation between those inputs and the observed consumption.

```python title="Simple linear regression"
import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([
    [8, 18, 0, 1],
    [14, 12, 0, 0],
    [3, 19, 1, 1],
    [17, 11, 1, 0],
])
y = np.array([84, 52, 96, 43])

model = LinearRegression()
model.fit(X, y)

prediction = model.predict(np.array([[6, 18, 0, 1]]))
print(prediction[0])
```

## Why this building block matters

This kind of model stays simple, but it establishes the basis for many other approaches.

- [v] It learns from historical data.
- [v] It formalizes a relation between signals and outcomes.
- [v] It lets us reason about the relative effect of variables.

## Natural limitation

Linear regression works well when we want to predict a continuous value. If we need to answer a yes-or-no question instead, we need another family of models.

That is exactly where probabilistic logic enters the picture in the next article of the series.
