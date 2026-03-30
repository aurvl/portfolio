---
slug: "allocine-data-visualization"
lang: "en"
title: "Data Visualization - AlloCiné"
summary: "Visual analytics study built on a locally curated AlloCiné dataset, combining descriptive charts and graph-based exploration to examine actors, genres, channels, durations, and release periods."
---

# Overview

## Project scope
This project focuses on exploratory visualization rather than predictive modeling.
Its purpose is to turn a cultural dataset into a structured analytical object that can be read through charts, distributions, and relationship graphs.

The work is built on `Base_allocine.xlsx`, a local workbook produced from a prior scraping effort.
The file contains `365` rows and fields such as title, nationality, channel, actor, genre, duration, and date.
That origin matters because the project does not start from a ready-made benchmark dataset.
It starts from collected material and then organizes it for interpretation.

## Analytical interest
Entertainment data is heterogeneous by nature.
Actors, genres, broadcast channels, durations, and release periods do not describe the same level of reality.
The value of the project lies in showing how these heterogeneous attributes can still be made comparable through visual design.

The dataset is not presented as an industry-wide census.
It is treated as a bounded analytical sample that makes it possible to study recurrence, concentration, and co-occurrence patterns.
That positioning keeps the interpretation measured and technically credible.

# Method

## Data preparation logic
The notebook relies on Python to load the Excel source, reorganize categorical fields, and generate the figures stored in `figure-allocine/`.
The variables are sufficiently rich to support several distinct readings of the sample: actor frequency, channel distribution, duration by genre, and temporal concentration of releases.

Part of the work consists in reshaping textual attributes so they become countable analytical units.
This is especially relevant for actor names and genre labels, which are not directly usable until they are separated and normalized.
The project therefore sits halfway between exploratory analysis and lightweight feature engineering.

## Visualization choices
The repository combines standard charting libraries with graph analysis.
`pandas`, `NumPy`, `Matplotlib`, and `Seaborn` are used for descriptive views, while `NetworkX` is used to expose relational structures.
This is an appropriate combination for the problem because descriptive charts answer frequency questions, whereas graphs make co-occurrences easier to inspect.

The notebook produces several complementary views.
One chart counts actors appearing more than twice in the sample.
Another compares numbers of seasons across broadcast channels.
Other visualizations study duration differences by genre and the rhythm of releases over time.
The graph-based view then adds a relational layer by showing how categories connect inside the same works.

## What the dataset reveals
The local sample shows a concentration of titles on channels such as `ABC`, `Netflix`, and `NBC`, with `ABC` appearing `30` times in the workbook.
It also highlights the mixed nature of genre labels, which often combine several categories rather than fitting into a single class.
That point is methodologically important because it justifies the use of co-occurrence analysis instead of strict one-category summaries.

- [v] The project reuses a self-constructed data asset rather than a pre-cleaned public benchmark.
- [v] Standard visualizations and graph exploration are used for different analytical questions.
- [v] Categorical preprocessing is treated as part of the analytical workflow, not as a trivial detail.
- [!] The workbook is a curated sample, so the results should not be read as a representative map of the whole AlloCiné catalog.
- [!] Several fields are text-heavy and depend on normalization quality, which can affect counts and graph structure.

## Technical perimeter
The architecture remains intentionally lightweight.
There is no dashboard server or production reporting stack behind the notebook.
Instead, the project concentrates on the analytical layer: extracting structure from a moderately complex dataset and presenting it in interpretable visual form.

That perimeter is coherent with the project objective.
The repository is less about deployment and more about the translation of raw entertainment metadata into readable exploratory outputs.

# Value

## What the project demonstrates
The project demonstrates an ability to move from collected cultural data to a coherent exploratory analysis.
It shows practical command of tabular preprocessing, visual summarization, and graph-based reasoning on categorical relationships.

It also makes visible an important analytical discipline: matching the visualization form to the nature of the question.
Counts, comparisons, and distributions are not forced into the same chart type.
The architecture retained in the notebook shows that the choice of representation is part of the analysis itself.

## Portfolio relevance
Taken together, the work highlights a useful combination of skills for data analysis projects built on non-standard sources.
It shows that the analytical effort begins before any model is trained, especially when the source material contains mixed categories, repeated names, and relational information.

The project also shows continuity across projects in the repository.
The visualization layer is not isolated from data collection.
It builds on a previous scraping workflow and extends it into a second stage focused on interpretation.
That continuity gives the project analytical value beyond the figures alone.

- [v] The project highlights exploratory analysis on a self-produced dataset.
- [v] It shows how graph logic can complement descriptive charting in a readable way.
- [v] The workflow links upstream data collection to downstream interpretation.
- [!] Its contribution is analytical and methodological rather than oriented toward deployment or large-scale inference.
