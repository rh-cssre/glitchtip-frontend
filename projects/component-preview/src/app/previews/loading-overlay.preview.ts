import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { LoadingOverlayComponent } from "src/app/shared/loading-overlay/loading-overlay.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * gt-loading-overlay: the shared reloading state for lists and tables. One
 * component so every filter, sort or pagination reload reads the same: a top
 * progress bar with the previous rows kept visible but dimmed, never a blank
 * table.
 */
@Component({
  selector: "preview-loading-overlay",
  imports: [
    LoadingOverlayComponent,
    MatTableModule,
    MatButtonModule,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .lo-demo {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-3);
        align-items: flex-start;
      }
      .lo-surface {
        width: 100%;
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        overflow: hidden;
      }
      table {
        width: 100%;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Loading overlay"
      status="stable"
      description="Wraps a reloading list or table: an indeterminate progress bar crosses the top while the previous rows stay visible but dimmed and non-interactive, instead of the table blanking to a spinner. Pair it with keepPreviousValue() in the data source so the rows survive the reload."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The wrapped content is marked aria-busy while loading so assistive tech announces the region is updating; the progress bar carries an aria-label. Keep a single busy signal per region rather than also spinning the pagination control."
      [content]="content"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Interactive</div>
        <p class="preview-section__note">
          Toggle the reload to see the bar appear while the rows dim and stop
          responding to clicks.
        </p>
        <div class="lo-demo">
          <button mat-stroked-button (click)="toggle()">
            {{ loading() ? "Stop reload" : "Simulate reload" }}
          </button>
          <div class="lo-surface">
            <gt-loading-overlay [loading]="loading()" label="Loading releases">
              <table mat-table [dataSource]="rows">
                <ng-container matColumnDef="version">
                  <th mat-header-cell *matHeaderCellDef>Version</th>
                  <td mat-cell *matCellDef="let r">{{ r.version }}</td>
                </ng-container>
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Date created</th>
                  <td mat-cell *matCellDef="let r">{{ r.date }}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="columns"></tr>
                <tr mat-row *matRowDef="let row; columns: columns"></tr>
              </table>
            </gt-loading-overlay>
          </div>
        </div>
      </div>
    </preview-doc>
  `,
})
export class LoadingOverlayPreview {
  readonly loading = signal(false);
  readonly columns = ["version", "date"];
  readonly rows = [
    { version: "v2.4.1", date: "Jul 18, 2026" },
    { version: "v2.4.0", date: "Jul 11, 2026" },
    { version: "v2.3.7", date: "Jul 2, 2026" },
  ];

  toggle() {
    this.loading.update((v) => !v);
  }

  readonly whenToUse = [
    "A paginated list or table that reloads on a filter, sort or page change",
    "Any table backed by a resource whose rows you want to keep during a reload",
  ];
  readonly dos = [
    "Wrap the whole table so the bar spans its full width",
    "Pair it with keepPreviousValue() so the rows do not clear on reload",
    "Give a specific label, e.g. Loading issues, for assistive tech",
    "Drop the pagination control's own loading spinner; this bar covers it",
  ];
  readonly donts = [
    "Blank the table to a centered spinner on every reload",
    "Use it for the very first load with no rows yet; that is an empty or skeleton state",
    "Stack it with another busy indicator on the same region",
  ];
  readonly content = [
    "A single projected list or table",
    "loading: true while the backing resource is refetching",
  ];
  readonly api: ApiRow[] = [
    {
      name: "loading",
      type: "boolean",
      default: "false",
      description: "Show the bar and dim the content while true",
    },
    {
      name: "label",
      type: "string",
      default: '"Loading"',
      description: "aria-label for the progress bar; name the list",
    },
    {
      name: "(content)",
      type: "projected",
      default: "",
      description: "The list or table to keep visible during reload",
    },
  ];
  readonly importCode = `import { LoadingOverlayComponent } from "src/app/shared/loading-overlay/loading-overlay.component";`;
  readonly code = `<!-- keep the rows during a reload; dim them under a top progress bar -->
<gt-loading-overlay [loading]="loading()" label="Loading releases">
  @if (releases(); as releases) {
    <table mat-table [dataSource]="releases">
      <!-- columns -->
    </table>
  }
</gt-loading-overlay>

<!-- in the data source, keep the previous page during the reload -->
private data = keepPreviousValue(() => this.resource.value()?.data);
releases = computed(() => this.data() ?? []);`;
}
