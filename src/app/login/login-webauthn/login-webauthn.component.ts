import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { LoginService } from "../login.service";

@Component({
  selector: "gt-login-webauthn",
  templateUrl: "./login-webauthn.component.html",
  styleUrls: ["./login-webauthn.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressBarModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterLink,
  ],
})
export class LoginWebAuthnComponent implements OnInit {
  private loginService = inject(LoginService);

  useTOTP = false; //this.loginService.useTOTP;
  // error$ = this.loginService.error$;
  authInProg = false;

  switchMethod() {
    this.loginService.switchMethod();
  }

  ngOnInit() {
    this.loginService.webAuthnAuthenticate();
  }

  retryAuth() {
    this.loginService.webAuthnAuthenticate();
  }

  restartLogin() {
    this.loginService.restartLogin();
  }

  toggleRemember(event: boolean) {
    // this.loginService.toggleRemember(event);
  }
}
