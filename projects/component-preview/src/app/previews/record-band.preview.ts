import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { RecordBandComponent } from "src/app/shared/record-band/record-band.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-record-band",
  imports: [
    PageHeaderComponent,
    RecordBandComponent,
    MatTabsModule,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .rb-surface {
        --gt-page-inset: var(--gt-space-5);
        overflow: hidden;
        padding: 0 var(--gt-page-inset);
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        background: var(--mat-sys-surface);
      }
      .rb-surface--narrow {
        max-width: 480px;
      }
      .rb-content {
        margin: 0;
        padding-bottom: var(--gt-space-4);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Record band"
      status="stable"
      description="The tinted band a data record page opens with: the page header and key figures on top, an optional summary tier, then the tabs on its bottom edge. It runs full bleed over the page's side padding."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="The band adds no landmarks or headings; the page header's h1 stays the page title. A figure's label comes before its value, so screen readers read the label first."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">With figures and tabs</div>
        <div class="rb-surface">
          <gt-record-band>
            <gt-page-header title="Storefront homepage">
              <span slot="meta">
                <span><span class="chip">https://example.com/</span></span>
                <span>every 60s</span>
                <span class="gt-band-narrow-only"
                  ><b>99.8%</b> up over the last 120 checks</span
                >
              </span>
            </gt-page-header>
            <div slot="stats" class="gt-stat">
              <span class="gt-stat__label">Uptime</span>
              <span class="gt-stat__value"
                >99.8<span class="gt-stat__unit">%</span></span
              >
            </div>
            <div slot="stats" class="gt-stat">
              <span class="gt-stat__label">Avg response</span>
              <span class="gt-stat__value"
                >130<span class="gt-stat__unit">ms</span></span
              >
            </div>
            <nav
              slot="tabs"
              mat-tab-nav-bar
              mat-stretch-tabs="false"
              [tabPanel]="panel"
            >
              <a mat-tab-link [active]="true">Overview</a>
              <a mat-tab-link>Checks</a>
              <a mat-tab-link>Alerts <span class="tab-count">2</span></a>
            </nav>
          </gt-record-band>
          <mat-tab-nav-panel #panel />
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Without tabs</div>
        <p class="preview-section__note">
          Without tabs the band leaves 16px before the content. A record with no
          key figures leaves the corner out.
        </p>
        <div class="rb-surface">
          <gt-record-band>
            <gt-page-header title="v1.2.0">
              <span slot="meta">
                <span><b>12</b> files</span>
                <span>Released Oct 22, 2026</span>
              </span>
            </gt-page-header>
          </gt-record-band>
          <p class="rb-content">Release files</p>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Narrow</div>
        <p class="preview-section__note">
          Under 900px the corner hides and the facts marked gt-band-narrow-only
          show in the meta line instead.
        </p>
        <div class="rb-surface rb-surface--narrow">
          <gt-record-band>
            <gt-page-header title="POST /api/checkout">
              <span slot="meta">
                <span><span class="chip">http.server</span></span>
                <span class="gt-band-narrow-only"><b>40</b> transactions</span>
                <span class="gt-band-narrow-only">avg <b>991ms</b></span>
              </span>
            </gt-page-header>
            <div slot="stats" class="gt-stat">
              <span class="gt-stat__label">Transactions</span>
              <span class="gt-stat__value">40</span>
            </div>
            <div slot="stats" class="gt-stat">
              <span class="gt-stat__label">Avg</span>
              <span class="gt-stat__value"
                >991<span class="gt-stat__unit">ms</span></span
              >
            </div>
          </gt-record-band>
          <p class="rb-content">Span breakdown</p>
        </div>
      </div>
    </preview-doc>
  `,
})
export class RecordBandPreview {
  readonly whenToUse = [
    "The first element inside .l-body on a data record page (issue, monitor, transaction, release)",
  ];
  readonly dos = [
    "Put the record's two to four key numbers in the corner, label over value",
    "Put a unit in .gt-stat__unit: same size as the number, muted",
    "Mark the meta facts the corner repeats with .gt-band-narrow-only",
    "Put a summary of the whole record, such as check bars or top tags, in the summary tier",
    "Put the tab bar in the tabs slot, so it sits on the band's bottom edge",
  ];
  readonly donts = [
    "Use it on settings pages; they keep the compact page header",
    "Put buttons or links in the corner; actions live in the top app bar",
    "Wrap several slotted elements in one block; each @if wraps one element so it still projects",
  ];
  readonly content = [
    "Figure label: one or two words in sentence case (Events, Avg response)",
    "Figure value: the number only; the unit goes in .gt-stat__unit",
  ];
  readonly api: ApiRow[] = [
    {
      name: "(content)",
      type: "projected",
      default: "",
      description: "The record's gt-page-header",
    },
    {
      name: '[slot="stats"]',
      type: "projected",
      default: "",
      description:
        "Key figures (.gt-stat) in the top right corner; hidden under 900px",
    },
    {
      name: '[slot="summary"]',
      type: "projected",
      default: "",
      description: "Optional summary tier under a hairline",
    },
    {
      name: '[slot="tabs"]',
      type: "projected",
      default: "",
      description: "The record's tab bar, on the band's bottom edge",
    },
  ];
  readonly importCode = `import { RecordBandComponent } from "src/app/shared/record-band/record-band.component";`;
  readonly code = `<gt-record-band>
  <gt-page-header [title]="group.transaction">
    <span slot="meta">
      <span class="gt-band-narrow-only"><b>{{ group.count }}</b> transactions</span>
    </span>
  </gt-page-header>
  <div slot="stats" class="gt-stat">
    <span class="gt-stat__label">Transactions</span>
    <span class="gt-stat__value">{{ group.count | number }}</span>
  </div>
</gt-record-band>`;
}
