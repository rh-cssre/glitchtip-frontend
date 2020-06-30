import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SettingsRoutingModule } from "./settings-routing.module";

// Components
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new-project/new-project.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { OrganizationComponent } from "./organization/organization.component";
import { SettingsComponent } from "./settings/settings.component";
import { SharedModule } from "../shared/shared.module";
import { TeamsComponent } from "./teams/teams.component";
import { NewTeamComponent } from "./teams/new-team/new-team.component";

// Material
import { MatDialogModule } from "@angular/material/dialog";
import { TeamMembersComponent } from "./teams/team-members/team-members.component";
import { MembersComponent } from "./members/members.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SettingsRoutingModule,
    SharedModule,
    MatDialogModule,
  ],
  declarations: [
    ProjectsComponent,
    NewProjectComponent,
    ProjectDetailComponent,
    OrganizationComponent,
    SettingsComponent,
    TeamsComponent,
    NewTeamComponent,
    TeamMembersComponent,
    MembersComponent,
    MemberDetailComponent,
  ],
})
export class SettingsModule {}
