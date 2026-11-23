import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { QueryParamsHandling, RouterLink } from "@angular/router";
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
  readonly link = input<string | readonly unknown[]>([".."]);
  readonly backLinkParams = input<{
    [key: string]: string | number | null;
  }>({});
  /** "merge" keeps the other query params, for a sub-view inside a tab. */
  readonly paramsHandling = input<QueryParamsHandling | null>(null);
  readonly backLinkText = input("");
}
