---
title: 'GlitchTip 6 released'
description: 'Performance and improved stacktraces'
published: true
---

GlitchTip 6.0 is a major release focused on performance optimizations, simplifying our stack, and modernizing our backend infrastructure. We have removed several complex dependencies in favor of faster, purpose-built solutions, resulting in a lighter footprint and improved ingestion speeds.

## Performance and Architecture

We have completely overhauled how we handle database partitioning.

- **UUIDv7 Primary Keys:** We have switched to UUIDv7 for event IDs. This allows us to determine the partition directly from the time-sortable ID without database lookups, resulting in faster event fetching. We maintain search compatibility with existing sentry-sdk event IDs.

- **Simplified Partitioning:** We have removed pg-partman and django-postgres-extras. Partitions are now managed by a custom internal PartitionManager. This unifies our strategy and removes a major external dependency that often complicates updates.

- **Database Optimizations:** We’ve applied column alignment optimizations to reduce disk usage and improved bulk query ingestion.

## Lightweight Task & Cache Management

We are replacing generic, heavy tools with optimized, modern alternatives:

- **Celery → django-vtasks:** A lighter task queue designed specifically for our workload.

- **Cache → django-vcache:** A modern, async caching backend that replaces our previous implementation.

## Granian & Rust-based Serving

We have standardized on Granian, a Rust-based HTTP server, as our default web server. It replaces Gunicorn and Uvicorn. While uwsgi remains included for compatibility, we strongly recommend Granian for its performance and consistency.

## New Features

- **Stable "All-in-One" Mode:** The combined web+worker process is now considered stable, making it easier than ever to run GlitchTip on low-resource environments or single-container deployments.

- **Swift Stacktraces:** We added backend support to the event threads interface, enabling proper stacktraces for Swift applications.

- **Read-Only Database Replica:** You can now optionally configure a `READ_ONLY_DATABASE_URL` to offload read operations from your primary database.

- **Sourcemap Reliability:** Fixed an issue where some Sentry SDK tools failed to follow redirects, improving sourcemap upload reliability.

## Breaking Changes

We support all upgrades from GlitchTip 5.x to 6.x. If you are running 4.x or earlier, you should upgrade to 5 first. If you customize GlitchTip start commands or need to ensure migration of more than 10,000 events, read the migration section below.

This release includes infrastructure changes that may require updates to customized deployment configuration:

- **Valkey 7+ or Redis 7+:** We now set minimum supported versions for our cache/task backends.

- **Init scripts:** We recommend all users run our `./bin/start.sh` command.

- Set `SERVER_ROLE` to worker to run the worker instead of web (default).

- Alternatively, use `./bin/run-all-in-one.sh`.

- **Port Consistency:** The container now uses port 8000 consistently. Check your load balancer or reverse proxy configs if you were relying on port 8080.

- **Granian Configuration:** If using Granian (default), you may want to set the `TRUSTED_PROXIES` environment variable (defaults to *).

- **Metrics Endpoint:** The optional metrics endpoint is now strictly available at `/metrics` and has been removed from the OpenAPI schema.

- **Removed Servers:** Uvicorn and Gunicorn have been removed from our Docker image.

## Migrating Events

When you upgrade, the 10,000 most recent events and uptime checks will be migrated.

To migrate more data, set the environment variable `GLITCHTIP_RETAIN_LEGACY_DATA=True` before migrating.

After migration, run: `./manage.py import_legacy_events --limit [number] --delete-source`.

## Enterprise Licenses

GlitchTip is independent, open source, and 100% user-funded. If you are a for-profit company using GlitchTip to monitor production systems, we expect you to purchase an Enterprise License.

An Enterprise License provides:

- **Priority Support:** Direct access to maintainers for architectural issues.

- **Compliance:** Formal invoices for your procurement team.

- **Sustainability:** Ensures the continued stability of the platform.

### Support the project

- 🛡️ [Get Enterprise Support](mailto:sales@glitchtip.com?subject=Purchasing%20enterprise%20support) (For Business) for $15 per user per month

- 💖 [Individual License](mailto:sales@glitchtip.com?subject=Purchasing%20an%20individual%20license) (For Supporters) for $5 per month

- 💸 Donate via [Liberapay](https://en.liberapay.com/GlitchTip). We currently receive $30.52 per week from 21 patrons.

### Community & Social

- ⭐ on [GitLab](https://gitlab.com/glitchtip/glitchtip-backend/). Help us reach 400 stars!

- ⭐ on [Docker Hub](https://hub.docker.com/r/glitchtip/glitchtip), where we have over 5 million pulls

- ❤️ on [AlternativeTo](https://alternativeto.net/software/glitchtip/about/) and leave a review. AlternativeTo generates [significant](https://plausible.io/glitchtip.com?period=30d) website traffic.

- Talk to us on [Gitter](https://app.gitter.im/#/room/#GlitchTip_community:gitter.im)

- ⏩ Follow on [Mastodon](https://mastodon.online/@glitchtip) or [BlueSky](https://bsky.app/profile/glitchtip.com)
