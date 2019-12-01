import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

import { SettingsRoutingModule } from "./settings-routing.module";
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new/new.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";

@NgModule({
  declarations: [
    ProjectsComponent,
    NewProjectComponent,
    ProjectDetailComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class SettingsModule {}
