import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";

let nextId = 0;

@Component({
  selector: "gt-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { "[class.list--flush]": "flush()" },
  template: `
    @if (label(); as label) {
      <h3 class="gt-subheading" [id]="labelId">{{ label }}</h3>
    }
    <div
      class="list__rows"
      role="list"
      [attr.aria-labelledby]="label() ? labelId : null"
    >
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
      margin-bottom: var(--gt-space-5, 24px);
    }

    :host:last-child {
      margin-bottom: 0;
    }

    .list__rows {
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: var(--mat-sys-corner-extra-small);
    }

    // Inside a flush panel the panel draws the outer border.
    :host(.list--flush) {
      margin-bottom: 0;
    }

    :host(.list--flush) .list__rows {
      border: 0;
      border-radius: 0;
    }
  `,
})
export class ListComponent {
  readonly label = input<string | null>(null);
  /** No outer border, for rows that sit edge to edge in a flush panel. */
  readonly flush = input(false, { transform: booleanAttribute });
  readonly labelId = `gt-list-label-${nextId++}`;
}
