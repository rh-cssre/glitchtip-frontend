import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new/new.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { OrganizationsComponent } from "./organizations/organizations.component";

const routes: Routes = [
  { path: "projects", component: ProjectsComponent },
  { path: "projects/new", component: NewProjectComponent },
  { path: "projects/:slug", component: ProjectDetailComponent },

  { path: "organizations", component: OrganizationsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
