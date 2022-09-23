import { Component, ChangeDetectionStrategy } from "@angular/core";
import { MultiFactorAuthService } from "../multi-factor-auth.service";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { EMPTY } from "rxjs";
import { checkForOverflow } from "src/app/shared/shared.utils";

@Component({
  selector: "gt-fido2",
  templateUrl: "./fido2.component.html",
  styleUrls: ["./fido2.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Fido2Component {
  tooltipDisabled = false;

  TOTPKey$ = this.service.TOTPKey$;
  FIDO2Keys$ = this.service.FIDO2Keys$;
  setupFIDO2Stage$ = this.service.setupFIDO2Stage$;
  error$ = this.service.serverError$;
  fido2Form = new UntypedFormGroup({
    fido2Code: new UntypedFormControl("", [
      Validators.required,
    ]),
  });
  constructor(private service: MultiFactorAuthService) {}

  get fido2Code() {
    return this.fido2Form.get("fido2Code");
  }

  activateFido2() {
    this.service.activateFido2().subscribe();
  }

  registerFido2() {
    const name = this.fido2Form.get("fido2Code")?.value;
    if (this.fido2Form.valid && name) {
      this.service.registerFido2(name).subscribe();
      return EMPTY;
    } else {
      return EMPTY;
    }
  }

  deleteFido2Key(keyId: number) {
    this.service.deleteKey(keyId, "FIDO2").subscribe();
  }

  formatDate(lastUsed: string) {
    if (lastUsed) {
      const date = new Date(lastUsed);
      return date.toLocaleDateString();
    } else {
      return "Not yet used";
    }}

  checkIfTooltipIsNecessary($event: Event) {
    this.tooltipDisabled = checkForOverflow($event);
  }
}
