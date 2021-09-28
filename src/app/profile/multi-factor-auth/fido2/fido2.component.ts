import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MultiFactorAuthService } from "../multi-factor-auth.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "gt-fido2",
  templateUrl: "./fido2.component.html",
  styleUrls: ["./fido2.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Fido2Component {
  userKeys$ = this.service.FIDO2Keys$;
  fido2Form = new FormGroup({
    fido2Code: new FormControl("", [
      Validators.required,
      Validators.maxLength(16),
    ]),
  });
  constructor(private service: MultiFactorAuthService) {}
}
