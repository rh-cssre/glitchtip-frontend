import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { SubscriptionRoutingModule } from "./subscription-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { SubscriptionComponent } from "./subscription.component";
import { PaymentComponent } from "./payment/payment.component";

@NgModule({
  declarations: [SubscriptionComponent, PaymentComponent],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    SharedModule,
    MatProgressBarModule,
  ],
})
export class SubscriptionModule {}
