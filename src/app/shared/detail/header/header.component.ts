import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

/**
 * Header with title, back button, and action buttons for a object detail page
 * Action buttons may be added as child elements
 */
@Component({
  selector: "gt-detail-header",
  standalone: true,
  imports: [RouterLink, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class DetailHeaderComponent {
  @Input() backLinkParams: { [key: string]: string | number } = {};
  @Input() backLinkText = "";
  @Input() title: string | [string, string | null] = "";
  @Input() subtitle?: string | null;

  getTitle() {
    if (Array.isArray(this.title)) {
      return this.title[0];
    }
    return this.title;
  }

  getTitleSuffix() {
    if (Array.isArray(this.title)) {
      return this.title[1];
    }
    return null;
  }
}
