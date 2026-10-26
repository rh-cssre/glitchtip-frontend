import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "gt-detail-header",
  imports: [MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class DetailHeaderComponent {
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
