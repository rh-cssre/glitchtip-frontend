import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * Marketing cards & surfaces. Two archetypes only: a bordered card for a
 * discrete scannable unit, and a flat divider-row for long homogeneous lists.
 * Flat, border-only depth; one fill token; one hover convention gated by
 * interactivity.
 */
@Component({
  selector: "preview-brand-card",
  imports: [MatIconModule, PreviewDocComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .bcard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
        gap: var(--gt-space-4);
      }
      .bcard {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 22px;
        text-decoration: none;
      }
      .bcard__icon {
        color: var(--mat-sys-primary);
        margin-bottom: 6px;
      }
      /* Surface + hover come from .mkt-card; type from .marketing-title-sm. */
      .bcard__title {
        margin: 0;
        color: var(--mat-sys-on-surface);
      }
      .bcard__desc {
        margin: 0;
        color: var(--mat-sys-on-surface-variant);
      }
      .brow-list {
        list-style: none;
        margin: 0;
        padding: 0;
        max-width: 560px;
      }
      .brow {
        display: block;
        padding: 16px 0;
        border-bottom: 1px solid var(--mat-sys-outline-variant);
        text-decoration: none;
      }
      .brow__title {
        margin: 0;
        color: var(--mat-sys-on-surface);
      }
      .brow__meta {
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <preview-doc
      title="Cards & surfaces"
      status="stable"
      description="Two archetypes only. One shared primitive: surface fill + 1px outline-variant border + a large (16px) corner. Flat, border-only depth with no in-flow drop shadows. Marquee cards (hero, feature switcher, newsletter) compose the same primitive with the extra-large (28px) corner."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="Interactive cards and rows are a single real link so the whole block is one focusable target that announces its destination; hover cues are paired with the focus/active state, never color alone."
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Archetype 1: bordered card</div>
        <p class="preview-section__note">
          A discrete, scannable unit: feature, plan, doc, support, or
          blog-feature. Interactive (link) cards hover to a primary border +
          title.
        </p>
        <div class="bcard-grid">
          <a class="mkt-card bcard" href="#" (click)="$event.preventDefault()">
            <mat-icon class="bcard__icon">breaking_news</mat-icon>
            <h3 class="mkt-card__title marketing-title-sm bcard__title">Error tracking</h3>
            <p class="marketing-caption bcard__desc">
              Capture and group every exception.
            </p>
          </a>
          <a class="mkt-card bcard" href="#" (click)="$event.preventDefault()">
            <mat-icon class="bcard__icon">code</mat-icon>
            <h3 class="mkt-card__title marketing-title-sm bcard__title">Issue tracker</h3>
            <p class="marketing-caption bcard__desc">
              Report a bug or request a feature.
            </p>
          </a>
          <a class="mkt-card bcard" href="#" (click)="$event.preventDefault()">
            <mat-icon class="bcard__icon">cloud</mat-icon>
            <h3 class="mkt-card__title marketing-title-sm bcard__title">Your data, your infra</h3>
            <p class="marketing-caption bcard__desc">
              Self-host and keep data in your region.
            </p>
          </a>
        </div>
      </div>

      <div class="preview-section" style="margin-bottom: 0">
        <div class="preview-section__title">Archetype 2: divider row</div>
        <p class="preview-section__note">
          Long homogeneous lists (blog archive, FAQ): no box, no fill, just a
          bottom hairline. Same title-color hover when the row is a link.
        </p>
        <ul class="brow-list">
          <li>
            <a class="mkt-row brow" href="#" (click)="$event.preventDefault()">
              <h3 class="mkt-row__title marketing-title-sm brow__title">
                GlitchTip 6.2 released
              </h3>
              <span class="marketing-caption brow__meta">June 22, 2026</span>
            </a>
          </li>
          <li>
            <a class="mkt-row brow" href="#" (click)="$event.preventDefault()">
              <h3 class="mkt-row__title marketing-title-sm brow__title">
                Making Django faster: django-vcache
              </h3>
              <span class="marketing-caption brow__meta">April 2, 2026</span>
            </a>
          </li>
        </ul>
      </div>
    </preview-doc>
  `,
})
export class BrandCardPreview {
  readonly whenToUse = [
    "A discrete, scannable unit: feature, plan, doc, support, or blog-feature card",
    "A long homogeneous list of links (blog archive, FAQ); use the divider row",
  ];
  readonly dos = [
    "Use one card primitive: surface + 1px outline-variant + large corner",
    "Match the corner to the role: large 16 for media/cards, medium 12 for chips, small 8 for code",
    "Hover only on interactive cards/rows (border + title → primary)",
    "Use a divider row (bottom hairline, no box) for long homogeneous lists",
  ];
  readonly donts = [
    "Use drop shadows in flow (reserve shadow for floating overlays)",
    "Reach for a card when a divider-row list is enough",
    "Recede a card with surface-container (reserve it for the banner band and code blocks)",
    "Add hover to a non-navigational container",
  ];
  readonly code = `<!-- bordered card (interactive) -->
<a class="mkt-surface mkt-card" [routerLink]="link"> … </a>

<!-- divider row -->
<li class="mkt-row"><a [routerLink]="link"> … </a></li>`;
}
