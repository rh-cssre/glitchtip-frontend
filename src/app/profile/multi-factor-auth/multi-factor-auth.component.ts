import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from "@angular/core";

import { MultiFactorAuthService } from "./multi-factor-auth.service";
import { TOTPComponent } from "./totp/totp.component";
import { WebAuthnComponent } from "./webauthn/webauthn.component";

@Component({
  selector: "gt-multi-factor-auth",
  templateUrl: "./multi-factor-auth.component.html",
  styleUrls: ["./multi-factor-auth.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TOTPComponent, WebAuthnComponent],
})
export class MultiFactorAuthComponent implements OnInit {
  private service = inject(MultiFactorAuthService);

  initialLoadComplete = this.service.initialLoadComplete;

  ngOnInit() {
    this.service.getAuthenticators();
  }
}
