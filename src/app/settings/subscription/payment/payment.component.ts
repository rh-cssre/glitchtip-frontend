import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { filter, first, tap } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { BasePrice } from "src/app/api/subscriptions/subscriptions.interfaces";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";

@Component({
  selector: "gt-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit {
  productOptions$ = this.subscriptionService.formattedProductOptions;
  subscriptionCreationLoadingId$ =
    this.subscriptionService.subscriptionCreationLoadingId$;
  billingEmail = environment.billingEmail;

  constructor(
    private subscriptionService: SubscriptionsService,
    private organizationService: OrganizationsService
  ) {}

  ngOnInit() {
    this.subscriptionService.retrieveProducts();
    this.organizationService.retrieveOrganizations().subscribe();
  }

  onSubmit(price: BasePrice) {
    lastValueFrom(
      this.organizationService.activeOrganization$.pipe(
        first(),
        filter((activeOrganization) => !!activeOrganization),
        tap((activeOrganization) =>
          this.subscriptionService.dispatchSubscriptionCreation(
            activeOrganization!,
            price
          )
        )
      )
    );
  }
}
