---
slug: "allocine-tv-series-scraping"
lang: "en"
title: "AlloCiné TV Series Scraping Project"
summary: "Web scraping pipeline extracting TV series metadata from local AlloCiné HTML pages, structuring the result in SQL, and extending it with a small R-based statistical analysis."
---

# Overview

## Project scope
This project addresses the upstream part of an analytics workflow: collecting, cleaning, and structuring data before interpretation begins.
The repository extracts TV-series information from AlloCiné HTML pages and turns that material into a reusable dataset for SQL querying and statistical analysis.

The work is grounded in `57` locally saved pages and does not rely on an official API.
That point is central to the project.
The technical problem is not only to gather values, but to recover structure from semi-structured web content and keep enough consistency for downstream use.

## Why the project matters
Many small data projects begin with a dataset that is already tabular and ready for modeling.
This repository documents the opposite situation.
It starts with raw HTML, converts it into a DataFrame, then carries the result into a database and a separate analysis notebook.

The result is therefore more than a scraping script.
It is a compact data pipeline moving from extraction to storage and then to analytical validation.

# Method

## Extraction workflow
The notebook `scraping_series.ipynb` parses AlloCiné pages and retrieves fields such as title, status, period, duration, genre, director, main character, nationality, channel, press rating, audience rating, number of seasons, number of episodes, and description.
The logic relies on Python, regular expressions, and HTML text cleaning.

This implementation choice is coherent with the source format.
Because the data is embedded in saved pages rather than exposed by a structured API, the pipeline must isolate recurring textual patterns and normalize them manually.
The repository therefore highlights a common practical issue in data work: the quality of the analytical result depends heavily on the extraction layer.

## Storage and query layer
Once extracted, the dataset is imported into a SQL table called `series`.
The schema defined in `series.sql` preserves a broad descriptive structure with ratings, review counts, episode duration, seasons, episodes, and free-text description.
This is useful because it allows the same dataset to support several analytical angles without collapsing everything into a single summary table.

The SQL script then groups the data by status, genre, nationality, and channel.
It also computes averages and ranking queries for press ratings, audience ratings, and review intensity.
That design shows an understanding that scraping is only one stage of the workflow.
The second stage is to turn raw extractions into questions that can be queried cleanly.

## Statistical extension
The repository extends the dataset with `analysis.Rmd`, which studies the relation between episode duration and audience rating.
This additional step gives the project more depth than a simple collection exercise.
It tests whether a plausible explanatory factor actually carries signal in the sample.

The R output concludes that duration is not a meaningful predictor of audience score in this dataset.
The estimated duration coefficient is about `0.002168`, the `p-value` is `0.588`, and the `R-squared` is only `0.00537`.
The descriptive section also shows that most durations cluster around `40` to `50` minutes and most ratings lie roughly between `3.5` and `4.5`.
This makes the conclusion coherent: the sample is relatively concentrated, and episode length alone explains almost none of the rating variation.

- [v] The project covers extraction, cleaning, SQL structuring, and statistical follow-up in one chain.
- [v] The SQL schema retains enough detail to support multiple forms of downstream analysis.
- [v] The repository does not stop at collection and checks a concrete explanatory hypothesis in R.
- [!] The extraction is based on regex and saved HTML pages, which makes the pipeline sensitive to source-format changes.
- [!] The sample remains limited to `57` titles, so the statistical interpretation must stay narrow.

## Technical reading
Taken together, the method shows a useful sequence for small-scale data engineering work.
Python handles messy extraction.
SQL stabilizes the dataset and supports reproducible aggregation.
R is then used to test a focused statistical question.

This sequence is technically modest in scale, but it is methodologically complete.
It shows that data collection, storage, and interpretation can be organized as distinct but connected stages.

# Value

## What the project demonstrates
The project demonstrates command of a full upstream analytics workflow.
It shows the ability to derive a structured dataset from web material, preserve the result in a relational format, and then evaluate a substantive question with a simple statistical model.

It also highlights a useful analytical posture.
The repository does not assume that an intuitive relationship must hold.
It checks the hypothesis and accepts a weak result when the data does not support it.
That is a relevant sign of methodological seriousness.

## Portfolio relevance
This work is valuable because it brings together several competencies that are often separated across small projects.
It combines acquisition of semi-structured data, schema design, SQL exploration, and a first inferential extension.

The overall structure also makes the project reusable.
The extracted dataset can support further descriptive work, richer visualization, or a broader recommendation or classification pipeline later on.
In that sense, the repository functions as both a completed study and a clean data foundation for later iterations.

- [v] The project highlights data acquisition from non-API web sources.
- [v] It demonstrates a transition from raw extraction to queryable relational storage.
- [v] It shows a disciplined approach to testing an explanatory relationship on the collected data.
- [!] Its main strength lies in the workflow design rather than in statistical complexity or sample breadth.
