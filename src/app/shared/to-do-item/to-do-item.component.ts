
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

/**
 * Useful for multi step (wizard) interfaces
 * https://www.figma.com/file/TUL7whJuANdvdLt3nejXPt/GlitchTip-Common-Library?node-id=422%3A513
 */
@Component({
  standalone: true,
  selector: "gt-to-do-item",
  imports: [MatIconModule],
  templateUrl: "./to-do-item.component.html",
  styleUrls: ["./to-do-item.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoItemComponent {
  @Input() title = "";
  @Input() isDone: "false" | "doing" | "true" = "false";
}
