import { Component, ViewChild, AfterViewChecked, input, inject, signal } from "@angular/core";
import { MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { LinksService } from "../../links.service";
import { environment } from "src/environments/environment";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDivider } from "@angular/material/divider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { DecimalPipe } from "@angular/common";
import { PricingAddonCardComponent } from "../pricing-addon-card/pricing-addon-card.component";
import { hostedFaqs, selfHostedFaqs } from "./payment-faqs";
import { planOptions, selfHostedPlanOptions } from "./payment-plans";

/**
 * Copied HTML from the frontend version of this, pulled some data that is
 * currently in use and hardcoded here, and sharing the SCSS file
 */
@Component({
  selector: "mkt-payment",
  templateUrl: "./payment.component.html",
  imports: [
    DecimalPipe,
    MatTabsModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatIcon,
    MatTooltip,
    MatExpansionModule,
    MatDivider,
    MatButtonToggleModule,
    RouterLink,
    PricingAddonCardComponent,
  ],
  styleUrls: [
    "../../../../../../src/app/settings/subscription/payment/payment.component.scss",
    "./payment.component.scss",
  ],
})
export class PaymentComponent implements AfterViewChecked {
  private links = inject(LinksService);

  @ViewChild("tabs", { static: false }) tabs?: MatTabGroup;
  readonly pricingPage = input<boolean>(false);
  billingEmail = environment.billingEmail;
  registerLink = this.links.registerLink;
  selectedTab = 0;
  billingPeriod = signal<"monthly" | "annual">("monthly");

  hostedFaqs = hostedFaqs;
  selfHostedFaqs = selfHostedFaqs;
  planOptions = planOptions;
  selfHostedPlanOptions = selfHostedPlanOptions;

  setSelectedTab(value: number) {
    this.selectedTab = value;
  }

  ngAfterViewChecked() {
    this.tabs?.realignInkBar();
  }
}
