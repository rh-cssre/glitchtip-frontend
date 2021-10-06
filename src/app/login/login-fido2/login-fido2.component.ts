import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { LoginService } from "../login.service";

@Component({
  selector: "gt-login-fido2",
  templateUrl: "./login-fido2.component.html",
  styleUrls: ["./login-fido2.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFido2Component implements OnInit {
  useTOTP$ = this.loginService.useTOTP$;
  error$ = this.loginService.error$;
  authInProg$ = this.loginService.authInProg$;


  constructor(private loginService: LoginService) {}

  switchMethod() {
    this.loginService.switchMethod();
  }

  ngOnInit() {
    this.loginService.authenticateFIDO2().subscribe();
  }

  retryAuth() {
    this.loginService.authenticateFIDO2().subscribe();
  }

}
