import { contentChild, Directive, effect, signal } from "@angular/core";
import { MatSelect } from "@angular/material/select";

/** Wrapper for a bar filter mat-select; see .gt-select-ghost. */
@Directive({
  selector: "[gtSelectGhost]",
  host: {
    class: "gt-select-ghost",
    "[class.gt-select-ghost--open]": "isOpen()",
    "(click)": "openFromPadding($event)",
  },
})
export class SelectGhostDirective {
  private readonly select = contentChild.required(MatSelect);
  protected readonly isOpen = signal(false);

  constructor() {
    effect((onCleanup) => {
      const sub = this.select().openedChange.subscribe((open) =>
        this.isOpen.set(open),
      );
      onCleanup(() => sub.unsubscribe());
    });
  }

  // Clicks on the wrapper's padding miss the select's own trigger.
  protected openFromPadding(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.select().open();
    }
  }
}
