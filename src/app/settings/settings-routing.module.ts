import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new-project/new-project.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { SettingsComponent } from "./settings/settings.component";
import { OrganizationShellComponent } from "./organizations/organization-shell/organization-shell.component";

const routes: Routes = [
  { path: "", component: SettingsComponent },

  { path: "projects", component: ProjectsComponent },
  { path: "projects/new", component: NewProjectComponent },
  { path: "projects/:slug", component: ProjectDetailComponent },

  { path: ":slug", component: OrganizationShellComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
