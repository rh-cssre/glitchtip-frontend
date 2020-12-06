import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsLoggedInGuard } from "./guards/is-logged-in.guard";
import { AlreadyLoggedInGuard } from "./guards/already-logged-in.guard";
import { EnableRegistrationGuard } from "./guards/enable-registration.guard";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./home/home.module").then((m) => m.HomeModule),
    pathMatch: "full",
    canActivate: [IsLoggedInGuard],
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./settings/settings.module").then((m) => m.SettingsModule),
    canActivate: [IsLoggedInGuard],
  },
  {
    path: "organizations/:org-slug/issues",
    loadChildren: () =>
      import("./issues/issues.module").then((m) => m.IssuesModule),
    canActivate: [IsLoggedInGuard],
  },
  {
    path: "organizations/new",
    loadChildren: () =>
      import("./new-organization/new-organization.module").then(
        (m) => m.NewOrganizationModule
      ),
    canActivate: [IsLoggedInGuard],
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginModule),
    canActivate: [AlreadyLoggedInGuard],
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfileModule),
    canActivate: [IsLoggedInGuard],
  },
  {
    path: "register",
    loadChildren: () =>
      import("./register/register.module").then((m) => m.RegisterModule),
    canActivate: [AlreadyLoggedInGuard, EnableRegistrationGuard],
  },
  {
    path: "reset-password",
    loadChildren: () =>
      import("./reset-password/reset-password.module").then(
        (m) => m.ResetPasswordModule
      ),
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
    redirectTo: "organizations/:org-slug/issues/:id",
    pathMatch: "full",
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
