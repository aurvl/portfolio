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

- [v] I defined an explicit feature set aligned with a practical forecasting workflow.
- [v] I deployed the model in an interface rather than leaving it confined to notebooks.
- [v] I documented both metrics and inference logic.
- [!] The evaluation setup could be stricter from a time-series validation standpoint.
- [!] Strong numerical scores should not be read as evidence of stable market robustness.

## Structural significance
Taken together, the project shows a full forecasting chain: market data preparation, feature engineering, sequential modeling, and interactive output. The architecture retained here is valuable because it keeps the modeling logic visible and exposes the points where methodological caution is required.

That balance between implementation and critical reading is one of the strongest aspects of the project.

# Value

## What I wanted to show
I wanted to build a complete forecasting chain on financial data: feature preparation, sequential modeling and application delivery, keeping the methodological constraints that condition the interpretation of the scores visible. For me, the deep learning model is worth as much for the structure of the pipeline as for its results.

## What I take from it
- [v] I linked preparation, sequential learning, interface and a cautious reading of the evaluation.
- [v] I put the method and its constraints forward rather than an announcement effect.
- [!] My strength is the clarity of the pipeline, not a promise of robust market prediction.
