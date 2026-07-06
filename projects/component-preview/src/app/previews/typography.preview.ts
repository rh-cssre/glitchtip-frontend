import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";

/**
 * Showcase of the handful of custom text classes the app layers on top of
 * Angular Material typography. Ported from the old `typography.stories.ts`.
 */
@Component({
  selector: "preview-typography",
  imports: [MatDividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mat-typography">
      <p class="mat-title-medium">section-header-text — page titles</p>
      <p class="section-header-text">The quick brown fox jumps over the lazy dog</p>
      <mat-divider />

      <p class="mat-title-medium">section-header-text-light — issue titles</p>
      <p class="section-header-text-light">
        The quick brown fox jumps over the lazy dog
      </p>
      <mat-divider />

      <p class="mat-title-medium">body-text — longer text blocks</p>
      <p class="body-text">The quick brown fox jumps over the lazy dog</p>
      <mat-divider />

      <p class="mat-title-medium">body-text-strong — bold variant</p>
      <p class="body-text-strong">The quick brown fox jumps over the lazy dog</p>
      <mat-divider />

      <p class="mat-title-medium">caption-text — small</p>
      <p class="caption-text">The quick brown fox jumps over the lazy dog</p>
    </section>
  `,
})
export class TypographyPreview {}
