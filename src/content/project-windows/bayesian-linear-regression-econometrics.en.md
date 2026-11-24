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

- [v] I clarified the link between classical regression, regularization, and Bayesian modeling.
- [v] I implemented the estimators from scratch with `NumPy` and `SciPy`.
- [!] I present the economic results as a methodological illustration, not as causal evidence.

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

- [v] I connected the formulas to code anyone can inspect.
- [v] I use a Cholesky factorization for both the log determinant and the quadratic term, which is more stable.
- [!] My `Empirical Bayes` estimates a point hyperparameter; it is not a fully Bayesian model with a hyperprior.

# Value

## What I wanted to show
I wanted to understand Bayesian linear regression from the inside, without relying on a library: derive the estimators, code them with `NumPy` and `SciPy`, and see how `OLS`, `Ridge`, Bayesian regression, and `Empirical Bayes` line up on a single axis.

What interested me most is uncertainty. A coefficient is no longer a single value but a distribution, and the shrinkage effect is directly visible: for the R&D coefficient, the OLS estimate of about `-0.121` is pulled toward `-0.031`, with a smaller standard error.

## What I take from it
- [v] I linked the formulas to readable code, from OLS to Empirical Bayes, on one axis.
- [v] I dealt with numerical stability (Cholesky factorization) instead of stopping at the formulas.
- [!] The WBES results illustrate the method: I draw no causal conclusion about R&D.
