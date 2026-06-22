import { Component, ChangeDetectionStrategy, input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

/**
 * Useful for multi step (wizard) interfaces
 * https://www.figma.com/file/TUL7whJuANdvdLt3nejXPt/GlitchTip-Common-Library?node-id=422%3A513
 */
@Component({
  selector: "gt-to-do-item",
  imports: [MatIconModule],
  templateUrl: "./to-do-item.component.html",
  styleUrls: ["./to-do-item.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoItemComponent {
  readonly title = input("");
  readonly isDone = input<"false" | "doing" | "true">("false");
}
