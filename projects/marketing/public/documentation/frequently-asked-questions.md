# Frequently Asked Questions

### How can I reduce the number of events my organization is using each month?

Performance events are one of the most common sources of excess events causing organizations on our hosted server to go over their monthly event limits. Users generally do not need GlitchTip to store large volumes of performance data, so it is recommended that you configure your SDK to send only a small percentage of performance events. This rate can be set with the `tracesSampleRate` config option (or `traces_sample_rate`, depending on your platform) on your SDK. Set this to a low number like `0.01` to have your SDK send only 1 percent of transactions to GlitchTip as performance events.

Sometimes users may also find their app is sounding out too many error events. If you can't resolve the errors quickly and don't need the details for every instance of every issue, you can reduce the rate at which your SDK sends out error events by setting the `sampleRate` config option (or `sample_rate` depending on your platform) to something like `0.5` to send only half of the errors your app experiences to GlitchTip as error events.

For more advanced use cases you can also configure your SDK to use different rates for different kinds of error/performance events using error and trace sampler functions. Check the documentation on your SDK for more details.

### Are you GDPR compliant?

GlitchTip is committed to user privacy and GDPR compliance. We minimize data collection, using cookies only for essential functionality like our chat widget (disabled by default in self-hosted GlitchTip). We use the privacy-respecting Plausible service for anonymized website analytics, which you can view publicly [here](https://plausible.io/glitchtip.com).

We are transparent about our data practices, and you can find detailed information in our [Privacy Policy](https://glitchtip.com/legal/privacy).

**Here's what else we do to protect your data:**
* **Data Control:** Hosted GlitchTip users have full control over their data and can delete it all when they delete their organization and user. We only retain billing records stored securely with Stripe.
* **No AI Training:** We do not use your data to train AI models.
* **Data Processing Agreements (DPAs):** We offer DPAs upon request, based on the Proton Mail DPA, which reflects our commitment to privacy and aligns with our internal tools.
We self-certify our compliance and continually review our processes to ensure we meet GDPR requirements.
