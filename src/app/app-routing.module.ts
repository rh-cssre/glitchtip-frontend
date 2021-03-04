import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsLoggedInGuard } from "./guards/is-logged-in.guard";
import { AlreadyLoggedInGuard } from "./guards/already-logged-in.guard";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./home/home.module").then((m) => m.HomeModule),
    pathMatch: "full",
    canActivate: [IsLoggedInGuard],
  },
  {
    path: "organizations/new",
    loadChildren: () =>
      import("./new-organization/new-organization.module").then(
        (m) => m.NewOrganizationModule
      ),
    canActivate: [IsLoggedInGuard],
    data: {
      title: "Create New Organization",
    },
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginModule),
    canActivate: [AlreadyLoggedInGuard],
    data: {
      title: "Log In",
    },
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfileModule),
    canActivate: [IsLoggedInGuard],
    data: {
      title: "Profile",
    },
  },
  {
    path: "register",
    loadChildren: () =>
      import("./register/register.module").then((m) => m.RegisterModule),
    canActivate: [AlreadyLoggedInGuard],
    data: {
      title: "Register",
    },
  },
  {
    path: "reset-password",
    loadChildren: () =>
      import("./reset-password/reset-password.module").then(
        (m) => m.ResetPasswordModule
      ),
    data: {
      title: "Reset Password",
    },
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "accept/:memberId/:token",
    loadChildren: () =>
      import("./accept/accept.module").then((m) => m.AcceptModule),
  },
  // Sentry OSS compat redirect
  {
    path: ":org-slug/:project-slug/issues/:id",
    redirectTo: ":org-slug/issues/:id",
    pathMatch: "full",
  },
  {
    path: ":org-slug",
    canActivate: [IsLoggedInGuard],
    children: [
      {
        path: "issues",
        loadChildren: () =>
          import("./issues/issues.module").then((m) => m.IssuesModule),
        data: {
          title: "Issues",
        },
      },
      {
        path: "projects",
        loadChildren: () =>
          import("./projects/projects.module").then((m) => m.ProjectsModule),
        data: {
          title: "Projects",
        },
      },
      {
        path: "settings",
        loadChildren: () =>
          import("./settings/settings.module").then((m) => m.SettingsModule),
        data: {
          title: "Settings",
        },
      },
      {
        path: "performance",
        loadChildren: () =>
          import("./performance/performance.module").then(
            (m) => m.PerformanceModule
          ),
        data: {
          title: "Performance",
        },
      },
    ],
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload",
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "corrected",
      paramsInheritanceStrategy: "always",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
