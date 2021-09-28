import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MultiFactorAuthService } from "../multi-factor-auth.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EMPTY } from "rxjs";

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

  activateFido2() {
    this.service.activateFido2().subscribe();
  }

  registerFido2() {
    const name = this.fido2Form.get("fido2Code")?.value;
    if (this.fido2Form.valid && name) {
      console.log("valid!")
      this.service.registerFido2(name).subscribe();
      return EMPTY;
    } else {
      return EMPTY;
    }
  }

}
