import { Component, ChangeDetectionStrategy } from "@angular/core";

const BRAND_TYPE_CLASSES: { className: string; usage: string }[] = [
  { className: "marketing-heading", usage: "Hero headings (45px)" },
  { className: "marketing-subheading", usage: "Section headings (34px)" },
  { className: "marketing-small-heading", usage: "Card and block headings (24px)" },
  { className: "marketing-body", usage: "Body copy" },
  { className: "marketing-body-strong", usage: "Emphasized body copy" },
  { className: "marketing-caption", usage: "Fine print" },
];

/**
 * The marketing site's display typography. Same IBM Plex family and Material
 * tokens as the product, scaled up for marketing surfaces, plus the `.fancy`
 * italic accent that defines the brand voice (also echoed in the product's
 * promo banners).
 */
@Component({
  selector: "preview-brand-typography",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .bt-row {
        padding-bottom: var(--gt-space-4);
        margin-bottom: var(--gt-space-4);
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }
      .bt-row:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      .bt-meta {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: var(--gt-space-1) var(--gt-space-3);
        margin-bottom: var(--gt-space-2);
      }
      .bt-token {
        font-family: var(--gt-font-mono, monospace);
        font-size: 0.78rem;
        color: var(--mat-sys-on-surface-variant);
      }
      .bt-label {
        font: var(--mat-sys-label-medium);
      }
      .bt-sample {
        margin: 0;
      }
    `,
  ],
  template: `
    <header class="preview-page-header">
      <h1 class="preview-page-title">Brand typography</h1>
      <p class="preview-lead">
        The marketing site's display scale. Same IBM Plex family and Material
        tokens as the product, sized up for marketing surfaces. Defined in
        <code>projects/marketing</code>.
      </p>
    </header>

    <div class="preview-section">
      <div class="preview-section__title">Display classes</div>
      @for (c of classes; track c.className) {
        <div class="bt-row">
          <div class="bt-meta">
            <span class="bt-token">.{{ c.className }}</span>
            <span class="bt-label">{{ c.usage }}</span>
          </div>
          <p class="bt-sample" [class]="c.className">
            Error tracking that respects your users
          </p>
        </div>
      }
    </div>

    <div class="preview-section">
      <div class="preview-section__title">The fancy accent</div>
      <p class="preview-section__note">
        The brand's signature: bold italic in the primary color, used inside
        hero headings and echoed by the product's promo banners. Apply with
        <code>.fancy</code> on an inline span.
      </p>
      <h2 class="marketing-subheading" style="margin: 0">
        Ship with <span class="fancy">confidence</span>
      </h2>
    </div>
  `,
})
export class BrandTypographyPreview {
  readonly classes = BRAND_TYPE_CLASSES;
}
