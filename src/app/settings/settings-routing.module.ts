import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new-project/new-project.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { SettingsComponent } from "./settings/settings.component";
import { OrganizationsComponent } from "./organizations/organizations.component";

const routes: Routes = [
  {
    path: ":org-slug",
    component: SettingsComponent,
    children: [
      { path: "", component: OrganizationsComponent },
      { path: "projects", component: ProjectsComponent },
      { path: "projects/new", component: NewProjectComponent },
      { path: "projects/:slug", component: ProjectDetailComponent },
      {
        path: "subscription",
        loadChildren: () =>
          import("./subscription/subscription.module").then(
            (m) => m.SubscriptionModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
