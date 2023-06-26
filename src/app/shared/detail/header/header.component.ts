import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

export interface ActionButton {
  name?: string;
  type?: "primary" | "delete";
  icon?: "delete" | "done";
  click: () => void;
}

/** Header with title, back button, and action buttons for a object detail page */
@Component({
  selector: "gt-detail-header",
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class DetailHeaderComponent {
  @Input() backLinkParams: { [key: string]: string } = {};
  @Input() backLinkText = "";
  @Input() title: [string, string | null] = ["", null];
  @Input() subtitle?: string | null;
  @Input() actionButtons: ActionButton[] = [];
}
