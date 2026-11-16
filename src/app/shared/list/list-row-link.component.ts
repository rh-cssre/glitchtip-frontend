import { ChangeDetectionStrategy, Component } from "@angular/core";

/**
 * The name link of a row that opens its record (`<a gtListRowLink [routerLink]>`).
 * Its hit area covers the row.
 */
@Component({
  // An attribute on the native <a>, so it stays a real link.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "a[gtListRowLink]",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: `
    // gt-list-row is the positioned ancestor, so a click anywhere on the row follows the link.
    :host::after {
      content: "";
      position: absolute;
      inset: 0;
    }

    :host(:hover)::after {
      background-color: color-mix(
        in srgb,
        var(--mat-sys-on-surface)
          calc(var(--mat-sys-hover-state-layer-opacity) * 100%),
        transparent
      );
    }

    // The ring goes round the row, the link's real target.
    :host(:focus-visible) {
      outline: none;
    }

    :host(:focus-visible)::after {
      outline: 2px solid var(--mat-sys-on-surface);
      outline-offset: -2px;
    }
  `,
})
export class ListRowLinkComponent {}
