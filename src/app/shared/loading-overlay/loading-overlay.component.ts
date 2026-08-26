import {
  ChangeDetectionStrategy,
  Component,
  input,
  booleanAttribute,
} from "@angular/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";

/**
 * Wraps a list or table and shows an indeterminate progress bar across the top
 * while `loading` is true, keeping the projected content visible but dimmed and
 * non-interactive instead of blanking out. Use it on every reloading list so a
 * filter, sort or pagination change reads the same everywhere.
 *
 * Pair it with keepPreviousValue() in the data source (see shared/signal.utils)
 * so the rows survive the reload; on their own the rows would still clear the
 * moment the resource goes pending.
 */
@Component({
  selector: "gt-loading-overlay",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressBarModule],
  template: `
    <div class="loading-overlay">
      <div class="loading-overlay__bar">
        @if (loading()) {
          <mat-progress-bar mode="indeterminate" [attr.aria-label]="label()" />
        }
      </div>
      <div
        class="loading-overlay__content"
        [class.is-reloading]="loading()"
        [attr.aria-busy]="loading()"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  host: { "[class.full-height]": "fullHeight()" },
  styles: `
    .loading-overlay {
      position: relative;
    }
    .loading-overlay__bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      z-index: 2;
      // The bar only conveys progress; never let its 4px strip swallow clicks
      // on the sticky header sitting beneath it.
      pointer-events: none;
    }
    .loading-overlay__content {
      transition: opacity 150ms ease;
    }
    // Dim + block interaction on the stale content while it reloads.
    .loading-overlay__content.is-reloading {
      opacity: 0.5;
      pointer-events: none;
    }
    :host(.full-height),
    :host(.full-height) .loading-overlay,
    :host(.full-height) .loading-overlay__content {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
    }
  `,
})
export class LoadingOverlayComponent {
  /** Whether the wrapped content is reloading. */
  readonly loading = input<boolean>(false);
  /** Accessible label for the progress bar, e.g. "Loading issues". */
  readonly label = input<string>("Loading");
  /** Whether the loading overlay should fill its parent container. */
  readonly fullHeight = input<boolean>(false, { transform: booleanAttribute });
}
