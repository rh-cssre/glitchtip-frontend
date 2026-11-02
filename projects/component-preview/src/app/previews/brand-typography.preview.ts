import { Component, ChangeDetectionStrategy } from "@angular/core";
import { DocBulletsComponent } from "../docs/doc-bullets.component";

interface TypeTier {
  className: string;
  usage: string;
  spec: string;
  sample: string;
}

/** The marketing type scale, top to bottom. One weight per tier. */
const BRAND_TYPE_CLASSES: TypeTier[] = [
  {
    className: "marketing-display",
    usage: "Hero headlines only",
    spec: "fluid 38-60px · 700 · -0.035em",
    sample: "Open source error tracking",
  },
  {
    className: "marketing-heading",
    usage: "Page & major section headings",
    spec: "45 / 50 · 700 · -0.035em",
    sample: "Everything you need to debug",
  },
  {
    className: "marketing-subheading",
    usage: "Section headings",
    spec: "34 / 37 · 700 · -0.02em",
    sample: "Track errors across your stack",
  },
  {
    className: "marketing-small-heading",
    usage: "Sub-sections & large card headings",
    spec: "24 / 30 · 700 · -0.02em",
    sample: "Performance monitoring",
  },
  {
    className: "marketing-title",
    usage: "Card & list-row titles",
    spec: "20 / 26 · 600 · -0.01em",
    sample: "Self-hosted support plan",
  },
  {
    className: "marketing-title-sm",
    usage: "Dense card / row titles",
    spec: "17 / 24 · 600 · -0.01em",
    sample: "Community chat",
  },
  {
    className: "marketing-body",
    usage: "Body copy",
    spec: "16 · 400 · lh 1.6",
    sample:
      "Collect every error from your project in real time, organize them, and get alerted where you want.",
  },
  {
    className: "marketing-body-strong",
    usage: "Emphasized body",
    spec: "16 · 500",
    sample: "Keep your data on servers you control.",
  },
  {
    className: "marketing-caption",
    usage: "Fine print & metadata",
    spec: "13 · 400",
    sample: "No credit card required. Cancel anytime.",
  },
];

/**
 * The marketing site's type scale. Same IBM Plex family and Material tokens as
 * the product; the deliberate marketing differences are the larger sizes, the
 * tight negative tracking, and the `.fancy` italic accent. Mirror of the
 * classes in projects/marketing/src/app/styles/_font-files.scss.
 */
@Component({
  selector: "preview-brand-typography",
  imports: [DocBulletsComponent],
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
      .bt-spec {
        font: var(--mat-sys-label-small);
        color: var(--mat-sys-on-surface-variant);
      }
      .bt-usage {
        font: var(--mat-sys-label-medium);
      }
      .bt-sample {
        margin: 0;
      }
      .bt-eyebrow-demo {
        max-width: 46ch;
      }
      .bt-eyebrow-demo p {
        margin: 0;
      }
      .bt-eyebrow-demo h2 {
        margin: var(--gt-space-1) 0 var(--gt-space-2);
      }
      .bt-eyebrow-demo .lead {
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <header class="preview-page-header">
      <h1 class="preview-page-title">Brand typography</h1>
      <p class="preview-lead">
        The marketing type scale uses the same IBM Plex family and Material
        tokens as the product, sized up for marketing surfaces. Use a class;
        never set a
        raw <code>font-size</code> on a heading or title. Defined in
        <code>projects/marketing/src/app/styles/_font-files.scss</code>.
      </p>
    </header>

    <div class="preview-section">
      <div class="preview-section__title">Type scale</div>
      @for (t of classes; track t.className) {
        <div class="bt-row">
          <div class="bt-meta">
            <span class="bt-token">.{{ t.className }}</span>
            <span class="bt-usage">{{ t.usage }}</span>
            <span class="bt-spec">{{ t.spec }}</span>
          </div>
          <p class="bt-sample" [class]="t.className">{{ t.sample }}</p>
        </div>
      }
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Eyebrow + section header</div>
      <p class="preview-section__note">
        The <code>.marketing-eyebrow</code> kicker labels a section above its
        title. The <code>mkt-section-header</code> component pairs it with a
        <code>.fancy</code> title and an optional subtitle. Reuse it instead of
        re-declaring an eyebrow per page.
      </p>
      <div class="bt-eyebrow-demo">
        <p class="marketing-eyebrow">Get support</p>
        <h2 class="marketing-subheading fancy">Talk to our team</h2>
        <p class="marketing-body lead">
          How you reach us depends on how you run GlitchTip.
        </p>
      </div>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">The fancy accent</div>
      <p class="preview-section__note">
        The brand accent: italic in the primary color, for a single
        highlighted word or short title. Inline accent only; block spacing
        comes from the heading class, not <code>.fancy</code>.
      </p>
      <h2 class="marketing-subheading" style="margin: 0">
        Ship with <span class="fancy">confidence</span>
      </h2>
    </div>

    <div class="preview-section">
      <div class="preview-section__title">Rules</div>
      <div class="dodont-grid">
        <doc-bullets label="Do" tone="do" [items]="dos" />
        <doc-bullets label="Don't" tone="dont" [items]="donts" />
      </div>
    </div>
  `,
})
export class BrandTypographyPreview {
  readonly classes = BRAND_TYPE_CLASSES;

  readonly dos = [
    "Keep one weight per tier: display and headings 700, titles 600, body 400, strong 500",
    "Pick the tier by role (hero to display, section to subheading, card to title), not by eyeballing a pixel size",
  ];
  readonly donts = [
    "Set a raw font-size on a heading or card title in a component; add or reuse a tier instead",
    "Give .fancy its own block margins, or use it for long runs of text",
  ];
}
