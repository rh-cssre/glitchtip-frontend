---
title: Marketing Refresh and Updated Terms
description: A new marketing site and updated Terms, Privacy Policy, and DPA
published: True
---
We're proud to launch our new marketing site, as well as some changes to our terms of service and how data processing agreements (DPA) function for our users.

## What's Changed

If glitchtip.com looks different, it is! Every page, from home to docs to the blog you're reading now, has been rebuilt on a single design system. The site looks consistent from page to page, and it'll be much easier for us to keep it that way.

### A new home page

The home page now opens with a new hero banner, followed by a feature switcher. Instead of scrolling through a long list, you can tab between Error Tracking, Performance Monitoring, Uptime Monitoring, and Logs to see what each one does.

<div style="width: 800px; max-width: 100%; margin: 0 auto;">

<img src="../assets/blog-images/marketing-site-tos/new-marketing-hero.png" alt="New landing page">

</div>

### Documentation you can find your way around

Probably the biggest change is our documentation site! It's laid out more clearly, so you can get the help you need as you use GlitchTip.

<div style="width: 800px; max-width: 100%; margin: 0 auto;">

<img src="../assets/blog-images/marketing-site-tos/old-docs-page.png" alt="Old documentation site">

</div>

<div style="width: 800px; max-width: 100%; margin: 0 auto;">

<img src="../assets/blog-images/marketing-site-tos/new-doc-page.png" alt="New documentation site">

</div>

The docs now have a sidebar for navigation, a table of contents that follows you as you scroll, and a copy button on every code block! Self-hosters should check out the new [PostgreSQL tuning](https://glitchtip.com/documentation/install#postgresql-tuning) section. It explains the one setting most installs get wrong, and new Docker Compose installs now set it for you.

### Everything else

- **Pricing:** The plans table was rebuilt, and the wording on the free plan and data retention is clearer.
- **Support:** The support page now shows every way to reach us in one place.
- **Support chat loads only when you open it.** Before, the chat widget loaded on every page of the site and the app. Now nothing is sent to our chat provider until you click it. If it can't load, you'll see our support email instead.
- **Link previews:** Share a glitchtip.com link in Slack, Mastodon, or anywhere else, and you'll get a proper preview card.

## Updated Terms

Outside of the visuals, we've also taken the time to update our [Terms of Service](https://glitchtip.com/legal/tos), [Privacy Policy](https://glitchtip.com/legal/privacy), and [Data Processing Agreement](https://glitchtip.com/legal/data-processing-agreement). Our old terms were short and left a lot unsaid. The new versions spell out what we promise, what we expect from you, and what happens to your data.

**When this takes effect:** New accounts accept the new terms when they sign up. Existing accounts move to them on November 21, 2026. Until then, the [previous Terms](https://glitchtip.com/legal/tos-2026-07-22), [Privacy Policy](https://glitchtip.com/legal/privacy-2026-07-22), and [DPA](https://glitchtip.com/legal/data-processing-agreement-2026-07-22) still apply. If you don't agree, cancel any paid subscription and delete your organization or account before November 21.

### The DPA now covers everyone

Our DPA used to apply only to personal data covered by GDPR or similar laws. It now applies to every hosted GlitchTip organization, free or paid, whatever law covers the data. You don't need to sign anything. Paid customers who need a signed copy can email support@glitchtip.com, and we consider requests case by case.

### What else changed in the DPA

- **Subprocessor objections:** We still email you at least 10 business days before adding or replacing a subprocessor, and you have 30 days to object. If we can't resolve the objection, you can now terminate and get a refund of any prepaid fees.
- **Retention:** Events are deleted after 90 days by default, or when you delete them. Deleted data is gone from backups within 35 days.
- **One liability cap:** The DPA now shares the liability cap in our Terms instead of setting its own.

### What changed in the Terms of Service

- **Your data is yours.** We **still** don't sell it or use it to train AI models.
- **Acceptable use:** Don't send special category data (health, biometric, genetic, etc.), and don't send PHI unless you have a signed BAA with us (available on the Large plan for app.glitchtip.com, see our [HIPAA page](https://glitchtip.com/hipaa)).
- **Free plan:** Provided as is, with no uptime or support commitment.
- **Cancellation:** Cancel any time from your subscription settings. The Terms now explain what happens to your data afterward.

Our Privacy Policy was also rewritten. It now covers what GDPR asks a privacy notice to cover: separate sections for the hosted service and this website, the legal basis for each use of your data, how long we keep it, and your rights.

### Chatwoot

While reviewing everything, we found that Chatwoot, which runs our support email and the in-app chat on app.glitchtip.com, was never listed as a subprocessor. We've used it since launch. It's now listed on our [Hosted Architecture](https://glitchtip.com/documentation/hosted-architecture) page, along with what it receives and how long it keeps it. If you object, email support@glitchtip.com.

## On the Horizon

GlitchTip 7.0 is well on its way! If you follow the GlitchTip repo on GitLab you've probably seen the flurry of activity from us as we get it all ready. Some highlights include on-demand billing, a permissions rework and plenty of efficiency upgrades! We haven't set a timeline yet, so all we can offer is a nebulous "soon".

## Support Us

GlitchTip is 100% built and funded by users. No VC. We have no one to answer to but you.

### Support the project

- 🛡️ [Get Enterprise Support](mailto:support@glitchtip.com?subject=Purchasing%20enterprise%20support) (For Business) for $15 per user per month
- 💖 [Individual License](mailto:support@glitchtip.com?subject=Purchasing%20an%20individual%20license) (For Supporters) for $5 per month
- 💸 Donate via [Liberapay](https://en.liberapay.com/GlitchTip). We currently receive $26.77 per week from 21 patrons.

### Community & Social
- ⭐ on [GitLab](https://gitlab.com/glitchtip/glitchtip-backend/). Help us reach 400 stars!
- ⭐ on [Docker Hub](https://hub.docker.com/r/glitchtip/glitchtip), where we have over 5 million pulls
- ❤️ on [AlternativeTo](https://alternativeto.net/software/glitchtip/about/) and leave a review. AlternativeTo generates [significant](https://plausible.io/glitchtip.com?period=30d) website traffic.
