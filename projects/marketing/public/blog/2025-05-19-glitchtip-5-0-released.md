---
title: "GlitchTip 5.0 Released and EU Server"
description: "Merge issue support, hosted servers on US and EU regions, breaking changes."
published: true
---

## Introducing Merge Issue Support

GlitchTip now supports merging issues. Declutter your issues list by taking two or more issues and merging them. When new events come in, they will stay in the same issue. This is useful when the same root cause creates multiple issues. You can also unmerge them on the issue detail page.

<div style="width: 800px; max-width: 100%; margin: 0 auto;">
    <img src="/assets/blog-images/glitchtip-5-0/issue-merge.png" alt="Screenshot of issues to be merged">
</div>

## EU server

A new hosted server option has been created: https://eu.glitchtip.com, managed by Burke Software and Consulting. This server is maintained by core developers behind GlitchTip. We'll refer to our https://app.glitchtip.com server as US hosted for now on.

You can also run EU hosted instances via [Pikapods](https://www.pikapods.com/pods?run=glitchtip) and [elestio](https://elest.io/open-source/glitchtip).

## Breaking changes for self-host users

Our policy is to introduce breaking changes only in major releases.

- Django 5.2 requires Postgres 14+. Users of Postgres 13 must upgrade before upgrading GlitchTip. The easiest way is to use pg_dump and restore on a new Postgres 14+ server. We recommend upgrading to Postgres 17 when possible.
- No upgrades from GlitchTip 3.x. You must upgrade to a 4.x release and then to 5.0. Older migration files have been removed. We aim to require such upgrades only once per year.

## What's next?

We depend on contributors for features and it can be hard to predict what our users contribute next. See our development [roadmap](https://gitlab.com/groups/glitchtip/-/roadmap?state=all&sort=START_DATE_ASC&layout=WEEKS&timeframe_range_type=CURRENT_QUARTER&progress=WEIGHT&show_progress=true&show_milestones=true&milestones_type=ALL&show_labels=false).

- Lois ([LUARM](https://github.com/LUARM)) is working on Material Design 3 refresh.
- Issue event graphs.
- Our Helm chart has received some recent contributions - thanks!
- Improved frontend contribution guide with focus on material design, signals and openapi-fetch.

Add your own plans to GitLab [issues](https://gitlab.com/groups/glitchtip/-/issues). Here are some ideas to get started on development:

- [Adjust configuration options for when new users are allowed to register.](https://gitlab.com/glitchtip/glitchtip-backend/-/issues/290)
- [Add bulk issue remove](https://gitlab.com/glitchtip/glitchtip-frontend/-/issues/210)

## Support GlitchTip

Your time and financial donations are the only thing that keeps GlitchTip development going. GlitchTip is not backed by venture capital.

- 💸 Donate via [Liberapay](https://en.liberapay.com/GlitchTip). We currently receive $29.81 per week from 19 patrons.
- ⭐ on [GitLab](https://gitlab.com/glitchtip/glitchtip-backend/). Help us reach 300 stars!
- ❤️ on [AlternativeTo](https://alternativeto.net/software/glitchtip/about/) and leave a review. AlternativeTo generates [significant](https://plausible.io/glitchtip.com?period=30d) website traffic.
- ⭐ on [dockerhub](https://hub.docker.com/r/glitchtip/glitchtip) where we have over 3 million pulls
- ⏩ Follow on [Mastodon](https://mastodon.online/@glitchtip) or [BlueSky](https://bsky.app/profile/glitchtip.com)
- Talk to us on [Gitter](https://app.gitter.im/#/room/#GlitchTip_community:gitter.im)
