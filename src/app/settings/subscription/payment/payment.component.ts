import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { exhaustMap, filter, first, tap, withLatestFrom } from "rxjs/operators";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { environment } from "../../../../environments/environment";
import { Plan } from "src/app/api/subscriptions/subscriptions.interfaces";
import { StripeService } from "../stripe.service";

@Component({
  selector: "gt-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit {
  planOptions$ = this.subscriptionService.planOptionsWithShortNames$;
  billingEmail = environment.billingEmail;
  selectedSubscription: number | null = null;

  constructor(
    private subscriptionService: SubscriptionsService,
    private organizationService: OrganizationsService,
    private stripe: StripeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptionService.retrieveSubscriptionPlans().subscribe();
    this.organizationService.retrieveOrganizations().subscribe();
  }

  onSubmit(plan: Plan, selectedIndex: number) {
    this.selectedSubscription = selectedIndex;
    this.organizationService.activeOrganizationId$
      .pipe(
        first(),
        filter((activeOrganizationId) => !!activeOrganizationId),
        exhaustMap((activeOrganizationId) => {
          if (plan.amount === 0) {
            return this.subscriptionService
              .createFreeSubscription(activeOrganizationId!, plan.id)
              .pipe(
                withLatestFrom(
                  this.organizationService.activeOrganizationSlug$
                ),
                tap(([_, orgSlug]) => {
                  this.selectedSubscription = null;
                  this.router.navigate([orgSlug, "issues"]);
                })
              );
          } else {
            return this.stripe.redirectToSubscriptionCheckout(plan.id);
          }
        })
      )
      .toPromise();
  }
}
