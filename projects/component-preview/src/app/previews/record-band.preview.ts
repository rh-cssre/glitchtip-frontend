import { Component, ChangeDetectionStrategy } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { RecordBandComponent } from "src/app/shared/record-band/record-band.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-record-band",
  imports: [
    NgTemplateOutlet,
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
      .rb-summary {
        margin: 0;
        color: var(--mat-sys-on-surface-variant);
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
      description="The tinted band a data record page opens with: the page header and key facts on top, an optional summary tier, then the tabs on its bottom edge. It runs full bleed over the page's side padding."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="The band adds no landmarks or headings; the page header's h1 stays the page title. The key facts render once in the reading order: the corner on a wide band, the meta line on a narrow one."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">With key facts and tabs</div>
        <ng-template #monitorFacts>
          <span class="gt-band-fact"><b>99.8%</b> uptime</span>
          <span class="gt-band-fact"><b>130ms</b> avg response</span>
        </ng-template>
        <div class="rb-surface">
          <gt-record-band>
            <gt-page-header title="Storefront homepage">
              <span slot="meta">
                <span><span class="chip">https://example.com/</span></span>
                <span>every 60s</span>
                <ng-container [ngTemplateOutlet]="monitorFacts" />
              </span>
            </gt-page-header>
            <span slot="stats" class="gt-band-facts"
              ><ng-container [ngTemplateOutlet]="monitorFacts"
            /></span>
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
        <div class="preview-section__title">Text summary on a strip</div>
        <p class="preview-section__note">
          A text summary sits on a darker strip; a graphic one, such as check
          bars, sits under a hairline.
        </p>
        <ng-template #issueFacts>
          <span class="gt-band-fact"><b>12.3K</b> events</span>
          <span class="gt-band-fact"><b>59</b> users</span>
        </ng-template>
        <div class="rb-surface">
          <gt-record-band summary="strip">
            <gt-page-header
              title="TypeError"
              subtitle="Cannot read properties of undefined (reading 'price')"
            >
              <span slot="meta">
                <span><span class="chip">STOREFRONT-WEB-1</span></span>
                <span>last seen 7 days ago</span>
                <ng-container [ngTemplateOutlet]="issueFacts" />
              </span>
            </gt-page-header>
            <span slot="stats" class="gt-band-facts"
              ><ng-container [ngTemplateOutlet]="issueFacts"
            /></span>
            <p slot="summary" class="rb-summary">
              environment <b>production</b> · browser <b>Chrome 129</b>
            </p>
          </gt-record-band>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Without tabs</div>
        <p class="preview-section__note">
          Without tabs the band leaves 16px before the content. A record with no
          key facts leaves the corner out.
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
          Under 900px the corner hides and the same facts continue the meta
          line.
        </p>
        <ng-template #txFacts>
          <span class="gt-band-fact"><b>40</b> transactions</span>
          <span class="gt-band-fact">avg <b>991ms</b></span>
          <span class="gt-band-fact">p95 <b>1.60s</b></span>
        </ng-template>
        <div class="rb-surface rb-surface--narrow">
          <gt-record-band>
            <gt-page-header title="POST /api/checkout">
              <span slot="meta">
                <span><span class="chip">http.server</span></span>
                <ng-container [ngTemplateOutlet]="txFacts" />
              </span>
            </gt-page-header>
            <span slot="stats" class="gt-band-facts"
              ><ng-container [ngTemplateOutlet]="txFacts"
            /></span>
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
    "Write up to three key facts once, in an ng-template of .gt-band-fact spans; further facts stay in the meta line",
    "Keep each stat's label to a word or two, with any detail in a tooltip",
    "Render that template at the end of the meta line and in a .gt-band-facts span in the stats slot",
    'Put a summary of the whole record in the summary tier: summary="strip" for text such as top tags, the default hairline for graphics such as check bars',
    "Put the tab bar in the tabs slot, so it sits on the band's bottom edge",
  ];
  readonly donts = [
    "Use it on settings pages; they keep the compact page header",
    "Put buttons or links in the corner; actions live in the top app bar",
    "Wrap several slotted elements in one block; each @if wraps one element so it still projects",
  ];
  readonly content = [
    "A fact reads like the meta line: the number in <b>, then its noun (12 events, avg 991ms). In the corner the number stands over its label",
    "Counts use compactNumber (12.3K) and durations shortDuration (815ms, 1.60s)",
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
        "Key facts (.gt-band-facts) in the top right corner; hidden under 900px, where the meta line shows them",
    },
    {
      name: '[slot="summary"]',
      type: "projected",
      default: "",
      description: "Optional summary tier spanning the band",
    },
    {
      name: "summary",
      type: '"line" | "strip"',
      default: '"line"',
      description:
        "How the summary tier is set off: a hairline for a graphic, a darker strip for text",
    },
    {
      name: '[slot="tabs"]',
      type: "projected",
      default: "",
      description: "The record's tab bar, on the band's bottom edge",
    },
  ];
  readonly importCode = `import { RecordBandComponent } from "src/app/shared/record-band/record-band.component";`;
  readonly code = `<ng-template #facts>
  <span class="gt-band-fact"><b>{{ group.count | compactNumber }}</b> transactions</span>
  <span class="gt-band-fact">avg <b>{{ group.avgDuration | shortDuration }}</b></span>
</ng-template>
<gt-record-band>
  <gt-page-header [title]="group.transaction">
    <span slot="meta">
      <ng-container [ngTemplateOutlet]="facts" />
    </span>
  </gt-page-header>
  <span slot="stats" class="gt-band-facts"
    ><ng-container [ngTemplateOutlet]="facts"
  /></span>
</gt-record-band>`;
}
