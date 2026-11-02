import {
  Component,
  computed,
  input,
  ChangeDetectionStrategy,
} from "@angular/core";
import { MatCard } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
  selector: "mkt-pricing-addon-card",
  imports: [MatCard, MatIcon, MatButtonModule, RouterLink],
  templateUrl: "./pricing-addon-card.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./pricing-addon-card.component.scss"],
})
export class PricingAddonCardComponent {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly buttonText = input.required<string>();
  readonly buttonUrl = input.required<string>();
  readonly isExternal = computed(() =>
    /^https?:\/\/|^mailto:/.test(this.buttonUrl()),
  );
  readonly routerPath = computed(() => this.buttonUrl().split("#")[0]);
  readonly routerFragment = computed(() => this.buttonUrl().split("#")[1]);
}
