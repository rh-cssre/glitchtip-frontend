import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { OrganizationsService } from "../api/organizations.service";
import { SettingsService } from "../api/settings.service";

@Component({
  selector: "gt-rate-limit-banner",
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  templateUrl: "./rate-limit-banner.component.html",
  styleUrls: ["./rate-limit-banner.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateLimitBannerComponent {
  private organizationsService = inject(OrganizationsService);
  private settingsService = inject(SettingsService);

  eventThrottleRate = computed(
    () => this.organizationsService.activeOrganization()?.eventThrottleRate,
  );
  activeOrgSlug = this.organizationsService.activeOrganizationSlug;
  billingEnabled = this.settingsService.billingEnabled;
  bannerVisible = signal(true);

  hideBanner() {
    this.bannerVisible.set(false);
  }
}
