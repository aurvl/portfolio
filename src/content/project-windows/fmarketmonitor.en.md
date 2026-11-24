---
slug: "fmarketmonitor"
lang: "en"
title: "FMarketMonitor"
summary: "A research prototype: an observatory that turns hundreds of U.S. economic series into 15 readable, dated and traceable indicators, built only from the data available at each date."
---

# Overview

## Project scope
FMarketMonitor (FinancialMarketMonitor) is the measurement layer of a larger project: a macroeconomic and financial observatory. It is designed to summarize hundreds of U.S. economic statistics into 15 indicators, one per major economic and financial concept. Each indicator is scored from 0 to 100 and comes with its sub-scores, the contribution of each series and a confidence level.

## The problem
The economy is described by hundreds of series, published at different paces and then revised. It is hard to know what to watch, how to read it, and how to tell a real change from a revision or a data gap. A real example: the October 2025 unemployment figure was never collected because of the U.S. government shutdown.

The aim is to decide on a short, justified reading of the context rather than to react to one series or one news item. The tool is built first for an individual saver who wants to beat inflation (the author), and more broadly for investors, analysts and researchers.

## Where it stands
It is a research prototype. The first indicator (Concept 01: growth, activity, employment) is built and tested, month by month, in a notebook. The 14 others will follow the same method. The terminal (the interface), the forecasts and the strategies come later; the terminal is designed, not built.

# Method

## A research process repeated for each concept
Each concept will have its own calculation method, but every one is built and validated the same way. Concept 01 is the first complete pass.

1. **Define the concept** from official scientific and institutional references (NBER, the Chicago Fed's CFNAI, the Philadelphia Fed's ADS index), so that the indicator measures what institutions and science recognize, not an invented concept.
2. **Collect each series with all its published versions** (ALFRED vintages) into a database where nothing is ever overwritten. This makes it possible to rebuild what was known on each date and never to use information from the future.
3. **Write a sheet per series** (role, expected sign, publication lag, substitute) and apply safeguards: at least 10 to 15 years of history and coverage of the 2008 crisis. Series are chosen on economic grounds and data quality, never because they "work" on recessions.
4. **Write and seal the validation protocol before any calculation**: 8 numerical criteria, comparison with 3 references (CFNAI-MA3, ADS, an equal-weights score), and two held-out periods (06/2007 to 12/2009 and 01/2023 to 10/2026) that can be looked at only once. This prevents choosing the method after seeing the result.
5. **Build the score** with a dynamic factor model and a Kalman filter, re-estimated every month on the past only. Variants are tested one by one under rules fixed in advance, then a single variant is submitted to the held-out periods.

## Data and tools
Sources are FRED and ALFRED (St. Louis Fed), which distribute series produced by the BLS, the BEA, the Federal Reserve (G.17) and the Census Bureau, plus the Philadelphia Fed (ADS index), the Chicago Fed (CFNAI), the San Francisco Fed (Daily News Sentiment Index) and the NBER recession dates. The catalogue holds 85 variables, 26 of them linked to Concept 01. 22 FRED series were collected with their vintages for this concept, and the final indicator uses 8 of them. The selection sample is 365 months; the evaluation runs from 1990 to October 2026.

The stack is Python (statsmodels, dynamic factor model), SQL and PostgreSQL 16. The database is split into layers (reference, raw data, transformations, models, indicators, validation, forecasts); it is bitemporal and append-only, with modifications blocked by triggers. About 25 collection connectors feed it, and results are shown in a Jupyter notebook.

## First verifiable result
On the 2008 recession, which belonged to a held-out period, the indicator recomputed in real time spots the recession months with an average precision (PR-AUC) of 0.934, against 0.918 for the Chicago Fed's CFNAI-MA3 and 0.829 for an equal-weights score. Over 1990 to 2026, it scores 0.718 against 0.671, with no false alarm (CFNAI-MA3: 1; equal weights: 4).

It was obtained with 8 series, a model re-estimated every month on the past only, criteria and thresholds written before the calculation, and a held-out period consulted once (on 24 November 2026).

## What is not proven
- **The verdict of my own protocol is NOT VALIDATED.** One criterion fails: stability against revisions is slightly worse than for the equal-weights score (3.1% of months against 1.9%, both far below the 10% threshold).
- Two weaknesses were measured: removing the unemployment rate can move the score by 48 points, and agreement with the ADS index is weak.
- The 2008 recession is flagged 5 months after its peak.
- The gap with the CFNAI (0.934 against 0.918) is small and rests on a single recession.
- The settings of this recipe were originally chosen by someone who already knew 2001, 2008 and 2020, so the 2008 test is not completely blind.
- No forecast, no strategy and no financial performance is demonstrated.

[!] Known data limits: vintages start late for some series (before that, the work is in pseudo real time), the October 2025 gap, real consumption (PCEC96) available only since 2007, the ADS index available only in its latest version, orders in current dollars, and January jumps in household-survey employment.

# Value

## What the project demonstrates
- **Economics and econometrics:** an activity index of the CFNAI and ADS type (dynamic factor model, Kalman filter, real-time data), confronted with NBER recessions under a protocol written in advance, with negative verdicts published too.
- **Data and engineering:** a bitemporal PostgreSQL database where every figure keeps the period it describes, its publication date, its source and the method that used it, without ever overwriting anything. What the system knew on any date can be reconstructed.
- **Communication:** the database is documented through a real story (the November 2025 unemployment rate, published at 4.6% then revised to 4.5%), and each series of tests is summed up in one sentence with a clear verdict.

## What comes next
Write a new protocol (C01_VAL_v2) before any improvement, with a prospective test on months published after 22 November 2026, then correct the dependence on unemployment and the lag. After that: the terminal, the 14 other concepts and the regime and decision layer.

## Limits and positioning
This is not a trading system, not a price-forecasting tool and not investment advice. No licensed data is used (the ISM series was excluded for that reason). The project is not published yet: no code or demo is linked, and its strongest contribution so far is the discipline of its validation, not a performance claim.
