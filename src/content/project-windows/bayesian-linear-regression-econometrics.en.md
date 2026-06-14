---
slug: "bayesian-linear-regression-econometrics"
lang: "en"
title: "Bayesian Linear Regression in Econometrics"
summary: "From-scratch econometrics project unifying OLS, Ridge, Bayesian regression, and Empirical Bayes to show shrinkage, posterior uncertainty, and marginal likelihood on an economic dataset."
---

# Overview

## Project logic
This project rebuilds Bayesian linear regression from the ground up and places it within a broader family of linear models.
The objective is methodological: show how `OLS`, `Ridge`, Bayesian regression, and `Empirical Bayes` can be understood on the same axis.

The central topic is uncertainty.
Instead of treating coefficients as isolated point estimates, the Bayesian model represents them as posterior distributions.
This makes it possible to inspect a central estimate, variance, and shrinkage effect at the same time.

The WBES 2023 economic dataset is used as a concrete illustration around innovation, R&D, and sales growth.
It is not used to defend a strong causal economic conclusion.

- [v] The project clarifies the link between classical regression, regularization, and Bayesian modeling.
- [v] The estimators are implemented from scratch with `NumPy` and `SciPy`.
- [!] The economic results should be read as a methodological illustration, not as causal evidence.

# Method

## Implemented models
The repository implements several linear estimators in `modules.py`:
`OLSRegression`, `RidgeRegression`, `BayesianRegression`, and `EmpiricalBayesianRegression`.

The progression is deliberately pedagogical.
A flat prior recovers the intuition of OLS, a zero-mean Gaussian prior leads to Ridge-like shrinkage, and `Empirical Bayes` learns the prior strength from the data through the marginal likelihood.

The project makes coefficient shrinkage visible.
In the R&D coefficient example, the OLS estimate around `-0.121` is pulled toward `-0.031` in the Bayesian version, with a smaller standard error.

## Numerical stability
The `Empirical Bayes` component optimizes a `tau^2` hyperparameter from the log marginal likelihood.
The computation uses a Cholesky factorization to avoid explicit inversion of the covariance matrix.

This decision matters.
It shows that the project does not only write down formulas, but also handles numerical issues that appear in a real implementation.

- [v] The project connects formulas to inspectable code.
- [v] Cholesky is used for both the log determinant and the quadratic term in a more stable way.
- [!] `Empirical Bayes` estimates a point hyperparameter; it is not a fully Bayesian model with a hyperprior.

# Value

## What the project demonstrates
This project shows a strong understanding of linear models beyond calling a library.
It explains why regularization can be read as a probabilistic assumption, and how posterior uncertainty helps interpret weak or noisy coefficients.

The portfolio value is the bridge between econometrics and probabilistic machine learning.
The project does not only present a final metric: it shows the mechanism, assumptions, and limits.

## Professional positioning
The project is especially useful for demonstrating statistical modeling foundations.
It shows the ability to derive, implement, and compare estimators while keeping a cautious interpretation of economic data.

The measuring-tape cover supports that message.
It evokes estimation, imperfect measurement, and uncertainty, which fits the Bayesian framing of the project.

- [v] Strong project for showing statistical foundations.
- [v] Clear articulation between OLS, Ridge, Bayes, and Empirical Bayes.
- [!] Present it as a methodological project, not as a definitive economic study on R&D.
