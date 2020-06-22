import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { SettingsRoutingModule } from "./settings-routing.module";

// Components
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new-project/new-project.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { OrganizationsComponent } from "./organizations/organizations.component";
import { OrganizationDetailComponent } from "./organizations/organization-detail/organization-detail.component";
import { SettingsComponent } from "./settings/settings.component";
import { SharedModule } from "../shared/shared.module";
import { TeamsComponent } from "./teams/teams.component";
import { NewTeamComponent } from "./teams/new-team/new-team.component";

// Material
import { MatDialogModule } from "@angular/material/dialog";
import { TeamMembersComponent } from "./teams/team-members/team-members.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    SharedModule,
    MatDialogModule,
  ],
  declarations: [
    ProjectsComponent,
    NewProjectComponent,
    ProjectDetailComponent,
    OrganizationsComponent,
    OrganizationDetailComponent,
    SettingsComponent,
    TeamsComponent,
    NewTeamComponent,
    TeamMembersComponent,
  ],
})
export class SettingsModule {}
