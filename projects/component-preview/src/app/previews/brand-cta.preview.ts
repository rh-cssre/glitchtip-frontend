import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ApiRow, PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * Marketing buttons & CTAs: the marketing counterpart of the product's
 * Buttons & actions page. Same emphasis ladder; the deliberate marketing
 * differences are conversion copy (one verb, "Start free"), the hero CTA row,
 * and that most CTAs are <a> links to the app.
 */
@Component({
  selector: "preview-brand-cta",
  imports: [MatButtonModule, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .bcta-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--gt-space-4);
      }
      .bcta-item {
        display: flex;
        flex-direction: column;
        gap: var(--gt-space-2);
        align-items: flex-start;
      }
      .bcta-item__use {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        max-width: 24ch;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Buttons & CTAs"
      status="stable"
      description="Marketing shares the product's emphasis ladder. The differences are conversion copy (one verb, 'Start free'), the hero CTA row pairing, and that most CTAs are links to the app. Buttons round to 8px via the marketing --mat-sys-corner-full override."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      [content]="content"
      a11y="Marketing CTAs are real <a> links so they are focusable and announce their destination. Off-site links open in a new tab with rel=noopener and a trailing open_in_new; app links stay same-tab with no cue."
      [api]="api"
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Emphasis ladder</div>
        <p class="preview-section__note">
          One filled primary per viewport. Everything else is neutral outlined
          or a text link.
        </p>
        <div class="bcta-row">
          <div class="bcta-item">
            <button mat-flat-button color="primary">Start free</button>
            <span class="bcta-item__use">Primary: the one conversion CTA</span>
          </div>
          <div class="bcta-item">
            <button mat-stroked-button>See pricing</button>
            <span class="bcta-item__use"
              >Secondary: neutral outlined, no color</span
            >
          </div>
          <div class="bcta-item">
            <button mat-button>Read the docs</button>
            <span class="bcta-item__use">Tertiary: text or link</span>
          </div>
        </div>
      </div>

      <div class="preview-section" style="margin-bottom: 0">
        <div class="preview-section__title">Hero CTA row</div>
        <p class="preview-section__note">
          The standard pairing at the top of a page and in the closing band:
          filled primary + neutral outlined, in a shared <code>.cta-row</code>.
        </p>
        <div class="bcta-row">
          <a mat-flat-button color="primary" href="#">Start free</a>
          <a mat-stroked-button href="#">Self-host</a>
        </div>
      </div>
    </preview-doc>
  `,
})
export class BrandCtaPreview {
  readonly whenToUse = [
    "Any marketing call to action: sign up, self-host, compare, view docs",
    "Pairing a primary conversion CTA with a secondary path",
  ];
  readonly dos = [
    "Use one filled color=\"primary\" CTA per viewport (the same CTA may repeat down a long page)",
    "Use one sign-up verb sitewide: Start free",
    "Make secondary CTAs neutral mat-stroked-button (no color)",
    "Lay CTAs out in one shared .cta-row",
  ];
  readonly donts = [
    "Put two different filled primaries in one section",
    "Color a secondary outlined button with primary",
    "Open the app in a new tab (reserve new-tab + open_in_new for off-site links)",
    "Invent a new sign-up verb per page",
  ];
  readonly content = [
    "Primary conversion verb is Start free; keep Register / Sign in only for the nav auth pair",
    "Secondary CTAs name the path: See pricing, Self-host, Read the docs",
  ];
  readonly api: ApiRow[] = [
    { name: "mat-flat-button color=\"primary\"", type: "filled", default: "", description: "The one primary conversion CTA" },
    { name: "mat-stroked-button", type: "outlined, neutral", default: "", description: "Secondary CTA (no color)" },
    { name: "mat-button", type: "text", default: "", description: "Low-emphasis / inline link action" },
    { name: ".cta-row", type: "layout", default: "", description: "Shared flex row for a CTA pair, one 12px gap" },
  ];
  readonly code = `<!-- hero / closing CTA row -->
<div class="cta-row">
  <a mat-flat-button color="primary" [href]="registerLink">Start free</a>
  <a mat-stroked-button routerLink="/pricing">Self-host</a>
</div>`;
}
