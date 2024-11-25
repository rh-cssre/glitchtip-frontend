---
title: 'GlitchTip 4.1 Released'
description: 'Improved auth flow security'
published: true
---

## Migrating to allauth

GlitchTip's new release aims to improve the maintability of the GlitchTip project. It moves multi-factor authentication and social sign on handling to django-allauth's API. This change will not impact the frontend user experience, but will provide a more secure auth flow using a well-tested upstream app. It will also increase the range of GlitchTip's OAuth compatability, even with OAuth providers we don't test for. Finally, if you are hosting your own GlitchTip instance you can now refer directly to django-allauth's [documentation](https://docs.allauth.org).

GlitchTip previously offered a "remember this device" option for multi-factor authentication. This feature is not currently supported by django-allauth, so we will not be offering it for now.

### Upgrade considerations

Self-hosted users will need to update the callbacks to their instance with any OAuth providers they have integrated. For example, if you have your instance configured to work with Google OAuth, you will need to change the callback registered with Google to `https://<your-glitchtip-domain>/accounts/google/login/callback/`. See django-allauth's [documentation](https://docs.allauth.org/) for details on specific providers.

## Completed migration to Django Ninja

This update marks the completion of our migration to django-ninja for our API views. Django-ninja gives developers type hints, provides first class async views, and utilizes the rust-based pydantic validation library.

## Support GlitchTip

Your time and financial donations are the only thing that keeps GlitchTip development going. GlitchTip is not backed by venture capital.

- 💸 Donate via [Liberapay](https://en.liberapay.com/GlitchTip). We currently receive $13.79 per week from 20 patrons.
- ⭐ on [GitLab](https://gitlab.com/glitchtip/glitchtip-backend/). Help us reach 300 stars!
- ❤️ on [AlternativeTo](https://alternativeto.net/software/glitchtip/about/) and leave a review. AlternativeTo generates [significant](https://plausible.io/glitchtip.com?period=30d) website traffic.
- ⭐ on [dockerhub](https://hub.docker.com/r/glitchtip/glitchtip) where we have over 3 million pulls
- ⏩ Follow on [Mastodon](https://mastodon.online/@glitchtip)
- Talk to us on [Gitter](https://app.gitter.im/#/room/#GlitchTip_community:gitter.im)
