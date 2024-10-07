---
title: 'GlitchTip 4.0 Released'
description: 'Event processing gets a major efficiency boost'
published: true
---

## Major version update

GlitchTip's new release includes a major overhaul of how the app handles events aimed at significantly improving its performance and ability to reliably field large volumes of data. As always, we aim to make the upgrade process as easy as possible for sysadmins. GlitchTip 4.0 includes a migration for moving a limited volume of existing issue and event data to new database tables and dropping older data. If you are already using GlitchTip 3.x and don't need to preserve large amounts of older event data, you can go ahead and upgrade now. However, if you want to increase the amount of data preserved in the migration, read on for more details.

### Upgrade considerations

- By default, GlitchTip 4.0 will migrate the most recent 50,000 issues in your GlitchTip instance. This number can be changed with the environment variable `ISSUE_EVENT_MIGRATION_LIMIT`. Additionally, it will only migrate up to 1,000 events per issue, which can be adjusted via the `EVENT_PER_ISSUE_MIGRATION_LIMIT` environment variable. In our testing, the migration has taken approximately 5 minutes per 50,000 issues. During this time, the processing of new events will be queued in redis, so you will not see new events appear until the migration is complete.

- We do not support upgrading multiple major versions such as 2.x to 4.x. If you haven't upgraded GlitchTip in the past year, you will want to upgrade to the latest 3.x release before upgrading to 4.0.

- We aim to maintain API compatibility, but with a large refactor this is hard to guarantee. Test your third party integrations before upgrading.

### app.glitchtip.com upgrade

We will be upgrading our hosted instance at [app.glitchtip.com](https://app.glitchtip.com) to this new version on Friday, April 12, at 14:00 UTC. We expect the upgrade to take about 35 minutes. In this time, incoming events will still be received but they will not be processed until the upgrade is complete. We will be migrating as many old issues as we can reasonably accommodate without excessive service interruption, but please be advised that not all issues will be carried over.

### Improvements

Our primary focus in GlitchTip 4.0 has been on improving performance and reducing system requirements. GlitchTip is not a venture capital backed company that can deploy ever-larger databases. Run by volunteers and supported by donations, it is important that we remain resource-light.

- Event ingest rewritten to be more performant.
- Data stored in Postgres table partitions. Dropping the old partition tables is also much faster than deleting rows nightly.
- Event ingest APIs sped up - quickly checking permissions and then forwarding the task to a celery background worker.
- All events saved in bulk batches. By default, GlitchTip celery workers will wait up to 2 seconds to batch new events before saving them. We believe such a small delay is unlikely to be noticed. Work that was previously done in Postgres was moved to Python, which is far easier to scale as needed.
- New async Django views using django-ninja for our API. By default, uwsgi is still used and runs synchronously. In a future major version, we aim to enable async Python by default.
- New API documentation
- Free text search indexing for issues reduced to specifically selected fields, such as title. We found that Postgres GIN indexes on frequently updated tables grow infinitely large and slow. While reindexing mitigates this, we decided to be more selective in our search index.

## Support GlitchTip

Your time and financial donations are the only thing that keeps GlitchTip development going. GlitchTip is not backed by venture capital.

- 💸 Donate via [Liberapay](https://en.liberapay.com/GlitchTip). We currently receive $8.90 per week from 15 patrons.
- ⭐ on [GitLab](https://gitlab.com/glitchtip/glitchtip-backend/). Help us reach 200 stars!
- ❤️ on [AlternativeTo](https://alternativeto.net/software/glitchtip/about/) and leave a review. AlternativeTo generates [significant](https://plausible.io/glitchtip.com?period=30d) website traffic.
- ⭐ on [dockerhub](https://hub.docker.com/r/glitchtip/glitchtip) where we have over 2 million pulls
- ⏩ Follow on [Mastodon](https://mastodon.online/@glitchtip)
- Talk to us on [Gitter](https://app.gitter.im/#/room/#GlitchTip_community:gitter.im)
