import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SettingsRoutingModule } from "./settings-routing.module";

// Material
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { MatRadioModule } from "@angular/material/radio";
import { MatExpansionModule } from "@angular/material/expansion";

// Components
import { ProjectsComponent } from "./projects/projects.component";
import { NewProjectComponent } from "./projects/new-project/new-project.component";
import { ProjectDetailComponent } from "./projects/project-detail/project-detail.component";
import { OrganizationComponent } from "./organization/organization.component";
import { SettingsComponent } from "./settings/settings.component";
import { SharedModule } from "../shared/shared.module";
import { TeamsComponent } from "./teams/teams.component";
import { NewTeamComponent } from "./teams/new-team/new-team.component";
import { TeamProjectsComponent } from "./teams/team-projects/team-projects.component";
import { TeamDetailsComponent } from "./teams/team-details/team-details.component";
import { TeamMembersComponent } from "./teams/team-members/team-members.component";
import { MembersComponent } from "./members/members.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { NewMemberComponent } from "./members/new-member/new-member.component";
import { TeamSettingsComponent } from "./teams/team-settings/team-settings.component";
import { ProjectAlertsComponent } from "./projects/project-detail/project-alerts/project-alerts.component";
import { ProjectEnvironmentsComponent } from "./projects/project-detail/project-environments/project-environments.component";
import { PlatformPickerComponent } from "./projects/platform-picker/platform-picker.component";
import { SlugifyDirective } from "./teams/new-team/slugify.directive";
import { AlertFormComponent } from "./projects/project-detail/project-alerts/alert-form/alert-form.component";
import { NewRecipientComponent } from "./projects/project-detail/project-alerts/new-recipient/new-recipient.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SettingsRoutingModule,
    SharedModule,
    MatDialogModule,
    MatTabsModule,
    MatRadioModule,
    MatExpansionModule,
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
    NewMemberComponent,
    TeamProjectsComponent,
    TeamDetailsComponent,
    TeamSettingsComponent,
    ProjectAlertsComponent,
    PlatformPickerComponent,
    SlugifyDirective,
    ProjectEnvironmentsComponent,
    AlertFormComponent,
    NewRecipientComponent,
  ],
  exports: [PlatformPickerComponent],
})
export class SettingsModule {}
