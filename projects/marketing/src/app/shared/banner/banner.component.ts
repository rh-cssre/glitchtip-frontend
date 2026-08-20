import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from "@angular/core";

/**
 * Full-width standout band with a faded line-grid texture; projected content
 * sits in a centred, width-capped column.
 */
@Component({
  selector: "mkt-banner",
  template: `<div class="banner">
    <div class="banner__inner"><ng-content /></div>
  </div>`,
  styleUrl: "./banner.component.scss",
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.Emulated,
})
export class BannerComponent {}
