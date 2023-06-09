import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  createUrlTreeFromSnapshot,
} from "@angular/router";
import { map } from "rxjs";
import { AuthService } from "../api/auth/auth.service";

export const alreadyLoggedInGuard = (next: ActivatedRouteSnapshot) => {
  inject(AuthService).isLoggedIn.pipe(
    map((isLoggedIn) =>
      isLoggedIn ? createUrlTreeFromSnapshot(next, ["/"]) : true
    )
  );
};
