import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

import { lastValueFrom } from "rxjs";
import { MultiFactorAuthService } from "./multi-factor-auth.service";
import { TOTPComponent } from "./totp/totp.component";
import { WebAuthnComponent } from "./webauthn/webauthn.component";

@Component({
  selector: "gt-multi-factor-auth",
  templateUrl: "./multi-factor-auth.component.html",
  styleUrls: ["./multi-factor-auth.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TOTPComponent, WebAuthnComponent],
})
export class MultiFactorAuthComponent implements OnInit {
  initialLoadComplete = this.service.initialLoadComplete;
  constructor(private service: MultiFactorAuthService) {}

  ngOnInit() {
    lastValueFrom(this.service.getAuthenticators());
  }
}
