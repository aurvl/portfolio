---
slug: "belgian-trade-time-series"
lang: "en"
title: "Analysis of Belgian Exports and Imports (1995-2023)"
summary: "Quarterly macroeconomic time-series study of Belgian exports and imports, combining stationarity diagnostics, VAR modeling, Granger causality, cointegration checks, and ten-quarter forecasting."
---

# Overview

## Project scope
This project studies Belgian foreign trade through a classical econometric time-series framework.
It examines exports and imports over the period `1995` to `2023` in order to characterize their dynamics, test their statistical properties, and produce forecasts over ten quarters.

The repository works on `116` quarterly observations drawn from Eurostat.
The series are expressed in chained volumes based on `2010`, seasonally adjusted, calendar adjusted, and measured in millions of euros.
This gives the analysis a serious macroeconomic footing while keeping the system narrow enough to remain interpretable.

## Economic positioning
Belgium is one of the most open economies in the euro area, so trade flows are structurally central to its economic profile.
That makes exports and imports more than descriptive aggregates.
They are variables through which competitiveness, external demand, and domestic absorption can be read jointly.

The interest of the project lies in combining economic interpretation with formal statistical diagnostics.
Instead of describing levels only, the work checks whether the series are stationary, whether they influence each other dynamically, and which forecasting framework is appropriate under those conditions.

# Method

## Univariate diagnostics
The first stage uses log-transformed exports and imports, noted `logEXP` and `logIMP`.
Plots and correlograms show clear upward trends and slow autocorrelation decay, which already suggests non-stationarity.
The analysis then differentiates the series and inspects the new correlograms to test whether the transformed processes behave more like stationary fluctuations.

An augmented Dickey-Fuller procedure is used to formalize the diagnosis.
The lag choice is guided by the Akaike criterion, with one lag retained for the ADF specification.
The conclusion is that the level series are non-stationary and behave like random walks with drift.
This result justifies moving to a VAR model in differences rather than estimating a system directly in levels.

## Multivariate modeling
The multivariate core of the project is a `VAR(4)` model.
The lag order is retained through AIC and gives the system enough flexibility to capture quarterly feedback and delayed trade effects.
The report notes that lagged coefficients at four quarters appear especially important, which is analytically interesting because it points to annual persistence in trade dynamics.

The project then applies Granger-causality testing.
The conclusion is bidirectional causality: past export variations help predict imports, and past import variations help predict exports.
This is a meaningful result in a trade setting, because the two flows are not treated as isolated trajectories but as mutually informative components of the same external-account structure.

## Cointegration and forecasting
The study also checks whether exports and imports are cointegrated.
It estimates a candidate long-run relation, tests the residuals, and concludes that they remain non-stationary.
Under that result, a VECM is not retained.
The forecasting stage therefore remains based on the differenced `VAR(4)` specification.

The model produces a ten-quarter projection running to `2026-Q2`.
In the forecast table, exports rise from about `96.87` billion euros in `2023-Q4` to roughly `108.66` billion in `2026-Q2`.
Imports rise from about `94.62` billion euros to roughly `106.14` billion over the same horizon.
The confidence bands widen over time, which is consistent with the increasing uncertainty of medium-range macroeconomic forecasting.

- [v] The project follows a complete classical time-series workflow from diagnostics to forecasting.
- [v] Model choice is justified by statistical properties of the data rather than by convenience.
- [v] The report distinguishes clearly between non-stationarity, causality, cointegration, and forecast construction.
- [!] The system is deliberately narrow and excludes other macro drivers such as prices, demand shocks, or exchange-rate conditions.
- [!] Forecasts remain conditional on historical structure and cannot absorb abrupt regime changes by themselves.

## Technical reading
From a methodological standpoint, the project is well structured.
It separates univariate and multivariate reasoning, uses the appropriate tests at each stage, and avoids forcing a cointegration framework when the residual diagnostics do not support it.

This matters because many small forecasting projects jump directly to prediction.
Here, the forecast is presented as the consequence of earlier modeling decisions.
That sequence gives the report analytical coherence.

# Value

## What the project demonstrates
The project demonstrates competence in applied econometrics on macroeconomic time series.
It shows the ability to diagnose non-stationarity, justify transformations, choose a lag structure, interpret Granger tests, reject an unsupported VECM route, and translate a VAR model into concrete forecast paths.

It also shows a useful balance between interpretation and technique.
The statistical apparatus is not used as ornament.
It directly determines which model can or cannot be defended.
That is an important sign of rigor in empirical economic work.

## Portfolio relevance
Taken together, the repository highlights a capacity to handle formal forecasting problems with a disciplined sequence of tests and decisions.
It moves beyond descriptive macro commentary and demonstrates a real modeling chain with explicit assumptions.

The output is also professionally legible.
The forecast table, the confidence intervals, and the diagnostic stages make the work easy to audit conceptually.
The overall structure therefore brings out competence in empirical reasoning, not only in software execution.

- [v] The project highlights rigorous econometric workflow design.
- [v] It demonstrates interpretable forecasting rather than black-box prediction.
- [v] The report connects statistical evidence to economic reading in a disciplined way.
- [!] Its scope is intentionally focused on a small two-variable trade system rather than a broader macroeconomic model.
