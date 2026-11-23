import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { BannerComponent } from "projects/marketing/src/app/shared/banner/banner.component";
import { SectionHeaderComponent } from "projects/marketing/src/app/shared/section-header/section-header.component";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * Full-width brand band: a subtle surface + faded line-grid that fades into
 * the page's dotted background. Use it to mark a highlighted zone.
 */
@Component({
  selector: "preview-brand-banner",
  imports: [
    MatButtonModule,
    BannerComponent,
    SectionHeaderComponent,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      // Type comes from the .marketing-body tier on the element.
      .bb-line {
        color: var(--mat-sys-on-surface-variant);
        max-width: 52ch;
        margin: var(--gt-space-4) auto var(--gt-space-5);
        text-align: center;
      }
      /* Flex/gap come from the shared .cta-row; this page's rows are centered. */
      .bb-cta-row {
        justify-content: center;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Banner"
      status="stable"
      description="A full-width standout band on a subtle surface, carrying a faded line-grid texture that fades into the page's dotted background at the top and bottom. Use it to mark a highlighted full-width zone. The .hero-banner host-class variant becomes the top-of-page hero: a solid, bordered card capped to the home column, with a fuller grid and filled grid cells (brand red + grey) clustered at the edges. Content projects into a centered, width-capped column matching the rest of the page."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="The banner is decorative chrome around projected content: the grid, surface fill, and filled cells are all pointer-events:none and carry no semantics. Keep a single h2 (via mkt-section-header) inside so the heading order stays intact, and let the CTAs be real focusable links."
      [api]="api"
      [anatomy]="anatomy"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Switch band (default)</div>
        <p class="preview-section__note">
          The compact band: a centered header, one supporting line, and a CTA
          row. Full-width in the app; constrained here inside the example card,
          which is expected. The texture still fades in from the sides.
        </p>
        <mkt-banner>
          <mkt-section-header
            eyebrow="Already using Sentry?"
            title="Switch in one line"
            subtitle="Keep every SDK, your instrumentation, and your data."
          />
          <p class="marketing-body bb-line">
            Point your existing DSN at GlitchTip and keep shipping. No re-instrumentation, no lock-in.
          </p>
          <div class="cta-row bb-cta-row">
            <a mat-flat-button color="primary" href="#">Start free</a>
            <a mat-stroked-button href="#">Compare &amp; calculate savings</a>
          </div>
        </mkt-banner>
      </div>

      <div class="preview-section" style="margin-bottom: 0">
        <div class="preview-section__title">Hero variant (.hero-banner)</div>
        <p class="preview-section__note">
          Add the <code>hero-banner</code> host class for the top-of-page hero:
          the band becomes a solid, bordered card with a fuller grid spread and
          filled-cell block art on the card's own 36px grid. The cells are
          desktop-only and hide below the large breakpoint.
        </p>
        <mkt-banner class="hero-banner">
          <mkt-section-header
            eyebrow="Open source error tracking"
            title="Simple, open source error tracking"
            subtitle="Collect every error in real time, organize what matters, and get alerted, without breaking the budget."
          />
          <div class="cta-row bb-cta-row">
            <a mat-flat-button color="primary" href="#">Start free</a>
            <a mat-stroked-button href="#">Self-host</a>
          </div>
        </mkt-banner>
      </div>
    </preview-doc>
  `,
})
export class BrandBannerPreview {
  readonly whenToUse = [
    "The top-of-page hero (with the hero-banner variant)",
    "A highlighted full-width zone that breaks the flat card-less rhythm: the 'already using Sentry?' switch, a closing call to action",
  ];
  readonly dos = [
    "Project a centered mkt-section-header so the heading and rhythm match the rest of the page",
    "Add the hero-banner class only for the page's one hero band",
    "Let content sit in the banner's own width-capped column; don't wrap it in another container",
    "Keep one filled primary CTA in the row, paired with a neutral outlined secondary",
  ];
  readonly donts = [
    "Stack two banners back to back; the texture stops reading as a standout",
    "Use the hero-banner variant for an ordinary switch band (its card chrome and block cells are hero-only)",
    "Add your own background, border, or card chrome. The faded grid and surface fill are the band's own treatment.",
    "Rely on the grid or filled cells in a dark context; both are tuned light-only",
  ];
  readonly api: ApiRow[] = [
    { name: "mkt-banner", type: "element", default: "", description: "The full-width band; projects content into a centered, capped column" },
    { name: "class=\"hero-banner\"", type: "host class", default: "", description: "Hero variant: a fuller grid spread plus the block-art layer and drift animation" },
    { name: "(content)", type: "ng-content", default: "", description: "Projected content; typically an mkt-section-header, a line of copy, and a CTA row" },
  ];
  readonly anatomy = `mkt-banner
├─ ::before   surface fill, masked to fade top & bottom
├─ ::after    faded line-grid, organic patches toward the sides
├─ .banner__art   block art (hero-banner only, desktop only)
└─ .banner__inner   centered, width-capped content column
     └─ <ng-content>  mkt-section-header + copy + CTA row`;
  readonly code = `<!-- switch / closing band -->
<mkt-banner>
  <mkt-section-header
    eyebrow="Already using Sentry?"
    title="Switch in one line"
    subtitle="Keep every SDK, your instrumentation, and your data." />
  <div class="cta-row">
    <a mat-flat-button color="primary" [href]="registerLink">Start free</a>
    <a mat-stroked-button routerLink="/sentry-alternative">Compare</a>
  </div>
</mkt-banner>

<!-- top-of-page hero -->
<mkt-banner class="hero-banner">
  <!-- hero content -->
</mkt-banner>`;
}
