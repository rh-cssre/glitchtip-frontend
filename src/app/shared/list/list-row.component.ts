import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ListRowLinkComponent } from "./list-row-link.component";

/** One record in a gt-list. A row whose name is an `<a gtListRowLink>` opens its record. */
@Component({
  selector: "gt-list-row",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  host: {
    role: "listitem",
    "[class.list-row--navigable]": "navigable()",
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
    @if (navigable()) {
      <!-- chevron_right is not in the icon font subset. -->
      <mat-icon class="list-row__chevron" aria-hidden="true"
        >keyboard_arrow_right</mat-icon
      >
    }
  `,
  styles: `
    @use "object-header";

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

    :host(.list-row--navigable) {
      padding-right: var(--gt-space-3, 12px);
    }

    .list-row__body {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--gt-space-1, 4px) var(--gt-space-4, 16px);
      min-width: 0;
    }

    .list-row__chevron {
      flex: none;
      width: 20px;
      height: 20px;
      font-size: 20px;
      color: var(--mat-sys-on-surface-variant);
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

        &:hover,
        &:focus-visible {
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
      // Above a row link's hit area, so the buttons keep their own clicks.
      position: relative;
      z-index: 1;

      &:empty {
        display: none;
      }

      ::ng-deep .mdc-button {
        min-width: 104px;
      }
    }
  `,
})
export class ListRowComponent {
  private readonly link = contentChild(ListRowLinkComponent);
  readonly navigable = computed(() => !!this.link());
}
