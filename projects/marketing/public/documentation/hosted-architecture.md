# Hosted GlitchTip Architecture Overview

The intention of this page is to inform users of hosted GlitchTip how it's deployed and potentially help with compliance needs.

Burke Software does not share user data with any third parties. We do rely on DigitalOcean for hosting and Cloudflare for our CDN.

![](/assets/glitchtip-saas.png)

## Platform Architecture and Transparency

- User data is stored in Postgres using managed DigitalOcean Postgres service.
  - This includes error data as sent by the Sentry SDK. Burke Software employees only inspect such data with explicit permission by end users and do so only for quality assurance purposes.
  - Our database cluster is only available within our DigitalOcean Kubernetes cluster's "Trusted Source". It is not internet accessible.
  - Authentication requires SSL and is stored in Kubernetes Secrets. Authentication information is not kept in any git repository.
- Our web servers are run in Kubernetes using managed DigitalOcean Kubernetes.
- Analytics are stored in Plausible, a privacy focused analytics platform.
- Web traffic passes through Cloudflare CDN
- This marketing page is served via GitLab Pages.
- Subscriptions and payment are handled by Stripe. Burke Software does not store credit card information. Only subscription related information is sent to Stripe. Error data is not shared.
- Docker images used for both hosted GlitchTip and self-hosting are hosted on both [GitLab](https://gitlab.com/glitchtip/glitchtip-frontend/container_registry) and [Docker Hub](https://hub.docker.com/r/glitchtip/glitchtip). These images are built in [GitLab CI](https://gitlab.com/glitchtip/glitchtip-frontend/-/pipelines).
- Cookies are used for session based authentication and are required for using GlitchTip. Cookies are never shared with third parties.
- Event data is purged after 90 days. Users who wish to purge all account information should email [info@burkesoftware.com](mailto:info@burkesoftware.com).
- Mozilla Observatory rates app.glitchtip.com as "A+". View [report](https://observatory.mozilla.org/analyze/app.glitchtip.com). To keep users safe, we utilize Content Security Policy, secure cookies, HTTPS, and HSTS.

## Disaster Recovery

Hosted GlitchTip relies on DigitalOcean’s [Managed Kubernetes](https://www.digitalocean.com/docs/kubernetes/) and [Managed PostgreSQL](https://www.digitalocean.com/docs/databases/postgresql/) for a robust, fault tolerant platform. DigitalOcean publishes their Droplet Policies [here](https://www.digitalocean.com/docs/droplets/resources/policies/#droplet-service-level-agreement-sla). Individual services including Kubernetes Nodes, Kubernetes Pods, and Database Clusters automatically restore themselves.

All hosted GlitchTip assets are deployed to DigitalOcean’s NYC1 region. Hosted GlitchTip is susceptible to region wide availability issues. DigitalOcean publishes status [here](https://status.digitalocean.com/).

Due to the nature and architecture of GlitchTip, service interruptions on GlitchTip will not lead to customer application disruptions.

### Recovery Time Objective

In the majority of cases, recovery time from underlying infrastructure is determined by DigitalOcean. In cases where GlitchTip itself has a service interruption, our recovery time objective is within 1 hour during EST business hours and is best effort outside of business hours.

### Recovery Point Objective

Hosted GlitchTip data is saved in DigitalOcean’s Managed PostgreSQL and is backed up once per day and retained for 7 days.

Hosted GlitchTip infrastructure is configured using OpenTofu and is not publicly available. All changes to infrastructure are managed in gitlab.com where history is saved indefinitely.

## Process controls

- Burke Software employees are required to utilize Single Sign On via Google Apps and Two-Factor authentication when accessing privileged hosting services including DigitalOcean and GitLab version control systems.
- Authorization for hosting services is provisioned via Terraform in a private git repository. All permission requests are logged via git commits.

## Security policy

The GlitchTip team aims to update server and browser packages at least monthly. Additionally, Django security releases are monitored and considered for hot fix release. Additional paid support guarantees are available. Email [sales@glitchtip.com](mailto:sales@glitchtip.com).

Found a security vulnerability? [Open a private issue on GitLab](https://gitlab.com/glitchtip). Please do not report results of automated tools, such as dependency bots. If you believe an automated tool would be helpful, discuss on Gitter first.

Need more information? Email us at [info@burkesoftware.com](mailto:info@burkesoftware.com)
