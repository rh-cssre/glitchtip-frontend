import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { lastValueFrom } from "rxjs";
import { FormErrorComponent } from "../../shared/forms/form-error/form-error.component";
import { LoginService } from "../login.service";

@Component({
  selector: "gt-login-webauthn",
  templateUrl: "./login-webauthn.component.html",
  styleUrls: ["./login-webauthn.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatProgressBarModule,
    FormErrorComponent,
    MatButtonModule,
    MatCheckboxModule,
    RouterLink,
  ],
})
export class LoginWebAuthnComponent implements OnInit {
  useTOTP = false; //this.loginService.useTOTP;
  // error$ = this.loginService.error$;
  authInProg = false; //this.loginService.authInProg;

  constructor(private loginService: LoginService) {}

  switchMethod() {
    this.loginService.switchMethod();
  }

  ngOnInit() {
    lastValueFrom(this.loginService.webAuthnAuthenticate());
  }

  retryAuth() {
    lastValueFrom(this.loginService.webAuthnAuthenticate());
  }

  restartLogin() {
    this.loginService.restartLogin();
  }

  toggleRemember(event: boolean) {
    // this.loginService.toggleRemember(event);
  }
}
