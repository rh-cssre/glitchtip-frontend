import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { LoginService } from "./login.service";

// This component is used for waiting until the auth status
// of a redirected social auth user is confirmed before
// redirect to the login page or inside the app
@Component({
  template: "<span i18n>Finalizing your login</span>",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalizeLogin {
  private authService = inject(AuthService);
  private router = inject(Router);
  private loginService = inject(LoginService);

  constructor() {
    effect(() => {
      if (this.authService.initialized()) {
        if (this.authService.isAuthenticated()) {
          this.loginService.redirect();
        } else {
          this.router.navigate(["/login"]);
        }
      }
    });
  }
}
