import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { PanelComponent } from "src/app/shared/panel/panel.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";
import { DoDontComponent } from "../docs/do-dont.component";

interface SpanRow {
  op: string;
  description: string;
  count: number;
  total: string;
}

const SPAN_ROWS: SpanRow[] = [
  {
    op: "db.query",
    description: "SELECT * FROM orders",
    count: 412,
    total: "8.2s",
  },
  {
    op: "http.client",
    description: "POST /v1/charges",
    count: 40,
    total: "5.1s",
  },
  { op: "cache.get", description: "cart:session", count: 388, total: "0.4s" },
];

@Component({
  selector: "preview-panel",
  imports: [
    PanelComponent,
    MatButtonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    PreviewDocComponent,
    DoDontComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .pn-chart {
        display: flex;
        align-items: flex-end;
        gap: var(--gt-space-1);
        height: 120px;
      }
      .pn-chart__bar {
        flex: 1;
        border-radius: var(--mat-sys-corner-extra-small)
          var(--mat-sys-corner-extra-small) 0 0;
        background: color-mix(in srgb, var(--mat-sys-primary) 60%, transparent);
      }
      .pn-table {
        width: 100%;
      }
      .pn-num {
        text-align: right;
      }
      .pn-setting {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--gt-space-3);
        width: 100%;
        font: var(--mat-sys-body-medium);
      }
      .pn-dd {
        width: 100%;
      }
      .pn-stack {
        display: grid;
        gap: var(--gt-space-3, 12px);
      }
      .pn-title {
        margin: 0;
        font: var(--mat-sys-title-medium);
        font-weight: 600;
      }
      .pn-text {
        margin: 0;
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
      }
      .pn-field {
        width: 100%;
        max-width: 560px;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Panel"
      status="stable"
      description="A bordered container for a chart or a block of data: a stack trace, breadcrumbs, request data, a code block, a table of spans. Pages themselves are card-less; the panel marks the data on them."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="A panel with a title is a region named by its heading. Pick headingLevel so the heading sits one level below the section it is in (the page title is the h1)."
      [anatomy]="anatomy"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Chart with an action</div>
        <gt-panel title="Events">
          <button slot="actions" mat-button>View events</button>
          <div class="pn-chart" aria-hidden="true">
            @for (h of bars; track $index) {
              <div class="pn-chart__bar" [style.height.%]="h"></div>
            }
          </div>
        </gt-panel>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Flush table</div>
        <gt-panel title="Span breakdown" flush>
          <table mat-table class="pn-table" [dataSource]="rows">
            <ng-container matColumnDef="op">
              <th mat-header-cell *matHeaderCellDef>Operation</th>
              <td mat-cell *matCellDef="let row">{{ row.op }}</td>
            </ng-container>
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let row">{{ row.description }}</td>
            </ng-container>
            <ng-container matColumnDef="count">
              <th mat-header-cell *matHeaderCellDef class="pn-num">Count</th>
              <td mat-cell *matCellDef="let row" class="pn-num">
                {{ row.count }}
              </td>
            </ng-container>
            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef class="pn-num">
                Total time
              </th>
              <td mat-cell *matCellDef="let row" class="pn-num">
                {{ row.total }}
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
          </table>
        </gt-panel>
      </div>

      <div class="preview-section">
        <div class="preview-section__title"
          >Settings save unit with a footer</div
        >
        <gt-panel>
          <div class="pn-stack">
            <h3 class="pn-title">Name</h3>
            <mat-form-field
              class="pn-field"
              appearance="outline"
              subscriptSizing="dynamic"
            >
              <input matInput value="Acme Shop" aria-label="Name" />
            </mat-form-field>
          </div>
          <span slot="footer-hint">Up to 64 characters.</span>
          <button slot="footer" mat-stroked-button>Save name</button>
        </gt-panel>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Danger tone</div>
        <gt-panel tone="danger">
          <div class="pn-stack">
            <h3 class="pn-title">Delete organization</h3>
            <p class="pn-text">
              Deletes Acme Shop and all of its projects, teams and events. This
              cannot be undone.
            </p>
          </div>
          <button slot="footer" mat-stroked-button color="warn">
            Delete organization
          </button>
        </gt-panel>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Where it belongs</div>
        <preview-do-dont
          doCaption="Use a panel for charts and data blocks."
          dontCaption="Don't wrap a whole settings page in one. Each save unit gets its own panel."
        >
          <gt-panel slot="do" class="pn-dd" title="Response time">
            <div class="pn-chart" aria-hidden="true">
              @for (h of bars.slice(0, 12); track $index) {
                <div class="pn-chart__bar" [style.height.%]="h"></div>
              }
            </div>
          </gt-panel>
          <gt-panel slot="dont" class="pn-dd" title="Notifications">
            <div class="pn-setting">
              Email me about new issues
              <mat-slide-toggle aria-label="Email me about new issues" />
            </div>
          </gt-panel>
        </preview-do-dont>
      </div>
    </preview-doc>
  `,
})
export class PanelPreview {
  readonly bars = [
    30, 45, 28, 60, 72, 40, 35, 90, 64, 50, 38, 55, 70, 48, 32, 26, 44, 58,
  ];
  readonly rows = SPAN_ROWS;
  readonly columns = ["op", "description", "count", "total"];

  readonly whenToUse = [
    "Holding a chart on a data page",
    "Holding a block of event data: stack trace, breadcrumbs, request data, code",
    "Holding a table that belongs to one record, such as its spans",
  ];
  readonly dos = [
    "Give it a short sentence-case title that names the data",
    "Use flush when the body draws its own rows, so the table runs edge to edge",
    "Keep header actions to one or two small controls",
    "Put a settings panel's Save in the footer, right aligned",
  ];
  readonly donts = [
    "Wrap a whole settings page in one panel; give each save unit its own",
    "Nest a panel inside another panel",
    "Use mat-card for new work; use a panel or no container",
  ];
  readonly anatomy = `Header (tinted; title or lead, then actions, only when one is set)
Body (padded, or flush)
Footer (tinted; hint left, actions right, only when either is set)`;
  readonly api: ApiRow[] = [
    {
      name: "title",
      type: "string",
      default: '""',
      description: "Header title; also names the panel as a region",
    },
    {
      name: "headingLevel",
      type: "number",
      default: "2",
      description: "aria-level of the title heading",
    },
    {
      name: "flush",
      type: "boolean",
      default: "false",
      description: "Removes body padding for tables and row lists",
    },
    {
      name: "tone",
      type: '"default" | "danger"',
      default: '"default"',
      description: "Danger tints the border for a destructive save unit",
    },
    {
      name: '[slot="footer"]',
      type: "projected",
      default: "",
      description: "Footer actions, right aligned on a tinted strip",
    },
    {
      name: '[slot="footer-hint"]',
      type: "projected",
      default: "",
      description: "Short muted note on the left of the footer",
    },
    {
      name: '[slot="actions"]',
      type: "projected",
      default: "",
      description: "Header controls, right aligned at 32px",
    },
    {
      name: '[slot="lead"]',
      type: "projected",
      default: "",
      description:
        "Muted fact that leads a header with no title, such as a list's count (2 alerts), so the actions never sit in an empty strip",
    },
    {
      name: "(default)",
      type: "projected",
      default: "",
      description: "Body content",
    },
  ];
  readonly importCode = `import { PanelComponent } from "src/app/shared/panel/panel.component";`;
  readonly code = `<gt-panel i18n-title title="Span breakdown" flush>
  <button slot="actions" mat-button i18n>View all</button>
  <table mat-table ...></table>
</gt-panel>`;
}
