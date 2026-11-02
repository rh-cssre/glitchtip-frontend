import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PreviewDocComponent } from "../docs/preview-doc.component";

/**
 * Icon usage rules (sizing, alignment, labeling), separate from the Icons and
 * Material symbols asset galleries which just show what exists.
 */
@Component({
  selector: "preview-icon-usage",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PreviewDocComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .iu-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--gt-space-5);
      }
      .iu-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--gt-space-2);
      }
      .iu-item__use {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
      }
      .iu-inline {
        display: inline-flex;
        align-items: center;
        gap: var(--gt-space-1);
        font: var(--mat-sys-body-medium);
      }
      .iu-inline mat-icon {
        font-size: 1.1em;
        width: 1.1em;
        height: 1.1em;
      }
    `,
  ],
  template: `
    <preview-doc
      title="Icon usage"
      description="How to size, place, and label icons. The Icons and Material symbols pages show what is available; this page is the rules for using them. The app draws from a self-hosted subset of Material Symbols, so adding a new glyph means regenerating that subset (see the Material symbols page)."
      [whenToUse]="whenToUse"
      [dos]="dos"
      [donts]="donts"
      a11y="An icon-only control needs an aria-label that names the action. A tooltip is a supplement, not a replacement; tooltips do not appear on touch and are unreliable on keyboard focus."
      [code]="code"
    >
      <div class="preview-section">
        <div class="preview-section__title">Sizes</div>
        <p class="preview-section__note">
          Inline icons match the text size. Icon buttons come in two sizes only,
          the same as on Buttons &amp; actions.
        </p>
        <div class="iu-row">
          <div class="iu-item">
            <span class="iu-inline"><mat-icon>check_circle</mat-icon> Resolved</span>
            <span class="iu-item__use">Inline: matches the text</span>
          </div>
          <div class="iu-item">
            <button mat-icon-button class="small-icon-button" aria-label="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <span class="iu-item__use">Small (24) for rows and inputs</span>
          </div>
          <div class="iu-item">
            <button mat-icon-button class="medium-icon-button" aria-label="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <span class="iu-item__use">Medium (36) for toolbars</span>
          </div>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-section__title">Placement</div>
        <p class="preview-section__note">
          Put the icon before the label. A trailing icon is only for the
          external-link cue.
        </p>
        <div class="iu-row">
          <button mat-flat-button color="primary">
            <mat-icon>add</mat-icon>
            New project
          </button>
          <a mat-stroked-button href="https://glitchtip.com" target="_blank">
            Docs
            <mat-icon iconPositionEnd>open_in_new</mat-icon>
          </a>
        </div>
      </div>

      <div class="preview-section" style="margin-bottom: 0">
        <div class="preview-section__title">Icon only</div>
        <p class="preview-section__note">
          When the button is just an icon, the aria-label carries the meaning. A
          tooltip helps sighted mouse users on top of that.
        </p>
        <div class="iu-row">
          <button
            mat-icon-button
            class="medium-icon-button"
            aria-label="Delete"
            matTooltip="Delete"
          >
            <mat-icon>delete</mat-icon>
          </button>
          <button
            mat-icon-button
            class="medium-icon-button"
            aria-label="More actions"
            matTooltip="More actions"
          >
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>
      </div>
    </preview-doc>
  `,
})
export class IconUsagePreview {
  readonly whenToUse = [
    "Reinforcing a label or a status, or standing in for a familiar action",
    "Compact actions in rows and toolbars where a text button will not fit",
  ];
  readonly dos = [
    "Use the two icon-button sizes: small (24) in rows and inputs, medium (36) in toolbars",
    "Match an inline icon to the size and baseline of its text",
    "Put the icon before the label; trailing only for an external-link cue",
    "Reuse an existing Material symbol before adding a new one",
  ];
  readonly donts = [
    "Invent per-page icon sizes",
    "Ship an icon-only button with no aria-label",
    "Lean on an icon alone for meaning the user must not miss; add a label",
    "Scale an icon up as decoration; use a container or an illustration instead",
  ];
  readonly code = `<!-- inline icon: sized to the text -->
<span class="iu-inline"><mat-icon>check_circle</mat-icon> Resolved</span>

<!-- icon button: two sizes, always labelled -->
<button mat-icon-button class="small-icon-button" aria-label="Edit">
  <mat-icon>edit</mat-icon>
</button>

<!-- leading icon with a label -->
<button mat-flat-button color="primary">
  <mat-icon>add</mat-icon>
  New project
</button>`;
}
