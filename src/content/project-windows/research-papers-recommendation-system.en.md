---
slug: "research-papers-recommendation-system"
lang: "en"
title: "Research Papers Recommendation System"
summary: "Hybrid recommender for scientific articles, combining keyword retrieval, transformer embeddings, user profiling, and trend-aware ranking."
---

# Overview

## Product logic
This project builds a recommendation system for scientific papers on top of a large academic corpus.
The objective is to improve paper discovery by combining lexical relevance, semantic similarity, and profile-aware ranking in a single service.

The repository sits at the intersection of information retrieval and recommendation.
It is not limited to nearest-neighbor search, and it does not rely on a single scoring signal.

## Why the project matters
Academic search suffers from a recurring tension between precision and breadth.
Keyword retrieval is often transparent but brittle, while semantic models improve recall yet can weaken control if not grounded in explicit ranking logic.

The project addresses that tension through a layered design.
It combines several signals so that recommendation quality does not depend on only one representation of relevance.

The scale of the corpus, around `58,891` articles, gives the repository enough substance to move beyond a toy example.
It also makes ranking design more meaningful because retrieval noise becomes a real constraint at that size.

- [v] The project tackles a concrete information retrieval problem with a hybrid design.
- [v] The corpus scale is large enough to justify retrieval and ranking choices.
- [!] Recommendation quality still depends on metadata quality and on how well user interests are represented over time.

# Method

## Retrieval layers
The repository evolves from a sparse lexical baseline toward a richer semantic pipeline.
On the lexical side, it uses a large `TF-IDF` representation with a vocabulary size around `500,000`, which preserves transparent keyword matching.

On the semantic side, it uses `MiniLM-L6-v2` embeddings with a `384`-dimensional representation.
This second layer captures conceptual proximity that would be missed by term overlap alone.

## User profiling and ranking
The recommendation logic blends profile components with a `60/40` weighting scheme.
This design indicates that the system does not treat all signals equally and instead tries to balance stable user preference with immediate relevance.

The repository also defines a "hot score" combining trend, publication year, and citation-related information with weights close to `0.5`, `0.3`, and `0.2`.
That choice introduces a temporal and popularity-aware dimension into the ranking process.

## Service layer
The implementation is exposed through `FastAPI`, which gives the recommender a usable application boundary rather than leaving it as a notebook-only experiment.
This matters because retrieval systems become more credible when the scoring logic can be queried through clear endpoints.

Taken together, the architecture combines sparse retrieval, dense semantics, user modeling, and API exposure.
That is a materially stronger structure than a single-model recommendation demo.

- [v] The system uses complementary ranking signals instead of a one-dimensional relevance score.
- [v] Sparse and dense representations are combined for better retrieval coverage.
- [v] The API layer makes the project closer to an actual service architecture.
- [!] The repository still depends on the quality of article metadata and profile update logic.

# Value

## What the project demonstrates
The project demonstrates a broad recommendation-system skill set.
It shows competence in text representation, semantic search, hybrid scoring, user-profile design, and service-oriented packaging.

It also reflects strong problem decomposition.
The repository separates retrieval, ranking, trend adjustment, and application exposure into understandable layers.

## Professional significance
Structurally, this is one of the more complete NLP-adjacent projects in the repository.
It highlights the ability to combine information retrieval methods with product-oriented ranking logic rather than stopping at a similarity notebook.

The architecture retained here also makes visible a practical understanding of recommendation trade-offs.
Precision, novelty, recency, and interpretability are all present as design concerns.

## Limits and positioning
The project is not a fully online recommender with click feedback loops or large-scale serving infrastructure.
Its strength lies in the hybrid design and in the fact that the ranking logic is explicit enough to be audited and extended.

- [v] The project highlights hybrid recommender design grounded in both IR and semantic modeling.
- [v] It connects model choices to an application-facing API layer.
- [!] Its main contribution is architectural and methodological depth rather than full production-scale deployment.
