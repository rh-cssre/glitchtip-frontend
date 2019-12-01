import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new/new.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";

const routes: Routes = [
  { path: "projects", component: ProjectsComponent },
  { path: "projects/new", component: NewProjectComponent },
  { path: "projects/:slug", component: ProjectDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
