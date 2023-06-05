import { Component, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { LoginService } from "../login.service";
import { RouterLink } from "@angular/router";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { FormErrorComponent } from "../../shared/forms/form-error/form-error.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { NgIf, AsyncPipe } from "@angular/common";

@Component({
    selector: "gt-login-fido2",
    templateUrl: "./login-fido2.component.html",
    styleUrls: ["./login-fido2.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatProgressBarModule,
        FormErrorComponent,
        MatButtonModule,
        MatCheckboxModule,
        RouterLink,
        AsyncPipe,
    ],
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

  toggleRemember(event: boolean) {
    this.loginService.toggleRemember(event);
  }
}
