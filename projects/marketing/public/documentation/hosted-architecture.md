# Hosted GlitchTip: Architecture & Security Compliance

This page outlines the infrastructure, security controls, and data policies for the Hosted GlitchTip SaaS. Our architecture is designed for data residency, transparency, and security. Our controls are informed by the HIPAA Security Rule, SOC 2, and ISO 27001, but we have not been audited or certified against any of them.

For HIPAA-specific information including BAA availability, see our [HIPAA page](/hipaa).

## Core Infrastructure & Third-Party Processors

For the data your applications send to GlitchTip, Burke Software acts as a data processor; for account and billing data it is the controller (see our [Privacy Policy](/legal/privacy)). We do not sell user data, and we share it only with this minimized set of sub-processors:

- Hosting (US): DigitalOcean NYC1 (New York, USA) - https://app.glitchtip.com
- Hosting (EU): DigitalOcean FRA1 (Frankfurt, Germany) - https://eu.glitchtip.com
- DNS & CDN: Cloudflare (DNS for both regions; reverse proxy/WAF on the EU instance only - see EU Hosting & Data Sovereignty below)
- Transactional Email: Mailgun (Data residency matches the server region: US or EU)
- Analytics: Plausible (Privacy-focused, GDPR compliant, no cookies) runs solely on this marketing website https://glitchtip.com and not on our GlitchTip hosted servers (ex: https://app.glitchtip.com)
- Customer Support: Chatwoot (hosted customer-support platform) - receives emails sent to support@glitchtip.com for both regions, and runs the in-app support chat on the US instance. For signed-in chat users it receives the user's ID, email, current organization, and plan. Support conversations are deleted 60 days after their last activity. Chatwoot stores data in the United States.
- Payments: Stripe (PCI-DSS Service Provider Level 1) - a global payment processor. Stripe receives only the billing details needed to process a subscription (e.g. name and billing contact); error events, logs, and PHI are never transmitted to Stripe.

If we add or replace a sub-processor, we will notify account holders by email at least 10 business days in advance and record the change below. Customers then have 30 days after notice to object, and may terminate if the objection can't be resolved, as provided in our [Data Processing Agreement](/legal/data-processing-agreement).

**Sub-processor changes:**

- **October 20, 2026** — Chatwoot added to this list. It has been used for customer support since GlitchTip launched but was previously omitted from this list in error.

![](/assets/glitchtip-saas.png)

## Data Processing Agreement (DPA)

Our Data Processing Agreement forms part of our [Terms of Service](/legal/tos) and applies automatically — if we process personal data on your behalf, whether you act as the data controller or as a processor for your own customer, it is already in effect. You don't need to sign anything for it to apply. It covers the personal data we process on your behalf under the GDPR, UK GDPR, and CCPA, and documents our role as a processor (or subprocessor), the sub-processors listed above, its technical and organizational security measures, and — for data leaving the EEA or UK — the EU Standard Contractual Clauses (Module 2, Controller-to-Processor, or Module 3, Processor-to-Processor) and the UK International Data Transfer Addendum.

- **Read the agreement**: [Data Processing Agreement](/legal/data-processing-agreement)

The published terms are our standard terms for every plan. This page describes our setup in more detail than the DPA and changes as the service evolves; the security measures in the DPA's Annex II are the binding ones.

## 🇪🇺 EU Hosting & Data Sovereignty

For organizations with data residency requirements, GlitchTip offers a fully independent EU instance hosted in Frankfurt, Germany (DigitalOcean FRA1).

- **EU Instance**: [eu.glitchtip.com](https://eu.glitchtip.com)
- **US Instance**: [app.glitchtip.com](https://app.glitchtip.com)

Data on the EU instance — including error events, user accounts, and transactional email — is stored and processed in the EU. The two instances are completely separate; there is no data replication between regions. Some processing happens outside the EU: Cloudflare's network (below), our payment processor Stripe for billing details, our support platform Chatwoot (US) for support messages, and Burke Software itself, a US company, when we access the service to operate or support it. These transfers are covered by the Standard Contractual Clauses in our [Data Processing Agreement](/legal/data-processing-agreement).

The EU instance sits behind Cloudflare as a reverse proxy and WAF, filtering malicious traffic and absorbing DDoS attempts before requests reach the origin. The US instance uses Cloudflare for DNS only, keeping it out of the request path entirely (so on the HIPAA-eligible US instance, Cloudflare has no access to request contents or PHI). Because Cloudflare runs a global anycast network, a visitor outside the EU may have their in-transit connection routed through a non-EU Cloudflare edge — for example, a US point of presence — before it reaches Frankfurt, and Cloudflare's reverse proxy and WAF process the request there. All data at rest remains in FRA1.

Both instances offer identical plans and features. To get started with EU hosting, sign up directly at [eu.glitchtip.com](https://eu.glitchtip.com).

## Security by Design

### Data Isolation and Encryption

- Storage: On the US instance, user data is stored in a PostgreSQL cluster in DigitalOcean Managed Kubernetes (DOKS), using CloudNativePG. On the EU instance, the application runs on DigitalOcean App Platform with DigitalOcean Managed PostgreSQL.
- Network Isolation: The US database cluster is isolated within a Private VPC (Virtual Private Cloud) and is not accessible via the public internet. The EU database accepts connections only from the GlitchTip application (a "Trusted Sources" allowlist) and requires TLS.
- Encryption:
  - In Transit: All data transmission requires TLS 1.2+ (HTTPS).
  - At Rest: Data is stored on encrypted DigitalOcean storage: Volumes Block Storage on the US instance, and DigitalOcean Managed PostgreSQL storage on the EU instance.
- Secrets Management: Application credentials and keys are managed via Kubernetes Secrets on the US instance and App Platform encrypted environment variables on the EU instance, and are never committed to version control.

### Access Controls

- Least Privilege: We operate on a strict principle of least privilege. Access to production infrastructure is restricted to the Principal Engineers at Burke Software.
- Audit Trails: Infrastructure changes are managed via OpenTofu (Infrastructure as Code). All access requests and infrastructure changes are version-controlled and logged via GitLab.
- Authentication: Administrative access to hosting environments requires Single Sign On (SSO) and hardware-backed Two-Factor Authentication (2FA/YubiKey).

### Workstation Security

- Encryption: All employee workstations utilize Full Disk Encryption (e.g., LUKS) to prevent unauthorized data access in the event of theft or loss.
- Auto-Lock: Workstations are configured to automatically lock after a short period of inactivity.
- Endpoint Protection: Development machines are kept up-to-date with the latest security patches and utilize local firewall restrictions.

### Application Security

- CSP & Headers: GlitchTip utilizes strict Content Security Policy (CSP), HSTS, and Secure Cookies.
- Independent Rating: Mozilla Observatory rates app.glitchtip.com as "A+". [View Report](https://developer.mozilla.org/en-US/observatory/analyze?host=app.glitchtip.com).
- Data Retention: Event data is automatically purged after 90 days by default. Deleted data expires from backups within 35 days.
- Container Security: Docker images are built in isolated GitLab CI pipelines and hosted on GitLab Container Registry and [Docker Hub](https://hub.docker.com/r/glitchtip/glitchtip)).

## Disaster Recovery & Availability

The US (HIPAA-eligible) instance runs on DigitalOcean’s Managed Kubernetes (DOKS) with a self-healing CloudNativePG PostgreSQL cluster in-cluster. The EU instance runs on DigitalOcean App Platform with DigitalOcean’s Managed PostgreSQL.

- Redundancy: Application services (Kubernetes Pods on the US instance, App Platform components on the EU instance) and databases are configured to self-heal.
- Backups: On the US instance, CloudNativePG (Barman Cloud) continuously archives PostgreSQL write-ahead logs and periodic base backups to a separate, encrypted DigitalOcean Spaces bucket, enabling point-in-time recovery (PITR) with a Recovery Point Objective (RPO) of minutes. The EU instance uses DigitalOcean Managed Database automated daily backups.
- Infrastructure status: our hosting provider's status is published at [DigitalOcean Status](https://status.digitalocean.com/).

### Incident Response Targets

While we utilize automated recovery for infrastructure, our internal targets for service-level incidents are:

- Response Time Objective: 1 hour (during EST business hours) / Best Effort (off-hours).
- Recovery Time Objective (RTO): 8 hours.

## Security Incident Response Policy

Burke Software maintains a response policy to address potential security events. This policy is designed to align with the notification requirements of GDPR and HIPAA.

### 1. Detection and Analysis

Roles are divided into a Technical Lead (investigation/remediation) and a Compliance Lead (communication). A security incident is declared upon discovery by staff or notification via automated security alerts.

### 2. Containment and Eradication

Upon verification of an incident, the Technical Lead will:

- Isolate affected services (Kubernetes Pods on the US instance, App Platform components on the EU instance).
- Rotate relevant API keys and secrets.
- Preserve system logs for forensic analysis.

### 3. Notification

If Burke Software becomes aware of a breach of customer data, it will notify the affected customer's designated contact without undue delay and no later than 72 hours after becoming aware, as required by our [Data Processing Agreement](/legal/data-processing-agreement).

The notification will include:

- A description of the breach.
- The data types involved.
- Mitigation steps taken.

### 4. Post-Incident Review

Following resolution, a root cause analysis is conducted to update policy and prevent recurrence. Documentation is retained for a minimum of six years.

## HIPAA Compliance

For HIPAA BAA information and compliance plan options, see our [HIPAA page](/hipaa).

## Vulnerability Disclosure

We are committed to keeping GlitchTip secure.

- Patch Management: We aim to update server and browser dependencies monthly.
- Reporting: If you find a security vulnerability, please open a [private issue on GitLab](https://gitlab.com/glitchtip).
- Note: Please do not report results of automated scanners (e.g., dependency bots) without manual verification. We do not offer a bug bounty program at this time.

For additional security questions or vendor risk assessment inquiries, please email support@glitchtip.com.
