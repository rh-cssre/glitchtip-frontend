import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { IsLoggedInGuard } from "../guards/is-logged-in.guard";

const routes: Routes = [
  {
    path: "",
    component: MainNavComponent,
    children: [
      {
        path: "settings",
        loadChildren: () =>
          import("../settings/settings.module").then(m => m.SettingsModule),
        canActivate: [IsLoggedInGuard]
      },
      {
        path: "issues",
        loadChildren: () =>
          import("../issues/issues.module").then(m => m.IssuesModule),
        canActivate: [IsLoggedInGuard]
      },
      {
        path: "organizations/new",
        loadChildren: () =>
          import("../new-organization/new-organization.module").then(
            m => m.NewOrganizationModule
          )
      }
    ]
  }
  // { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainNavRoutingModule {}
