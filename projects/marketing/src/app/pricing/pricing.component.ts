import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from "@angular/core";
import { PaymentComponent } from "../shared/payment/payment.component";
import { PageShellComponent } from "../shared/page-shell/page-shell.component";

@Component({
  selector: "mkt-pricing",
  imports: [PageShellComponent, PaymentComponent],
  templateUrl: "./pricing.component.html",
  styleUrl: "./pricing.component.scss",
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PricingComponent {}
