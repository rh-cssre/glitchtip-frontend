import {
  Component,
  ChangeDetectionStrategy,
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
  ],
})
export class SelfHostedSubscriptionComponent {
  private settings = inject(SettingsService);
  private instanceLicense = inject(InstanceLicenseService);

  billingEmail = environment.billingEmail;
  paidForGlitchTip = this.settings.paidForGlitchTip;
  manageBillingLoading = signal(false);

  manageBilling() {
    this.manageBillingLoading.set(true);
    const email = this.instanceLicense.billingEmail();
    const url = email
      ? `${environment.stripePortalLoginUrl}?prefilled_email=${encodeURIComponent(email)}`
      : environment.stripePortalLoginUrl;
    window.location.href = url;
  }
}
