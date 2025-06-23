---
title: 'GlitchTip 4.2 Released'
description: 'More control over incoming events'
published: true
---

## Introducing server-side throttling
The GlitchTip team is pleased to announce GlitchTip 4.2 and the initial release for server-side event throttling. Users looking to reduce cost and disk usage should consider configuring their sentry SDK client throttling as the best option to reduce events. However, at times this may be infeasible. Version 4.2 introduces both organization and project-level server-side throttles.

## Throttling for self-host users
At this time, throttles must be set in Django Admin (/admin/) on the project and/or organization. We plan to provide a way to set throttle rates under project settings in our front-end soon. API users may notice it can be set already. When a throttle is set to a percentage (0 to 100), GlitchTip will cache and calculate whether to accept an event or throttle it with a 429 status code. When throttled, the request will make a single Redis read request to fetch the throttle %. By avoiding the database on cache hits, the server resources used to handle a throttled request are minimal. 

## Throttling for hosted users
Hosted users such as those on app.glitchtip.com pay for a plan with a set quota of events. Starting now, plans will have throttles progressively increased when over the quota. This means that you will actually get more events for no additional cost until the throttle hits 100%.

- Under quota - no throttling
- 100% to 150% - 10% throttle
- 150% to 200% - 50% throttle
- \>200% - No events are accepted

If you have a plan with 1,000 events, such as the [app.glitchtip.com](https://app.glitchtip.com) free plan, you can now submit as many as 2,000 events. Emails are sent out when a threshold is reached and upgrading the plan will immediately reset the throttle.

## Source map support
Source maps help make your code more readable, ensuring you see the original JavaScript and not a minified version. GlitchTip 4.2 includes support for sentry SDK "artifact bundles". These bundles embed a "debug id" into the source map which can be used to reference between an event and it's source code. Previously with GlitchTip, a release had to be set to enable source map look ups. That restriction is removed and more sentry SDKs will produce readable stack-traces by default.
If you have any problems with source maps uploaded prior to 4.2, you may need to reupload them.

## Hosting and revenue sharing

The GlitchTip team strongly believes in the freedom of choice for hosting. While Burke Software and Consulting hosts the app.glitchtip.com server, there are plenty of other options. Two of these participate in revenue sharing:

**Elest.io** allows hosting on various cloud providers and on-premise. I (David Burke) personally like their flexible options on where to host. Their revenue share program is quite generous, so when you use Elest.io you are supporting GlitchTip development. Check out this option on [their website](https://elest.io/open-source/glitchtip).

**pikapods** is easy to run and offers a good value for their service. They have less options available however. I use them myself for another open source project that I like - immich. You might be surprised that the lead developer of GlitchTip uses a hosted service because I don't prefer spending time configuring servers. Check out this option on [their website](https://www.pikapods.com/pods?run=glitchtip).

The GlitchTip team has put in considerable time towards lowering resource requirements. GlitchTip uses a write buffer system to save events in batches. If you've been running GlitchTip for a long time, you may wish to evaluate your resource needs and consider downscaling PostgreSQL. We're also evaluating a single process all-in-one launcher for very small servers.

## Support GlitchTip

Your time and financial donations are the only thing that keeps GlitchTip development going. GlitchTip is not backed by venture capital.

- 💸 Donate via [Liberapay](https://en.liberapay.com/GlitchTip). We currently receive $16.64 per week from 21 patrons.
- ⭐ on [GitLab](https://gitlab.com/glitchtip/glitchtip-backend/). Help us reach 300 stars!
- ❤️ on [AlternativeTo](https://alternativeto.net/software/glitchtip/about/) and leave a review. AlternativeTo generates [significant](https://plausible.io/glitchtip.com?period=30d) website traffic.
- ⭐ on [dockerhub](https://hub.docker.com/r/glitchtip/glitchtip) where we have over 3 million pulls
- ⏩ Follow on [Mastodon](https://mastodon.online/@glitchtip)
- Talk to us on [Gitter](https://app.gitter.im/#/room/#GlitchTip_community:gitter.im)
