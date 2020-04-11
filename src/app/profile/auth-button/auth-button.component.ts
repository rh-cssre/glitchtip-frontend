import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "app-auth-button",
  templateUrl: "./auth-button.component.html",
  styleUrls: ["./auth-button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthButtonComponent {
  @Input() svg: string;
  @Input() text: string;
  @Input() disabled = false;

  @Output() clickEvent: EventEmitter<any> = new EventEmitter();
}
