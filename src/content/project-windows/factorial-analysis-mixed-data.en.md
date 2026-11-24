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

- [v] I aligned the workflow with the specific requirements of mixed-variable analysis.
- [v] I made the preprocessing choices explicit and methodologically coherent.
- [v] I interpreted the extracted dimensions rather than leaving them as abstract components.
- [!] Final figures and tables are not fully frozen in the repository outputs.
- [!] Reproducibility depends partly on a live UCI dataset download.

## Structural significance
Taken together, the project shows how mixed data can be explored in a disciplined way before any predictive model is considered. The implementation foregrounds dimensional structure, variable contribution, and interpretability.

This gives the project a strong analytical identity despite the absence of a predictive score.

# Value

## What I wanted to show
I wanted to work cleanly with mixed data and produce a structured interpretation of a factorial space: a useful skill in data exploration, quantitative social science and the upstream phase of modeling. Knowing how to organize a complex space of variables before choosing a supervised model is often decisive.

## What I take from it
- [v] I used dimension reduction as a tool for interpretation, not as an automatic preprocessing step.
- [v] I care about multivariate analysis and reading latent structures, not only prediction.
- [!] My strength is interpretation and rigor of reading, not a single performance figure.
