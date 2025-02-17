import { Component, inject } from "@angular/core";
import { LinksService } from "./links.service";
import { MatCard, MatCardContent } from "@angular/material/card";
import { ResponsiveImageComponent } from "./shared/responsive-image/responsive-image.component";
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from "@angular/material/form-field";
import { RouterLink } from "@angular/router";
import { PaymentComponent } from "./shared/payment/payment.component";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "marketing-home",
  imports: [
    MatButtonModule,
    MatCard,
    MatCardContent,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,
    MatFormField,
    RouterLink,
    PaymentComponent,
    ResponsiveImageComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  private links = inject(LinksService);

  registerLink = this.links.registerLink;
}
