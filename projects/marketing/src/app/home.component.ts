import { Component } from "@angular/core";
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
  standalone: true,
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
  registerLink = this.links.registerLink;

  constructor(private links: LinksService) {}
}
