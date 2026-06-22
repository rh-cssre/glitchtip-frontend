---
title: "GlitchTip 5.1 Released"
description: "Featuring security best practices, performance boosts, and new features"
published: true
---

## Strict Content Security Policy (CSP) by default

GlitchTip 5.1 implements strict CSP settings. "unsafe-inline" is removed from our style-src. This best practice mitigates malicious third-party styles that could, in theory, trick a user by changing the visual look of GlitchTip.

## Hardening Database Roles

We now offer Helm chart support and documentation for setting less privileged database user roles. Interested users should review our [install documentation](https://glitchtip.com/documentation/install#configuration) for details.

## Other Improvements

- Transaction group statistics are calculated much faster
- Some create/update buttons are now disabled when the user does not have the necessary permissions.
- Tags can now be assigned to alerts thanks to [!1678](https://gitlab.com/glitchtip/glitchtip-backend/-/merge_requests/1678) via new contributor Maelstro. A user interface will be added soon.
- Issue event body payloads can now be toggled between raw and structured view thanks to [!573](https://gitlab.com/glitchtip/glitchtip-frontend/-/merge_requests/573) via new contributor moezkorkmaz.
- Slightly less JavaScript in our bundle. Our initial bundle size is 202.91 kB (gzipped). Full JS/CSS bundle is 501 kB (gzipped). As we modernized our frontend, we're able to get the same features done with less code.

## What's next?

- Material Design 3 refresh is in progress. This will further reduce JS bundle size.
- Backend support for issue event graphs is finished. Next, we need to create a JS graph to display them.
- Still no AI, no plans to add AI, and no selling your data to train AI models. Just boring old Python, JavaScript, and privacy.

## Support GlitchTip

Your time and financial donations are the only thing that keeps GlitchTip development going. GlitchTip is not backed by venture capital.

- 💸 Donate via [Liberapay](https://en.liberapay.com/GlitchTip). We currently receive $29.44 per week from 19 patrons.
- ⭐ on [GitLab](https://gitlab.com/glitchtip/glitchtip-backend/). Help us reach 300 stars!
- ❤️ on [AlternativeTo](https://alternativeto.net/software/glitchtip/about/) and leave a review. AlternativeTo generates [significant](https://plausible.io/glitchtip.com?period=30d) website traffic.
- ⭐ on [Docker Hub](https://hub.docker.com/r/glitchtip/glitchtip) where we have over 4 million pulls
- ⏩ Follow on [Mastodon](https://mastodon.online/@glitchtip) or [BlueSky](https://bsky.app/profile/glitchtip.com)
- Talk to us on [Gitter](https://app.gitter.im/#/room/#GlitchTip_community:gitter.im)
