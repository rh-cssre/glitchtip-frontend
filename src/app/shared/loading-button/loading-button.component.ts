import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  selector: "app-loading-button",
  templateUrl: "./loading-button.component.html",
  styleUrls: ["./loading-button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingButtonComponent {
  @Input() buttonText?: string;
  @Input() loading?: boolean;
  @Input() disabled?: boolean;
  @Input() buttonStyle: "flat" | "stroked" = "flat";
}
