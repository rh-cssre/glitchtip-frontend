import {
  Component,
  ChangeDetectionStrategy,
  Input,
  input,
  output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "gt-loading-button",
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: "./loading-button.component.html",
  styleUrls: ["./loading-button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingButtonComponent {
  readonly buttonText = input<string>();
  @Input() icon?: string;
  readonly loading = input<boolean>();
  readonly disabled = input<boolean>();
  /** For fullWidth to work, you may need to set width: 100% to app-loading-button */
  readonly fullWidth = input(false);
  readonly buttonStyle = input<"flat" | "stroked" | "basic">("flat");
  readonly buttonClick = output();
}
