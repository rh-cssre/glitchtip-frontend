import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-page-header",
  imports: [PageHeaderComponent, MatTabsModule, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .ph-surface {
        padding: var(--gt-space-4) var(--gt-space-5) var(--gt-space-2);
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: var(--mat-sys-corner-extra-small);
        background: var(--mat-sys-surface);
      }
      .ph-surface + .ph-surface {
        margin-top: var(--gt-space-4);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Page header"
      status="stable"
      description="The title row of every detail page: the record's name, then one meta line of facts. Settings pages add an icon tile for the object type; records with facets add tabs directly below."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="The title is the page's single h1. The icon tile is decorative and hidden from screen readers; the meta line is plain text read in order."
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title"
          >Settings page, compact, with tabs</div
        >
        <p class="preview-section__note">
          Settings pages for a named object use compact: one line, a 32px tile,
          the facts after the title. They drop under it on a narrow screen.
        </p>
        <div class="ph-surface">
          <gt-page-header icon="groups" title="#payments" compact>
            <span slot="meta">
              <span><b>5</b> members</span>
              <span>Created Oct 22, 2026</span>
            </span>
          </gt-page-header>
          <nav mat-tab-nav-bar mat-stretch-tabs="false" [tabPanel]="panel">
            <a mat-tab-link [active]="true"
              >Members <span class="tab-count">5</span></a
            >
            <a mat-tab-link>Projects <span class="tab-count">2</span></a>
            <a mat-tab-link>Settings</a>
          </nav>
          <mat-tab-nav-panel #panel />
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Data page with state</div>
        <div class="ph-surface">
          <gt-page-header
            title="Storefront homepage"
            status="Up"
            statusColor="var(--gt-monitor-up)"
          >
            <span slot="meta">
              <span class="no-sep">for 2 hours</span>
              <span><span class="chip">https://example.com/</span></span>
              <span>every 60s</span>
            </span>
          </gt-page-header>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Data page with a subtitle</div>
        <div class="ph-surface">
          <gt-page-header
            title="TypeError"
            subtitle="Cannot read properties of undefined (reading 'id')"
            status="Unresolved"
            statusColor="var(--info-color)"
          >
            <span slot="meta">
              <span><span class="chip">STOREFRONT-1F</span></span>
              <span><b>1,204</b> events</span>
              <span>Last seen 2 minutes ago</span>
            </span>
          </gt-page-header>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Data page</div>
        <div class="ph-surface">
          <gt-page-header title="POST /api/checkout">
            <span slot="meta">
              <span><span class="chip">http.server</span></span>
              <span><b>40</b> transactions</span>
              <span>avg <b>991ms</b></span>
              <span>p95 <b>1.6 s</b></span>
              <span><b>0</b> errors</span>
            </span>
          </gt-page-header>
        </div>
      </div>
    </preview-doc>
  `,
})
export class PageHeaderPreview {
  readonly whenToUse = [
    "The first element inside .l-body on every record detail page",
  ];
  readonly dos = [
    "Give settings pages for a named object (organization, project, team, member) an icon tile; leave it off data pages and profile pages",
    "Use compact on those settings pages, so the header is one line; data pages keep the full header",
    "Use the same icon as the object's item in the nav",
    "Write the meta as short facts: numbers in <b>, identifiers in a .chip",
    "Show a record's state with status, rendered as the Status pill, first in the meta line",
    "Use subtitle for a second line that belongs to the title, such as an error's message",
    "Add class no-sep to a fact that continues the pill, such as for 2 hours",
    "Put tabs directly below when the record has facets, with counts in .tab-count",
    "Place at most one status strip, such as the monitor check bars, between the header and the tabs",
    "Show a tab count once it is known, including 0; leave ?tab= off the default tab",
    "Keep the back link and page actions in the top app bar",
  ];
  readonly donts = [
    "Add a divider under the header; the tab bar is the only line",
    "Put buttons in the header",
    "Use subtitle for facts; those go in the meta line",
    "Repeat the page type in the title (Settings for project)",
    "Repeat the title in the meta, such as a slug chip under the name (Acme Shop, acme-shop)",
  ];
  readonly content = [
    "Title: the record's own name, never a sentence about it",
    "Meta: facts in order of importance, separated automatically",
  ];
  readonly api: ApiRow[] = [
    {
      name: "title",
      type: "string",
      default: "",
      description: "The record's name (required)",
    },
    {
      name: "subtitle",
      type: "string | null",
      default: "null",
      description: "One muted line under the title, clamped to two lines",
    },
    {
      name: "icon",
      type: "string | null",
      default: "null",
      description: "Object icon for settings pages; omit on data pages",
    },
    {
      name: "status",
      type: "string | null",
      default: "null",
      description: "State label, shown as a Status pill",
    },
    {
      name: "statusColor",
      type: "string",
      default: '"var(--mat-sys-outline)"',
      description: "Color for the pill; use a role token",
    },
    {
      name: "compact",
      type: "boolean",
      default: "false",
      description:
        "One line: 32px tile, title-large title, meta inline after it",
    },
    {
      name: '[slot="meta"]',
      type: "projected",
      default: "",
      description: "One element whose children are the meta facts",
    },
  ];
  readonly importCode = `import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";`;
  readonly code = `<gt-page-header icon="groups" [title]="'#' + team.slug" compact>
  <span slot="meta">
    <span><b>{{ team.memberCount }}</b> members</span>
    <span>Created {{ team.dateCreated | date: "mediumDate" }}</span>
  </span>
</gt-page-header>`;
}
