import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { SettingsRoutingModule } from "./settings-routing.module";
import { MaterialModule } from "../shared/material.module";

// Components
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new-project/new-project.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { OrganizationsComponent } from "./organizations/organizations.component";
import { OrganizationDetailComponent } from "./organizations/organization-detail/organization-detail.component";
import { SettingsComponent } from "./settings/settings.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    MaterialModule
  ],
  declarations: [
    ProjectsComponent,
    NewProjectComponent,
    ProjectDetailComponent,
    OrganizationsComponent,
    OrganizationDetailComponent,
    SettingsComponent
  ]
})
export class SettingsModule {}
