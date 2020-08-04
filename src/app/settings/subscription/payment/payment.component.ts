import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { environment } from "../../../../environments/environment";
import { Plan } from "src/app/api/subscriptions/subscriptions.interfaces";
import { StripeService } from "../stripe.service";
import { tap, map } from "rxjs/operators";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit {
  activeOrganizationId?: number | null;
  planOptions$ = this.subscriptionService.planOptions$.pipe(
    map((plans) => {
      return plans?.map((plan) => ({
        ...plan,
        name: plan.name.startsWith("GlitchTip ")
          ? plan.name.substring(10)
          : plan.name,
      }));
    })
  );
  billingEmail = environment.billingEmail;
  selectedSubscription: number | null = null;

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

  onSubmit(plan: Plan, selectedIndex: number) {
    this.selectedSubscription = selectedIndex;
    if (this.activeOrganizationId) {
      if (plan.amount === 0) {
        this.subscriptionService
          .createFreeSubscription(this.activeOrganizationId, plan.id)
          .pipe(tap(() => (this.selectedSubscription = null)))
          .toPromise();
      } else {
        this.stripe.redirectToSubscriptionCheckout(plan.id);
      }
    }
  }
}
