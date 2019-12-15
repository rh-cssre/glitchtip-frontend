import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IsLoggedInGuard } from "./guards/is-logged-in.guard";

const routes: Routes = [
  { path: "", redirectTo: "settings", pathMatch: "full" },
  {
    path: "issues",
    loadChildren: () =>
      import("./issues/issues.module").then(m => m.IssuesModule),
    canActivate: [IsLoggedInGuard]
  },
  {
    path: "login",
    loadChildren: () => import("./login/login.module").then(m => m.LoginModule)
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./settings/settings.module").then(m => m.SettingsModule),
    canActivate: [IsLoggedInGuard]
  },
  {
    path: "organizations/new",
    loadChildren: () =>
      import("./new-organization/new-organization.module").then(
        m => m.NewOrganizationModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
