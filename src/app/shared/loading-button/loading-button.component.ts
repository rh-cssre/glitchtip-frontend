import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

@Component({
  selector: "gt-loading-button",
  templateUrl: "./loading-button.component.html",
  styleUrls: ["./loading-button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingButtonComponent {
  @Input() buttonText?: string;
  @Input() icon?: string;
  @Input() loading?: boolean;
  @Input() disabled?: boolean;
  /** For fullWidth to work, you may need to set width: 100% to app-loading-button */
  @Input() fullWidth = false;
  @Input() buttonStyle: "flat" | "stroked" | "basic" = "flat";
}
