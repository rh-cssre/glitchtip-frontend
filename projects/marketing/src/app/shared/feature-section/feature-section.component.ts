import { Component, input } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { ResponsiveImageComponent } from "../responsive-image/responsive-image.component";

@Component({
  selector: "mkt-feature-section",
  imports: [MatIcon, ResponsiveImageComponent],
  templateUrl: "./feature-section.component.html",
  styleUrls: ["./feature-section.component.scss"],
})
export class FeatureSectionComponent {
  readonly icon = input<string>();
  readonly heading = input<string>();
  readonly imageSrc = input.required<string>();
  readonly imageAlt = input.required<string>();
  readonly direction = input.required<"left" | "right">();
  readonly promo = input(false);
}
