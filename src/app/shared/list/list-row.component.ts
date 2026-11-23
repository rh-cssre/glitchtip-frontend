import { ChangeDetectionStrategy, Component } from "@angular/core";

/** One record in a gt-list. A row whose name is an `<a gtListRowLink>` opens its record. */
@Component({
  selector: "gt-list-row",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "listitem",
  },
  template: `
    <div class="list-row__body">
      <div class="list-row__main">
        <ng-content />
        <div class="list-row__description">
          <ng-content select="[slot=description]" />
        </div>
      </div>
      <div class="list-row__meta"><ng-content select="[slot=meta]" /></div>
      <div class="list-row__actions">
        <ng-content select="[slot=actions]" />
      </div>
    </div>
  `,
  styles: `
    // Positioned, so a row link's hit area can cover the row.
    :host {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--gt-space-3, 12px);
      min-height: 52px;
      padding: var(--gt-space-2, 8px) var(--gt-space-4, 16px);
      box-sizing: border-box;
      font: var(--mat-sys-body-medium);
    }

    .list-row__body {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--gt-space-1, 4px) var(--gt-space-4, 16px);
      min-width: 0;
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

    .list-row__description {
      flex-basis: 100%;
      font-weight: 400;
      color: var(--mat-sys-on-surface-variant);

      &:empty {
        display: none;
      }
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
      // Above a row link's hit area, so the buttons keep their own clicks.
      position: relative;
      z-index: 1;

      &:empty {
        display: none;
      }
    }
  `,
})
export class ListRowComponent {}
