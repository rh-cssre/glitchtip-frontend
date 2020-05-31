import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { tap } from "rxjs/operators";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { environment } from "../../../../environments/environment";
import { Plan } from "src/app/api/subscriptions/subscriptions.interfaces";
import { StripeService } from "../stripe.service";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit {
  activeOrganizationId: number | null;
  planOptions$ = this.subscriptionService.planOptions$;
  billingEmail = environment.billingEmail;
  isLoading = false;

  constructor(
    private subscriptionService: SubscriptionsService,
    private organizationService: OrganizationsService,
    private stripe: StripeService
  ) {
    this.organizationService.activeOrganizationId$.subscribe(
      (id) => (this.activeOrganizationId = id)
    );
  }

  ngOnInit() {
    this.subscriptionService.retrieveSubscriptionPlans().subscribe();
    this.organizationService.retrieveOrganizations().subscribe();
  }

  onSubmit(plan: Plan) {
    if (this.activeOrganizationId) {
      this.isLoading = true;

      if (plan.amount == "0.00") {
        this.subscriptionService
          .createFreeSubscription(this.activeOrganizationId, plan.id)
          .pipe(tap(() => (this.isLoading = false)))
          .toPromise();
      } else {
        this.stripe.redirectToSubscriptionCheckout(plan.id);
      }
    }
  }
}
