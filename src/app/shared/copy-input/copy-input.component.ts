import { ClipboardModule } from "@angular/cdk/clipboard";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { BehaviorSubject, timer } from "rxjs";
import { take } from "rxjs/operators";

/**
 * A read-only input that allows the user to copy it's value
 */
@Component({
  standalone: true,
  selector: "gt-copy-input",
  templateUrl: "./copy-input.component.html",
  imports: [
    CommonModule,
    ClipboardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyInputComponent {
  @Input() value = "";
  @Input() placeholder = "";
  copied$ = new BehaviorSubject(false);

  /**
   * Set copy icon to show it was copied, then reset state
   */
  copied() {
    timer(0, 4000)
      .pipe(take(2))
      .subscribe((i) =>
        i === 0 ? this.copied$.next(true) : this.copied$.next(false)
      );
  }
}
