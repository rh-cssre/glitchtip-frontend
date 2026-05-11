import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { environment } from "../../../../environments/environment";
import { EventInfoComponent } from "../../../shared/event-info/event-info.component";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { DecimalPipe } from "@angular/common";
import { PaymentService, PaymentState, Price, Product } from "./payment.service";
import { OrganizationsService } from "src/app/api/organizations.service";
import { SubscriptionService } from "src/app/api/subscriptions/subscription.service";

@Component({
  selector: "gt-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    LoadingButtonComponent,
    EventInfoComponent,
    DecimalPipe,
  ],
})
export class PaymentComponent
  extends StatefulComponent<PaymentState, PaymentService>
  implements OnInit
{
  private organizationService = inject(OrganizationsService);
  private subscriptionService = inject(SubscriptionService);
  private dialogRef = inject(MatDialogRef, { optional: true });

  readonly isDialog = !!this.dialogRef;
  readonly billingInterval = signal<"month" | "year">(
    this.subscriptionService.subscription()?.price?.interval === "year"
      ? "year"
      : "month",
  );
  readonly products = this.service.products;
  readonly subscriptionCreationLoadingId = this.service.subscriptionCreationLoadingId;
  readonly billingEmail = environment.billingEmail;

  constructor() {
    const service = inject(PaymentService);

    super(service);

    this.service = service;
  }

  ngOnInit() {
    this.service.productsResource.reload();
  }

  onSubmit(price: Price) {
    const activeOrganization = this.organizationService.activeOrganization();
    if (activeOrganization) {
      this.service.dispatchSubscriptionCreation(activeOrganization, price);
    }
  }

  hasAnnualPrice(product: Product): boolean {
    return (
      product.defaultPrice.interval === "year" ||
      product.prices.some((p) => p.interval === "year")
    );
  }

  getActivePrice(product: Product): Price | undefined {
    const interval = this.billingInterval();
    if (
      product.defaultPrice.isPublic &&
      (product.defaultPrice.interval === interval ||
        product.defaultPrice.price === 0)
    ) {
      return product.defaultPrice;
    }
    return product.prices.find(
      (p) => p.interval === interval && p.isPublic,
    );
  }
}
