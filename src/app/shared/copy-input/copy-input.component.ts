import { ClipboardModule } from "@angular/cdk/clipboard";
import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

/**
 * A read-only input that allows the user to copy it's value
 */
@Component({
  selector: "gt-copy-input",
  templateUrl: "./copy-input.component.html",
  imports: [ClipboardModule, MatIconModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyInputComponent {
  readonly value = input("");
  readonly placeholder = input("");
  copied = signal(false);

  /**
   * Set copy icon to show it was copied, then reset state
   */
  copy() {
    this.copied.set(true);
    setTimeout(() => {
      this.copied.set(false);
    }, 4000);
  }
}
