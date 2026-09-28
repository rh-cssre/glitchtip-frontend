import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { SubscriptionChartsComponent } from "../subscription-charts/subscription-charts.component";
import { environment } from "../../../../environments/environment";
import { InstanceLicenseService } from "src/app/api/instance-license.service";
import { SettingsService } from "src/app/api/settings.service";
import { UserService } from "src/app/api/user/user.service";
import { SupportBannerComponent } from "src/app/shared/support-banner/support-banner.component";

@Component({
  selector: "gt-self-hosted-subscription",
  templateUrl: "./self-hosted-subscription.component.html",
  styleUrls: ["./self-hosted-subscription.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TopAppBar,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    SubscriptionChartsComponent,
    SupportBannerComponent,
  ],
})
export class SelfHostedSubscriptionComponent {
  private settings = inject(SettingsService);
  private instanceLicense = inject(InstanceLicenseService);
  private userService = inject(UserService);

  billingEmail = environment.billingEmail;
  paidForGlitchTip = this.settings.paidForGlitchTip;
  isSuperuser = computed(() => this.userService.user()?.isSuperuser ?? false);
  manageBillingLoading = signal(false);
  // Self-hosted has no billing cycle — usage is a rolling 30-day window.
  currentPeriodLabel = $localize`Last 30 Days`;
  previousPeriodLabel = $localize`Previous 30 Days`;

  manageBilling() {
    this.manageBillingLoading.set(true);
    const email = this.instanceLicense.billingEmail();
    const url = email
      ? `${environment.stripePortalLoginUrl}?prefilled_email=${encodeURIComponent(email)}`
      : environment.stripePortalLoginUrl;
    window.location.href = url;
  }
}
