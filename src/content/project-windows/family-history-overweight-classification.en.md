---
slug: "family-history-overweight-classification"
lang: "en"
title: "Family History of Overweight Classification"
summary: "Comparison of classification models for predicting family history of overweight, with SMOTE, mixed-variable encoding, feature interpretation, and careful metric reading."
---

# Overview

## Project scope
This project addresses a binary classification problem built around health-related and behavioral variables: predicting whether an individual has a family history of overweight. The topic is straightforward, but the repository turns it into a more substantial workflow through preprocessing, imbalance handling, model comparison, and interpretation.

The main analytical interest lies in the fact that the project does not reduce performance assessment to a single score. It also examines model behavior and the coherence of the reported metrics.

## Analytical positioning
The project is situated in an applied machine learning logic where variable treatment and class balance matter as much as the classifier itself. That is what gives it substance beyond a standard “three models, one accuracy” exercise.

It also gains methodological value from the way contradictory outputs are treated, especially in the `XGBoost` case.

# Method

## Data preparation and modeling
The repository loads an obesity-related dataset, separates numeric, binary, and multi-level categorical variables, then applies an adapted encoding strategy, notably for `CAEC`, `CALC`, `MTRANS`, and `NObeyesdad`. The target is recoded into a binary variable, class imbalance is handled through `SMOTE`, and the dataset is split under an `80/20` logic.

Three models are then compared: `Logistic Regression`, `Random Forest` with `500` trees, and `XGBoost`. This combination is useful because it contrasts an interpretable linear baseline, a robust ensemble model, and a more sensitive boosting-based learner.

## Results and interpretation
The logistic regression reaches roughly `85.34%` accuracy with an `AUC-ROC` around `85.28%`. The `Random Forest` appears as the strongest compromise, with `94.43%` accuracy, `93.45%` F1-score, and `94.21%` AUC-ROC. `XGBoost`, however, produces a more problematic pattern: `57.14%` accuracy, zero recall, but a very high `AUC-ROC` (`97.99%`), which strongly suggests an issue related to thresholding, encoding, or implementation details.

The repository also includes feature-importance outputs and supporting visualizations, which improves interpretability and keeps the analysis from collapsing into a metric table alone.

- [v] I explicitly addressed class imbalance through `SMOTE`.
- [v] I compared several model families under the same prediction task.
- [v] The Random Forest results are consistent across multiple metrics.
- [!] The `XGBoost` outputs should be interpreted cautiously because the metric combination is internally inconsistent.
- [!] The project remains predictive and exploratory rather than causal in scope.

## Structural significance
Taken together, the project highlights an applied classification workflow where preprocessing, encoding, imbalance treatment, and metric interpretation are all visible parts of the method. That gives it a more serious analytical profile than a minimal benchmark.

The repository also shows that identifying suspicious results can be as valuable as identifying strong ones.

# Value

## What I wanted to show
I wanted to show several reflexes: cleanly preparing heterogeneous variables, handling class imbalance, comparing several models and refusing to take an isolated figure for the whole truth. Serious classification work is not about keeping the best score: you also have to interpret, diagnose and spot a result that looks inconsistent despite a flattering metric.

## What I take from it
- [v] I read the metrics critically.
- [v] I combined performance, interpretation and methodological caution.
- [!] The contribution is as much the critical analysis of the results as the best score obtained.
