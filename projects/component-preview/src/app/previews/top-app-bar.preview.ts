import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { BreakpointObserver } from "@angular/cdk/layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { SelectGhostDirective } from "src/app/shared/select-ghost.directive";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-top-app-bar",
  imports: [
    TopAppBar,
    SelectGhostDirective,
    BackLinkComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatTooltipModule,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .tab-demo-status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        margin-inline-end: var(--gt-space-2, 8px);
        background-color: var(--info-color);
      }
      .tab-demo-filters {
        display: flex;
        align-items: center;
        gap: var(--gt-space-1);
      }
      .tab-demo-projects {
        width: 160px;
      }
      .tab-demo-range {
        width: 140px;
      }
      .tab-demo-gap {
        height: var(--gt-space-6);
        background-color: var(--mat-sys-surface-container-low);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Top app bar"
      status="stable"
      description="The page-level header bar used by every list and detail view. It is 52px tall, set once by $top-app-bar-height, and every control in it is 32px: compact buttons and ghost select filters (.gt-select-ghost). The left slot holds the page title or the back link; the right slot holds the page actions and nothing else."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The bar is layout only; keep a real heading in the left slot on list pages so the page has an h1, give icon-only buttons and the More actions trigger an aria-label, and keep right-slot actions in DOM order so tab order reads left to right."
      [anatomy]="anatomy"
      [composition]="composition"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
      [flushExample]="true"
      [widthToggle]="true"
    >
      <!-- List page: title left, one filled New action right. On mobile the
           action becomes an icon so the title keeps its room. -->
      <gt-top-app-bar>
        <ng-container slot="left">
          <h1 class="gt-bar-title">Uptime Monitors</h1>
        </ng-container>
        <ng-container slot="right">
          @if (isMobile()) {
            <button mat-icon-button aria-label="New monitor">
              <mat-icon>add</mat-icon>
            </button>
          } @else {
            <button mat-flat-button>New monitor</button>
          }
        </ng-container>
      </gt-top-app-bar>

      <div class="tab-demo-gap"></div>

      <!-- List bar with filters: ghost selects and a 32px icon button.
           The settings gear only shows when one project is selected. -->
      <gt-top-app-bar>
        <ng-container slot="left">
          <h1 class="gt-bar-title">
            <span class="gt-bar-title__text">Issues</span>
            <span class="tab-count">1,204</span>
          </h1>
        </ng-container>
        <ng-container slot="right">
          <div class="tab-demo-filters">
            <span gtSelectGhost class="tab-demo-projects">
              <mat-select value="web" aria-label="Projects" panelWidth="240px">
                <mat-option value="web">acme-web</mat-option>
                <mat-option value="api">acme-api</mat-option>
              </mat-select>
            </span>
            <button mat-icon-button aria-label="Project settings">
              <mat-icon>settings</mat-icon>
            </button>
            <span gtSelectGhost class="tab-demo-range">
              <mat-select
                value="24h"
                aria-label="Time range"
                panelWidth="200px"
                hideSingleSelectionIndicator
              >
                <mat-option value="24h">Last 24 hours</mat-option>
                <mat-option value="7d">Last 7 days</mat-option>
                <mat-option value="30d">Last 30 days</mat-option>
              </mat-select>
            </span>
          </div>
        </ng-container>
      </gt-top-app-bar>

      <div class="tab-demo-gap"></div>

      <!-- Record with an edit page: back link names the parent list, one
           outlined neutral Edit action. Delete lives on the edit page. -->
      <gt-top-app-bar>
        <ng-container slot="left">
          <gt-back-link backLinkText="Uptime Monitors" />
        </ng-container>
        <ng-container slot="right">
          @if (isMobile()) {
            <button mat-icon-button aria-label="Edit monitor">
              <mat-icon>edit</mat-icon>
            </button>
          } @else {
            <button mat-stroked-button>Edit monitor</button>
          }
        </ng-container>
      </gt-top-app-bar>

      <div class="tab-demo-gap"></div>

      <!-- Record without an edit page: status dropdown, divider, then its one
           extra action as an icon button. -->
      <gt-top-app-bar>
        <ng-container slot="left">
          <gt-back-link backLinkText="Issues" />
        </ng-container>
        <ng-container slot="right">
          <button mat-stroked-button [matMenuTriggerFor]="status">
            <span class="tab-demo-status-dot" aria-hidden="true"></span>
            Unresolved
            <mat-icon iconPositionEnd>arrow_drop_down</mat-icon>
          </button>
          <mat-menu #status="matMenu">
            <button mat-menu-item>Resolved</button>
            <button mat-menu-item>Unresolved</button>
            <button mat-menu-item>Ignored</button>
          </mat-menu>
          <span class="gt-bar-divider" aria-hidden="true"></span>
          <button
            mat-icon-button
            aria-label="Delete issue"
            matTooltip="Delete issue"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </ng-container>
      </gt-top-app-bar>

      <div class="tab-demo-gap"></div>

      <!-- Two or more extra actions go in a More actions menu. -->
      <gt-top-app-bar>
        <ng-container slot="left">
          <gt-back-link backLinkText="Releases" />
        </ng-container>
        <ng-container slot="right">
          <button
            mat-icon-button
            [matMenuTriggerFor]="more"
            aria-label="More actions"
            matTooltip="More actions"
          >
            <mat-icon>more_horiz</mat-icon>
          </button>
          <mat-menu #more="matMenu">
            <button mat-menu-item>Download artifacts</button>
            <button mat-menu-item>Delete release</button>
          </mat-menu>
        </ng-container>
      </gt-top-app-bar>
    </preview-doc>
  `,
})
export class TopAppBarPreview {
  // Content swaps below the $small breakpoint. In the Mobile example width
  // this fires for real because the example renders in a true viewport.
  private readonly breakpoints = inject(BreakpointObserver);
  readonly isMobile = toSignal(
    this.breakpoints
      .observe("(max-width: 599px)")
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  readonly whenToUse = [
    "The header row of every list page and detail page",
    "Anywhere a page title or back link needs actions aligned right",
  ];
  readonly dos = [
    "List pages: page heading in the left slot and one filled New X in the right slot",
    "Record pages: gt-back-link in the left slot, named with the parent page's nav label",
    "Title a list page with .gt-bar-title (title-medium, the back link size) and put its count in a .tab-count badge, like tab counts, with the text in .gt-bar-title__text so a long title ellipsizes",
    "Record pages: one extra action is a neutral 32px icon button with a tooltip and aria-label; two or more go in a More actions menu",
    "Show a record's status as an outlined neutral dropdown with the gt-status-pill dot",
    "Link a record to its edit page with an outlined Edit X",
    "Put Delete on the record's settings or edit page; without one, delete from the bar with the same confirm",
    "Put a .gt-bar-divider between two groups of different kinds: status | delete, filters | New X",
    "Make bar filters ghost selects: a mat-select in a gtSelectGhost span, with an aria-label and a fixed width",
    "On mobile, collapse text actions to icon buttons (toggle the example to Mobile)",
  ];
  readonly donts = [
    "Put a filled button in a record page's bar, or make a status control filled primary",
    "Put a one-item More actions menu in the bar; show that action as an icon button",
    "Put a .gt-bar-divider between two controls of the same kind, at the bar edge, or in a bar with one group",
    "Write Back to or View all in the back link, or swap its label on mobile",
    "Override the bar height per page; change $top-app-bar-height or use a density mixin",
    "Wrap bar filters in an outlined mat-form-field; the outline competes with the page heading",
    "Give a ghost select a focus ring or a primary colour; it uses the same grey state layer as text buttons",
    "Restyle bar controls with ::ng-deep or internal .mat-mdc-* classes; use the overrides mixins in material-overrides/",
    "Nest a second bar inside a page section",
    "Put non-actions, like a user's email, in the action slot",
    "Let text buttons overflow or wrap the title on narrow screens",
  ];
  // No "within": the bar is the header row of every list and detail view,
  // so naming one parent would read as a restriction.
  readonly composition = {
    contains: ["Back link (detail pages)", "Buttons & actions"],
  };
  readonly anatomy = `<gt-top-app-bar>
  <... slot="left" />
  <... slot="right" />
</gt-top-app-bar>`;
  readonly api: ApiRow[] = [
    { name: "slot=left", type: "content projection", default: "", description: "Page title (list pages) or back link (detail pages)" },
    { name: "slot=right", type: "content projection", default: "", description: "Actions and filters, spaced from the left slot by a gap" },
  ];
  readonly importCode = `import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { SelectGhostDirective } from "src/app/shared/select-ghost.directive";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";`;
  readonly code = `<gt-top-app-bar>
  <ng-container slot="left">
    <gt-back-link i18n-backLinkText backLinkText="Uptime Monitors" />
  </ng-container>
  <ng-container slot="right">
    <a mat-stroked-button [routerLink]="['./update']" i18n>Edit monitor</a>
  </ng-container>
</gt-top-app-bar>`;
}
