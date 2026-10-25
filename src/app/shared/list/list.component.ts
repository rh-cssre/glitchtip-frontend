import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "gt-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label(); as label) {
      <h3 class="list__label">{{ label }}</h3>
    }
    <div class="list__rows" role="list">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
      margin-bottom: var(--gt-space-5, 24px);
    }

    .list__label {
      margin: 0 0 var(--gt-space-2, 8px);
      font: var(--mat-sys-title-small);
      font-weight: 600;
      color: var(--mat-sys-on-surface-variant);
    }

    .list__rows {
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 4px;
    }
  `,
})
export class ListComponent {
  readonly label = input<string | null>(null);
}
