---
title: 'Upcoming: GlitchTip 4.0'
description: 'Our reworked API will significantly increase efficiency'
published: true
---

## Big changes under the hood

We are pleased to announce the upcoming release of GlitchTip 4.0, which includes a major overhaul of how the app handles events aimed at significantly improving its performance and ability to reliably handle large volumes of data. GlitchTip 4.0 is expected to be released in late March if no major issues are found in testing.

We believe that sysadmins just want their software to work and that breaking changes prevent that. As such, we've included a default migration that respects your time and disk space. If you don't mind losing some older events, then there is nothing you will need to do or prepare for. If you wish to preserve more of your older events, the migration will allow you to specify how many events you want to carry over. Instructions will be provided with the release of GlitchTip 4.0.

### Improvements

Our primary focus in GlitchTip 4.0 has been on improving performance and reducing system requirements. GlitchTip is not a venture capital backed company that can deploy ever-larger databases. Run by volunteers and supported by donations, it is important that we remain resource-light.

- Event ingest rewritten to be more performant.
- Data stored in Postgres table partitions. Dropping the old partition tables is also much faster than deleting rows nightly.
- Event ingest APIs sped up - quickly checking permissions and then forwarding the task to a celery background worker.
- All events saved in bulk batches. By default, GlitchTip celery workers will wait up to 2 seconds to batch new events before saving them. We believe such a small delay is unlikely to be noticed. Work that was previously done in Postgres was moved to Python, which is far easier to scale as needed.
- New async Django views using django-ninja for our API. By default, uwsgi is still used and runs synchronously. In a future major version, we aim to enable async Python by default.
- New API documentation
- Free text search indexing for issues reduced to specifically selected fields, such as title. We found that Postgres GIN indexes on frequently updated tables grow infinitely large and slow. While reindexing mitigates this, we decided to be more selective in our search index.

### Potentially breaking changes

- As always, we do not support upgrading multiple major versions such as 2.x to 4.x. If you haven't upgraded GlitchTip in the past year, you will want to upgrade to the latest 3.x release before upgrading to 4.0.

- We aim to maintain API compatibility, but with a large refactor this is hard to guarantee. Test your third party integrations before upgrading.

## Elestio: A new way to run GlitchTip

https://elest.io is a managed hosting environment that now supports GlitchTip. Elestio supports revenue sharing with open source projects including GlitchTip. It's also a good way to run GlitchTip in your own region of the world. Check out their [installation guide video](https://www.youtube.com/watch?v=tXf7GrfTsuQ).

We also support PikaPods, which has a similar revenue sharing plan.

## How to help

- GlitchTip has a simplistic performance feature but is not under active development. We need volunteers to help build this out. We would also consider simply removing the feature entirely. It's our most popular GitLab issue but has absolutely no contributors.
- Android difs support needs a maintainer. This would be a great way for an Android app developer to contribute with minimal time commitments.
- We've been considering an [official EU demo/managed server](https://gitlab.com/glitchtip/glitchtip/-/issues/54). We would love to see other core contributors run an official server. If you or your company has interest, let us know. We would expect heavy (ideally code) contributions to the project in return for linking to it as an official install option. Based on user feedback, we believe this would be best run by an EU-backed individual or company.
- We've experimented with Rust. While this was fun, we don't estimate it to be feasible to deploy with our level of contributors (much less than a full time equivalent). Are you a Rust fanatic looking for a project? Let us know. We could imagine rewriting select portions of GlitchTip in Rust.

## Support GlitchTip

Your time and financial donations are the only thing that keeps GlitchTip development going. GlitchTip is not backed by venture capital.

- 💸 Donate via [Liberapay](https://en.liberapay.com/GlitchTip). We currently receive $13.08 per week from 15 patrons.
- ⭐ on [GitLab](https://gitlab.com/glitchtip/glitchtip-backend/). Help us reach 200 stars!
- ❤️ on [AlternativeTo](https://alternativeto.net/software/glitchtip/about/) and leave a review. AlternativeTo generates [significant](https://plausible.io/glitchtip.com?period=30d) website traffic.
- ⭐ on [dockerhub](https://hub.docker.com/r/glitchtip/glitchtip) where we have over 2 million pulls
- ⏩ Follow on [Mastodon](https://mastodon.online/@glitchtip)
- Talk to us on [Gitter](https://app.gitter.im/#/room/#GlitchTip_community:gitter.im)
