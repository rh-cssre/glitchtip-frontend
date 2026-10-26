import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { BreakpointObserver } from "@angular/cdk/layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

@Component({
  selector: "preview-top-app-bar",
  imports: [
    TopAppBar,
    BackLinkComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .tab-demo-heading {
        font: var(--mat-sys-title-large);
        margin: 0;
      }
      .tab-demo-gap {
        height: var(--gt-space-6);
        background-color: var(--mat-sys-surface-container-low);
      }
      .top-bar-actions {
        display: flex;
        align-items: center;
        gap: var(--gt-space-2);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Top app bar"
      status="stable"
      description="The page-level header bar used by every list and detail view (34 uses, the second most used component in the app). The left slot holds the page title or the back link. The right slot holds the page actions: one primary, plus at most one secondary or destructive action, with any extras in an overflow menu."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The bar is layout only; keep a real heading in the left slot on list pages so the page has an h1, and keep right-slot actions in DOM order so tab order reads left to right."
      [anatomy]="anatomy"
      [composition]="composition"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
      [flushExample]="true"
      [widthToggle]="true"
    >
      <!-- List page variant: title left, action right. On mobile the action
           becomes an icon so the title keeps its room. -->
      <gt-top-app-bar>
        <ng-container slot="left">
          <h1 class="tab-demo-heading">Uptime Monitors</h1>
        </ng-container>
        <ng-container slot="right">
          @if (isMobile()) {
            <button mat-icon-button aria-label="New Monitor">
              <mat-icon>add</mat-icon>
            </button>
          } @else {
            <button mat-flat-button color="primary">New Monitor</button>
          }
        </ng-container>
      </gt-top-app-bar>

      <div class="tab-demo-gap"></div>

      <!-- Detail page variant: back link left, actions right. When actions
           do not fit, they collapse to icons plus an overflow menu (the
           gt-list-app-bar pattern). -->
      <gt-top-app-bar>
        <ng-container slot="left">
          <gt-back-link
            [backLinkText]="
              isMobile() ? 'Uptime Monitors' : 'View all uptime monitors'
            "
          />
        </ng-container>
        <ng-container slot="right">
          <div class="top-bar-actions">
            @if (isMobile()) {
              <button mat-icon-button aria-label="Settings">
                <mat-icon>settings</mat-icon>
              </button>
              <button mat-icon-button [matMenuTriggerFor]="more" aria-label="More">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #more="matMenu">
                <button mat-menu-item>
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            } @else {
              <button mat-flat-button color="primary">Settings</button>
              <button mat-icon-button class="medium-icon-button" aria-label="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            }
          </div>
        </ng-container>
      </gt-top-app-bar>
    </preview-doc>
  `,
})
export class TopAppBarPreview {
  // Same mechanism the product's detail pages use (see monitor-detail):
  // content swaps below the $small breakpoint. In the Mobile example width
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
    "List pages: page heading in the left slot",
    "Detail pages: gt-back-link in the left slot",
    "One primary action in the right slot, plus at most one secondary or destructive action",
    "Style a destructive action per Buttons & actions: outlined warn plus a confirm dialog, not a plain red icon",
    "More than two actions: keep the primary and move the rest into a more_vert menu",
    "On mobile, collapse text actions to icon buttons and overflow the rest into a more_vert menu (toggle the example to Mobile)",
    "Shorten the back-link text on mobile via isMobile()",
  ];
  readonly donts = [
    "Nest a second bar inside a page section",
    "Use it as a heading inside the page body",
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
    { name: "slot=right", type: "content projection", default: "", description: "Action buttons area, divided from the content" },
  ];
  readonly importCode = `import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";`;
  readonly code = `<gt-top-app-bar>
  <ng-container slot="left">
    <gt-back-link backLinkText="View all uptime monitors" />
  </ng-container>
  <ng-container slot="right">
    <button mat-flat-button color="primary" [routerLink]="['./update']">
      Settings
    </button>
  </ng-container>
</gt-top-app-bar>`;
}
