---
title: "Columnar analytics without the columnar database: how GlitchTip archives events with DuckDB and Parquet"
description: "How GlitchTip keeps event retention long and costs low by combining Postgres, DuckDB, and Parquet archives on S3-compatible storage."
author: "David Burke"
published: true
---

GlitchTip aims to be resource efficient, simple, and useful. We need to scale up while keeping costs rock bottom. Avoid complex stacks of databases for every possible use case. While keeping historic data around. What if we could run on 512 mb ram, keep events for a year or longer, and keep data storage costs low? Impossible, right? You'd need ClickHouse for analytics, Elasticsearch for search, Postgres, Valkey, huge ($$$) volumes for them all, 16GB of ram to power the fleet minimum.

But do you? What if Postgres is good enough. What if we store old data on cheap S3-compatible storage? This is where an Online Analytical Processing (OLAP) database comes into play. DuckDB is an OLAP implementation that can run embedded, in-process of say a Django ASGI server. Storage goes to a volume or cheaper S3-compatible object storage.

1. Accept event (error, log, span etc) in a lightweight API that validates and places into a Valkey (or Postgres) queue. And most of that in Rust, because why not. It's faster. It's small. Pydantic for validation, [django-vcache](https://gitlab.com/glitchtip/django-vcache) (our Rust-backed Valkey cache Backend) for fast Valkey interaction.
2. Process the events in batches using [django-vtasks](https://gitlab.com/glitchtip/django-vtasks), our async task queue. Saving them to Postgres partitions.
3. After X days (default of 30 for error events) copy the partition data to a parquet using arro3 (Fast Rust based parquet writer). Drop the postgres partition.
4. Stitch the data back together during queries. Keep some metadata and small statistic aggregates in Postgres for fast lookups. Even a log call ranging between hot (Postgres) and cold (Parquet) logs stitch together silently in the backend.

Enable this in GlitchTip today by setting `GLITCHTIP_ENABLE_DUCKDB=true` and ensure [S3-compatible storage is enabled](https://glitchtip.com/documentation/install#file-storage).

The user experience is almost invisible. Most users are looking at fast aggregate statistics or new-ish events. Taking 2 seconds to look up a 3-month old event or slice of log data is acceptable. I also left out a few minor details, like how we store noisy span data only in parquets, using ultra-fast arro3 to write without blowing our memory budget.

Ok but you got me - at the 100 million event scale surely 512 mb ram isn't enough for all those events and in-ram duckdb! You are right. This may merit a hefty 8GBs of ram between the services and maybe 200GB of disk. Even more if you want high availability. At that high cost, you could double ram to 16GB and store a single event in on a leading proprietary self-hosted competitor! But you can bet that once I solve this problem of 100 million events on 512mb ram, I'll write a blog post about it.

Like the pattern? GlitchTip is actually open source - not "source available," not "open-ish until you scale" - just open source. Take it: https://gitlab.com/glitchtip/glitchtip-backend/

Looking for fast, open source, scalable observability? Try out GlitchTip.
