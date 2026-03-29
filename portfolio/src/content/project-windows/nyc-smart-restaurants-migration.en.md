---
slug: "nyc-smart-restaurants-migration"
lang: "en"
title: "NYC Smart Restaurants: Migration Postgres-MongoDB"
summary: "Migration of a New York restaurant catalog from PostgreSQL to MongoDB, with proximity queries, document-oriented modeling, and measurable JSONB caching."
---

# Overview

## Project scope
This project focuses on a practical data engineering problem: migrating a restaurant catalog from a relational database structure to a document-oriented model better suited to flexible search use cases. The dataset covers New York City restaurants and supports queries by name, neighborhood, cuisine, and geographic proximity.

The core interest of the project lies in the fact that it is not framed as a simple database export. It is framed as a redesign of the data shape in response to the way the catalog is queried and consumed.

## Analytical positioning
The repository combines relational modeling, document conversion, geospatial querying, and caching. This gives it a broader scope than a basic migration exercise. The work is fundamentally about aligning storage structure with usage patterns, which is one of the central questions in applied data architecture.

The project therefore sits in a design logic rather than a tooling logic. PostgreSQL and MongoDB are not used as interchangeable technologies; they are assigned different roles according to query behavior.

# Method

## Migration logic
Python scripts are used to transform relational restaurant data into MongoDB JSON documents. The source side includes more than `25,000` insert statements across the relational tables, which gives the migration process enough scale to make structural choices meaningful.

The target model is shaped around flexible search scenarios rather than normalized table traversal. This is what makes the migration technically relevant: the document format is motivated by access patterns rather than by novelty.

## Query model and optimization
The application supports text search, cuisine filtering, neighborhood filtering, and nearest-neighbor retrieval from latitude and longitude. Geographic proximity is computed through the Haversine formula, which gives the project a clear location-aware component.

To accelerate repeated requests, the system introduces a PostgreSQL `JSONB` cache keyed by `(latitude, longitude, k, cuisine_filter, results)`. A coordinate tolerance of `±0.001` allows nearby requests to reuse previously computed results. The accompanying report documents a speed improvement from roughly `0.125 s` to `0.0034 s` on cache hits.

- [v] The migration is tied to actual query needs rather than a generic technology switch.
- [v] The project combines document modeling and geospatial lookup in a coherent way.
- [v] The cache is implemented and measured rather than merely suggested.
- [!] The nearest-neighbor search remains brute-force rather than based on a dedicated spatial index.
- [!] The cache policy is intentionally simple and would require refinement in a broader production setting.

## Structural implications
The overall architecture shows how a migration can be justified by query ergonomics, response time, and modeling clarity. This is more significant than the database swap itself. The repository highlights the fact that schema design, access paths, and performance are inseparable in practical systems.

That structural perspective gives the project a stronger analytical identity than a straightforward “SQL versus NoSQL” comparison.

# Value

## What the project demonstrates
The project demonstrates an ability to reason about data shape, query cost, and storage trade-offs at the same time. It highlights competence in relational-to-document migration, Python-based transformation, geospatial querying, and lightweight performance optimization.

It also shows that database work becomes more valuable when the architectural rationale is explicit. The repository makes that rationale visible.

## Professional relevance
From a technical standpoint, the project fits within a broader architecture and backend engineering logic. The implementation shows how data modeling choices can be aligned with application-level search behavior and response-time constraints.

Taken together, the work brings out a capacity to design around usage patterns rather than around isolated technologies. That is what gives the project its strongest professional relevance.

## Limits and positioning
The repository is best understood as a compact architecture and migration prototype.
Its strongest contribution lies in schema redesign, proximity-query logic, and measured caching gains rather than in full production hardening.

- [v] The project highlights architectural reasoning rather than tool usage alone.
- [v] The implementation shows a clear relationship between schema shape and query behavior.
- [v] The measured cache gain adds concrete substance to the migration narrative.
- [!] The repository remains a compact prototype and does not aim to cover every production concern.
