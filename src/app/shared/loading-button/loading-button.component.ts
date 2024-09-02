
import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  standalone: true,
  selector: "gt-loading-button",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
],
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
  @Output() buttonClick = new EventEmitter();
}
