import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  input,
  OnInit,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { EventInfoComponent } from "src/app/shared/event-info/event-info.component";
import { environment } from "../../../environments/environment";
import {
  SubscriptionService,
  SubscriptionState,
} from "src/app/api/subscriptions/subscription.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PaymentComponent } from "./payment/payment.component";
import { MatButtonModule } from "@angular/material/button";
import { LoadingButtonComponent } from "src/app/shared/loading-button/loading-button.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { OrganizationsService } from "src/app/api/organizations.service";

interface Percentages {
  total: number;
  errorEvents: number;
  transactionEvents: number;
  uptimeEvents: number;
  fileSize: number;
}

@Component({
  selector: "gt-subscription",
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatDialogModule,
    RouterLink,
    MatFormFieldModule,
    MatButtonModule,
    LoadingButtonComponent,
    PaymentComponent,
    MatProgressSpinnerModule,
    CurrencyPipe,
    DatePipe,
  ],
})
export class SubscriptionComponent
  extends StatefulComponent<SubscriptionState, SubscriptionService>
  implements OnInit
{
  private orgService = inject(OrganizationsService);
  dialog = inject(MatDialog);

  orgSlug = input.required<string>({ alias: "org-slug" });
  sessionId = input<string>("", { alias: "session_id" });
  billingPortalRedirect = input<string>("", {
    alias: "billing_portal_redirect",
  });

  fromStripe = this.service.fromStripe;
  subscription = this.service.subscription;
  subscriptionLoading = this.service.subscriptionLoading;
  subscriptionRefreshTimeout = this.service.subscriptionRefreshTimeout;
  eventsCountWithTotal = this.service.eventsCountWithTotal;
  totalEventsAllowed = this.service.totalEventsAllowed;
  activeOrganization = this.orgService.activeOrganization;
  activeOrganizationSlug = this.orgService.activeOrganizationSlug;
  billingPortalLoading = this.service.billingPortalLoading;
  billingPortalLoadingError = this.service.billingPortalLoadingError;

  promptForProject = computed(() => {
    const status = this.orgService.activeOrganizationLoaded();
    const count = this.orgService.projectsCount();
    const subscription = this.service.subscription();
    if (subscription) {
      return status &&
        count === 0 &&
        subscription.status !== null &&
        subscription.status !== "canceled"
        ? true
        : false;
    } else {
      return false;
    }
  });
  billingEmail = environment.billingEmail;
  eventsPercent = computed<Percentages>(() => {
    const eventsAllowed = this.totalEventsAllowed();
    const events = this.eventsCountWithTotal();
    return {
      total: (events?.total! / eventsAllowed!) * 100,
      errorEvents: (events?.eventCount! / eventsAllowed!) * 100,
      transactionEvents:
        (events?.transactionEventCount! / eventsAllowed!) * 100,
      uptimeEvents: (events?.uptimeCheckEventCount! / eventsAllowed!) * 100,
      fileSize: (events?.fileSizeMb! / eventsAllowed!) * 100,
    };
  });

  constructor() {
    const service = inject(SubscriptionService);

    super(service);

    this.service = service;
  }

  ngOnInit(): void {
    this.orgService.activeOrganizationResource.reload();
    this.service.retrieveSubscriptionData(this.orgSlug());

    if (this.sessionId()) {
      this.service.refreshUntilSubscriptionOrTimeout();
    }
    if (this.billingPortalRedirect()) {
      this.orgService.repeatRefreshOrgDetail();
    }
  }

  openEventInfoDialog() {
    this.dialog.open(EventInfoComponent, {
      maxWidth: "300px",
    });
  }

  manageSubscription() {
    this.service.redirectToBillingPortal();
  }
}
