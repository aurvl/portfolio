---
slug: "okuns-law-economic-indicators"
lang: "en"
title: "Analysis of Economic Indicators: Okun's Law"
summary: "Econometric study of GDP growth and unemployment dynamics, using cross-country data to examine the strength and limits of Okun's Law."
---

# Overview

## Analytical objective
This project studies the relationship between economic growth and unemployment through the lens of Okun's Law.
The repository uses macroeconomic indicators to test whether variations in output are associated with the expected labor market response across countries.

The subject is classical, but it remains useful.
Okun's Law is a good vehicle for demonstrating how empirical macroeconomic regularities can be evaluated rather than simply cited.

## Why the project is relevant
The interest of the project lies in confronting theory with observed data.
Instead of treating growth and unemployment as abstract textbook variables, the repository compares their relationship across multiple national contexts.

This approach matters because macroeconomic relationships are rarely uniform.
The same broad law may hold differently depending on labor market structure, productivity dynamics, and country-specific shocks.

- [v] I turned a standard macroeconomic concept into a measurable empirical exercise.
- [v] I compared pooled and country-level behavior instead of assuming perfect homogeneity.
- [!] The analysis remains parsimonious and should not be read as a structural macroeconomic model.

# Method

## Data and specification
The repository combines Eurostat indicators on GDP growth and unemployment with an additional Serbian productivity source.
This data choice broadens the study and allows the analysis to include a case that does not fit as neatly into the main European pattern.

The empirical workflow relies on linear regressions, both on pooled observations and on country-specific subsets.
That design is appropriate for testing whether the expected negative growth-unemployment association appears consistently across contexts.

## Comparative reading
The project does not stop at a single aggregate coefficient.
It uses country-level views and visual diagnostics to show that the relationship varies materially across the sample.

Serbia appears as a relevant outlier in the repository.
This is analytically useful because it highlights how productivity patterns and local economic structure can weaken or reshape the standard Okun interpretation.

## Methodological discipline
The repository remains close to the evidence.
It uses a simple and readable specification, which keeps the empirical claim proportionate to the available variables and the intended scope of the project.

That restraint is a strength rather than a weakness.
It keeps the study interpretable and makes the country differences easier to discuss.

- [v] I compared pooled and disaggregated regressions instead of relying on one average result.
- [v] I treated outlier behavior as analytical information rather than as noise to discard automatically.
- [v] I kept the specification readable and consistent with the project scale.
- [!] Additional controls would be needed for stronger causal interpretation.

# Value

## What I wanted to show
I wanted to start from a simple theoretical framework, confront it properly with the data and accept that an interesting result can be a departure from theory. For me, data are there to reason with, not to illustrate an idea that is already closed: the diagnosis matters as much as the shape of the estimated coefficient.

## What I take from it
- [v] I treated a well-known macroeconomic relationship as a hypothesis to test, not as an established result.
- [v] I linked conceptual framework, public data and the reading of anomalies.
- [!] My strength is the quality of the interpretation, not the complexity of the model.
