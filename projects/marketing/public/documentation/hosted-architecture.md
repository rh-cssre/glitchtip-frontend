# Hosted GlitchTip: Architecture & Security Compliance

This page outlines the infrastructure, security controls, and data policies for the Hosted GlitchTip SaaS. Our architecture is designed to ensure data residency, transparency, and security, adhering to principles found in HIPAA, SOC II, and ISO 27001 frameworks.

For HIPAA-specific information including BAA availability, see our [HIPAA page](/hipaa).

## Core Infrastructure & Third-Party Processors

Burke Software functions as a data processor. We do not sell or share user data with third parties. We utilize a minimized set of industry-standard sub-processors:

- Hosting (US): DigitalOcean NYC1 (New York, USA) - https://app.glitchtip.com
- Hosting (EU): DigitalOcean FRA1 (Frankfurt, Germany) - https://eu.glitchtip.com
- DNS & CDN: Cloudflare (DNS for both regions; reverse proxy/WAF on the EU instance only - see EU Hosting & Data Sovereignty below)
- Transactional Email: Mailgun (Data residency matches the server region: US or EU)
- Analytics: Plausible (Privacy-focused, GDPR compliant, no cookies) runs solely on this marketing website https://glitchtip.com and not on our GlitchTip hosted servers (ex: https://app.glitchtip.com)
- Payments: Stripe (PCI-DSS Service Provider Level 1) - a global payment processor. Stripe receives only the billing details needed to process a subscription (e.g. name and billing contact); error events, logs, and PHI are never transmitted to Stripe.

![](/assets/glitchtip-saas.png)

## Data Processing Agreement (DPA)

For customers who need one, Burke Software offers a standard Data Processing Agreement covering the personal data we process on your behalf under the GDPR, UK GDPR, and CCPA. It documents our role as a processor, the sub-processors listed above, the technical and organizational security measures described on this page, and — for data leaving the EEA or UK — the EU Standard Contractual Clauses (Module 2, Controller-to-Processor) and the UK International Data Transfer Addendum.

- **Read the agreement**: [Data Processing Agreement (PDF)](/legal/data-processing-agreement.pdf)

The published version is our standard template, offered as-is. Paying customers who require a signed, countersigned copy can request one at [sales@glitchtip.com](mailto:sales@glitchtip.com).

## 🇪🇺 EU Hosting & Data Sovereignty

For organizations with data residency requirements, GlitchTip offers a fully independent EU instance hosted in Frankfurt, Germany (DigitalOcean FRA1).

- **EU Instance**: [eu.glitchtip.com](https://eu.glitchtip.com)
- **US Instance**: [app.glitchtip.com](https://app.glitchtip.com)

All data on the EU instance — including error events, user accounts, and transactional email — stays within the EU. The two instances are completely separate; there is no data replication between regions.

The EU instance sits behind Cloudflare as a reverse proxy and WAF, filtering malicious traffic and absorbing DDoS attempts before requests reach the origin. The US instance uses Cloudflare for DNS only, keeping it out of the request path entirely (so on the HIPAA-eligible US instance, Cloudflare has no access to request contents or PHI). Because Cloudflare runs a global anycast network, a visitor outside the EU may have their in-transit connection routed through a non-EU Cloudflare edge — for example, a US point of presence — before it reaches Frankfurt; all data at rest and all processing still remain in FRA1.

Both instances offer identical plans and features. To get started with EU hosting, sign up directly at [eu.glitchtip.com](https://eu.glitchtip.com).

## Security by Design

### Data Isolation and Encryption

- Storage: User data is stored in managed Kubernetes (DOKS) PostgreSQL cluster, using CloudNativePG.
- Network Isolation: The database cluster is isolated within a Private VPC (Virtual Private Cloud) and is accessible strictly via the Kubernetes cluster’s "Trusted Source" allowlist. It is not accessible via the public internet.
- Encryption:
  - In Transit: All data transmission requires TLS 1.2+ (HTTPS).
  - At Rest: DigitalOcean Volumes Block Storage provides encryption at rest.
- Secrets Management: Application credentials and keys are managed via Kubernetes Secrets and are never committed to version control.

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
- Data Retention: Event data is automatically purged after 90 days.
- Container Security: Docker images are built in isolated GitLab CI pipelines and hosted on GitLab Container Registry and [Docker Hub](https://hub.docker.com/r/glitchtip/glitchtip)).

## Disaster Recovery & Availability

Hosted GlitchTip relies on DigitalOcean’s Managed Kubernetes and Managed PostgreSQL for high availability.

- Redundancy: Individual services (Kubernetes Pods) and Database Clusters are configured to self-heal.
- Failover: In the event of a service interruption, our architecture ensures that the GlitchTip ingestion API fails closed; service interruptions on GlitchTip will not disrupt your application's core functionality.
- Backups: Database snapshots are taken daily and retained for 7 days to ensure Recovery Point Objective (RPO) capabilities.
- Status: Platform status is available at [DigitalOcean Status](https://status.digitalocean.com/).

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

- Isolate affected Kubernetes Pods or services.
- Rotate relevant API keys and secrets.
- Preserve system logs for forensic analysis.

### 3. Notification

If a breach of customer data is confirmed, Burke Software will notify the affected customer's designated contact without undue delay and no later than 72 hours after discovery.

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

For additional security questions or vendor risk assessment inquiries, please email sales@glitchtip.com.
