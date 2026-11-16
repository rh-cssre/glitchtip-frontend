import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { BreakpointObserver } from "@angular/cdk/layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";
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
    PageHeaderComponent,
    MatButtonModule,
    MatIconModule,
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
      <section class="dp-body">
        <gt-page-header title="GlitchTip Health">
          <span slot="meta">
            <span><span class="chip">https://glitchtip.com/</span></span>
            <span>every <b>60s</b></span>
          </span>
        </gt-page-header>
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
  // Swap the text action for an icon button below the $small breakpoint.
  // Fires for real inside the Mobile viewport.
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
    "Put gt-back-link in the app bar's left slot, named with the parent page's nav label",
    "Put page actions in the app bar's right slot: outlined or neutral only. One extra action is a neutral icon button; two or more go in a More actions menu",
    "Link to the record's edit page with an outlined Edit X, and put Delete in that page's last section",
    "Without an edit page, put Delete in the bar (see Top app bar)",
    "Render gt-page-header first inside the l-body content column (see Page header)",
  ];
  readonly donts = [
    "Hand-roll a back arrow instead of gt-back-link",
    "Add a margin to gt-back-link to line up its chevron; it already sits on the container edge",
    "Put a filled button in the bar",
  ];
  readonly composition = {
    contains: ["Top app bar", "Back link", "Page header", "Buttons & actions"],
  };
  readonly anatomy = `<gt-top-app-bar>
  <gt-back-link slot="left" />
  <... slot="right" actions />
</gt-top-app-bar>
<section class="l-body">
  <gt-page-header [title]="..." />
  <... content />
</section>`;
  readonly api: ApiRow[] = [
    { name: "gt-back-link backLinkText", type: "string", default: `""`, description: "Link label: the parent page's nav label, or the record's name" },
    { name: "gt-back-link link", type: "string | unknown[]", default: `[".."]`, description: "Where the link goes; [] stays on the page, for a sub-view in a tab" },
    { name: "gt-back-link backLinkParams", type: "object", default: "{}", description: "Query params on the way back; null removes one" },
    { name: "gt-back-link paramsHandling", type: "QueryParamsHandling | null", default: "null", description: "\"merge\" keeps the other query params" },
    { name: "gt-detail-header title", type: "string | [string, string | null]", default: `""`, description: "Legacy: use gt-page-header for new pages. Record title, optionally with a muted suffix" },
    { name: "gt-detail-header subtitle", type: "string | null", default: "", description: "Secondary line under the title" },
    { name: "gt-detail-header ng-content", type: "content projection", default: "", description: "Optional action row inside the header" },
  ];
  readonly importCode = `import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { BackLinkComponent } from "src/app/shared/detail/back-link/back-link.component";
import { PageHeaderComponent } from "src/app/shared/detail/page-header/page-header.component";`;
  readonly code = `<gt-top-app-bar>
  <ng-container slot="left">
    <gt-back-link i18n-backLinkText backLinkText="Uptime Monitors" />
  </ng-container>
  <ng-container slot="right">
    <a mat-stroked-button [routerLink]="['./update']" i18n>Edit monitor</a>
  </ng-container>
</gt-top-app-bar>

<section class="l-body">
  <gt-page-header [title]="monitor.name">
    <span slot="meta">...</span>
  </gt-page-header>
  ...
</section>`;
}
