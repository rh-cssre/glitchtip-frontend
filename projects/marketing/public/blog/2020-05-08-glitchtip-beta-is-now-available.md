---
title: GlitchTip beta is now available
description: Today we are releasing GlitchTip 0.0.1 to Docker Hub. We hope this will make it easier for interested users to preview GlitchTip and for developers to try it out for their own projects.
published: true
---

Today we are releasing GlitchTip 0.0.1 to [Docker Hub](https://hub.docker.com/r/glitchtip/glitchtip). We hope this will make it easier for interested users to preview GlitchTip and for developers to try it out for their own projects. We’re calling it beta because it’s not feature complete yet. Sign up requires using Django Admin (/admin) to create organizations, teams, projects, and users.

<div>
    <picture>
        <source
            type="image/webp"
            srcset="
                /assets/blog-images/glitchtip-beta/glitchtip-beta-issue-list@1x.webp,
                /assets/blog-images/glitchtip-beta/glitchtip-beta-issue-list@2x.webp 2x,
                /assets/blog-images/glitchtip-beta/glitchtip-beta-issue-list@3x.webp 3x,
            "
        />
        <img
            src="/assets/blog-images/glitchtip-beta/glitchtip-beta-issue-list@1x.png"
            srcset="
                /assets/blog-images/glitchtip-beta/glitchtip-beta-issue-list@1x.png,
                /assets/blog-images/glitchtip-beta/glitchtip-beta-issue-list@2x.png 2x,
                /assets/blog-images/glitchtip-beta/glitchtip-beta-issue-list@3x.png 3x,
            "
            loading="lazy"
            alt="Screenshot of GlitchTip's issues list page"
        />
    </picture>
</div>

<div>
    <picture>
        <source
            type="image/webp"
            srcset="
                /assets/blog-images/glitchtip-beta/glitchtip-beta-issue-detail@1x.webp,
                /assets/blog-images/glitchtip-beta/glitchtip-beta-issue-detail@2x.webp 2x,
                /assets/blog-images/glitchtip-beta/glitchtip-beta-issue-detail@3x.webp 3x,
            "
        />
        <img
            src="/assets/blog-images/glitchtip-beta/glitchtip-beta-issue-detail@1x.png"
            srcset="
                /assets/blog-images/glitchtip-beta/glitchtip-beta-issue-detail@1x.png,
                /assets/blog-images/glitchtip-beta/glitchtip-beta-issue-detail@2x.png 2x,
                /assets/blog-images/glitchtip-beta/glitchtip-beta-issue-detail@3x.png 3x,
            "
            loading="lazy"
            alt="Screenshot of GlitchTip's issue detail page"
        />
    </picture>
</div>

GlitchTip is an open source reimplementation of Sentry’s proprietary backend software. It’s compatible with Sentry’s various open source client SDKs. We thank the Sentry team for continuing their commitment to open source SDKs.

If you're interested in running GlitchTip on your own, read our [installation guide](https://glitchtip.com/documentation/install).

To contribute, talk to us with the live chat at [glitchtip.com](https://glitchtip.com) or open an issue on our [GitLab](https://gitlab.com/groups/glitchtip/-/issues). If your company is interested in open source error tracking, you can contribute by signing up for our hosted SaaS GlitchTip service. Contact [info@burkesoftware.com](mailto:info@burkesoftware.com) for more information. Prices start at \$15/month for up to 100k events. Hosted GlitchTip uses the same open source code available to all and always will.

## What’s next?

Our next big milestone is a 1.0 release. Some highlights from this release will include self sign up and search.
