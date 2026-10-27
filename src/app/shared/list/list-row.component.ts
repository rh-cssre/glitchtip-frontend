import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "gt-list-row",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: "listitem" },
  template: `
    <div class="list-row__main">
      <ng-content />
      <div class="list-row__description">
        <ng-content select="[slot=description]" />
      </div>
    </div>
    <div class="list-row__meta"><ng-content select="[slot=meta]" /></div>
    <div class="list-row__actions"><ng-content select="[slot=actions]" /></div>
  `,
  styles: `
    @use "object-header";

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

      ::ng-deep a {
        color: inherit;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }

      // Fixed attribute such as Owner or Primary; states use gt-status-pill.
      ::ng-deep .list-row__tag {
        padding: 0 var(--gt-space-2, 8px);
        border-radius: var(--mat-sys-corner-small);
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
        background-color: var(--mat-sys-surface-container-high);
        white-space: nowrap;
      }
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

      // Several facts are child spans; the separators are drawn here, as in
      // gt-page-header, so translators never see them.
      // Flex drops the template whitespace, so the gap matches the header.
      ::ng-deep [slot="meta"] {
        display: inline-flex;
      }

      ::ng-deep [slot="meta"] > * {
        position: relative;
        white-space: nowrap;
      }

      ::ng-deep [slot="meta"] > :not(:first-child) {
        margin-left: var(--gt-space-4, 16px);

        &::before {
          @include object-header.separator;
        }
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
