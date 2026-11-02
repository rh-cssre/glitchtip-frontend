import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { BreakpointObserver } from "@angular/cdk/layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * Documents the full detail-page skeleton every detail view follows,
 * mirrored from real pages like monitor-detail: a top app bar with the back
 * link and page actions, then the detail header and content inside .l-body.
 */
@Component({
  selector: "preview-detail-page",
  imports: [
    TopAppBar,
    BackLinkComponent,
    DetailHeaderComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .dp-body {
        // Stand-in for the page-level .l-body wrapper (max-width column with
        // side padding) at example scale.
        padding: var(--gt-space-4) var(--gt-space-5) var(--gt-space-5);
      }
      .dp-body mat-card {
        margin-top: var(--gt-space-4);
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
      title="Detail page"
      status="stable"
      description="The skeleton every detail view follows (issue, release, monitor, member, team): a top app bar carrying the back link and the page actions, then the record's detail header and content inside the page body."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The back link is a real link and names its destination; the detail header renders the record name inside an h1, keeping one heading per page."
      [anatomy]="anatomy"
      [composition]="composition"
      [api]="api"
      [importCode]="importCode"
      [code]="code"
      [flushExample]="true"
      [widthToggle]="true"
    >
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
      <section class="dp-body">
        <gt-detail-header [title]="['Uptime details for GlitchTip Health', null]" />
        <mat-card appearance="outlined">
          <mat-card-content>
            Monitor content: response times, check history, status.
          </mat-card-content>
        </mat-card>
      </section>
    </preview-doc>
  `,
})
export class DetailPagePreview {
  // The product's own mobile mechanism (see monitor-detail): swap content
  // below the $small breakpoint. Fires for real inside the Mobile viewport.
  private readonly breakpoints = inject(BreakpointObserver);
  readonly isMobile = toSignal(
    this.breakpoints
      .observe("(max-width: 599px)")
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  readonly whenToUse = [
    "Every record detail view reached from a list",
    "Forms that create a record within a list context (new monitor)",
  ];
  readonly dos = [
    "Put gt-back-link in the app bar's left slot and name the destination",
    "Put page actions in the app bar's right slot",
    "Render gt-detail-header first inside the l-body content column",
  ];
  readonly donts = [
    "Hand-roll a back arrow instead of gt-back-link",
  ];
  readonly composition = {
    contains: ["Top app bar", "Back link", "Buttons & actions"],
  };
  readonly anatomy = `<gt-top-app-bar>
  <gt-back-link slot="left" />
  <... slot="right" actions />
</gt-top-app-bar>
<section class="l-body">
  <gt-detail-header [title]="..." />
  <... content />
</section>`;
  readonly api: ApiRow[] = [
    { name: "gt-back-link backLinkText", type: "string", default: `""`, description: "Link label; navigates to the parent route (..)" },
    { name: "gt-back-link backLinkParams", type: "object", default: "{}", description: "Query params preserved on the way back" },
    { name: "gt-detail-header title", type: "string | [string, string | null]", default: `""`, description: "Record title, optionally with a muted suffix" },
    { name: "gt-detail-header subtitle", type: "string | null", default: "", description: "Secondary line under the title" },
    { name: "gt-detail-header ng-content", type: "content projection", default: "", description: "Optional action row inside the header" },
  ];
  readonly importCode = `import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { DetailHeaderComponent } from "src/app/shared/detail/header/header.component";`;
  readonly code = `<gt-top-app-bar>
  <ng-container slot="left">
    <gt-back-link backLinkText="View all uptime monitors" />
  </ng-container>
  <ng-container slot="right">
    <button mat-flat-button color="primary" [routerLink]="['./update']">
      Settings
    </button>
  </ng-container>
</gt-top-app-bar>

<section class="l-body">
  <gt-detail-header [title]="['Uptime details for ' + monitor.name, null]" />
  ...
</section>`;
}
