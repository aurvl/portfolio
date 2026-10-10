---
slug: "insurance-claim-fraud-counterfactual-simulator"
lang: "en"
title: "Insurance Fraud: Detecting and Justifying Suspicious Claims"
summary: "A fraud detection and explanation method built on an insurer's existing claims data, so teams know which files to review and why."
---

# Overview

## The insurer's situation
The insurer already has its data flow: claim files arrive (forms, PDFs, photos) and are stored in a PostgreSQL database linking customers, policies and claims. What it lacks is not data but a method: nothing tells the team which files are suspicious, or why.

Claim handlers therefore review files one by one, with no clear priority, and struggle to justify an investigation to a customer or to their management.

## What is at stake
The portfolio holds `54,248` claims, about `7.0%` of them fraudulent. A fraudulent claim costs `€15,600` on average, against `€6,300` for a regular one. Fraud exposure reaches about `€8.5M` a year.

The question is simple: **how to flag suspicious files and explain why they are flagged**, without flooding the investigation team with false alarms?

## Example: a file that comes in

Illustrative file, built from the claim profiles in the project.

| What the file contains | Value |
|---|---|
| Claim type | Bodily injury after a car accident |
| Claimed amount | €18,400 (a regular claim costs €6,300 on average) |
| Same customer's last claim | 3 months ago |
| Service provider | a clinic already often linked to suspicious files |
| Attachments | form, medical quote as a PDF, photo of the vehicle |

For the claim handler, nothing sets this file apart from the dozens received the same week.

:::panel{tone="green" title="What the method brings to this file"}
- **Fraud score: 0.91**, above the 0.83 alert threshold. The file moves to the top of the investigation list.
- **Why it stands out:** an amount three times the average, a claim very close to the previous one and a provider already flagged.
- **What would have changed the decision:** with an amount of about €9,800 and more than a year since the last claim, the file would not have been flagged.
- **Suggested action:** ask the clinic for the original quote and check the customer's history before paying.
:::

# Method

## 1. Understand where fraud sits
A first diagnostic of the insurer's existing data shows where risk concentrates: `bodily injury` and `fire` claims have the highest fraud rates, and some service providers stay consistently above the rest of the network. This diagnostic guides the rest of the method.

## 2. A score calibrated on investigation capacity
Several models are compared. The selected one, `XGBoost`, gives each file a fraud probability. The key point is the decision threshold: instead of the default `0.50`, it is set at `0.83`, favouring precision while still catching at least `20%` of frauds. **Every alert costs investigation time**: a few reliable alerts beat many doubtful ones.

## 3. An explanation for every flagged file
A score alone convinces nobody. For each risky file, the method produces a counterfactual: what would have had to be different for the file not to be flagged (a lower claimed amount, a longer delay since the previous claim…). The handler gets a concrete argument that can be discussed.

## 4. Plug the method into the existing flow
The method is delivered as an API (FastAPI) that plugs into the insurer's flow: a file comes in, the API returns the fraud probability, the decision and, when useful, the counterfactual. Nothing needs rebuilding on the data side.

# Value

## What the insurer gains
On a first batch of `100` recent files, `4%` exceed the alert threshold: the team knows where to look first. `bodily injury` files carry the highest average score in that batch and suspicious providers are over-represented, which gives an immediate line of investigation.

{purple}In several high-risk files, the decision flips with plausible changes, such as a lower claimed amount or a longer delay since the previous claim{/purple}. This is not proof of fraud, but an explanation the team can check.

- [v] A priority list of files to review, sized to the number of available investigators.
- [v] A readable reason for every alert, which can be shown to a handler or a customer.
- [v] A method that adds to the insurer's existing tools, with no rebuild of its data.

## What the project shows
The project shows a consulting approach: start from a client's real situation, identify what is missing, and propose a method that answers its main constraint, investigation time. Modelling serves the decision, not the other way round.
