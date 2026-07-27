import { Component, ChangeDetectionStrategy } from "@angular/core";
import { SupportBannerComponent } from "src/app/shared/support-banner/support-banner.component";
import { UpgradeBannerComponent } from "src/app/shared/upgrade-banner/upgrade-banner.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * The app's promotional/status banners. verify-email-banner is intentionally
 * not previewed: it injects EmailsService and renders from live account state.
 */
@Component({
  selector: "preview-banners",
  imports: [SupportBannerComponent, UpgradeBannerComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .banner-stack {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-4);
        max-width: 720px;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Banners"
      status="stable"
      description="Prominent cards that promote an action or surface account state: upgrading a plan, getting support. They sit at the top of a page, above the content they relate to."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="Banners are static content with real link/button actions; they do not steal focus or auto-dismiss. State changes (throttling, hard stop) are conveyed in text, not color alone."
      [composition]="composition"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Upgrade banner</div>
        <p class="preview-section__note">
          Variants for approaching the limit, throttling, and hard stop.
        </p>
        <div class="banner-stack">
          <gt-upgrade-banner
            [usagePercent]="82"
            [nextPlanEvents]="1000000"
            [freeEventLimit]="1000"
          />
          <gt-upgrade-banner
            [usagePercent]="100"
            [eventThrottleRate]="50"
            [nextPlanEvents]="1000000"
            [freeEventLimit]="1000"
          />
          <gt-upgrade-banner
            [usagePercent]="100"
            [isAcceptingEvents]="false"
            variant="get-started"
            [nextPlanEvents]="1000000"
            [freeEventLimit]="1000"
          />
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Support banner</div>
        <p class="preview-section__note">
          Shown on self-hosted instances. The superuser variant adds the
          license-key hint.
        </p>
        <div class="banner-stack">
          <gt-support-banner [isSuperuser]="true" />
        </div>
      </div>
    </preview-doc>
  `,
})
export class BannersPreview {
  readonly whenToUse = [
    "Account-level state the user should act on (usage limits, plan upgrade)",
    "Self-hosted support promotion",
  ];
  readonly dos = [
    "Place one banner at the top of the related page",
    "Bind real usage numbers; the banner formats them (1M, 1k)",
  ];
  readonly donts = [
    "Use a banner for transient feedback that belongs in a toast",
  ];
  readonly content = [
    "Lead with the state or the offer, not the mechanism",
    "Name the action on the button: Upgrade, Compare Plans, not Learn More",
    "Give numbers meaning: you have used 82% of your events",
  ];
  readonly composition = {
    contains: ["Buttons & actions"],
  };
  readonly api: ApiRow[] = [
    { name: "usagePercent", type: "number | null", default: "null", description: "Current usage as a percent of the plan" },
    { name: "eventThrottleRate", type: "number | null", default: "null", description: "Nonzero when events are being throttled" },
    { name: "isAcceptingEvents", type: "boolean | null", default: "null", description: "false renders the hard-stop state" },
    { name: "variant", type: `"upgrade" | "get-started"`, default: `"upgrade"`, description: "Copy variant" },
    { name: "nextPlanEvents", type: "number | null", default: "null", description: "Event volume of the next plan (formatted)" },
    { name: "freeEventLimit", type: "number | null", default: "null", description: "Free plan event limit (formatted)" },
    { name: "hideActions", type: "boolean", default: "false", description: "Hides the action buttons" },
    { name: "upgradeLoading", type: "boolean", default: "false", description: "Spinner on the upgrade action" },
    { name: "(upgradeClick)", type: "output", default: "", description: "Upgrade action pressed" },
    { name: "(comparePlansClick)", type: "output", default: "", description: "Compare-plans action pressed" },
  ];
  readonly importCode = `import { UpgradeBannerComponent } from "src/app/shared/upgrade-banner/upgrade-banner.component";
import { SupportBannerComponent } from "src/app/shared/support-banner/support-banner.component";`;
  readonly code = `<gt-upgrade-banner
  [usagePercent]="usagePercent()"
  [eventThrottleRate]="throttleRate()"
  [nextPlanEvents]="nextPlan()?.events"
  (upgradeClick)="startUpgrade()"
/>`;
}
