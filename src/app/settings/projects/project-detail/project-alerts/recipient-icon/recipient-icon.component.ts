import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { resolveRecipientIcon } from "../alert-labels";

/** One recipient type's icon, the same size and color everywhere. */
@Component({
  selector: "gt-recipient-icon",
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (type() === "email") {
      <mat-icon aria-hidden="true">email</mat-icon>
    } @else {
      <svg aria-hidden="true"><use [attr.xlink:href]="href()"></use></svg>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
    }
    mat-icon,
    svg {
      width: 20px;
      height: 20px;
      font-size: 20px;
      // Sprite icons without their own color follow the text, so they show
      // in dark mode.
      fill: currentColor;
    }
  `,
})
export class RecipientIconComponent {
  readonly type = input.required<string>();
  readonly href = computed(() => "#" + resolveRecipientIcon(this.type()));
}
