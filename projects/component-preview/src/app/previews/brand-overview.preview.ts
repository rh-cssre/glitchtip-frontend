import { Component, ChangeDetectionStrategy } from "@angular/core";

/**
 * Front door for the Brand section. Explains that the marketing site is built
 * on the product's theme and holds the shared-vs-brand split, which is not
 * specific to any one component.
 */
@Component({
  selector: "preview-brand-overview",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .bo-split {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--gt-space-4);
        max-width: 720px;
      }
      .bo-col {
        padding: var(--gt-space-4);
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: 8px;
        background-color: var(--mat-sys-surface-container-low);
      }
      .bo-col__label {
        font: var(--mat-sys-label-large);
        margin: 0 0 var(--gt-space-2);
      }
      .bo-col ul {
        margin: 0;
        padding-left: var(--gt-space-4);
        font: var(--mat-sys-body-medium);
      }
      .bo-col li {
        margin-bottom: var(--gt-space-1);
      }
    `,
  ],
  template: `
    <header class="preview-page-header">
      <h1 class="preview-page-title">Brand overview</h1>
      <p class="preview-lead">
        The marketing site's visual language. It is built on the product's
        Material 3 theme and adds only a thin brand layer, so brand pages render
        faithfully inside the product-themed canvas and never fork a product
        component.
      </p>
    </header>

    <div class="preview-section">
      <div class="preview-section__title">What comes from the product</div>
      <p class="preview-section__note">
        The marketing site inherits most of the system and adds a small brand
        layer on top. Every brand page is composed from these.
      </p>
      <div class="bo-split">
        <div class="bo-col">
          <p class="bo-col__label">Inherited from the product</p>
          <ul>
            <li>Material 3 color roles (--mat-sys-*)</li>
            <li>Spacing scale (--gt-space-*)</li>
            <li>Base body and label type</li>
          </ul>
        </div>
        <div class="bo-col">
          <p class="bo-col__label">Added by the brand</p>
          <ul>
            <li>Display type scale (.marketing-heading)</li>
            <li>The .fancy italic accent</li>
            <li>--mkt-accent-blue / --mkt-accent-yellow</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="preview-section" style="margin-bottom: 0">
      <div class="preview-section__title">Components not shown here</div>
      <p class="preview-section__note">
        The marketing site also has image-based components (feature section,
        responsive image) that need real marketing assets to render, so they are
        documented in the marketing source rather than shown live in this guide.
      </p>
    </div>
  `,
})
export class BrandOverviewPreview {}
