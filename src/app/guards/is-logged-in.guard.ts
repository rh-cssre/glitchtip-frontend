import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../api/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class IsLoggedInGuard implements CanActivate {
  isLoggedIn?: boolean;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.isLoggedIn.subscribe(
      (isLoggedIn) => (this.isLoggedIn = isLoggedIn)
    );
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.isLoggedIn) {
      this.auth.setRedirectUrl(state.url);
      this.router.navigate(["login"]);
      return false;
    }
    return true;
  }
}
