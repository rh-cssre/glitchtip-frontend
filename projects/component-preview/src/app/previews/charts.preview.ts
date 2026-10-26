import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

interface DayBar {
  day: string;
  accepted: number;
  dropped: number;
}

interface Swatch {
  token: string;
  label: string;
  use: string;
}

/**
 * Data-visualization guidelines. GlitchTip's charts are custom, lightweight
 * CSS/div bars (no chart library) colored from theme tokens, so they theme
 * with the app and stay small. This page sets the color and behavior rules;
 * the example is a self-contained demo, not a product component.
 */
@Component({
  selector: "preview-charts",
  imports: [PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .chart-legend {
        display: flex;
        flex-wrap: wrap;
        gap: var(--gt-space-4);
        margin-bottom: var(--gt-space-3);
      }
      .chart-legend__item {
        display: flex;
        align-items: center;
        gap: var(--gt-space-2);
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
      }
      .chart-legend__swatch {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }
      .chart {
        display: flex;
        align-items: flex-end;
        gap: var(--gt-space-3);
        height: 160px;
      }
      .chart-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--gt-space-2);
        flex: 1;
        height: 100%;
        justify-content: flex-end;
      }
      .chart-bar {
        display: flex;
        flex-direction: column-reverse;
        width: 100%;
        max-width: 36px;
        border-radius: 3px 3px 0 0;
        overflow: hidden;
      }
      .chart-x {
        font: var(--mat-sys-label-small);
        color: var(--mat-sys-on-surface-variant);
      }
      .chart-nodata {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 160px;
        border: 1px dashed var(--mat-sys-outline-variant);
        border-radius: 8px;
        background-color: var(--mat-sys-surface-container-low);
        color: var(--mat-sys-on-surface-variant);
        font: var(--mat-sys-body-medium);
        text-align: center;
        padding: var(--gt-space-4);
      }
      .swatch-grid {
        display: flex;
        flex-wrap: wrap;
        gap: var(--gt-space-4) var(--gt-space-5);
      }
      .swatch {
        display: flex;
        align-items: center;
        gap: var(--gt-space-3);
      }
      .swatch__chip {
        flex: none;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        border: 1px solid var(--mat-sys-outline-variant);
      }
      .swatch__label {
        font: var(--mat-sys-body-small);
      }
      .swatch__label small {
        display: block;
        color: var(--mat-sys-on-surface-variant);
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.72rem;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Charts"
      status="stable"
      description="Charts are custom, lightweight CSS bars, no chart library, colored from theme tokens so they follow the light and dark themes automatically. Color carries meaning: a series' color says what it is, not just that it is different."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="Never encode meaning in color alone. Give every series a label or legend and expose the underlying value (tooltip or adjacent number). Meet contrast against the surface, and respect prefers-reduced-motion for any grow or transition."
      [api]="api"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Color by meaning</div>
        <p class="preview-section__note">
          Status colors say how something is doing. Reach for these first.
        </p>
        <div class="swatch-grid">
          @for (s of status; track s.token) {
            <div class="swatch">
              <span
                class="swatch__chip"
                [style.background-color]="'var(' + s.token + ')'"
              ></span>
              <span class="swatch__label">{{ s.label }}<small>{{ s.use }}</small></span>
            </div>
          }
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Categorical sequence</div>
        <p class="preview-section__note">
          When categories carry no inherent status, assign colors in this order.
          The hues are spaced for contrast, so neighboring series stay distinct.
          Our primary and error roles are both red, so never place them side by
          side in a chart.
        </p>
        <div class="swatch-grid">
          @for (s of categorical; track s.token) {
            <div class="swatch">
              <span
                class="swatch__chip"
                [style.background-color]="'var(' + s.token + ')'"
              ></span>
              <span class="swatch__label">{{ s.label }}<small>{{ s.token }}</small></span>
            </div>
          }
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Events over time</div>
        <p class="preview-section__note">
          A stacked bar per day: accepted volume plus the part that was dropped.
          Dropped uses warning amber, not error red, so it does not clash with
          the primary series.
        </p>
        <div class="chart-legend">
          <span class="chart-legend__item">
            <span class="chart-legend__swatch" style="background-color: var(--mat-sys-primary)"></span>
            Accepted
          </span>
          <span class="chart-legend__item">
            <span class="chart-legend__swatch" style="background-color: var(--warning-color)"></span>
            Dropped
          </span>
        </div>
        <div class="chart">
          @for (d of series; track d.day) {
            <div class="chart-col">
              <div class="chart-bar">
                <div
                  [style.height.px]="barPx(d.accepted)"
                  style="background-color: var(--mat-sys-primary)"
                ></div>
                <div
                  [style.height.px]="barPx(d.dropped)"
                  style="background-color: var(--warning-color)"
                ></div>
              </div>
              <span class="chart-x">{{ d.day }}</span>
            </div>
          }
        </div>
      </div>

      <div class="preview-section" style="margin-bottom: 0">
        <div class="preview-section__title">No data</div>
        <p class="preview-section__note">
          When there is nothing to plot, replace the chart with a short message,
          do not leave an empty frame. On reload, keep the previous chart until
          fresh data lands (the same rule as tables).
        </p>
        <div class="chart-nodata">No events in this range yet.</div>
      </div>
    </preview-doc>
  `,
})
export class ChartsPreview {
  readonly series: DayBar[] = [
    { day: "Mon", accepted: 40, dropped: 5 },
    { day: "Tue", accepted: 55, dropped: 8 },
    { day: "Wed", accepted: 30, dropped: 3 },
    { day: "Thu", accepted: 62, dropped: 12 },
    { day: "Fri", accepted: 48, dropped: 6 },
    { day: "Sat", accepted: 20, dropped: 2 },
    { day: "Sun", accepted: 35, dropped: 4 },
  ];
  // Tallest total (Thu: 62 + 12) maps to the full 150px plot height.
  private readonly maxTotal = 74;
  barPx(value: number): number {
    return Math.round((value / this.maxTotal) * 150);
  }

  readonly status: Swatch[] = [
    { token: "--success-color", label: "Success", use: "up, healthy, accepted" },
    { token: "--warning-color", label: "Warning", use: "degraded, throttled, dropped" },
    { token: "--mat-sys-error", label: "Error", use: "down, failed" },
  ];
  readonly categorical: Swatch[] = [
    { token: "--issues-color", label: "1", use: "" },
    { token: "--logs-color", label: "2", use: "" },
    { token: "--success-color", label: "3", use: "" },
    { token: "--uptime-color", label: "4", use: "" },
    { token: "--warning-color", label: "5", use: "" },
  ];

  readonly whenToUse = [
    "Trends over time (events, checks, response times)",
    "Comparing a handful of categories or series",
    "Showing a part of a whole (accepted vs dropped)",
  ];
  readonly dos = [
    "Color by meaning: status roles first, categorical sequence only when there is no inherent status",
    "Keep it to a few series; past four or five, colors stop being distinct",
    "Label the axes and state the unit",
    "Keep the previous chart visible on reload; show a short message when there is no data",
    "Read colors from theme tokens so the chart follows light and dark",
  ];
  readonly donts = [
    "Place primary and error next to each other; both are red in our theme",
    "Use a rainbow or a gradient for decoration",
    "Rely on color alone to tell series apart; label them",
    "Blank the chart to a spinner on reload",
    "Hardcode hex values instead of tokens",
  ];
  readonly content = [
    "Name the axis and the unit: Events, Response time (ms)",
    "No-data copy says what would appear and how to get it: No events in this range yet",
    "Round large numbers in labels (1.2k, 3.4M), keep exact values for the tooltip",
  ];
  readonly api: ApiRow[] = [
    { name: "--success/warning/error", type: "status tokens", default: "", description: "How a series is doing; use before categorical colors" },
    { name: "--issues/logs/uptime-color", type: "categorical tokens", default: "", description: "Distinct hues for categories with no inherent status" },
    { name: "--mat-sys-primary", type: "single-series token", default: "", description: "The default color for a one-series chart" },
  ];
  readonly code = `<!-- a bar is a div; height is the value, color is a token -->
<div class="chart">
  @for (d of series(); track d.day) {
    <div class="chart-bar">
      <div [style.height.px]="scale(d.accepted)"
           style="background: var(--mat-sys-primary)"></div>
      <div [style.height.px]="scale(d.dropped)"
           style="background: var(--warning-color)"></div>
    </div>
  }
</div>

@if (!series().length) {
  <p class="chart-nodata">No events in this range yet.</p>
}`;
}
