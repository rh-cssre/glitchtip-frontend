import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from "@angular/core";
import { lastValueFrom } from "rxjs";
import { filter, first, tap } from "rxjs/operators";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { environment } from "../../../../environments/environment";
import { Plan } from "src/app/api/subscriptions/subscriptions.interfaces";

@Component({
  selector: "gt-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit {
  @Input() activeOrganization: boolean = true;
  planOptions$ = this.subscriptionService.planOptionsWithShortNames$;
  subscriptionCreationLoadingId$ =
    this.subscriptionService.subscriptionCreationLoadingId$;
  billingEmail = environment.billingEmail;

  constructor(
    private subscriptionService: SubscriptionsService,
    private organizationService: OrganizationsService
  ) {}

  ngOnInit() {
    this.subscriptionService.retrieveSubscriptionPlans()
    this.organizationService.retrieveOrganizations().subscribe();
  }

  onSubmit(plan: Plan) {
    lastValueFrom(
      this.organizationService.activeOrganization$.pipe(
        first(),
        filter((activeOrganization) => !!activeOrganization),
        tap((activeOrganization) =>
          this.subscriptionService.dispatchSubscriptionCreation(
            activeOrganization!,
            plan
          )
        )
      )
    );
  }
}
