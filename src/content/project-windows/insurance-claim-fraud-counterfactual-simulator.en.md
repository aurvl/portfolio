---
slug: "insurance-claim-fraud-counterfactual-simulator"
lang: "en"
title: "Insurance Claim Fraud Detection & Counterfactual Decision Support"
summary: "End-to-end insurance fraud workflow combining JSON, PDF, and image intake, PostgreSQL analytics, tuned scoring, and counterfactual explanations to help claim teams investigate risky files and justify decisions."
---

# Overview

## Business context
This project is built around a realistic insurance-claims workflow rather than around a standalone fraud notebook. A claim package arrives with structured CRM fields, a PDF attachment, and an image attachment. The operational question is not only whether the file looks suspicious, but also how to organize intake, storage, analysis, scoring, and explanation in one coherent process.

The business objective is decision support. The project is designed to help fraud and claims teams prioritize risky files, understand what drives a suspicious score, and document why a case should be escalated or reviewed. In that sense, the model is only one layer inside a broader business system.

## Why the project matters
The historical synthetic portfolio contains `54,248` claims, with a fraud rate close to `7.0%`. Fraudulent claims are materially more expensive than non-fraudulent ones: the average fraudulent amount is about `15.6k`, versus `6.3k` for the rest of the portfolio. At the portfolio level, the annual fraud exposure is about `8.5M` per year on average, which gives the scoring and prioritization problem a clear business rationale.

The exploratory work also surfaces concrete operational signals. `bodily injury` and `fire` claims concentrate the highest fraud rates, while several service providers show persistently elevated suspiciousness levels. The point of the project is therefore not to automate a binary answer in isolation, but to create a usable analytical layer for fraud investigation.

# Method

## End-to-end workflow
The pipeline starts from multimodal intake. Claim packages are generated and handled as `JSON + PDF + image`, then passed through a local extraction layer that consolidates the package into structured records. PostgreSQL acts as the system of record, with a relational structure organized around customers, policies, and reported claims.

This architecture matters because it mirrors how an insurer would actually work.

## Analytical and modeling choices
The analysis begins in SQL. The project includes business exploration scripts and reusable analytical views to answer questions such as portfolio fraud rate, suspicious providers, claim-type exposure, temporal patterns, and production-risk mix. This makes the modeling stage an extension of the analytical diagnosis rather than an isolated machine-learning step.

On the modeling side, the project compares multiple candidates and imbalance strategies, then tunes the decision threshold for operational use instead of keeping the default `0.50`. The retained deployment model is an `XGBoost` model with oversampling and a tuned threshold of `0.83`, selected with a precision-first objective under a minimum recall (`20%`) constraint. This is a more realistic deployment posture for fraud review teams, where **false positives and investigation cost matter**.

## Production and counterfactual layer
The FastAPI service exposes package (JSON, PDF, image) intake, claim scoring, and counterfactual generation. Once a package is ingested, the API returns a fraud probability, a model decision, and, when useful, a heuristic counterfactual showing what would need to change for the file to look less suspicious.

This final layer is what makes the project distinctive. It turns a scoring system into a decision-support tool that can be discussed with business users, not only with technical stakeholders.

# Value

## Business insights and operational value
The project shows how to move from raw insurance inputs to actionable fraud analysis. On the reserved production-like flow, the first `100` scored files show a small but meaningful set of high-priority cases: `4%` are above the active deployment threshold, `17%` score above `0.50`, and `bodily injury` files carry the highest average risk score in that first operational slice. Suspicious providers are also over-represented, which gives analysts an immediate investigation angle.

The counterfactual layer adds another business signal. {purple}In several high-risk examples, the model can be flipped by more plausible claim conditions such as a lower claim amount or a longer gap since the previous claim{/purple}. This does not provide a legal truth, but it does help explain which factors are materially driving the fraud suspicion and which cases deserve closer review.

[v] The project combines structured data, documents, images, SQL analytics, and FastAPI into a single insurance workflow.
[v] The tuned threshold and top-risk ranking make the model usable for claims review, not just for offline evaluation.
[v] The counterfactual layer gives a concrete explanation of what would need to change to reduce fraud suspicion.

## What this proves in a portfolio
From a hiring perspective, this project demonstrates more than model training. It shows the ability to build an end-to-end insurance analytics workflow combining structured data, documents, images, relational storage, analytical SQL, production-style APIs, tuned fraud scoring, and explanation logic in one coherent system.

It is especially relevant for roles that sit at the intersection of data science, data engineering, and business-facing product work. The strongest signal is not only that a model was trained, but that the whole workflow was designed to be understandable, operable, and useful for fraud analysis.
