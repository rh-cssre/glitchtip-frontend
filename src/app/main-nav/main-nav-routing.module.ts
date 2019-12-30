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
        path: "",
        loadChildren: () =>
          import("../home/home.module").then(m => m.HomeModule),
        pathMatch: "full",
        canActivate: [IsLoggedInGuard]
      },
      {
        path: "settings",
        loadChildren: () =>
          import("../settings/settings.module").then(m => m.SettingsModule),
        canActivate: [IsLoggedInGuard]
      },

      {
        path: "organizations/:org-slug/issues",
        loadChildren: () =>
          import("../issues/issues.module").then(m => m.IssuesModule),
        canActivate: [IsLoggedInGuard]
      },
      {
        path: "organizations/new",
        loadChildren: () =>
          import("../new-organization/new-organization.module").then(
            m => m.NewOrganizationModule
          ),
        canActivate: [IsLoggedInGuard]
      }
    ]
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainNavRoutingModule {}
