import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  createUrlTreeFromSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth.service";
import { map } from "rxjs";

export const alreadyLoggedInGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
) =>
  inject(AuthService).loggedInGuard$.pipe(
    map((loggedIn) => {
      if (loggedIn) {
        return createUrlTreeFromSnapshot(next, ["/"]);
      }
      return true;
    }),
  );

export const loggedInGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) =>
  inject(AuthService).loggedInGuard$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      }
      return createUrlTreeFromSnapshot(
        next,
        ["/", "login"],
        state.url !== "/" ? { next: state.url } : {},
      );
    }),
  );
