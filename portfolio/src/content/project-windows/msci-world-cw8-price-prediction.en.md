---
slug: "msci-world-cw8-price-prediction"
lang: "en"
title: "MSCI World CW8 Price Prediction"
summary: "LSTM-based forecasting pipeline for the CW8 ETF, combining technical features, temporal sequences, and a Streamlit interface for visualization and projection."
---

# Overview

## Project scope
This project addresses a highly visible financial forecasting problem: modeling the price dynamics of `CW8.PA`, an ETF tracking the MSCI World. The practical interest of the repository lies less in claiming precise prediction and more in showing how a coherent forecasting pipeline can be assembled from market data through to an interactive application.

The work is therefore best understood as a structured time-series modeling project rather than as a promise of reliable market prediction.

## Analytical positioning
The repository exposes several parts of the modeling chain: feature construction, sequence preparation, recurrent architecture design, and deployment through `Streamlit`. This broader scope gives the project more substance than a notebook that simply fits an LSTM on raw price data.

It also creates room for a more serious discussion of evaluation, because the apparent quality of the result can be assessed against the way the pipeline was actually built.

# Method

## Data preparation and features
The model relies on market data enriched with technical and calendar-related variables such as `lag_1_week`, `Vol_1_month`, `SMA20`, `SMA50`, `RSI(10)`, and returns. The input data is scaled with `MinMaxScaler` and converted into sequences of length `10` before being passed to the recurrent network.

This is a relevant design because the repository does not train purely on raw price levels. It attempts to encode short-term market structure through a compact set of engineered features.

## Model, deployment, and limits
The architecture stacks three `LSTM` layers with dropout and a dense head. The deployment layer is implemented through `Streamlit`, with `Plotly` visualizations and recursive forecasting over roughly thirty business days.

The metrics reported in `src/metrics.txt` are strong on paper, with `MAE 11.68`, `RMSE 14.42`, and `R² 0.9773`. At the same time, the repository also exposes meaningful limitations: the train/test split is not fully time-consistent on the sequence side, and there are slight discrepancies between some training and inference feature updates, notably `shift(5)` versus `shift(7)` in recursive logic.

- [v] The feature set is explicit and aligned with a practical forecasting workflow.
- [v] The model is deployed in an interface rather than remaining confined to notebooks.
- [v] The repository documents both metrics and inference logic.
- [!] The evaluation setup could be stricter from a time-series validation standpoint.
- [!] Strong numerical scores should not be read as evidence of stable market robustness.

## Structural significance
Taken together, the project shows a full forecasting chain: market data preparation, feature engineering, sequential modeling, and interactive output. The architecture retained here is valuable because it keeps the modeling logic visible and exposes the points where methodological caution is required.

That balance between implementation and critical reading is one of the strongest aspects of the project.

# Value

## What the project demonstrates
The project demonstrates an ability to build a complete time-series workflow around financial data, including feature preparation, recurrent modeling, and delivery through an application layer. It also highlights awareness of the methodological issues that matter in forecasting work.

That combination is important because a technically appealing model is only useful when the assumptions and evaluation constraints remain visible.

## Professional relevance
Within a broader analytical line, the project fits applied quantitative modeling rather than a speculative trading narrative. The implementation shows how deep learning can be integrated into a structured financial pipeline while still leaving space for critical assessment of the results.

The overall result brings out competence in sequential modeling, practical deployment, and disciplined interpretation of forecasting outputs.

## Limits and positioning
The repository is best positioned as a forecasting prototype with an application layer.
Its strongest contribution lies in end-to-end pipeline design and methodological transparency rather than in any claim of robust market predictability.

- [v] The project highlights mastery of a full financial forecasting workflow.
- [v] The implementation bridges modeling and product-facing delivery.
- [v] The overall structure foregrounds method and constraints rather than overstatement.
- [!] Its strongest contribution lies in the clarity of the pipeline, not in the claim of predictive certainty.
