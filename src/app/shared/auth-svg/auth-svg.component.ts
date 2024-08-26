
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
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
  standalone: true,
  selector: "gt-auth-svg",
  imports: [MatProgressSpinnerModule],
  templateUrl: "./auth-svg.component.html",
  styleUrls: ["./auth-svg.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSvgComponent {
  @Input() text = "";
  @Input() provider = "";
  @Input() source: "auth" | "dropdown" | "disconnect" | "" = "";
  @Input() loading = false;

  getProviderSvgName(provider: string) {
    if (knownSocialProviders.includes(provider)) {
      return `#${provider}`;
    } else {
      return "#openid";
    }
  }
}
