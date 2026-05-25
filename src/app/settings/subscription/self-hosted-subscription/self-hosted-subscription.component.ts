import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { TopAppBar } from "src/app/shared/top-app-bar/top-app-bar";
import { SubscriptionChartsComponent } from "../subscription-charts/subscription-charts.component";
import { environment } from "../../../../environments/environment";

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
    SubscriptionChartsComponent,
  ],
})
export class SelfHostedSubscriptionComponent {
  billingEmail = environment.billingEmail;
}
