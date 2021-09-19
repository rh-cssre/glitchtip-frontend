import { Component, ChangeDetectionStrategy } from "@angular/core";
import { map } from "rxjs/operators";
import { MultiFactorAuthService } from "../multi-factor-auth.service";

@Component({
  selector: "gt-fido2",
  templateUrl: "./fido2.component.html",
  styleUrls: ["./fido2.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Fido2Component {
  userKeys$ = this.service.FIDO2Keys$;
  totpEnabled$ = this.service.TOTPKey$.pipe(map((key) => !!key));
  constructor(private service: MultiFactorAuthService) {}

  addFIDO2Key() {}
}
