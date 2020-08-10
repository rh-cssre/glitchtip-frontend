import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../../shared/shared.module";
import { PaymentComponent } from "./payment.component";

@NgModule({
  declarations: [PaymentComponent],
  imports: [CommonModule, SharedModule],
  exports: [PaymentComponent],
})
export class PaymentModule {}
