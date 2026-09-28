import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "gt-support-banner",
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: "./support-banner.component.html",
  styleUrls: ["./support-banner.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportBannerComponent {
  readonly isSuperuser = input(false);
}
