---
slug: "factorial-analysis-mixed-data"
lang: "en"
title: "Factorial Analysis of Mixed Data"
summary: "Factorial analysis of mixed data on the UCI Adult dataset in order to map socio-economic structures combining quantitative and qualitative variables."
---

# Overview

## Project scope
This project deliberately moves away from a purely predictive logic and focuses instead on structural data exploration. Its objective is to apply `FAMD` to the UCI `Adult` dataset in order to understand how quantitative and categorical socio-economic variables organize themselves within a reduced factorial space.

That orientation is analytically valuable because it foregrounds interpretation and dimensional structure rather than forcing the dataset into a supervised task too early.

## Analytical positioning
The project is positioned around mixed-data analysis, which is what makes it distinctive. It deals with a genuine mixed-variable setting where neither PCA alone nor MCA alone would fully capture the structure of the dataset.

The result is a project centered on multivariate reasoning rather than predictive performance.

# Method

## Data preparation and FAMD
The workflow loads the `Adult` dataset, removes the `education` variable as redundant with `education_num`, converts categorical variables to factors, and removes rows containing `?` in selected fields. The cleaned dataset contains around `30,162` individuals, which provides a substantial basis for factor analysis.

The analysis is performed through `FactoMineR::FAMD` on a dataset composed of `8` categorical variables and `6` quantitative variables. The repository then generates the expected outputs of a serious factorial workflow: eigenvalues, screeplots, variable contributions, representation quality, and projected individual coordinates.

## Interpretive outputs
The project highlights that the first dimension is mainly driven by `relationship`, `marital_status`, and `income`, while the second dimension is more strongly structured by `occupation`, `relationship`, and `gender`. These results matter because they show that the extracted dimensions are not arbitrary compression axes but interpretable socio-economic structures.

The visual outputs also help clarify how categorical modalities and quantitative variables relate to each other across dimensions, which is precisely the strength of FAMD in mixed-data settings.

- [v] The workflow is aligned with the specific requirements of mixed-variable analysis.
- [v] The preprocessing choices are explicit and methodologically coherent.
- [v] The extracted dimensions are interpreted rather than left as abstract components.
- [!] Final figures and tables are not fully frozen in the repository outputs.
- [!] Reproducibility depends partly on a live UCI dataset download.

## Structural significance
Taken together, the project shows how mixed data can be explored in a disciplined way before any predictive model is considered. The implementation foregrounds dimensional structure, variable contribution, and interpretability.

This gives the project a strong analytical identity despite the absence of a predictive score.

# Value

## What the project demonstrates
The project demonstrates competence in multivariate analysis, mixed-data preparation, and interpretive reading of factorial outputs. It shows how categorical and quantitative variables can be analyzed jointly without reducing one family to an awkward encoding workaround.

It also highlights a broader analytical skill: the ability to organize a complex variable space before turning it into a downstream modeling problem.

## Professional relevance
The project broadens the analytical profile beyond benchmark-oriented machine learning. It shows a capacity to use exploratory multivariate tools in a rigorous way and to derive interpretable structure from a socio-economic dataset.

The overall result highlights methodological range, interpretive discipline, and comfort with mixed-data analysis frameworks.

## Limits and positioning
The repository is best positioned as an exploratory multivariate analysis rather than as a predictive workflow.
Its strongest contribution lies in dimensional interpretation and mixed-variable treatment, which are often absent from more standard data projects.

- [v] The project highlights a less common but highly relevant analytical skill set.
- [v] The implementation shows clear control over FAMD-oriented workflow design.
- [v] The structure brings out interpretation as a primary analytical objective.
- [!] Its value lies in multivariate insight rather than in a conventional performance metric.
