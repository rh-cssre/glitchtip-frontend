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
    `,
  ],
  template: `
    <preview-doc
      title="Top app bar"
      status="stable"
      description="The page-level header bar used by every list and detail view. It is 48px tall, set once by $top-app-bar-height. The left slot holds the page title or the back link; the right slot holds the page actions and nothing else."
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
          <h1 class="tab-demo-heading">Uptime Monitors</h1>
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

      <!-- Record without an edit page: Delete goes in the More actions menu. -->
      <gt-top-app-bar>
        <ng-container slot="left">
          <gt-back-link backLinkText="Issues" />
        </ng-container>
        <ng-container slot="right">
          <button
            mat-icon-button
            [matMenuTriggerFor]="more"
            aria-label="More actions"
          >
            <mat-icon>more_horiz</mat-icon>
          </button>
          <mat-menu #more="matMenu">
            <button mat-menu-item>
              <mat-icon>delete</mat-icon>
              <span>Delete issue</span>
            </button>
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
    "Record pages: at most two outlined or neutral controls, the rest in a More actions menu",
    "Link a record to its edit page with an outlined Edit X",
    "Put Delete on the record's settings or edit page; without one, put it in the More actions menu",
    "On mobile, collapse text actions to icon buttons (toggle the example to Mobile)",
  ];
  readonly donts = [
    "Put a filled button in a record page's bar",
    "Add a standalone delete icon button",
    "Write Back to or View all in the back link, or swap its label on mobile",
    "Override the bar height per page; change $top-app-bar-height or use a density mixin",
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
    { name: "slot=right", type: "content projection", default: "", description: "Action buttons area, divided from the content" },
  ];
  readonly importCode = `import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
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
