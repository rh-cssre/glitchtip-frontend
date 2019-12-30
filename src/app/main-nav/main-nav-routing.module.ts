import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainNavComponent } from "./main-nav/main-nav.component";

const routes: Routes = [
  {
    path: "",
    component: MainNavComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("../home/home.module").then(m => m.HomeModule),
        pathMatch: "full"
      },
      {
        path: "settings",
        loadChildren: () =>
          import("../settings/settings.module").then(m => m.SettingsModule)
      },
      {
        path: "organizations/:org-slug/issues",
        loadChildren: () =>
          import("../issues/issues.module").then(m => m.IssuesModule)
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainNavRoutingModule {}
