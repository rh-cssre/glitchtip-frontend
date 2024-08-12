import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
  createUrlTreeFromSnapshot,
} from "@angular/router";
import { Injectable, inject } from "@angular/core";
import { map } from "rxjs";
import { LoggedInComponent } from "./logged-in.component";
import { alreadyLoggedInGuard } from "./guards/already-logged-in.guard";
import { AuthService } from "./api/auth/auth.service";
import { OrganizationsService } from "./api/organizations/organizations.service";

export const routes: Routes = [
  {
    path: "login",
    loadChildren: () => import("./login/routes"),
    canActivate: [alreadyLoggedInGuard],
    title: "Log In",
  },
  {
    path: "register",
    loadChildren: () => import("./register/routes"),
    canActivate: [alreadyLoggedInGuard],
    title: "Register",
  },
  {
    path: "reset-password",
    loadChildren: () => import("./reset-password/routes"),
    title: "Reset Password",
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/routes"),
  },
  {
    path: "accept/:memberId/:token",
    loadChildren: () => import("./accept/routes"),
  },
  // Sentry OSS compat redirect
  {
    path: ":org-slug/:project-slug/issues/:id",
    redirectTo: ":org-slug/issues/:id",
    pathMatch: "full",
  },
  {
    path: "orgredirect/organizations/:orgslug/settings/auth-tokens",
    redirectTo: "/profile/auth-tokens",
    pathMatch: "full"
  },
  {
    path: "account/settings/wizard/:hash",
    redirectTo: "profile/wizard/:hash",
    pathMatch: "full",
  },
  {
    path: "",
    component: LoggedInComponent,
    canActivate: [
      (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
        inject(AuthService)
          .loginCheck(state)
          .pipe(
            map((isLoggedIn) =>
              isLoggedIn
                ? true
                : createUrlTreeFromSnapshot(next, ["/", "login"])
            )
          ),
    ],
    children: [
      {
        path: "",
        loadChildren: () => import("./home/routes"),
        pathMatch: "full",
        data: {
          preload: true,
        },
      },
      {
        path: "organizations/new",
        loadChildren: () => import("./new-organization/routes"),
        title: "Create New Organization",
      },
      {
        path: "profile",
        loadChildren: () => import("./profile/routes"),
        title: "Profile",
        data: {
          preload: true,
        },
      },
      {
        path: "system-info",
        loadChildren: () => import("./system-info/routes"),
        title: "System info",
        data: {
          preload: true,
        },
      },
      {
        path: ":org-slug",
        canActivate: [
          (next: ActivatedRouteSnapshot) =>
            inject(OrganizationsService).watchRoute(next),
        ],
        children: [
          {
            path: "issues",
            loadChildren: () => import("./issues/routes"),
            title: "Issues",
            data: {
              preload: true,
            },
          },
          {
            path: "uptime-monitors",
            loadChildren: () => import("./uptime/routes"),
            title: "Uptime Monitors",
          },
          {
            path: "projects",
            loadChildren: () => import("./projects/routes"),
            title: "Projects",
          },
          {
            path: "releases",
            loadChildren: () => import("./releases/routes"),
            data: {
              title: "Releases",
            },
          },
          {
            path: "settings",
            loadChildren: () => import("./settings/routes"),
            title: "Settings",
            data: {
              preload: true,
            },
          },
          {
            path: "performance",
            loadChildren: () => import("./performance/routes"),
            title: "Performance",
          },
          {
            path: ":project-slug",
            redirectTo: "settings/projects/:project-slug",
          },
        ],
      },
    ],
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full",
  },
];

@Injectable()
export class TemplatePageTitleStrategy extends TitleStrategy {
  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      document.title = title;
    } else {
      document.title = "GlitchTip";
    }
  }
}
