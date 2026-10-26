---
title: "GlitchTip 5.2 Released"
description: "A Modern Design Refresh with Material Design 3 and PostgreSQL-Only Mode. And new DOS mitigation."
published: true
---

## A Modern Design Refresh with Material Design 3 and PostgreSQL-Only Mode

<div style="width: 800px; max-width: 100%; margin: 0 auto;">
    <img src="/assets/blog-images/issue-list-page.png" alt="New Material Design 3 Issue List Page">
</div>

Our headline feature for GlitchTip 5.2 is a design refresh, based on the Material Design 3 system. A new graph on the issues list page allows you to see recent trends of events in the past 24 hours or two weeks. Dark mode has been improved as well.

## Security Improvement

GlitchTip 5.2 includes a denial of service (DOS) vulnerability fix from the brotli project. GlitchTip already mitigated the memory consumption partially, capping impact at around 1GB ram per request. The latest version of brotli allows us to lower this further. We recommend all users concerned about DOS attacks, to upgrade soon.

## Simplified Architecture and Lower Resource Footprint

<div style="width: 800px; max-width: 100%; margin: 0 auto;">
    <img src="/assets/blog-images/terminal-resources.png" alt="Terminal showing lower resource usage in Docker">
</div>

GlitchTip 5.2 has experimental support for PostgreSQL as our only database. Valkey (or Redis) are no longer required. If you set `VALKEY_URL` to an empty string, GlitchTip will now utilize Postgres for cache, celery, and sessions. This requires less ram, but yields slower performance.

Our existing (experimental) `bin/start-all-in-one.sh` script has been updated to support scaling. Previously, running more than one instance would start multiple celery beat schedulers. This has been improved to start just one. Without Valkey, you can now run GlitchTip on as low as 256mb ram. We recommend this only for the most shoe-string of budgets. Larger instances should not use the all-in-one instance.

Adventurous users should try this out and report any issues on GitLab. With Docker Compose, you can set the command to `bin/start-all-in-one.sh` and remove the worker/beat services.

Our settings have also been slightly simplified. `DISABLE_SERVER_SIDE_CURSORS` now defaults to False, as this setting leads to errors when using more than one app server. Over time, we are moving to a model where more settings have "just works" defaults, but can still be overwritten by advanced users. We don't intend any of these changes to be breaking, but if you do have a problem, then please open a GitLab issue.

Finally our design refresh uses slightly LESS JavaScript.

## Community Contributions

GitHub user vltansky let us know about [GlitchTip MCP](https://github.com/vltansky/glitchtip-mcp), used for connecting with AI models in the standardized MCP convention. The GlitchTip team remains firmly committed to our open-source, no-bloat, no-forced-AI philosophy, ensuring user data is never sent to third parties for model training or usage. Opting into communicating with these models is well within our scope. We would consider a contribution to add MCP support directly to GlitchTip using Python, so long as it's disabled by default. Please note that glitchtip-mcp is not affiliated with the core GlitchTip team.

GitLab user tytan652 contributed a highly requested feature to control social authentication registration. `ENABLE_SOCIAL_APPS_USER_REGISTRATION` can now be set independently of `ENABLE_USER_REGISTRATION`. This allows users to enabled authentication using only single sign on.

GitLab user vanschelven, from Bugsink, notified us of a new DOS mitigation in brotli. Our Renovate bot updated brotli and core contributor bufke applied the fix. Our existing mitigation already limited memory usage to under 1GB, but this patch greatly improves it. Users concerned about DOS attacks should upgrade as soon as possible. Read me about the brotli DOS vulnerability and mitigation [here](https://github.com/advisories/GHSA-2qfp-q593-8484).

See a full list of contributors on our [GlitchTip group](https://gitlab.com/groups/glitchtip/-/contribution_analytics?start_date=2025-08-07) on GitLab. Thank you to all contributors, especially those making the more important and less headline worthy changes that make GlitchTip better!

## Helm migrate away from Bitnami images

Bitnami, in the past, has offered free helm charts for many popular projects including Postgres and Valkey. They have since abandoned these offerings. Our 6.0 release of `glitchtip-helm-chart` introduces breaking changes to replace Postgres and Valkey charts with alternatives.

## What's next?

GlitchTip search will soon support * wildcards thanks to a combination of trigram index + tsvector based full text search.

We're working to improve our Python asyncio support to process more requests with less system resources. django-valkey supports async cache. django-async-backend introduces async for raw SQL connections in Django. These packages will require time to stabilize. In the future, we plan to default to an async python web server. However at this time, performance is not yet acceptable for larger deployments due to lack of async support in Django cache and ORM.

We'll continue refining our new design. We hope to add a high-contract theme and better dashboards.

Our glitchtip.com website needs updated to incorporate the new design. We're aiming to emphasize the many deployment options users have, including our own EU server and partner organizations that host and share revenue with GlitchTip. Freedom to choose is a core value of the GlitchTip team.

## Support GlitchTip

Your time and financial donations are the only thing that keeps GlitchTip development going. GlitchTip is not backed by venture capital.

- 💸 Donate via [Liberapay](https://en.liberapay.com/GlitchTip). We currently receive $30.52 per week from 21 patrons.
- ⭐ on [GitLab](https://gitlab.com/glitchtip/glitchtip-backend/). Help us reach 400 stars!
- ❤️ on [AlternativeTo](https://alternativeto.net/software/glitchtip/about/) and leave a review. AlternativeTo generates [significant](https://plausible.io/glitchtip.com?period=30d) website traffic.
- ⭐ on [Docker Hub](https://hub.docker.com/r/glitchtip/glitchtip) where we have over 4 million pulls
- ⏩ Follow on [Mastodon](https://mastodon.online/@glitchtip) or [BlueSky](https://bsky.app/profile/glitchtip.com)
- Talk to us on [Gitter](https://app.gitter.im/#/room/#GlitchTip_community:gitter.im)
