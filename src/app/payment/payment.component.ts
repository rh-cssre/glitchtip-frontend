import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';


@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent implements OnInit {

  constructor() { }

  async ngOnInit() {
    const stripe = await loadStripe(environment.stripePublicKey);
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: 'cs_test_hVRzrPg1VWLK3ck27SITgiZPwe08fgJSHOLzpqtd1YHLFHeRfL479mlF'
      })
      console.log(error);
    }
  }

}
