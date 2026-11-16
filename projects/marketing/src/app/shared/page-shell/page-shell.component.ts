import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from "@angular/core";

/**
 * Card-less page container: content sits directly on the page's dot-grid
 * background in one centered, width-capped column, matching the home page.
 * Pages compose their own inner blocks (`.centered-block`,
 * `mkt-section-header`, `.divider`, markdown, etc.).
 */
@Component({
  selector: "mkt-page-shell",
  template: `<div class="page-shell"><ng-content /></div>`,
  styleUrl: "./page-shell.component.scss",
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PageShellComponent {}
