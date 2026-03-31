---
slug: "regression-multiple-aggregation"
seriesSlug: "ia-pas-a-pas"
lang: "en"
title: "Deciding with numbers"
summary: "A simple introduction to the core idea behind most models: aggregating multiple signals, assigning them weights, and producing a decision."
date: "2026-03-26"
tags:
  - "regression"
  - "aggregation"
  - "ai"
cover: "/assets/blog/images/blog6.jpg"
featured: true
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

Everyone is talking about artificial intelligence. And the first reaction is almost always the same: *"it must be incredibly complicated."*

Makes sense, right? It talks. It reads documents. It answers questions. It writes code. It generates images. And you think: I do not even know how I speak, how my brain works, or how I make decisions. So a machine that does all of that must be something completely out of reach, reserved for engineers with PhDs.

Except no.

Because AI is built on a ridiculously simple idea. One you already use every day without realising it.

That idea is **information aggregation**: gathering several signals, weighing them, and turning them into a decision.

It is exactly what you do when you pick a restaurant in the evening. You check the reviews, the price, the distance, whether your friends liked it. You add all of that up in your head and you decide. You just did AI without knowing it.

This entire series rests on one idea:

> `y = f(X)` - an AI is a function that transforms input information `X` into a response `y`.

If you understand that, you already understand 80% of what matters. The rest is sophistication.

In this article, we lay the first brick. The foundation. No jargon, no complex maths - just the core intuition everything else is built on.

# The power plant: your brain already does AI

Imagine a manager at a power plant. This morning, they need to decide whether the grid will hold tonight.

- They check the weather: it is `-8 C` outside.
- They check the calendar: it is a Monday, and there is a big match on TV tonight.
- They check the time: it is peak hour.
- [v] They put it all together in their head and they decide.

What just happened is exactly what an AI model does. No more, no less. It takes information, assigns weights to it, adds it all up, and produces a response.

:::panel{tone="red" title="The difference?"}
It does this across millions of examples, in a few milliseconds, without ever getting tired.
:::

# Weighing information to make a decision

Let us stay in the power plant. You now want to predict the electricity consumption of the neighbourhood tonight. You have several pieces of information:

* $x_1$ = outside temperature (C)
* $x_2$ = time of day
* $x_3$ = day of the week
* $x_4$ = special event tonight (match, concert)

The machine will learn an equation of this form:

$Consumption = w_1 x_1 + w_2 x_2 + w_3 x_3 + w_4 x_4$

:::panel{tone="red" title="What are $w_1$, $w_2$... exactly?"}
They are weights - coefficients the machine adjusts automatically from thousands of past examples. It learns that temperature matters a lot, that peak hour does too, and that Sunday is very different from Monday.
:::

This is not magic. It is optimisation: **finding the weights that minimise the gap between what it predicts and what actually happened** - just like you adjust a recipe until it is right.

:::panel{tone="blue" title="The coach analogy"}
A coach evaluating players rates each one on speed, passing, and physical endurance. They multiply each score by its importance:

- speed counts double in attack
- passing counts for `1.5`
- physical endurance counts for `1`

They add everything up to get a final score.

- [v] This is what we call **linear regression**: learning which factors matter, and how much.
:::

:::panel{tone="green" title="Linear regression: a foundational tool"}
Linear regression is the basic tool for this kind of weighted aggregation. It is simple, fast, and often surprisingly effective for predicting continuous values.
:::

[Go further](https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares)

## Application: predicting electricity consumption

:::codegroup
```python
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

# Generate sample data
np.random.seed(0)
n_samples = 1000
X = np.random.rand(n_samples, 4)  # 4 features: temperature, hour, day, event
y = 10 * X[:, 0] + 5 * X[:, 1] + np.random.rand(n_samples)  # consumption with some noise

# Train the model
model = LinearRegression()  # machine that learns the optimal configuration to make good predictions
model.fit(X, y)  # show the data and target so it can learn the weights

# Make a prediction
# Right now: temperature = 15 C, hour = 6pm, day = Thursday, event = match
new_data = np.array([[0.15, 0.75, 0, 1]])  # normalised between 0 and 1
predicted_consumption = model.predict(new_data)
print(f"Predicted consumption: {predicted_consumption[0]:.2f} MW")
```

```r
library(MASS)
set.seed(0)

# Generate sample data
n_samples <- 1000
X <- matrix(runif(n_samples * 4), ncol = 4)  # 4 features: temperature, hour, day, event
y <- 10 * X[, 1] + 5 * X[, 2] + rnorm(n_samples)  # consumption with some noise

# Train the model
model <- lm(y ~ X)

# Make a prediction
# Right now: temperature = 15 C, hour = 6pm, day = Thursday, event = match
new_data <- data.frame(X1 = 0.15, X2 = 0.75, X3 = 0, X4 = 1)  # normalised between 0 and 1
predicted_consumption <- predict(model, newdata = new_data)
print(paste("Predicted consumption:", round(predicted_consumption, 2), "MW"))
```
:::

## Strengths and limits of this approach

- [v] Predict a continuous value: electricity consumption, revenue, delivery time.
- [!] Answer `YES` or `NO` - and that is where we need to go one step further.

# Summary: linear regression

:::panel{tone="green" title="What it is"}
A model that learns to **weigh information** to predict a continuous value. It searches for the weights $w_1, w_2, ..., w_n$ that minimise the gap between its predictions and reality.

$y = w_0 + w_1 x_1 + w_2 x_2 + ... + w_n x_n$
:::

:::panel{tone="blue" title="Where it shines"}
- [v] Predicting continuous values: electricity consumption, revenue, delivery time
- [v] Interpretable results: you can read the weights and understand what matters
- [v] Fast to train, easy to deploy
- [v] A solid baseline - always test this first before adding complexity
:::

:::panel{tone="red" title="Its limits"}
- [!] It assumes the relationship between X and y is **linear** - if reality is more complex, it fails
- [!] Sensitive to outliers - one extreme value can pull the weights in the wrong direction
- [!] It cannot answer YES or NO - it produces a number, not a decision
:::

# What's next?

Linear regression is powerful. But it has one clear limit: it predicts numbers, not decisions.

In real AI applications, many questions are binary - is this email spam? Will this flight be delayed? Is this transaction fraudulent? If we used our equation directly, we would get values like `1.7` or `-0.3`. Hard to turn that into a clear decision. And impossible to talk in terms of probabilities.

In the next article, we introduce the brick that solves exactly this problem: **{purple}logistic regression{/purple}** - and with it, a small mathematical function that will change the way you see things.

It is called the {purple}sigmoid{/purple}. And once you have seen it, you will spot it everywhere.

# Go further

- [Linear regression - scikit-learn](https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares)
- [Linear regression - R documentation](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/lm.html)
- [Gradient descent visualised](https://distill.pub/2017/momentum/)
- [StatQuest - Linear Regression](https://www.youtube.com/watch?v=nk2CQITm_eo)
