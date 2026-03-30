---
slug: "gradient-descent-intuition"
seriesSlug: "ia-pas-a-pas"
lang: "en"
title: "How a model actually adjusts itself"
summary: "A simple intuition for gradient descent: observe the error, move in a better direction, and repeat until the model stabilizes."
date: "2026-03-30"
tags:
  - "optimization"
  - "gradient-descent"
  - "ai"
cover: "/assets/blog/images/blog6.jpg"
featured: false
---

# Introduction

Once we understand that a model combines signals, one question remains: how does it find the right weights?

The standard answer is gradient descent. The term sounds technical, but the core idea is simple.

## A progressive adjustment logic

The model starts from an imperfect configuration, measures its error, then adjusts its parameters to reduce that error.

- [v] we observe the gap between prediction and reality
- [v] we slightly update the weights
- [v] we repeat the process many times

## A useful intuition

Imagine walking down a hill in the fog. You do not know the full map of the terrain, but you can still feel whether your last step moved you downward or not.

:::panel{tone="blue" title="Useful intuition"}
Gradient descent is not a magical formula. It is a local improvement procedure, repeated long enough to reach a more stable area.
:::

## Compact example

```python title="Iterative update"
weight = 4.0
learning_rate = 0.1

for _ in range(5):
    gradient = 2 * (weight - 1)
    weight = weight - learning_rate * gradient
    print(round(weight, 4))
```

In this example, the weight gradually moves closer to `1`, which represents the best value here.

## Two common pitfalls

- [!] a step that is too large can make training diverge
- [!] a step that is too small can make training unnecessarily slow

## Why this matters

Understanding that logic makes it easier to read concepts such as `learning_rate`, epochs, and training stability. It is not limited to deep learning: it is a core idea behind how many models learn.
