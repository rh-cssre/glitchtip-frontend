import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../api/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class AlreadyLoggedInGuard implements CanActivate {
  isLoggedIn?: boolean;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.isLoggedIn.subscribe(
      (isLoggedIn) => (this.isLoggedIn = isLoggedIn)
    );
  }
  canActivate() {
    if (this.isLoggedIn) {
      this.router.navigate([""]);
      return false;
    }
    return true;
  }
}
