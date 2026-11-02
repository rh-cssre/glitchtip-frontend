import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { LinksService } from "./links.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { RouterLink } from "@angular/router";
import { PaymentComponent } from "./shared/payment/payment.component";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { FeatureSectionComponent } from "./shared/feature-section/feature-section.component";
import { FeatureSwitcherComponent } from "./shared/feature-switcher/feature-switcher.component";
import { RevealDirective } from "./shared/reveal.directive";
import { BannerComponent } from "./shared/banner/banner.component";

@Component({
  selector: "marketing-home",
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    RouterLink,
    PaymentComponent,
    FeatureSectionComponent,
    FeatureSwitcherComponent,
    RevealDirective,
    BannerComponent,
  ],
  templateUrl: "./home.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  private links = inject(LinksService);

  registerLink = this.links.registerLink;
}
