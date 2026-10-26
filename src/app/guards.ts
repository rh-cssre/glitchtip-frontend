import { computed, inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { filter, map, of, take, timeout } from "rxjs";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  createUrlTreeFromSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { AuthService } from "./auth.service";
import { OrganizationsService } from "./api/organizations.service";

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

// Sends people without project:write back a level instead of to a form the
// backend would reject. Waits until the organization in the URL is both
// selected and loaded, since the scope gates fail closed until then.
export const projectWriteGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
) => {
  const orgs = inject(OrganizationsService);
  const orgSlug = next.pathFromRoot
    .map((route) => route.paramMap.get("org-slug"))
    .find(Boolean);
  const back = createUrlTreeFromSnapshot(next, [".."]);
  const ready = computed(
    () =>
      orgs.selectedOrganizationSlug() === orgSlug &&
      orgs.activeOrganization()?.slug === orgSlug,
  );
  return toObservable(ready).pipe(
    filter(Boolean),
    take(1),
    map(() => orgs.canWriteProject() || back),
    timeout({ first: 10000, with: () => of(back) }),
  );
};
