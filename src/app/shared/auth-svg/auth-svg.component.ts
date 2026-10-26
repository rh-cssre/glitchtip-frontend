import { Component, ChangeDetectionStrategy, input } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

const knownSocialProviders = [
  "digitalocean",
  "gitea",
  "github",
  "gitlab",
  "google",
  "keycloak",
  "microsoft",
];

@Component({
  selector: "gt-auth-svg",
  imports: [MatProgressSpinnerModule],
  templateUrl: "./auth-svg.component.html",
  styleUrls: ["./auth-svg.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSvgComponent {
  readonly text = input("");
  readonly provider = input("");
  readonly source = input<"auth" | "dropdown" | "disconnect" | "">("");
  readonly loading = input(false);

  getProviderSvgName(provider: string) {
    if (knownSocialProviders.includes(provider)) {
      return `#${provider}`;
    } else {
      return "#openid";
    }
  }
}
