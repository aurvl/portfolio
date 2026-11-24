---
slug: "technological-employment-gender-inequalities"
lang: "en"
title: "Technological Employment and Gender Inequalities"
summary: "Spatial econometrics study of female unemployment across European regions, linking technological employment, HRST variables, and neighborhood effects."
---

# Overview

## Research objective
This project examines how technological employment and science-related qualifications are associated with female unemployment across European regions.
The repository is grounded in a spatial econometrics perspective, which is appropriate because labor-market outcomes rarely stop at administrative borders.

The study covers `NUTS2` regions from `2012` to `2021` across `France`, `Spain`, `Italy`, `the Netherlands`, and `Belgium`.
That perimeter gives the analysis both a longitudinal and a territorial dimension.

## Why the project matters
The core interest of the repository lies in its refusal to treat regional labor markets as isolated observations.
Technology-intensive employment, neighboring specialization, and human-capital concentration can all produce spillovers that standard regressions miss.

This makes the project more than a descriptive labor-market notebook.
It is an applied research exercise on how regional structure and spatial dependence shape gendered employment outcomes.

- [v] I addressed a socially and economically relevant question with an appropriate regional lens.
- [v] I treated spatial dependence as a methodological requirement, not as a secondary refinement.
- [!] The interpretation remains observational and should not be read as a causal policy proof.

# Method

## Data and regional structure
The repository compiles Eurostat indicators over ten years at `NUTS2` level.
It focuses on female unemployment as the outcome variable and relates it to technology employment, `HRST`, `STEM`, and education variables.

This variable set creates a useful tension in interpretation.
Technology jobs and science-related human capital may improve opportunities in some regions while also reflecting structural selection or mismatch in others.

## Econometric framework
The implementation uses the `plm`, `splm`, `spdep`, and `sf` ecosystems in `R`.
That stack is well suited to panel and spatial specifications where regional adjacency and temporal structure both matter.

The repository considers `SAR`, `SEM`, and `SAC` type models.
This is an important design choice because different spatial processes imply different readings of local and neighboring effects.

## Main findings
The reported results indicate that technological employment is associated with lower female unemployment both locally and through neighboring spillovers.
By contrast, higher `HRST` and `STEM` concentrations are associated with an increase in female unemployment in the estimated setting, while education tends to reduce it.

These results are analytically interesting because they show that innovation-oriented indicators do not all act in the same direction.
The study therefore avoids a simplistic equation between technological intensity and uniformly better labor outcomes.

- [v] I used a method aligned with the geographic structure of the data.
- [v] I used multiple spatial specifications to make the interpretation more robust than a single baseline model.
- [v] My findings preserve complexity instead of forcing a uniformly positive technology narrative.
- [!] Stronger causal claims would require additional identification strategy and institutional controls.

# Value

## What I wanted to show
I wanted to translate a concrete public question into an explicit modeling framework: spatial econometrics, panel reasoning, socio-economic interpretation on regional data. I made room for mixed effects and non-intuitive results instead of flattening them, integrating territory as the central analytical variable in the reasoning about employment inequalities.

## What I take from it
- [v] I practiced spatial panel modeling on an important socio-economic topic.
- [v] I interpreted regional spillovers without oversimplification.
- [!] My value is analytical and methodological, not that of a one-sided policy message.
