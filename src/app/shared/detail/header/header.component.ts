import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

/**
 * Header with title, back button, and action buttons for a object detail page
 * Action buttons may be added as child elements
 */
@Component({
  selector: "gt-detail-header",
  imports: [RouterLink, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class DetailHeaderComponent {
  readonly backLinkParams = input<{
    [key: string]: string | number;
  }>({});
  readonly backLinkText = input("");
  readonly title = input<string | [string, string | null]>("");
  readonly subtitle = input<string | null>();

  getTitle() {
    const title = this.title();
    if (Array.isArray(title)) {
      return title[0];
    }
    return title;
  }

  getTitleSuffix() {
    const title = this.title();
    if (Array.isArray(title)) {
      return title[1];
    }
    return null;
  }
}
