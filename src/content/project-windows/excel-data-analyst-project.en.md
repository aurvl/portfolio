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

## What makes the analysis credible
The technical side is essential, because this business reading only becomes credible if the analytical layer is reliable. I therefore documented the upstream work: messy raw files, explicit cleaning decisions, mapping logic, structured fact tables, and final reporting outputs.

- [v] I started from a concrete business storyline instead of a generic KPI display.
- [v] I framed the analysis on 2012-2014 to make it easier to read and defend.
- [!] I present the dataset as a portfolio case study, not as audited corporate reporting.

# Method

## Excel pipeline and reporting chain
The workflow follows a clear `raw -> clean -> fact -> reporting` logic inside Excel. Source files cover customers, products, sales orders, order lines, expenses, cash movements, budgets, and calendar data. The repository then separates the analytical workbook `eda.xlsx` from the reporting workbook `report.xlsx`, with Power Query acting as the bridge between data preparation and restitution.

This technical structure matters because the project does more than summarize sales. It standardizes labels, repairs dates, handles missing values, normalizes numeric fields, and applies explicit business rules before anything reaches the final dashboard. That makes the outputs traceable rather than cosmetic.

## KPI logic and analytical choices
The repository builds around explicit measures such as revenue, COGS, gross profit, gross margin, OPEX, net income, cash flow, ending cash, and budget-versus-actual comparisons. It also materializes intermediate analytical tables such as `fact_sales`, `fact_opex`, `fact_cash`, `financial_summary`, and `activity_survey`.

Several choices are especially relevant from an analyst perspective: replacing missing discounts with `0`, using the median for absent selling prices, keeping unknown categories visible instead of dropping rows, and preserving a readable path from raw inputs to management indicators. Those choices are what allow the commercial narrative to emerge with credibility: the late-2012 drop, the heavy dependence on bike categories, the weakness of VIP conversion, and the cross-sell opportunity in accessories.

# Value

## What I wanted to show
I wanted to turn imperfect business data into the backbone of a reporting layer, then into a commercial interpretation a manager can use. I do not stop at charts: I explain what the numbers imply for revenue stability, product-portfolio concentration, customer retention and demographic renewal.

## What I take from it
- [v] I put my Excel and Power Query skills at the service of business questions.
- [v] I turned historical sales data into recommendations for a manager.
- [v] I kept pipeline reliability and decision-support storytelling together.
- [!] The value comes from analyst reasoning and reporting structure, not from high software complexity.
