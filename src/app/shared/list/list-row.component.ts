import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "gt-list-row",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: "listitem" },
  template: `
    <div class="list-row__main"><ng-content /></div>
    <div class="list-row__meta"><ng-content select="[slot=meta]" /></div>
    <div class="list-row__actions"><ng-content select="[slot=actions]" /></div>
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--gt-space-1, 4px) var(--gt-space-4, 16px);
      min-height: 52px;
      padding: var(--gt-space-2, 8px) var(--gt-space-4, 16px);
      box-sizing: border-box;
      font: var(--mat-sys-body-medium);
    }

    :host:not(:first-child) {
      border-top: 1px solid var(--mat-sys-outline-variant);
    }

    .list-row__main {
      display: flex;
      flex: 1 1 240px;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--gt-space-2, 8px);
      min-width: 0;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .list-row__meta {
      min-width: 120px;
      color: var(--mat-sys-on-surface-variant);

      &:empty {
        display: none;
      }
    }

    .list-row__actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--gt-space-2, 8px);
      min-width: 104px;
      margin-left: auto;

      &:empty {
        display: none;
      }

      ::ng-deep .mdc-button {
        min-width: 104px;
      }
    }
  `,
})
export class ListRowComponent {}
