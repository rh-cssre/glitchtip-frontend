import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { SettingsService } from "src/app/api/settings.service";

export const TERMS_EFFECTIVE_DATE = new Date("2026-11-21T00:00:00Z");
export const TERMS_BANNER_DISMISSED_KEY = "termsUpdate20261121Dismissed";

@Component({
  selector: "gt-terms-update-banner",
  imports: [MatCardModule, MatButtonModule],
  templateUrl: "./terms-update-banner.component.html",
  styleUrls: ["./terms-update-banner.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsUpdateBannerComponent {
  private settingsService = inject(SettingsService);

  private dismissed = signal(
    localStorage.getItem(TERMS_BANNER_DISMISSED_KEY) === "true",
  );
  private beforeEffectiveDate = Date.now() < TERMS_EFFECTIVE_DATE.getTime();

  // Self-hosted installs have billing off and aren't bound by these terms.
  show = computed(
    () =>
      this.settingsService.billingEnabled() === true &&
      this.beforeEffectiveDate &&
      !this.dismissed(),
  );

  dismiss() {
    localStorage.setItem(TERMS_BANNER_DISMISSED_KEY, "true");
    this.dismissed.set(true);
  }
}
