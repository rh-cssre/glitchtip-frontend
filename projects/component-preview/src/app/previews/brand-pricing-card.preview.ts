import { Component, ChangeDetectionStrategy } from "@angular/core";
import { PricingAddonCardComponent } from "projects/marketing/src/app/shared/pricing-addon-card/pricing-addon-card.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-brand-pricing-card",
  imports: [PricingAddonCardComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .bpc-row {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-4);
        max-width: 560px;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Pricing card"
      status="stable"
      description="A wide promo row for pricing pages: an icon, a heading and one supporting line, and a call to action. Used to sell add-ons and plan features."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The call to action is a real link (router or external) so it is focusable and announces its destination; external URLs get proper hrefs."
      [api]="api"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Examples</div>
        <div class="bpc-row">
          <mkt-pricing-addon-card
            icon="avg_pace"
            title="Custom data retention"
            subtitle="Keep events beyond the default 90 days."
            buttonText="Contact us"
            buttonUrl="mailto:sales@glitchtip.com"
          />
          <mkt-pricing-addon-card
            icon="check_circle"
            title="Priority support"
            subtitle="Direct line to the engineers who build GlitchTip."
            buttonText="See plans"
            buttonUrl="/pricing#support"
          />
        </div>
      </div>
    </preview-doc>
  `,
})
export class BrandPricingCardPreview {
  readonly whenToUse = [
    "Pricing page add-ons and plan features",
    "Any brand row of icon + heading + copy + CTA",
  ];
  readonly dos = [
    "Keep the subtitle to one line",
    "Label the CTA with a verb: Contact us, See plans",
  ];
  readonly donts = [
    "Put more than one call to action in a card",
  ];
  readonly api: ApiRow[] = [
    { name: "icon", type: "string", default: "", description: "Material symbol name (must be in the app's subset)" },
    { name: "title", type: "string", default: "", description: "Card heading" },
    { name: "subtitle", type: "string", default: "", description: "One line of supporting copy" },
    { name: "buttonText", type: "string", default: "", description: "CTA label" },
    { name: "buttonUrl", type: "string", default: "", description: "Router path, #fragment, mailto:, or https:; external is detected automatically" },
  ];
  readonly code = `<mkt-pricing-addon-card
  icon="avg_pace"
  title="Custom data retention"
  subtitle="Keep events beyond the default 90 days."
  buttonText="Contact us"
  buttonUrl="mailto:sales@glitchtip.com"
/>`;
}
