import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { MonitorListService } from "./monitor-list.service";

export const monitorListResolver: ResolveFn<void> = (
  route: ActivatedRouteSnapshot
) => {
  const orgSlug = route.parent!.paramMap.get("org-slug");
  if (orgSlug) {
    inject(MonitorListService).getMonitors(
      orgSlug,
      route.queryParamMap.get("cursor")
    );
  }
};
