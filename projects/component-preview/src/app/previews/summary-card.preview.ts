import { Component, ChangeDetectionStrategy } from "@angular/core";
import { SummaryCardComponent } from "src/app/settings/subscription/subscription-charts/summary-card/summary-card.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * gt-summary-card: a metric with an optional progress-toward-limit, used on the
 * subscription and self-hosted dashboards (events, uptime checks, and so on).
 */
@Component({
  selector: "preview-summary-card",
  imports: [SummaryCardComponent, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .sc-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        // Equal rows: every cell takes the tallest card's height, so the tiles
        // line up instead of each sizing to its own content.
        grid-auto-rows: 1fr;
        gap: var(--gt-space-4);
        max-width: 760px;
      }
      // The ideal metric-card layout: the card fills its cell and the progress
      // bar sits on a shared bottom baseline, so a row lines up even when the
      // values differ (loading, over-limit, not-enough-data). The shipped
      // component sizes to its own content and leaves the bar wherever the text
      // ends, so this demo pierces it to show the target (product fix: P19).
      .sc-grid gt-summary-card {
        display: block;
        height: 100%;
      }
      .sc-grid gt-summary-card ::ng-deep mat-card {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .sc-grid gt-summary-card ::ng-deep mat-card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      // Push the meter to the bottom so every card's bar shares one baseline.
      .sc-grid gt-summary-card ::ng-deep mat-progress-bar {
        margin-top: auto;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Summary card"
      status="stable"
      description="A single headline number with an optional progress bar toward a limit and a plain-language subtitle. Use several in a row for a dashboard's key metrics. It handles its own not-enough-data and loading states."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="The number, subtitle, and progress bar are read in order, so the value and its context are announced together. Over-limit is conveyed by the subtitle text, not the bar color alone."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">States</div>
        <div class="sc-grid">
          <gt-summary-card title="Events" [value]="620" [eventsAllowed]="1000" />
          <gt-summary-card title="Events" [value]="920" [eventsAllowed]="1000" />
          <gt-summary-card
            title="Events"
            [value]="1000"
            [eventsAllowed]="1000"
            [limitThreshold]="100"
          />
          <gt-summary-card title="Uptime Checks" [value]="4820" [eventsAllowed]="null" [showLimits]="false" />
          <gt-summary-card title="Events" [value]="null" [eventsAllowed]="1000" />
          <gt-summary-card title="Events" [value]="620" [eventsAllowed]="1000" [loading]="true" />
        </div>
      </div>
    </preview-doc>
  `,
})
export class SummaryCardPreview {
  readonly whenToUse = [
    "A dashboard's headline metrics (events used, checks run)",
    "Any single number that is more meaningful against a limit",
  ];
  readonly dos = [
    "Set showLimits only when there is a real limit to compare against",
    "Pass null for value when there is not enough data; the card handles the copy",
    "Group cards in a responsive grid so they wrap cleanly",
  ];
  readonly donts = [
    "Put a paragraph in the title; it is a short metric label",
    "Use it for a value with no headline number (use a stat row instead)",
  ];
  readonly content = [
    "Title is a short noun: Events, Uptime Checks",
    "Let the card write the subtitle (percent of limit, Over limit, Not enough data)",
  ];
  readonly api: ApiRow[] = [
    { name: "title", type: "string", default: "", description: "Short metric label (required)" },
    { name: "value", type: "number | null", default: "", description: "The headline number; null shows Not enough data (required)" },
    { name: "eventsAllowed", type: "number | null", default: "", description: "The limit the value is measured against (required)" },
    { name: "limitThreshold", type: "number", default: "80", description: "Percent at which the card reads as over limit" },
    { name: "showLimits", type: "boolean", default: "true", description: "Hide the progress bar and percentage when there is no limit" },
    { name: "loading", type: "boolean", default: "false", description: "Shows a spinner while the metric loads" },
  ];
  readonly importCode = `import { SummaryCardComponent } from "src/app/settings/subscription/subscription-charts/summary-card/summary-card.component";`;
  readonly code = `<gt-summary-card
  title="Events"
  [value]="usage.events()"
  [eventsAllowed]="plan.eventLimit()"
  [loading]="usage.loading()"
/>`;
}
