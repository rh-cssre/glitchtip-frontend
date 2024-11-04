import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { filter, first, tap } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { BasePrice } from "src/app/api/subscriptions/subscriptions.interfaces";
import { OrganizationsService } from "src/app/api/organizations/organizations.service";
import { SubscriptionsService } from "src/app/api/subscriptions/subscriptions.service";
import { EventInfoComponent } from "../../../shared/event-info/event-info.component";
import { MatDividerModule } from "@angular/material/divider";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { AsyncPipe, DecimalPipe } from "@angular/common";

@Component({
  selector: "gt-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    LoadingButtonComponent,
    MatDividerModule,
    EventInfoComponent,
    AsyncPipe,
    DecimalPipe
],
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
