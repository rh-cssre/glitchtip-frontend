import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MultiFactorAuthService } from "../multi-factor-auth.service";

@Component({
  selector: "gt-fido2",
  templateUrl: "./fido2.component.html",
  styleUrls: ["./fido2.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Fido2Component {
  userKeys$ = this.service.FIDO2Keys$;
  constructor(private service: MultiFactorAuthService) {}
}
