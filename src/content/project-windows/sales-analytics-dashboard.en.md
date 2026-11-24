---
slug: "sales-analytics-dashboard"
lang: "en"
title: "Sales Analytics Dashboard"
summary: "End-to-end BI workflow transforming raw retail sales into business-oriented SQL views, customer and product segments, and a decision-ready Power BI dashboard."
---

# Overview

## Project scope
This project is built around a practical business intelligence problem: turning raw retail sales into an analytical layer that can support commercial monitoring, customer analysis, and catalog review. The emphasis is not limited to dashboard presentation. It lies in the way data is modeled upstream so that reporting becomes consistent, interpretable, and operationally relevant.

The overall structure places the project in a classic BI chain: source data, SQL transformation, analytical views, and Power BI reporting. What gives the work substance is the fact that the business logic is already visible in the data layer rather than being deferred to visual formatting alone.

## Analytical positioning
The repository works on a dataset large enough to support meaningful aggregation, with roughly `60,398` sales rows, `18,484` customers, and `295` products. This scale is sufficient to move beyond a toy example and into questions related to concentration of revenue, customer value, product ranking, and segment performance.

The project therefore sits in a decision-support logic rather than a simple dashboarding exercise. It focuses on how raw transactions can be reorganized into indicators that clarify where value is created, which customers matter most, and which products sustain or weaken overall performance.

# Method

## Data layer and analytical views
The core of the implementation relies on PostgreSQL. The dataset is reorganized through dedicated analytical views, notably `gold.report_customers`, `gold.report_products`, and `gold.report_overview`. These views form a semantic layer that simplifies downstream reporting and makes the business rules explicit.

This structure matters because the project does not treat SQL as a simple aggregation tool. It encodes customer recency, frequency, customer value, average order value, product performance, and a gross profit estimate directly in the analytical layer. As a result, Power BI consumes already-interpretable business objects rather than raw tables.

## Technical choices
Customer segmentation is implemented through categories such as `VIP`, `Regular`, and `New`, which immediately align the project with CRM and retention logic. Product segmentation is also explicit, with `High-Performer`, `Mid-Performer`, and `Low-Performer` categories that support a structured reading of catalog performance.

The repository also uses window functions in `business_analytics.sql` to compute cumulative values and year-over-year comparisons. This is a relevant design choice because it shows analytical SQL proficiency beyond flat `GROUP BY` summaries. The resulting workflow is closer to a reporting-ready business model than to a simple export of summary tables.

- [v] I organized the views around real business questions.
- [v] I built the customer and product segmentation directly into the analytical layer.
- [v] I used window functions to add temporal depth to the reporting.
- [!] Data ingestion still depends on local CSV paths, so the pipeline is not fully automated end to end.

## Operational outputs
The Power BI layer consolidates the analytical work into a dashboard oriented toward revenue, average order value, customer value, recency, segmentation, and product performance. The overall architecture therefore links raw sales, SQL logic, and reporting output in a single, readable chain.

Taken together, the implementation shows how a commercial reporting layer can be designed as a data product rather than a set of disconnected charts. The architecture retained here makes that logic explicit.

# Value

## What I wanted to show
I wanted to turn transactional data into a structured steering layer: business-oriented modeling, analytical SQL, KPI definition and BI reporting. For me, the value of a dashboard comes more from the quality of the data model than from its visual finish.

## What I take from it
- [v] I applied analytical SQL to business needs.
- [v] I clearly linked data modeling to the dashboard output.
- [v] I aimed at decision support, not a simple visual demonstration.
- [!] My strength is analytical design, not infrastructure industrialization.
