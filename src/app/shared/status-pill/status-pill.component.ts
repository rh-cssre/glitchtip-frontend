import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "gt-status-pill",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ label() }}`,
  host: { "[style.--status-color]": "color()" },
  styles: `
    @use "controls";

    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--gt-space-1, 4px);
      padding: 1px var(--gt-space-2, 8px);
      border-radius: var(--mat-sys-corner-full);
      font: var(--mat-sys-label-medium);
      font-weight: 500;
      white-space: nowrap;
      color: var(--mat-sys-on-surface);
      background-color: var(--mat-sys-surface-container-highest);
    }
    :host::before {
      @include controls.status-dot;
      content: "";
      background-color: var(--status-color);
    }
  `,
})
export class StatusPillComponent {
  readonly label = input.required<string>();
  readonly color = input("var(--mat-sys-outline)");
}
