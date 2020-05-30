import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { tap } from "rxjs/operators";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { environment } from "../../../../environments/environment";

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
    private organizationService: OrganizationsService
  ) {
    this.organizationService.activeOrganizationId$.subscribe(
      (id) => (this.activeOrganizationId = id)
    );
  }

  ngOnInit() {
    this.subscriptionService.retrieveSubscriptionPlans().subscribe();
    this.organizationService.retrieveOrganizations().subscribe();
  }

  onSubmit(planId: string) {
    if (this.activeOrganizationId) {
      this.isLoading = true;
      this.subscriptionService
        .createFreeSubscription(this.activeOrganizationId, planId)
        .pipe(tap(() => (this.isLoading = false)))
        .toPromise();
    }
  }
}
