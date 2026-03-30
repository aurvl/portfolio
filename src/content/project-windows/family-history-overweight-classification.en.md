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

- [v] The workflow explicitly addresses class imbalance through `SMOTE`.
- [v] Several model families are compared under the same prediction task.
- [v] The Random Forest results are consistent across multiple metrics.
- [!] The `XGBoost` outputs should be interpreted cautiously because the metric combination is internally inconsistent.
- [!] The project remains predictive and exploratory rather than causal in scope.

## Structural significance
Taken together, the project highlights an applied classification workflow where preprocessing, encoding, imbalance treatment, and metric interpretation are all visible parts of the method. That gives it a more serious analytical profile than a minimal benchmark.

The repository also shows that identifying suspicious results can be as valuable as identifying strong ones.

# Value

## What the project demonstrates
The project demonstrates competence in mixed-variable preprocessing, imbalance handling, baseline comparison, and critical reading of classification outputs. It also shows that model evaluation is not reduced to maximizing one favorable metric.

That broader analytical posture gives the work more professional substance than a model ranking alone would provide.

## Professional relevance
The project fits an applied machine learning logic centered on clean tabular preparation and disciplined evaluation. The implementation shows an ability to question contradictory outputs instead of treating every high number as a sign of model quality.

The overall result highlights method control, interpretability, and caution in reading performance claims.

## Limits and positioning
The repository is best understood as a classification study whose value comes partly from detecting instability in the modeling results.
Its strongest contribution lies in preprocessing discipline and metric interpretation rather than in a single headline score.

- [v] The project highlights practical mastery of tabular classification workflow design.
- [v] The analysis keeps model behavior and metric coherence in view.
- [v] The implementation foregrounds method and interpretation rather than score presentation.
- [!] Its strongest contribution lies in the analytical handling of the workflow rather than in the nominal best metric alone.
