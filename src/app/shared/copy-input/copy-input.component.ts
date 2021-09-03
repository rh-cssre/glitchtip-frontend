import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { BehaviorSubject, timer } from "rxjs";
import { take } from "rxjs/operators";

/**
 * A read-only input that allows the user to copy it's value
 */
@Component({
  selector: "gt-copy-input",
  templateUrl: "./copy-input.component.html",
  styleUrls: ["./copy-input.component.scss"],
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
