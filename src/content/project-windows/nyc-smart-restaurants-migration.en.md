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

- [v] I tied the migration to actual query needs rather than a generic technology switch.
- [v] I combined document modeling and geospatial lookup in a coherent way.
- [v] I implemented and measured the cache (from about 0.125 s to 0.0034 s on a cache hit).
- [!] The nearest-neighbor search remains brute-force rather than based on a dedicated spatial index.
- [!] The cache policy is intentionally simple and would require refinement in a broader production setting.

## Structural implications
The overall architecture shows how a migration can be justified by query ergonomics, response time, and modeling clarity. This is more significant than the database swap itself. The repository highlights the fact that schema design, access paths, and performance are inseparable in practical systems.

That structural perspective gives the project a stronger analytical identity than a straightforward “SQL versus NoSQL” comparison.

# Value

## What I wanted to show
I wanted to reason at the same time about the shape of the data, the cost of queries and storage trade-offs: relational-to-document migration, Python transformation, geographic queries, light response-time optimization. For me, the value of a database comes from how well it fits its uses, more than from the technology choice in isolation.

## What I take from it
- [v] I reasoned about architecture rather than just using tools.
- [v] I clearly linked schema, queries and performance.
- [!] This is a compact prototype: it does not cover every production concern.
