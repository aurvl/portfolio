---
slug: "ab-testing-new-model"
lang: "en"
title: "A/B Testing: The New Model"
summary: "Methodologically structured comparison of school-failure risk models, framed as an experimental evaluation with stratified randomization, paired analysis, and McNemar testing."
---

# Overview

## Project scope
This project does not present a simple side-by-side comparison of predictive scores. Its main interest lies in the fact that the evaluation itself is framed as an experimental design problem: how to compare a baseline model and a new model for school-failure risk without confusing real improvement with methodological bias.

That positioning matters because many machine learning comparisons stop at global metrics. Here, the central concern is whether the comparison protocol is defensible in the first place.

## Analytical positioning
The project stands out because it treats predictive evaluation as a statistical and experimental problem rather than a leaderboard exercise. Even with limited public documentation, the available material already indicates a more mature approach to model comparison than a standard “best score wins” benchmark.

The overall logic is therefore closer to applied evaluation design than to pure algorithm substitution.

# Method

## Documented protocol
The available project material describes a comparison between a baseline model and a `Random Forest`, with stratified randomization used to build comparable groups. The project also includes paired analysis on the same individuals, which strengthens the interpretation of any observed performance difference by bringing the comparison back to the case level.

This is a relevant design choice because it avoids relying only on aggregated metrics that may hide distributional or group-composition effects.

## What can be established
The documented use of the `McNemar` test is a strong methodological indicator. It shows that the comparison is not reduced to an accuracy gap, but structured around a test appropriate for two classifiers evaluated on the same observations. The project also references subgroup analysis, especially around socioeconomic background, which broadens the reading of the gains obtained.

The toolset listed in the available sources includes `R`, `Python`, and statistical comparison methods. At the same time, the public GitHub repository inspected for this project is effectively empty on the implementation side, which limits external verification of the exact pipeline and quantitative outputs.

- [v] Stratified randomization gives the evaluation a stronger comparative basis.
- [v] Paired analysis improves the interpretability of differences at the observation level.
- [v] McNemar testing reflects an explicit concern for methodological validity.
- [!] The public repository does not expose code, notebooks, or detailed evaluation outputs.
- [!] Quantitative claims cannot be independently reproduced from the currently available public sources.

## Structural significance
Taken together, the project points toward a framework where model comparison is treated as a design problem rather than as an automatic benchmark. That is its most distinctive aspect. The available documentation suggests a disciplined evaluation posture even if the public implementation remains incomplete.

The project therefore remains valuable, but it needs to be described with measured precision rather than overextended claims.

# Value

## What the project demonstrates
The project demonstrates an understanding that model evaluation is not only about algorithm choice. It also depends on how groups are constructed, how paired differences are measured, and how significance is assessed. That perspective is highly relevant in applied machine learning settings where decision quality depends on evaluation rigor.

The work also highlights a capacity to move beyond headline metrics and toward a more statistically grounded comparison logic.

## Professional relevance
The project fits a more mature analytical line than a standard benchmark comparison. The available structure shows concern for validity, subgroup interpretation, and defensible testing rather than for isolated score optimization.

The overall result is a project whose interest lies primarily in evaluation architecture. That is precisely what gives it substance despite the limits of the public repository.

## Limits and positioning
The project is best positioned as a documented evaluation framework with incomplete public implementation.
Its strongest contribution lies in experimental rigor and comparative design, not in externally reproducible benchmark code.

- [v] The project highlights methodological maturity in comparative evaluation.
- [v] The evaluation logic is more structured than a conventional model leaderboard.
- [v] The overall framing brings out a strong statistical sensibility.
- [!] Its public documentation supports the method more clearly than the implementation details.
