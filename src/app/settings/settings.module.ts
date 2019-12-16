import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

import { SettingsRoutingModule } from "./settings-routing.module";
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new-project/new-project.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { OrganizationsComponent } from "./organizations/organizations.component";
import { OrganizationDetailComponent } from "./organizations/organization-detail/organization-detail.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { SettingsComponent } from "./settings/settings.component";
import { OrganizationShellComponent } from './organizations/organization-shell/organization-shell.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    NewProjectComponent,
    ProjectDetailComponent,
    OrganizationsComponent,
    OrganizationDetailComponent,
    SettingsComponent,
    OrganizationShellComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule
  ]
})
export class SettingsModule {}
