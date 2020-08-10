import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SubscriptionRoutingModule } from "./subscription-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { SubscriptionComponent } from "./subscription.component";
import { PaymentModule } from "./payment/payment.module";

@NgModule({
  declarations: [SubscriptionComponent],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    SharedModule,
    PaymentModule,
  ],
})
export class SubscriptionModule {}
