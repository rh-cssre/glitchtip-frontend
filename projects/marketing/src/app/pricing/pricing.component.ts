import { Component, ViewEncapsulation } from "@angular/core";
import { MatCard } from "@angular/material/card";
import { PaymentComponent } from "../shared/payment/payment.component";

@Component({
  selector: "mkt-pricing",
  standalone: true,
  imports: [MatCard, PaymentComponent],
  templateUrl: "./pricing.component.html",
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PricingComponent {
  constructor() {}

  //   pricingRoutes$ = this.scully.available$.pipe(
  //     map((availableRoutes) =>
  //       availableRoutes
  //         .filter((routeObject) => routeObject.route.startsWith('/pricing'))
  //         .reverse()
  //     )
  //   );
}
