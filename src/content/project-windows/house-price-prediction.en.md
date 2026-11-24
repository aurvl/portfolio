---
slug: "house-price-prediction"
lang: "en"
title: "House Price Prediction"
summary: "Supervised learning workflow for housing valuation, combining cleaning, feature preparation, baseline modeling, and model comparison."
---

# Overview

## Problem framing
This project addresses a standard but still instructive regression task: estimating house prices from property and area-level attributes.
The repository works on a housing dataset with roughly `5,000` observations and uses that material to build a compact end-to-end predictive workflow.

The interest of the project lies less in novelty than in execution quality.
Housing valuation is a useful benchmark because it requires careful preprocessing, sensible model comparison, and restrained interpretation of performance.

## Why the subject matters
Price prediction problems are easy to oversimplify.
In practice, they involve mixed feature types, noisy signals, outliers, and strong sensitivity to data preparation choices.

This gives the repository analytical value.
It shows how a familiar supervised learning problem can still reveal important decisions about data cleaning, feature selection, scaling, and evaluation.

- [v] I chose a concrete regression objective with direct business meaning.
- [v] My workflow covers more than fitting a single model on a pre-cleaned file.
- [!] The problem remains bounded by the representativeness of the sample and the available feature set.

# Method

## Data preparation
The preprocessing stage removes the `Address` field, which is a reasonable simplification when a raw text location column is not being geocoded or encoded explicitly.
Missing values are imputed with medians, and outliers are handled through an `IQR`-based strategy.

These decisions are methodologically coherent for a baseline workflow.
They reduce instability without introducing an unnecessarily complex feature engineering stack.

## Modeling choices
The repository compares two approaches: `Linear Regression` and `KNN Regressor`.
This comparison is useful because the models rely on very different assumptions about structure, smoothness, and locality.

Feature scaling is applied before modeling, which is especially important for distance-based methods such as `KNN`.
The final results show a clear advantage for the linear model on the prepared dataset.

## Reported performance
The linear regression model reaches a test `R²` close to `0.858`, while the `KNN` alternative remains around `0.749`.
This suggests that, in this feature space, the global linear trend captures the structure of the target better than local neighborhood averaging.

The repository also reveals a practical caution point.
One script appears to invert the argument order in `r2_score`, which does not erase the broader comparison but does call for attention when interpreting exact values.

- [v] I compared baseline models with distinct inductive biases.
- [v] I made the preprocessing steps explicit and easy to audit.
- [v] I integrated scaling where it matters.
- [!] Evaluation details require minor cleanup to make the reported scores fully robust.

# Value

## What I wanted to show
I wanted to pose a regression problem properly, clean the data before training and compare different approaches without losing sight of the importance of the upstream pipeline. I am not trying to impress: good discipline on the data and a reasonable reading of the results are worth more than a stack of complex models on a simple case.

## What I take from it
- [v] I favored the quality of the pipeline over the complexity of the model.
- [v] I explicitly identified the weaknesses of my notebook where technical details deserve correction.
- [!] This is a clean regression pipeline, not an exhaustive benchmark of house-price prediction.
