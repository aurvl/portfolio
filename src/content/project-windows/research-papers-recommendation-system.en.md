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

- [v] I tackled a concrete information retrieval problem with a hybrid design.
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

- [v] I use complementary ranking signals instead of a one-dimensional relevance score.
- [v] I combine sparse and dense representations for better retrieval coverage.
- [v] I added an API layer, which brings the project closer to an actual service architecture.
- [!] The repository still depends on the quality of article metadata and profile update logic.

# Value

## What I wanted to show
I wanted to build a hybrid recommender grounded in both information retrieval and embeddings: text representation, semantic similarity, user profile and service exposure. I clearly separated retrieval, ranking, trend adjustment and service, to make visible the trade-offs between lexical precision, semantic coverage, novelty and ranking readability.

## What I take from it
- [v] I linked representation choices, ranking logic and API exposure.
- [v] I built a system closer to a usable service than to a similarity exercise.
- [!] This is a well-built content-based system, not an industrial platform with online feedback.
