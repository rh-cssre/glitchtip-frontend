import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

/**
 * Shared empty state: a centered icon, title, a short message and one optional
 * action. Use it wherever a list, table or panel has no data so every empty
 * state reads the same. Project a single button for the action. Set headingLevel
 * to match the surrounding page so the title lands in the right place in the
 * heading outline.
 */
@Component({
  selector: "gt-empty-state",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="empty-state">
      @if (icon()) {
        <mat-icon class="empty-state__icon" aria-hidden="true">{{
          icon()
        }}</mat-icon>
      }
      <p
        class="empty-state__title"
        role="heading"
        [attr.aria-level]="headingLevel()"
      >
        {{ title() }}
      </p>
      @if (message()) {
        <p class="empty-state__message">{{ message() }}</p>
      }
      <span class="empty-state__action"><ng-content></ng-content></span>
    </div>
  `,
  styles: `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--gt-space-2, 8px);
      padding: var(--gt-space-7, 48px) var(--gt-space-4, 16px);
      color: var(--mat-sys-on-surface-variant);
    }
    .empty-state__icon {
      width: 48px;
      height: 48px;
      font-size: 48px;
      color: var(--mat-sys-outline);
    }
    .empty-state__title {
      margin: 0;
      font: var(--mat-sys-title-medium);
      color: var(--mat-sys-on-surface);
    }
    .empty-state__message {
      margin: 0;
      max-width: 44ch;
      font: var(--mat-sys-body-medium);
    }
    .empty-state__action {
      margin-top: var(--gt-space-2, 8px);
    }
    .empty-state__action:empty {
      display: none;
    }
  `,
})
export class EmptyStateComponent {
  readonly icon = input<string>("");
  readonly title = input.required<string>();
  readonly message = input<string>("");
  readonly headingLevel = input<number>(3);
}
