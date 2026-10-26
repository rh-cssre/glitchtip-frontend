import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

interface DemoRow {
  title: string;
  events: number;
  lastSeen: string;
}

const DEMO_ROWS: DemoRow[] = [
  { title: "TypeError: Cannot read properties of undefined", events: 128, lastSeen: "2 min ago" },
  { title: "ConnectionError: database is unreachable", events: 42, lastSeen: "14 min ago" },
  { title: "ValueError: invalid literal for int()", events: 7, lastSeen: "1 hour ago" },
];

/**
 * Documents the app's table *pattern*: the classes and conventions used by
 * every data table (issues, releases, members). Unlike the component pages,
 * this is a pattern reference; there is no single reusable table component.
 */
@Component({
  selector: "preview-table-pattern",
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatProgressBarModule,
    LoadingButtonComponent,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .demo-toolbar {
        display: flex;
        gap: var(--gt-space-3);
        margin-bottom: var(--gt-space-3);
      }
      // Recommended narrow-width pattern: the container scrolls horizontally
      // and the table keeps a sensible min-width, so columns stay legible
      // instead of wrapping. (The app's shared .table-container does not do
      // this yet, see the design audit.)
      .demo-table-scroll {
        overflow-x: auto;
        position: relative;
      }
      // Mirrors MR !728: a thin progress bar pinned to the top of the table
      // while a reload is in flight, instead of disabling controls. The
      // z-index must clear the sticky header row (Material gives it 100) or
      // the header paints over the bar and it looks like nothing happened.
      .demo-progress {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 101;
      }
      table {
        width: 100%;
        min-width: 480px;
      }
      table td,
      table th {
        white-space: nowrap;
      }
      // Mirror the issues table: rows stay visible while a reload is in
      // flight, dimmed slightly so the state is perceivable.
      .demo-table--loading td {
        opacity: 0.5;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Table pattern"
      status="stable"
      description="The conventions every data table in the app follows (issues, releases, members). This is a pattern, not a single component: tables are built from mat-table plus a set of shared global classes."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="Header cells are real th elements via mat-table. Row selection uses visible checkboxes, not click-anywhere rows, so selection is keyboard reachable."
      [composition]="composition"
      [api]="api"
      [code]="code"
      [widthToggle]="true"
      [designNotes]="['recommended: horizontal scroll on narrow widths']"
    >
      <div class="preview-section">
        <div class="preview-section__title">Live example</div>
        <p class="preview-section__note">
          Reload keeps the previous rows visible instead of blanking the table:
          a progress bar runs across the top and the rows dim until fresh data
          lands. Try it.
        </p>
        <div class="demo-toolbar">
          <gt-loading-button
            buttonText="Reload"
            buttonStyle="stroked"
            [loading]="loading()"
            (buttonClick)="simulateReload()"
          />
        </div>
        <div class="table-container demo-table-scroll">
          @if (loading()) {
            <mat-progress-bar
              class="demo-progress"
              mode="indeterminate"
              aria-label="Loading rows"
            />
          }
          <table
            mat-table
            [dataSource]="rows()"
            class="mat-elevation-z2"
            [class.demo-table--loading]="loading()"
            [attr.aria-busy]="loading()"
          >
            <ng-container matColumnDef="select">
              <th mat-header-cell *matHeaderCellDef class="table-header__actions">
                <mat-checkbox />
              </th>
              <td mat-cell *matCellDef="let row">
                <mat-checkbox />
              </td>
            </ng-container>
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let row">{{ row.title }}</td>
            </ng-container>
            <ng-container matColumnDef="events">
              <th mat-header-cell *matHeaderCellDef>Events</th>
              <td mat-cell *matCellDef="let row">{{ row.events }}</td>
            </ng-container>
            <ng-container matColumnDef="lastSeen">
              <th mat-header-cell *matHeaderCellDef>Last seen</th>
              <td mat-cell *matCellDef="let row">{{ row.lastSeen }}</td>
            </ng-container>

            <tr
              mat-header-row
              class="table-header"
              *matHeaderRowDef="columns; sticky: true"
            ></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
          </table>
          @if (rows().length === 0) {
            <div class="table-empty-states">
              <p>No results. Adjust the filters and try again.</p>
            </div>
          }
        </div>
      </div>
    </preview-doc>
  `,
})
export class TablePatternPreview {
  readonly columns = ["select", "title", "events", "lastSeen"];
  readonly rows = signal<DemoRow[]>(DEMO_ROWS);
  readonly loading = signal(false);

  readonly whenToUse = [
    "Any list of records with columns (issues, releases, members)",
    "Data that reloads in place when filters or pagination change",
  ];
  readonly dos = [
    "Wrap the table in .table-container for the border, radius and scroll",
    "Put class table-header on the sticky mat-header-row",
    "On reload, run a top progress bar and keep the previous rows (via keepPreviousValue), dimmed, instead of blanking the table",
    "Show .table-empty-states inside the container when there are no rows",
    "On narrow widths, let the container scroll horizontally (min-width on the table) so columns stay legible",
  ];
  readonly donts = [
    "Build one-off table styles per page",
  ];
  readonly composition = {
    contains: ["Pagination buttons", "Loading button", "Buttons & actions"],
  };
  readonly api: ApiRow[] = [
    { name: ".table-container", type: "wrapper class", default: "", description: "Border, radius, scroll region, density overrides" },
    { name: ".table-header", type: "header-row class", default: "", description: "Sticky header background (surface-container-high)" },
    { name: ".table-header__actions", type: "cell class", default: "", description: "Compact padding for action/checkbox header cells" },
    { name: ".table-empty-states", type: "block class", default: "", description: "Empty-state message area inside the container" },
  ];
  readonly code = `<!-- reload: top progress bar + keep previous rows (keepPreviousValue) -->
<div class="table-container">
  @if (loading()) { <mat-progress-bar mode="indeterminate" /> }
  <table mat-table [dataSource]="rows()" class="mat-elevation-z2"
         [attr.aria-busy]="loading()">
    ...
    <tr mat-header-row class="table-header"
        *matHeaderRowDef="columns; sticky: true"></tr>
    <tr mat-row *matRowDef="let row; columns: columns"></tr>
  </table>
  @if (rows().length === 0) {
    <div class="table-empty-states">...</div>
  }
</div>`;

  simulateReload(): void {
    if (this.loading()) return;
    this.loading.set(true);
    // Keep the existing rows on screen while "fetching", per the app's
    // keep-previous-data convention, then land fresh data.
    setTimeout(() => {
      this.rows.set([...DEMO_ROWS].reverse());
      this.loading.set(false);
    }, 2000);
  }
}
