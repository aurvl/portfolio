---
slug: "fear-greed-index-estimator"
lang: "en"
title: "Fear & Greed Index Estimator"
summary: "Transparent reconstruction of a market sentiment index from public data, with financial proxies, robust scoring, statistical calibration, and a web-facing interface."
---

# Overview

## Project scope
This project addresses a very specific problem in market analytics: the difficulty of understanding how a widely cited sentiment index is actually constructed. Instead of treating the Fear & Greed Index as an opaque signal, the project rebuilds a similar indicator from public financial data in a form that can be inspected, discussed, and reused.

The work is not limited to reproducing an existing reference for convenience. It is structured as a transparent analytical pipeline, where the assumptions, proxies, normalization logic, and aggregation steps are visible and therefore open to scrutiny.

## Analytical positioning
The project sits at the intersection of market data collection, feature engineering, statistical calibration, and deployment. This combination is what makes it valuable: the output is not merely a score, but a measurable and interpretable market sentiment framework.

The overall logic is therefore closer to indicator engineering than to speculative black-box modeling. That distinction matters, because the project explicitly prioritizes transparency alongside usefulness.

# Method

## Signal construction
The pipeline draws data from Yahoo Finance and FRED in order to approximate several dimensions of market sentiment, including momentum, breadth, safe-haven demand, high-yield spreads, relative volatility, and in some cases a proxy for put/call behavior. Each sub-signal is then converted into a normalized score based on rolling historical behavior.

Normalization is one of the strongest components of the implementation. The repository uses long historical windows, `min_periods=252`, a `1260`-observation window, and winsorization between `1` and `99` to limit the influence of extreme values. This produces a more stable scoring process than a naive point-in-time normalization.

## Aggregation and evaluation
The final index can be aggregated by a simple mean or through a calibrated linear model under `scikit-learn`. The repository reports a substantial gap between the naive version and the calibrated version, with the latter reaching approximately `RMSE ≈ 6.31` and `R² ≈ 0.897`.

The notebooks also include a regime-based reading of the estimated index, with an accuracy around `76%` and a weighted `F1` close to `0.76`. This does not turn the system into an institutional benchmark, but it does show that the indicator captures meaningful structure rather than a purely cosmetic resemblance.

- [v] I normalized each component on its own history, robustly to extremes.
- [v] The calibrated version improves reconstruction fidelity over the naive aggregation (RMSE ≈ 6.31, R² ≈ 0.897).
- [v] I extended the analysis with an API and a web interface.
- [!] Some components of the reference index are approximated through proxies rather than directly observed inputs.
- [!] My repository is neither an institutional benchmark nor an exhaustive validation system.

## Delivery layer
The project is not confined to notebooks. It also includes an API and a web-facing interface, which turns the analytical pipeline into a usable service. That extension matters because it shows how an index estimator can be exposed as a consultable tool rather than remaining an isolated experiment.

The architecture retained here therefore combines data sourcing, normalization, calibration, and delivery in a way that remains coherent from end to end.

# Value

## What I wanted to show
I wanted to break a complex financial indicator into measurable components, then recombine them into a coherent framework: multi-source data, financial feature engineering, robust normalization, statistical calibration. I want the score to be explained rather than presented as a mysterious output.

## What I take from it
- [v] I built a transparent indicator, from raw data to a consultable estimator.
- [v] I combined quantitative reasoning with a concern for practical use.
- [!] This is a public estimator of market sentiment, not an official market reference.
