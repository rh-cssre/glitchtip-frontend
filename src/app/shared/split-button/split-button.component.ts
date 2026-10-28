import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BreakpointObserver } from "@angular/cdk/layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule, MatMenuPanel } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { map } from "rxjs";

/** An outlined 32px action with a caret menu of related actions; icon only under 600px. */
@Component({
  selector: "gt-split-button",
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: "group", "[attr.aria-label]": "label()" },
  template: `
    @if (narrow()) {
      <button
        mat-icon-button
        type="button"
        class="gt-split__main-icon"
        [attr.aria-label]="label()"
        [matTooltip]="label()"
        (click)="action.emit()"
      >
        <mat-icon class="gt-split__icon" aria-hidden="true">{{
          icon()
        }}</mat-icon>
      </button>
    } @else {
      <button
        mat-button
        type="button"
        class="gt-split__main"
        (click)="action.emit()"
      >
        @if (icon()) {
          <mat-icon class="gt-split__icon" aria-hidden="true">{{
            icon()
          }}</mat-icon>
        }
        {{ label() }}
      </button>
    }
    <span class="gt-split__sep" aria-hidden="true"></span>
    <button
      mat-icon-button
      type="button"
      class="gt-split__caret"
      [attr.aria-label]="menuLabel()"
      [matTooltip]="menuLabel()"
      [matMenuTriggerFor]="menu()"
    >
      <mat-icon aria-hidden="true">arrow_drop_down</mat-icon>
    </button>
  `,
  styleUrl: "./split-button.component.scss",
})
export class SplitButtonComponent {
  readonly label = input.required<string>();
  readonly icon = input("");
  /** Accessible name and tooltip of the caret. */
  readonly menuLabel = input.required<string>();
  readonly menu = input.required<MatMenuPanel>();
  readonly action = output<void>();

  readonly narrow = toSignal(
    inject(BreakpointObserver)
      .observe("(max-width: 599.98px)")
      .pipe(map((r) => r.matches)),
    { initialValue: false },
  );
}
