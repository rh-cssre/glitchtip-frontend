import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  createUrlTreeFromSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { AuthService } from "./auth.service";

export const alreadyLoggedInGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
): boolean | UrlTree => {
  const authService = inject(AuthService);
  if (authService.loggedInGuard()) {
    return createUrlTreeFromSnapshot(next, ["/"]);
  }
  return true;
};

export const loggedInGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean | UrlTree => {
  const authService = inject(AuthService);
  if (authService.loggedInGuard()) {
    return true;
  }
  return createUrlTreeFromSnapshot(
    next,
    ["/", "login"],
    state.url !== "/" ? { next: state.url } : {},
  );
};
