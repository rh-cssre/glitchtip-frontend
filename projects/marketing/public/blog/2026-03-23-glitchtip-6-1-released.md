---
title: 'GlitchTip 6.1 released'
description: 'Logs, cold storage, MCP and minidump support'
published: true
---

GlitchTip 6.1 is a feature heavy release, while keeping everything optional and simple.

## Cold Storage with optional DuckDB
It’s time to reduce your storage costs while keeping old data around longer.

Observability platforms often use several databases, which provides the benefits of both row and columnar databases at the cost of operational complexity and sky-high resource needs.

GlitchTip 6.1 takes a simpler approach. DuckDB runs inside your existing Python process — no extra service, no extra container — and stores event data as compressed Parquet files. Older events are automatically offloaded to cold storage instead of deleted. You keep your history; your database stays lean.

### New Configuration Settings:
DuckDB can now be enabled when a local volume or S3-compatible bucket is present. Cold storage handling is configurable via these environment variables:
*  `GLITCHTIP_ENABLE_DUCKDB`: Disabled by default, set to true to enable the cold storage feature
* `GLITCHTIP_EVENT_HOT_DAYS`: Number of days to store error events in fast Postgres storage
* `GLITCHTIP_LOG_HOT_DAYS`: Number of days to store logs in Postgres

Enable today and get your hosting bill down. Note that DuckDB does use more RAM (we default to an extra 128MB needed), but it is still well under the 32GB our competitor recommends.

## Logging
The open-source sentry-sdk added logging support and it’s now supported in GlitchTip. We strongly recommend using it with DuckDB enabled, as logging storage costs grow quickly.

## Model Context Protocol (MCP)
GlitchTip doesn’t force AI on you. We don’t sell it ourselves. But MCP is there if you want it. Use it with tools like Claude Code or Zed or whatever you decide to fit YOUR needs, not our VC funders (which we lack). Ask your own agent to identify slow SQL queries, triage (and fix) issues, or anything else you can imagine. It’s fully optional, disabled by default, and puts you in control of your own data.

## Performance Monitoring Improvements
Did I say MCP can identify slow SQL queries? GlitchTip 6.1 refactors our internals for performance monitoring, supporting both transactions and spans. Due to the huge volume of span data, we do require DuckDB to be enabled for spans (transactions will continue to work without). These are available today in our API and MCP server. Frontend and further refinement is coming soon.

## Minidump and Source Contexts support
We continue refining our stacktrace enhancement stack. 6.1 now supports minidump and source contexts for Java.

## Platform as a Service and Railway support
A core value of GlitchTip is to be fully OSI-approved, open source, and easy to host. To achieve that, we officially support many PaaS vendors and have added an official Railway template. I won’t insist on your trust: if you don’t want me hosting GlitchTip, host it yourself or use one of many PaaS providers such as [Railway](https://railway.com/new/template/glitchtip?utm_medium=integration&utm_source=button&utm_campaign=glitchtip), [PikaPods](https://www.pikapods.com/pods?run=glitchtip), and [Elest.io](https://elest.io/).

## What’s Next?
We’re going to pivot away from prioritizing donations and toward being clear that we expect for-profit companies to fund the open source that they use. To improve that experience, we'll be working to roll out “license keys”. This will include self-serve sign up for a license key based support plan. When set, we’ll replace the “Support GlitchTip” banner with a support page. This is 100% open source. Nothing will stop you from hacking it and lying about having support, but when you request support in-app, it will attach an ID that lets us check if you're an active user in Stripe and prioritize the support request accordingly.

We’re also working to keep our frontend in sync with backend features, which we typically develop first. We’ll expose features like “Resolve in next release” and the new performance data. Our home page and general lack of dashboards is also on the radar.

Sentry-cli recently switched to a non-free license. So we’re building a drop-in replacement: **glitchtip-cli**. Most end users can likely keep using either project, though you may want to check with your compliance team. Users who wish to retain using a fully OSI-approved MIT cli are encouraged to try out glitchtip-cli and report bugs. We’ll mark it 1.0.0 when stable for production usage. GlitchTip CLI is also slightly smaller and offers more features for GlitchTip-specific workflows.

## Call to Action: Contribute
GlitchTip is 100% built and funded by users. No VC. No one to answer to but you.

### Support the project

- 🛡️ [Get Enterprise Support](mailto:sales@glitchtip.com?subject=Purchasing%20enterprise%20support) (For Business) for $15 per user per month

- 💖 [Individual License](mailto:sales@glitchtip.com?subject=Purchasing%20an%20individual%20license) (For Supporters) for $5 per month

- 💸 Donate via [Liberapay](https://en.liberapay.com/GlitchTip). We currently receive $26.77 per week from 21 patrons.

### Community & Social

- ⭐ on [GitLab](https://gitlab.com/glitchtip/glitchtip-backend/). Help us reach 400 stars!

- ⭐ on [Docker Hub](https://hub.docker.com/r/glitchtip/glitchtip), where we have over 5 million pulls

- ❤️ on [AlternativeTo](https://alternativeto.net/software/glitchtip/about/) and leave a review. AlternativeTo generates [significant](https://plausible.io/glitchtip.com?period=30d) website traffic.

- Talk to us on [Gitter](https://app.gitter.im/#/room/#GlitchTip_community:gitter.im)

- ⏩ Follow on [Mastodon](https://mastodon.online/@glitchtip) or [BlueSky](https://bsky.app/profile/glitchtip.com)
