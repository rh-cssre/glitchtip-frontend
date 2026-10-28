import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule, MatMenuPanel } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";

/** An outlined 32px action with a caret menu of related actions; icon only in a narrow bar. */
@Component({
  selector: "gt-split-button",
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: "group", "[attr.aria-label]": "label()" },
  template: `
    <button
      mat-button
      type="button"
      class="gt-split__main"
      [attr.aria-label]="label()"
      [matTooltip]="label()"
      (click)="action.emit()"
    >
      <mat-icon class="gt-split__icon" aria-hidden="true">{{
        icon()
      }}</mat-icon>
      <span class="gt-split__label">{{ label() }}</span>
    </button>
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
  /** Stands alone when a narrow bar hides the label. */
  readonly icon = input.required<string>();
  /** Accessible name and tooltip of the caret. */
  readonly menuLabel = input.required<string>();
  readonly menu = input.required<MatMenuPanel>();
  readonly action = output<void>();
}
