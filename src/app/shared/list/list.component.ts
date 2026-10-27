import { ChangeDetectionStrategy, Component, input } from "@angular/core";

let nextId = 0;

@Component({
  selector: "gt-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  `,
})
export class ListComponent {
  readonly label = input<string | null>(null);
  readonly labelId = `gt-list-label-${nextId++}`;
}
