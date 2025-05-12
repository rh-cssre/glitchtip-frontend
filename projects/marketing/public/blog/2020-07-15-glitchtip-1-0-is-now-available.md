---
title: GlitchTip 1.0 is now available
description: Today we are releasing GlitchTip 1.0 to Docker Hub. It's our first stable release that's ready for general usage!
published: true
---

Today we are releasing GlitchTip 1.0.0 to [Docker Hub](https://hub.docker.com/r/glitchtip/glitchtip). This release includes the ability to sign up and manage your organization. This makes GlitchTip ready for general usage.

<div>
    <picture>
        <source
            type="image/webp"
            srcset="
                /assets/blog-images/glitchtip-1-0/add-member@1x.webp,
                /assets/blog-images/glitchtip-1-0/add-member@2x.webp 2x,
                /assets/blog-images/glitchtip-1-0/add-member@3x.webp 3x,
            "
        />
        <img
            src="/assets/blog-images/glitchtip-1-0/add-member@1x.png"
            srcset="
                /assets/blog-images/glitchtip-1-0/add-member@1x.png,
                /assets/blog-images/glitchtip-1-0/add-member@2x.png 2x,
                /assets/blog-images/glitchtip-1-0/add-member@3x.png 3x,
            "
            loading="lazy"
            alt="Screenshot of GlitchTip's add member page"
        />
    </picture>
</div>

<div>
    <picture>
        <source
            type="image/webp"
            srcset="
                /assets/blog-images/glitchtip-1-0/create-team@1x.webp,
                /assets/blog-images/glitchtip-1-0/create-team@2x.webp 2x,
                /assets/blog-images/glitchtip-1-0/create-team@3x.webp 3x,
            "
        />
        <img
            src="/assets/blog-images/glitchtip-1-0/create-team@1x.png"
            srcset="
                /assets/blog-images/glitchtip-1-0/create-team@1x.png,
                /assets/blog-images/glitchtip-1-0/create-team@2x.png 2x,
                /assets/blog-images/glitchtip-1-0/create-team@3x.png 3x,
            "
            loading="lazy"
            alt="Screenshot of GlitchTip's create team page"
        />
    </picture>
</div>

GlitchTip is an open source reimplementation of Sentry’s proprietary backend software. It’s compatible with Sentry’s various open source client SDKs. We thank the Sentry team for continuing their commitment to open source SDKs.

## Introducing Hosted GlitchTip

Looking for a open source, hosted, and affordable error tracking platform? Sign up for [Hosted GlitchTip](app.glitchtip.com) by Burke Software. Paid plans start at \$15/month, but you can give it a try with 1000 events/month for free. Your support allows us to develop the only 100% free and open source error monitoring platform that's compatible with the Sentry SDK. Our hosted platform is the same exact Docker image you get with self-hosting and we are committed to never creating proprietary bits or restricting how you can use GlitchTip.

Would you prefer to run GlitchTip on your own? Read our [installation guide](https://glitchtip.com/documentation/install) to learn more.

## What’s next?

Our next milestone is [1.1](https://gitlab.com/groups/glitchtip/-/milestones/6). Future work for 1.1 and beyond will include:

- Support for project releases
- Support for tags
- Event aggregation
- Improved SaaS subscription management
- Improved social sign on options
- Better Sentry API compatibility for integrations that work with Sentry

Interested in developing GlitchTip? Say hi to us on [Gitter](https://gitter.im/GlitchTip/community) or open an issue on [Gitlab](https://gitlab.com/glitchtip/). Not a Django/Angular developer? We can always use help with design, marketing, documentation, and translations too!
