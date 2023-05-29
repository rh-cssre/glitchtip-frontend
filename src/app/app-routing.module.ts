import { Injectable, NgModule } from "@angular/core";
import {
  Routes,
  RouterModule,
  TitleStrategy,
  RouterStateSnapshot,
} from "@angular/router";
import { IsLoggedInGuard } from "./guards/is-logged-in.guard";
import { AlreadyLoggedInGuard } from "./guards/already-logged-in.guard";
import { CustomPreloadingStrategy } from "./preloadingStrategy";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./home/routes"),
    pathMatch: "full",
    canActivate: [IsLoggedInGuard],
    data: {
      preload: true,
    },
  },
  {
    path: "organizations/new",
    loadChildren: () => import("./new-organization/routes"),
    canActivate: [IsLoggedInGuard],
    title: "Create New Organization",
  },
  {
    path: "login",
    loadChildren: () => import("./login/routes"),
    canActivate: [AlreadyLoggedInGuard],
    title: "Log In",
  },
  {
    path: "profile",
    loadChildren: () => import("./profile/routes"),
    canActivate: [IsLoggedInGuard],
    title: "Profile",
    data: {
      preload: true,
    },
  },
  {
    path: "register",
    loadChildren: () => import("./register/routes"),
    canActivate: [AlreadyLoggedInGuard],
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
    path: "account/settings/wizard/:hash",
    redirectTo: "profile/wizard/:hash",
    pathMatch: "full",
  },
  {
    path: ":org-slug",
    canActivate: [IsLoggedInGuard],
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

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload",
      scrollPositionRestoration: "enabled",
      paramsInheritanceStrategy: "always",
      preloadingStrategy: CustomPreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: TemplatePageTitleStrategy }],
})
export class AppRoutingModule {}
