import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from "@angular/core";
import { StatefulComponent } from "src/app/shared/stateful-service/signal-state.component";
import { environment } from "../../../../environments/environment";
import { EventInfoComponent } from "../../../shared/event-info/event-info.component";
import { MatDividerModule } from "@angular/material/divider";
import { LoadingButtonComponent } from "../../../shared/loading-button/loading-button.component";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { DecimalPipe } from "@angular/common";
import { PaymentService, PaymentState, Price } from "./payment.service";
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
export class PaymentComponent
  extends StatefulComponent<PaymentState, PaymentService>
  implements OnInit
{
  private organizationService = inject(OrganizationsService);

  products = this.service.products;
  subscriptionCreationLoadingId = this.service.subscriptionCreationLoadingId;
  billingEmail = environment.billingEmail;

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
}
