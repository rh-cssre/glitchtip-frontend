import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  createUrlTreeFromSnapshot,
} from "@angular/router";
import { AuthService } from "../auth.service";
import { map } from "rxjs";

export const alreadyLoggedInGuard = (next: ActivatedRouteSnapshot) =>
  inject(AuthService).loggedInGuard$.pipe(
    map((loggedIn) => {
      if (loggedIn) {
        return createUrlTreeFromSnapshot(next, ["/"]);
      }
      return true;
    }),
  );
