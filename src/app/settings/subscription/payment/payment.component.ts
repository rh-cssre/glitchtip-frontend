import { Component, ChangeDetectionStrategy, OnInit, inject } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { BasePrice } from "src/app/api/subscriptions/subscriptions.interfaces";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { EventInfoComponent } from "../../../shared/event-info/event-info.component";
import { MatDividerModule } from "@angular/material/divider";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { DecimalPipe } from "@angular/common";
import { PaymentService } from "./payment.service";
import { OrganizationsService } from "src/app/api/organizations.service";

@Component({
  selector: "gt-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatIconModule,
    LoadingButtonComponent,
    MatDividerModule,
    EventInfoComponent,
    DecimalPipe,
  ],
})
export class PaymentComponent implements OnInit {
  private subscriptionService = inject(SubscriptionsService);
  private organizationService = inject(OrganizationsService);
  private paymentService = inject(PaymentService);

  productOptions = this.subscriptionService.formattedProductOptions;
  subscriptionCreationLoadingId =
    this.subscriptionService.subscriptionCreationLoadingId;
  billingEmail = environment.billingEmail;

  ngOnInit() {
    this.subscriptionService.retrieveProducts();
    this.organizationService.activeOrganizationResource.reload();
  }

  onSubmit(price: BasePrice) {
    const activeOrganization = this.organizationService.activeOrganization();
    if (activeOrganization) {
      this.paymentService.dispatchSubscriptionCreation(
        activeOrganization,
        price
      );
    }
  }
}
