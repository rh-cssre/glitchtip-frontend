import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "gt-back-link",
  imports: [RouterLink, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./back-link.component.html",
  styleUrls: ["./back-link.component.scss"]
})
export class BackLinkComponent {
  readonly backLinkParams = input<{
    [key: string]: string | number;
  }>({});
  readonly backLinkText = input("");
}
