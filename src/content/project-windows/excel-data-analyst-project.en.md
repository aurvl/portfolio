---
slug: "excel-data-analyst-project"
lang: "en"
title: "Excel Sales Performance Analysis (2012-2014)"
summary: "Excel sales analysis project combining data cleaning, KPI modeling, and management reporting to examine a 2012-2014 commercial trajectory marked by revenue volatility, product concentration, and retention issues."
---

# Overview

## Historical business angle
This project is framed first as a 2012-2014 commercial analysis, then as an Excel implementation. The final report reads like a management diagnosis: around `EUR 8M` in sales, roughly `25k` orders, and a visible break in momentum after late 2012. The point is not only to visualize activity, but to understand what sits behind that shift: revenue volatility, product concentration, client mix, and retention weaknesses.

That storyline gives the work substance. The company appears capable of acquiring customers at scale, yet fragile on several strategic dimensions. Bicycle sales dominate revenue, accessory cross-sell remains underused, VIP retention softens over time, and the age structure raises long-term renewal questions. The project therefore behaves like a real commercial review rather than a simple dashboard showcase.

## Why the project matters
The technical side is still important, because this business reading only becomes credible if the analytical layer is reliable. The repository shows the upstream work needed to support that diagnosis: messy raw files, explicit cleaning decisions, mapping logic, structured fact tables, and final reporting outputs.

- [v] The project stays grounded in a concrete business storyline instead of generic KPI display.
- [v] The historical 2012-2014 framing makes the analysis easier to interpret and defend.
- [!] The dataset is best understood as a serious portfolio case study, not as audited corporate reporting.

# Method

## Excel pipeline and reporting chain
The workflow follows a clear `raw -> clean -> fact -> reporting` logic inside Excel. Source files cover customers, products, sales orders, order lines, expenses, cash movements, budgets, and calendar data. The repository then separates the analytical workbook `eda.xlsx` from the reporting workbook `report.xlsx`, with Power Query acting as the bridge between data preparation and restitution.

This technical structure matters because the project does more than summarize sales. It standardizes labels, repairs dates, handles missing values, normalizes numeric fields, and applies explicit business rules before anything reaches the final dashboard. That makes the outputs traceable rather than cosmetic.

## KPI logic and analytical choices
The repository builds around explicit measures such as revenue, COGS, gross profit, gross margin, OPEX, net income, cash flow, ending cash, and budget-versus-actual comparisons. It also materializes intermediate analytical tables such as `fact_sales`, `fact_opex`, `fact_cash`, `financial_summary`, and `activity_survey`.

Several choices are especially relevant from an analyst perspective: replacing missing discounts with `0`, using the median for absent selling prices, keeping unknown categories visible instead of dropping rows, and preserving a readable path from raw inputs to management indicators. Those choices are what allow the commercial narrative to emerge with credibility: the late-2012 drop, the heavy dependence on bike categories, the weakness of VIP conversion, and the cross-sell opportunity in accessories.

# Value

## What the project demonstrates
This project shows more than spreadsheet comfort. It demonstrates the ability to turn imperfect business data into a structured reporting backbone, then convert that backbone into a commercial interpretation that a manager could actually use. The value lies in the combination of technical discipline and business reading.

It also highlights an analyst posture that is useful in real teams: do not stop at charts, explain what the numbers imply. Here, the reporting layer supports concrete questions about revenue stability, portfolio concentration, customer retention, and demographic renewal.

## Portfolio relevance
For a portfolio, the strongest point is the balance between execution and interpretation. The repository proves that the Excel pipeline is real: cleaning, mapping, fact-table design, KPI construction, and Power Query refresh logic. The final report proves that the work is not just technical plumbing: it turns those outputs into strategic recommendations around retention, diversification, upsell, and commercial resilience.

- [v] Demonstrates Excel and Power Query reporting skills grounded in business questions.
- [v] Translates historical sales data into management-facing recommendations.
- [v] Balances pipeline credibility with decision-support storytelling.
- [!] Its value comes more from analyst reasoning and reporting structure than from software engineering complexity.
