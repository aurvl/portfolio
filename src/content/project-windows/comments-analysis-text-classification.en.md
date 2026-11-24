---
slug: "comments-analysis-text-classification"
lang: "en"
title: "Comments Analysis: Text Classification Pipeline"
summary: "NLP pipeline for YouTube comments, from extraction to supervised classification, with alternative labeling strategies, TF-IDF features, baseline models, and interpretation outputs."
---

# Overview

## Project scope
This project analyzes a corpus of YouTube comments collected from a sports media video centered on Ousmane Dembélé and the Ballon d'Or 2025 discussion. While the topic is accessible, the corpus itself is a realistic NLP setting: short and noisy texts, mixed tone, irony, punctuation-heavy reactions, and highly variable language use.

The repository is therefore not just a classification exercise. It is a practical text-processing workflow that starts with raw user comments and moves through labeling, cleaning, feature extraction, model comparison, and interpretation.

## Analytical positioning
The project is valuable because it treats text classification as a data problem before treating it as a modeling problem. That positioning is important in applied NLP, where annotation quality, label design, and corpus preparation usually shape the outcome more than the choice between baseline classifiers.

The work also stays grounded in a realistic scale and in an interpretable modeling approach, which gives it more credibility than an over-engineered sentiment pipeline built on weak labels and opaque outputs.

# Method

## Corpus construction
The repository works with `3,242` comments extracted and stored in CSV format. Two labeling strategies are implemented. One relies on `cardiffnlp/twitter-xlm-roberta-base-sentiment`, while the other uses a more heuristic combination of lexicons and emojis. This dual setup is methodologically important because it makes the impact of supervision design immediately visible.

Once the text is cleaned, the main representation is based on `TF-IDF` with uni-grams and bi-grams, using `min_df=2` and `max_df=0.9`. The train/test split is stratified, and the classification step compares `Logistic Regression`, `Linear SVC`, and `Decision Tree`.

## Results and interpretation
The best results reported in `tp_min_results.csv` are around `0.789` accuracy for `Linear SVC` and `Decision Tree`, with slightly lower performance for logistic regression. Beyond the score table, the repository also generates more informative outputs: word clouds, discriminative term analysis, `t-SNE` projections, and prediction review exports.

That interpretation layer matters because it keeps the project from collapsing into a scoreboard. The implementation remains focused on understanding what the pipeline learns and where the limits of the labeling scheme begin to shape the outcome.

- [v] My workflow covers extraction, preprocessing, vectorization, training, and interpretation.
- [v] I chose models well aligned with TF-IDF features and corpus size.
- [v] I treated alternative labeling strategies as part of the analytical problem.
- [!] My labels are not based on a manually curated gold-standard annotation set.
- [!] Neutral and negative content may partially collapse depending on the labeling path retained.

## Structural significance
Taken together, the repository highlights a practical NLP pipeline built on imperfect but realistic data. The architecture retained here is not centered on model complexity. It is centered on controllable preprocessing, interpretable baselines, and visible trade-offs in supervision quality.

That orientation gives the project a stronger analytical identity than a purely benchmark-driven experiment.

# Value

## What I wanted to show
I wanted to work with noisy text, build a pragmatic supervised framework and keep a critical distance from the metrics. For me, in many applied NLP pipelines, the structure of the labels weighs as much as the choice of model.

## What I take from it
- [v] I kept preprocessing, supervision and interpretation visible at every step.
- [v] I built a concrete and technically readable pipeline.
- [!] This is a realistic applied pipeline, not a general solution to sentiment analysis.
