# Data Processing Agreement

_This Data Processing Agreement (“DPA”) forms part of GlitchTip’s [Terms of Service](/legal/tos) and applies automatically in the circumstances described in the Data Processing section of those Terms. No signature or separate acceptance is required._

Version 1.1 — Last Updated October 20, 2026

_Effective November 21, 2026 for existing accounts. New accounts accept this version when they sign up._

This DPA has 2 parts: (1) the Key Terms on this page and (2) the Common Paper DPA Standard Terms Version 1.1 posted at <a href="https://commonpaper.com/standards/data-processing-agreement/1.1" target="_blank" rel="noopener noreferrer">commonpaper.com/standards/data-processing-agreement/1.1</a> (“DPA Standard Terms”), which is incorporated by reference. If there is any inconsistency between the parts of the DPA, the Key Terms on this page will control over the DPA Standard Terms. The Key Terms below have the meanings given on this page. However, if this page omits or does not define a Key Term, the default meaning will be “none” or “not applicable” and the correlating clause, sentence, or section does not apply to this DPA. All other capitalized words have the meanings given in the DPA Standard Terms or the Agreement.

This page is the Cover Page for purposes of the DPA Standard Terms. Every reference in the DPA Standard Terms to the “Cover Page” means this page, including its Key Terms and Annexes. Customer electronically accepts this Cover Page by accepting the Agreement, and the parties are deemed to have agreed to a Cover Page for purposes of Section 10.1 of the DPA Standard Terms at that time.

## Key Terms

### Agreement

The GlitchTip [Terms of Service](/legal/tos), as accepted by Customer.

### Approved Subprocessors

[https://glitchtip.com/documentation/hosted-architecture#core-infrastructure-third-party-processors](/documentation/hosted-architecture#core-infrastructure-third-party-processors)

### Provider Security Contact

support@glitchtip.com

### Security Policy

The technical and organizational security measures described in Annex II below. The [Architecture & Security](/documentation/hosted-architecture) page gives more background, but it is informational and is not part of the Security Policy.

### Notices

Provider: support@glitchtip.com

Customer: the email addresses of the owners of Customer’s GlitchTip organization, or, for an account without an organization, the email address registered to that account.

### DPA Liability Cap

As provided in Section 8.1 of the DPA Standard Terms, each party’s liability arising out of or related to this DPA is subject to the Limitation of Liability section of the Agreement. Except as provided in Section 8.3 of the DPA Standard Terms, Provider’s liability under this DPA counts toward, and is not in addition to, the single liability cap stated there.

### Service Provider Relationship

To the extent California Consumer Privacy Act, Cal. Civ. Code § 1798.100 et seq (“CCPA”) applies, the parties acknowledge and agree that Provider is a service provider and is receiving Personal Data from Customer to provide the Service as agreed in the Agreement and detailed below (see Nature and Purpose of Processing), which constitutes a limited and specified business purpose. Provider will not sell or share any Personal Data provided by Customer under the Agreement. In addition, Provider will not retain, use, or disclose any Personal Data provided by Customer under the Agreement except as necessary for providing the Service for Customer, as stated in the Agreement, or as permitted by Applicable Data Protection Laws. Provider certifies that it understands the restrictions of this paragraph and will comply with all Applicable Data Protection Laws. Provider will notify Customer if it can no longer meet its obligations under the CCPA.

## Restricted Transfers

### Governing Member State

EEA Transfers: Ireland

UK Transfers: England and Wales

## Annex I(A) List of Parties

### Data Exporter

Name: the Customer, as identified by the account registered for the Services

Address: the address provided in Customer’s account or billing details

Activities relevant to transfer: See Annex I(B)

Role: Controller or Processor

### Data Importer

Name: Burke Software and Consulting LLC

Contact person: Burke Software and Consulting LLC — Privacy & Security Contact, Data Protection Contact

Address: New York, New York USA

Activities relevant to transfer: See Annex I(B)

Role: Processor or Subprocessor

## Annex I(B) Description of Transfer and Processing Activities

### Service

The Service is: GlitchTip, a hosted error tracking and application monitoring platform

### Categories of Data Subjects

- Customer’s end users or customers
- Customer’s employees
- Contractors and other authorized users of the Customer who log into and manage the GlitchTip platform, to the extent their personal data appears in data the Customer sends to the Service. Their account and sign-in data is covered by our [Privacy Policy](/legal/privacy) instead.

### Categories of Personal Data

- Name
- Contact information such as email, phone number, or address
- User activity and analysis such as device information or IP address
- Location information
- Telemetry Data: application error logs, stack traces, HTTP request parameters, device metadata, operating system and browser versions, IP addresses, and unstructured text strings automatically or manually captured by the Customer’s error reporting configuration.

### Special Category Data

Is special category data (as defined in Article 9 of the GDPR) Processed? Not intentionally. Customer determines what data its error reporting configuration transmits and is responsible for excluding special category data. Because payloads include unstructured content, such data may be transmitted incidentally. Customer agrees not to send special category data except as permitted by the Acceptable Use section of the Agreement. Protected health information may be Processed only where Customer and Provider have both signed a Business Associate Agreement that is in effect, and then subject to that agreement.

### Frequency of Transfer

Continuous

### Nature and Purpose of Processing

- Receiving data, including collection, accessing, retrieval, recording, and data entry
- Holding data, including storage, organization, and structuring
- Using data, including analysis, consultation, and testing
- Protecting data, including restricting, encrypting, and security testing
- Erasing data, including destruction and deletion

### Duration of Processing

Provider will process Customer Personal Data as long as required (i) to conduct the Processing activities instructed in Section 2.2(a)-(d) of the Standard Terms; or (ii) by Applicable Laws.

## Annex I(C)

### Competent Supervisory Authority

The supervisory authority will be the supervisory authority of the data exporter, as determined in accordance with Clause 13 of the EEA SCCs or the relevant provision of the UK Addendum.

## Annex II Technical and Organizational Security Measures

The measures below are the Security Policy.

**User identification and authorization process and protection:**

Production access is limited to authorized Provider personnel and requires single sign-on with hardware-backed multi-factor authentication. Application secrets are kept out of source control.

**Protecting Customer Personal Data during transmission (in transit):**

All data in transit is encrypted using TLS 1.2 or higher (HTTPS).

**Protecting Customer Personal Data during storage (at rest):**

Customer Personal Data is stored on encrypted DigitalOcean storage. Production databases accept connections only from the GlitchTip application.

**Physical security where Customer Personal Data is processed:**

Physical security and environmental controls are provided by DigitalOcean at its EU (Frankfurt, DE) and US (New York, US) data centers.

**Internal IT and IT security governance and management:**

Infrastructure is managed as version-controlled code and deployed through CI/CD.

**Ensuring limited data retention:**

Event data is deleted automatically, after 90 days by default, or when Customer deletes it. Deleted data expires from backups within 35 days.

## Other Changes to Standard Terms

Modification to Standard Terms Section 2.6 (Subprocessors). Provider will give at least 10 business days’ advance notice of any intended change to the Approved Subprocessors by email to Customer’s Notices address and by recording the change at the Approved Subprocessors page. If Customer objects within the objection period and the parties cannot resolve the objection in good faith, Customer may terminate the Agreement by written notice within that objection period, and Provider will refund any prepaid fees covering the period after termination. This is Customer’s sole remedy for an objection to a new Subprocessor.

Modification to Standard Terms Section 5.2 (Security Reports) and the defined term “Report.” Provider is a small organization that performs internal security self-assessments and does not undergo audits by independent third-party auditors. Accordingly, the references in Section 5.2 to audits by independent third-party auditors and to a “Report” do not apply to Provider. In their place, upon Customer’s written request to the Provider Security Contact (no more than once per calendar year), Provider will provide a summary of its then-current internal security documentation and self-assessment records sufficient for Customer to verify Provider’s compliance with the technical and organizational security measures described in Annex II. This modification does not affect Customer’s rights under Section 5.1 (Audit Rights) or Section 5.3 (Security Due Diligence).

## Acceptance

Provider and Customer have not changed the Standard Terms, except for the details on this page. Customer accepts this DPA by accepting the Agreement, and this DPA takes effect on the date Customer accepted the Agreement, except that for Customers who accepted the Agreement before this version was posted, it takes effect on November 21, 2026. It continues for as long as Provider Processes Customer Personal Data.

<hr />

The Common Paper DPA Standard Terms Version 1.1 are published by <a href="https://commonpaper.com" target="_blank" rel="noopener noreferrer">Common Paper</a> and are incorporated into this DPA by reference.
